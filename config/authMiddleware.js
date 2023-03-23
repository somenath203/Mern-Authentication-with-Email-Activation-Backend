const jwt = require('jsonwebtoken');


const authVerify = async (req, res, next) => {

    try {

        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {

            token = req.headers.authorization.split(' ')[1];

            const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

            req.body.user = verifyToken;

            next();

        } 

        if(!token) {

            return res.status(401).send({
                success: false,
                message: 'You are not authorized to access this page.'
            });

        }

    } catch (error) {

        return res.status(500).send({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    authVerify
};