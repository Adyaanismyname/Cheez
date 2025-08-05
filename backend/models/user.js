const mongoose = require('mongoose');

// User schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    
    // otp functionality
    currentOtp: {
        type: String,
        default: null,
    },
    otpExpiresAt: {
        type: Date,
        default: null, 
    }
    
});

module.exports = mongoose.model('User', userSchema);
