const User = require('../models/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');



const login = async (req, res) => {
    const { username, password, rememberMe } = req.body;

    console.log('Login request received:', { username, password, rememberMe });

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username: username })

    // validating and authenticating user
    if (!user) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
    }
    if (user.password !== password) {
        console.log('Invalid password');
        return res.status(401).json({ message: 'Invalid password' });
    }

    // otp token verification
    const { otp, expiresAt } = generateOtp();
    user.currentOtp = otp;
    user.otpExpiresAt = expiresAt;


    await user.save();

    // sending email with otp
    sendEmailWithOtp(user.email, otp);
    console.log('OTP sent to user:', user.email);

    res.status(200).json({
        email: user.email,
        message: 'Otp sent successfully',
    })





    // const payload = {
    //     id : user._id,
    //     username : user.username,
    // }

    // const token = generateToken(payload);

    // res.status(200).json({
    //     message: 'Login successful',
    //     token : token
    // });
}


const verifyOtp = async (req, res) => {
    const { email, otp, rememberMe } = req.body;


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

    // Generate JWT token
    const payload = {
        id: user._id,
        username: user.username,
    }

    const token = generateToken(payload, rememberMe);

    res.status(200).json({
        message: 'OTP verification successful',
        token: token
    });
}



const generateToken = (payload, RememberMe) => {
    // Set token expiration based on RememberMe
    const expiresIn = RememberMe ? '7d' : '1h'; // 7 days if RememberMe is true, otherwise 1 hour
    const secretKey = process.env.JWT_SECRET;
    return jwt.sign(payload, secretKey, { expiresIn: expiresIn });
}

const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
    return { otp, expiresAt };
}


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
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It is valid for 5 minutes.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error sending email:', error);
        }
        console.log('Email sent successfully:', info.response);
    });
}

module.exports = {
    login,
    verifyOtp
};

