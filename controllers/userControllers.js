const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');
const Token = require('./../models/tokenModel');
const { sendMailConfig } = require('./../config/emailSendConfig');


const registerUser = async (req, res) => {

    try {

        const { userFullName, userEmailAddress, userPassword } = req.body;

        const isUserAlreadyExists = await User.findOne({ userEmailAddress: userEmailAddress });

        if (isUserAlreadyExists) {

            return res.status(400).send({
                success: false,
                message: 'user with this emailID already exists'
            });

        };


        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(userPassword, salt);

        const userCreated = await User.create({
            userFullName: userFullName,
            userEmailAddress: userEmailAddress,
            userPassword: hashedPassword
        });


        await sendMailConfig(userCreated);

        res.status(201).send({
            success: true,
            message: 'A verification mail has been sent to your gmail inbox successfully'
        });

    } catch (error) {

        res.status(500).send({
            success: false,
            message: error.message
        });

    };

};


const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ userEmailAddress: email });

        if (!user) {

            return res.status(401).send({
                success: false,
                message: 'Invalid Credentials!! Please try again.'
            });

        }

        const isPasswordCorrect = await bcrypt.compare(password, user.userPassword);

        if (!isPasswordCorrect) {

            return res.status(401).send({
                success: false,
                message: 'Invalid Credentials!! Please try again.'
            });

        }

        if (user.isVerified) {

            const tokenData = {
                _id: user._id,
                user: user.userFullName,
                email: user.userEmailAddress
            };

            const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN });

            return res.status(200).send({
                success: true,
                message: 'you are logged in successfully',
                userData: {
                    token: token
                }
            });

        } else {

            return res.status(401).send({
                success: false,
                message: 'your account is not verified'
            });

        }


    } catch (error) {

        res.status(500).send({
            success: false,
            message: error.message
        });

    }
};


const userProfile = async (req, res) => {

    try {

        const user = await User.findById(req.body.user._id);

        res.status(200).send({
            fullname: user.userFullName,
            email: user.userEmailAddress
        });

    } catch (error) {

        res.status(500).send({
            success: false,
            message: error.message
        });

    }
};


const changePassword = async (req, res) => {

    try {

        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.body.user._id);

        if (user && await bcrypt.compare(currentPassword, user.userPassword)) {

            const salt = await bcrypt.genSalt(10);

            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await User.findByIdAndUpdate(user._id, { userPassword: hashedPassword }, { new: true });

            return res.status(200).send({
                success: true,
                message: 'your password has been updated successfully'
            });

        } else {

            return res.status(401).send({
                success: false,
                message: 'The password entered does not belong to you. Please try again.'
            });

        }

    } catch (error) {

        res.status(500).send({
            success: false,
            message: error.message
        });

    };

};


const verifyMail = async (req, res) => {

    try {

        const tokenDetail = await Token.findOne({ token: req.body.tokenFromFrontend });

        if (tokenDetail) {


            await User.findByIdAndUpdate(tokenDetail.userId, { isVerified: true }, { new: true });

            await Token.findOneAndDelete({ token: req.body.tokenFromFrontend });

            res.status(200).send({
                success: true,
                message: 'your account is verified successfully'
            });
            

        } else {

            res.status(401).send({
                success: true,
                message: 'Invalid Token'
            });

        }

    } catch (error) {

        res.status(500).send({
            success: false,
            message: error.message
        });

    };

};


module.exports = {
    registerUser,
    loginUser,
    userProfile,
    changePassword,
    verifyMail
}