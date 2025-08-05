const express = require('express');
const router = express.Router();
const { login, verifyOtp } = require('../controllers/loginController');

// Route for user login
router.post('/login', login);

// Route for OTP verification
router.post('/verify-otp', verifyOtp);










module.exports = router;



