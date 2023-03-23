const router = require('express').Router();

const { registerUser, loginUser, userProfile, changePassword, verifyMail } = require('../controllers/userControllers');
const { authVerify } = require('./../config/authMiddleware');


router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/user-profile', authVerify, userProfile);

router.post('/change-password', authVerify, changePassword);

router.post('/verify-email', verifyMail);


module.exports = router;