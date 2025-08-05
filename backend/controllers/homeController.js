const Product = require('../models/product')
const Category = require('../models/category');
const User = require('../models/user');



const getUserProfile = async (req, res) => {
    try {
        // The authMiddleware already validated the token and added user info to req.user
        const userId = req.user.id;

        // Fetch user from database, excluding password
        const user = await User.findById(userId).select('-password -currentOtp -otpExpiresAt');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User profile fetched successfully',
            data: user
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}



const getHomePageProducts = async (req, res) => {
    const categories = ['Electronics', 'Fashion', 'Home Appliances', 'Books', 'Toys'];

    try {
        const categoryData = await Promise.all(
            categories.map(async (catName) => {
                const category = await Category.findOne({ name: catName }).lean();

                if (!category) return { [catName]: [] };

                const products = await Product.find({ category: category._id })
                    .limit(10)
                    .populate('category', 'name') 
                    .select('_id title price images rating description category createdAt')
                    .lean(); 

                return { [catName]: products };
            })
        );

        const result = Object.assign({}, ...categoryData);

        res.status(200).json({
            message: 'Products fetched successfully',
            data: result
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



module.exports = {
    getUserProfile,
    getHomePageProducts
};