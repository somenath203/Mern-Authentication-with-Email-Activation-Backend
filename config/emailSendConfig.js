const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const Token = require('./../models/tokenModel');


const sendMailConfig = async (userData) => {

    try {

        const mailConfig = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MY_EMAIL_ADDRESS,
                pass: process.env.GMAIL_APP_PASSWORD
            },
        });


        const verificationToken = await bcrypt.hashSync(userData._id.toString(), 10).replaceAll('/', ''); 

        const tokenSavedInDB = await Token.create({ userId: userData._id, token: verificationToken });

        const contentOfEmail = `
        <div>
            <h1>Please click the button below to verify your Account</h1>
            <a href="${process.env.FRONTEND_WEB_URL}/verify/${tokenSavedInDB.token}">
                <button>Activate Account</button>
            </a>
        </div>
        `;

        const mailOptions = {
            from: process.env.MY_EMAIL_ADDRESS,
            to: userData.userEmailAddress,
            subject: "Verify your Account for Advanced-JWT-Authentication App",
            html: contentOfEmail
        };


        await mailConfig.sendMail(mailOptions);



    } catch (error) {

        console.log(error);

    };

};


module.exports = {
    sendMailConfig
}