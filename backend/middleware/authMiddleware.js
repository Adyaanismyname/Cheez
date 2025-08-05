const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authtoken || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const secret_key = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret_key);
        req.user = decoded; // Store the entire decoded payload (contains id, username)
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
}

module.exports = authMiddleware;
