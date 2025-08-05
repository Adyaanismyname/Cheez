const express = require('express');
const router = express.Router();
const { getHomePageProducts, getUserProfile } = require('../controllers/homeController');
const authMiddleware = require('../middleware/authMiddleware');

router.get(
    '/fetch-all-products',
    authMiddleware,
    getHomePageProducts
);

router.get(
    '/fetch-user-profile',
    authMiddleware,
    getUserProfile
);

// Export the router
module.exports = router;

