const User = require('../models/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const signup = async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        if (existingUser.username === username) {
            return res.status(409).json({ message: 'Username already exists' });
        }
        if (existingUser.email === email) {
            return res.status(409).json({ message: 'Email already exists' });
        }
    }

    try {
        // Create new user
        const newUser = new User({
            username,
            email,
            password
        });

        await newUser.save();

        // Generate OTP for email verification
        const { otp, expiresAt } = generateOtp();
        newUser.currentOtp = otp;
        newUser.otpExpiresAt = expiresAt;
        await newUser.save();

        // Send email with OTP
        sendEmailWithOtp(email, otp);
        console.log('OTP sent to user:', email);

        res.status(201).json({
            email: email,
            message: 'User created successfully. OTP sent for verification.',
        });

    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const verifySignupOtp = async (req, res) => {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is valid and not expired
    if (user.currentOtp !== otp || new Date() > user.otpExpiresAt) {
        return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP after successful verification
    user.currentOtp = null;
    user.otpExpiresAt = null;
    await user.save();

    // Generate JWT token (with default 1 hour expiration for signup)
    const payload = {
        id: user._id,
        username: user.username,
    }

    const token = generateToken(payload, false); // Default to 1 hour for signup

    res.status(200).json({
        message: 'Signup verification successful',
        token: token
    });
};

const generateToken = (payload, rememberMe) => {
    // Set token expiration based on rememberMe
    const expiresIn = rememberMe ? '7d' : '1h'; // 7 days if rememberMe is true, otherwise 1 hour
    const secretKey = process.env.JWT_SECRET;
    return jwt.sign(payload, secretKey, { expiresIn: expiresIn });
};

const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
    return { otp, expiresAt };
};

const sendEmailWithOtp = (email, otp) => {
    // Implement your email sending logic here
    console.log(`Sending OTP ${otp} to ${email}`);
    // Use a service like Nodemailer or SendGrid to send the email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome! Verify your email',
        text: `Welcome to our platform! Your verification OTP code is ${otp}. It is valid for 5 minutes.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error sending email:', error);
        }
        console.log('Email sent successfully:', info.response);
    });
};

module.exports = {
    signup,
    verifySignupOtp
};