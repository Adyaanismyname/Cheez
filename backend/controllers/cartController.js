const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');


const addToCart = async (req, res) => {
    const userId = req.user.id; // Get user ID from the request object
    const product_id = req.body.product_id; // get product from the request object
    const quantity = req.body.quantity; // get quantity from the request object

    // Validate input
    if (!product_id || !quantity) {
        return res.status(400).json({ message: 'Product and quantity are required' });
    }

    // Validate quantity is positive
    if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    try {
        // Verify product exists
        const productExists = await Product.findById(product_id);
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // If cart doesn't exist, create a new one
            const newCart = new Cart({
                user: userId,
                items: [{ product: product_id, quantity }]
            });
            await newCart.save();
            return res.status(201).json({ message: 'Product added to cart', data: newCart });
        }
        else {
            // If cart exists, check if product is already in the cart
            const existingItem = cart.items.find(item => item.product.toString() === product_id.toString());

            if (existingItem) {
                // If product is already in the cart, update the quantity
                existingItem.quantity += quantity;
                await cart.save();
                return res.status(200).json({ message: 'Product quantity updated', data: cart });
            }
            else {
                // If product is not in the cart, add it
                cart.items.push({ product: product_id, quantity });
                await cart.save();
                return res.status(200).json({ message: 'Product added to cart' });
            }
        }

    } catch (error) {
        console.error('Error adding to cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }


};

const getCart = async (req, res) => {
    const userId = req.user.id; // Get user ID from the request object

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(200).json({ message: 'Cart not found', data: [] }); // Return empty cart if not found
        }

        // Populate product details in the cart items
        await cart.populate({
            path: 'items.product',
            select: '_id title price images category rating description stock', // Match frontend sample data structure
            populate: {
                path: 'category',
                select: 'name' // Only get the category name
            }
        });

        // Transform cart data to include inStock status and originalPrice
        const transformedCart = {
            ...cart.toObject(),
            items: cart.items.map(item => ({
                product: {
                    ...item.product.toObject(),
                    category: item.product.category.name, // Extract just the category name
                    inStock: item.product.stock > 0, // true if stock > 0, false otherwise
                    originalPrice: item.product.price // Set originalPrice to actual price for now
                },
                quantity: item.quantity,
                _id: item._id
            }))
        };

        console.log('Cart retrieved successfully:', transformedCart);

        return res.status(200).json({ message: 'Cart retrieved successfully', data: transformedCart });
    } catch (error) {
        console.error('Error retrieving cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const removeCartItem = async (req, res) => {
    const userId = req.user.id;
    const itemId = req.body.itemId; // Get item ID from the request object
    const newQuantity = req.body.newQuantity; // Get new quantity from the request object

    // Validate input
    if (!itemId) {
        return res.status(400).json({ message: 'Item ID is required' });
    }

    // Validate newQuantity
    if (newQuantity < 0) {
        return res.status(400).json({ message: 'Quantity cannot be negative' });
    }

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the item in the cart
        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId.toString());

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (newQuantity === 0) {
            // Remove item completely if new quantity is 0
            cart.items.splice(itemIndex, 1);
            await cart.save();
            return res.status(200).json({ message: 'Item removed from cart', data: cart });
        } else {
            // Update the quantity
            cart.items[itemIndex].quantity = newQuantity;
            await cart.save();
            return res.status(200).json({ message: 'Item quantity updated', data: cart });
        }

    } catch (error) {
        console.error('Error removing/updating cart item:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    addToCart,
    getCart,
    removeCartItem
};
