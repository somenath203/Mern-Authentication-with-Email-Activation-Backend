const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    userFullName: {
        type: String,
        trim: true,
        required: true
    },
    userEmailAddress: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    userPassword: {
        type: String,
        trim: true,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


const user = mongoose.model('users', userSchema);

module.exports = user;