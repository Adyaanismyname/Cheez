const express = require('express');
const router = express.Router();
const { signup, verifySignupOtp } = require('../controllers/signupController');

// Route for user signup
router.post('/signup', signup);

// Route for signup OTP verification
router.post('/verify-otp', verifySignupOtp);

module.exports = router;
