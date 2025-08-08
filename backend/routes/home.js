const express = require('express');
const router = express.Router();
const { getHomePageProducts, getUserProfile, getProductById, getProductsByCategory } = require('../controllers/homeController');
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

router.get(
    '/product/:productId',
    authMiddleware,
    getProductById
)

router.get(
    '/products/category/:categoryName',
    authMiddleware,
    getProductsByCategory
)

// Export the router
module.exports = router;

