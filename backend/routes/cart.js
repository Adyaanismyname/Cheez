const express = require('express');
const router = express.Router();
const { addToCart, getCart , removeCartItem } = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');


router.post(
    '/add-to-cart',
    authMiddleware,
    addToCart
);

router.get(
    '/get-cart',
    authMiddleware,
    getCart
);

router.post(
    '/update-cart',
    authMiddleware,
    removeCartItem
);

module.exports = router;