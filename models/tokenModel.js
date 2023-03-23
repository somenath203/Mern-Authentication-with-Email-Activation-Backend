const mongoose = require('mongoose');


const tokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        trim: true,
        required: true
    },
    token: {
        type: String,
        trim: true,
        required: true 
    }
}, {
    timestamps: true
});


const token = mongoose.model('Token', tokenSchema);

module.exports = token;