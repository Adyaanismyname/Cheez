require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/product');
const Category = require('../models/category');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding ✅');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

// Categories data
const categoriesData = [
    {
        name: 'Electronics',
        description: 'Electronic devices and gadgets'
    },
    {
        name: 'Fashion',
        description: 'Clothing, shoes, and accessories'
    },
    {
        name: 'Home Appliances',
        description: 'Home and kitchen appliances'
    },
    {
        name: 'Books',
        description: 'Books and educational materials'
    },
    {
        name: 'Toys',
        description: 'Toys and games for all ages'
    }
];

// Products data organized by category
const productsData = {
    'Electronics': [
        {
            title: 'Wireless Bluetooth Headphones',
            description: 'Premium quality wireless headphones with noise cancellation and 30-hour battery life.',
            price: 99.99,
            rating: 4.5,
            stock: 50,
            images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop']
        },
        {
            title: 'Smart Watch Pro',
            description: 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life.',
            price: 299.99,
            rating: 4.7,
            stock: 30,
            images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop']
        },
        {
            title: 'Gaming Laptop',
            description: 'High-performance gaming laptop with RTX graphics and 16GB RAM.',
            price: 1299.99,
            rating: 4.8,
            stock: 15,
            images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop']
        },
        {
            title: 'Smartphone 128GB',
            description: 'Latest smartphone with triple camera, 5G connectivity, and fast charging.',
            price: 699.99,
            rating: 4.6,
            stock: 40,
            images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop']
        },
        {
            title: 'Tablet 10-inch',
            description: '10-inch tablet perfect for work and entertainment with stylus support.',
            price: 399.99,
            rating: 4.3,
            stock: 25,
            images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop']
        },
        {
            title: 'Wireless Mouse',
            description: 'Ergonomic wireless mouse with precision tracking and long battery life.',
            price: 29.99,
            rating: 4.2,
            stock: 100,
            images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop']
        }
    ],
    'Fashion': [
        {
            title: 'Designer Leather Jacket',
            description: 'Premium leather jacket with modern design and comfortable fit.',
            price: 199.99,
            rating: 4.6,
            stock: 20,
            images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop']
        },
        {
            title: 'Running Sneakers',
            description: 'Comfortable running shoes with advanced cushioning and breathable material.',
            price: 89.99,
            rating: 4.7,
            stock: 45,
            images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop']
        },
        {
            title: 'Designer Sunglasses',
            description: 'Stylish sunglasses with UV protection and polarized lenses.',
            price: 79.99,
            rating: 4.4,
            stock: 35,
            images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop']
        },
        {
            title: 'Luxury Watch',
            description: 'Elegant watch with stainless steel band and water resistance.',
            price: 249.99,
            rating: 4.8,
            stock: 12,
            images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop']
        },
        {
            title: 'Travel Backpack',
            description: 'Durable backpack with multiple compartments and laptop sleeve.',
            price: 69.99,
            rating: 4.5,
            stock: 30,
            images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop']
        },
        {
            title: 'Cotton T-Shirt',
            description: 'Comfortable 100% cotton t-shirt available in multiple colors.',
            price: 24.99,
            rating: 4.3,
            stock: 80,
            images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop']
        }
    ],
    'Home Appliances': [
        {
            title: 'Coffee Maker Deluxe',
            description: 'Programmable coffee maker with thermal carafe and auto-shut off.',
            price: 129.99,
            rating: 4.5,
            stock: 25,
            images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop']
        },
        {
            title: 'Air Fryer 5L',
            description: 'Large capacity air fryer for healthy cooking with rapid air technology.',
            price: 89.99,
            rating: 4.6,
            stock: 20,
            images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop']
        },
        {
            title: 'Robot Vacuum',
            description: 'Smart robot vacuum with app control and automatic charging.',
            price: 299.99,
            rating: 4.4,
            stock: 15,
            images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop']
        },
        {
            title: 'Blender Pro',
            description: 'High-power blender perfect for smoothies and food preparation.',
            price: 79.99,
            rating: 4.3,
            stock: 30,
            images: ['https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&h=500&fit=crop']
        },
        {
            title: 'Electric Kettle',
            description: 'Fast-boiling electric kettle with temperature control and auto shut-off.',
            price: 39.99,
            rating: 4.2,
            stock: 40,
            images: ['https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=500&h=500&fit=crop']
        }
    ],
    'Books': [
        {
            title: 'JavaScript: The Definitive Guide',
            description: 'Comprehensive guide to JavaScript programming for developers.',
            price: 49.99,
            rating: 4.7,
            stock: 25,
            images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop']
        },
        {
            title: 'The Art of War',
            description: 'Classic strategy book by Sun Tzu - timeless wisdom for life and business.',
            price: 14.99,
            rating: 4.6,
            stock: 50,
            images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop']
        },
        {
            title: 'Cooking Masterclass',
            description: 'Professional cooking techniques and recipes from top chefs.',
            price: 34.99,
            rating: 4.5,
            stock: 30,
            images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop']
        },
        {
            title: 'Mindfulness Guide',
            description: 'Complete guide to meditation and mindfulness practices.',
            price: 19.99,
            rating: 4.4,
            stock: 40,
            images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop']
        },
        {
            title: 'Photography Basics',
            description: 'Learn the fundamentals of photography with practical examples.',
            price: 29.99,
            rating: 4.3,
            stock: 35,
            images: ['https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&h=500&fit=crop']
        }
    ],
    'Toys': [
        {
            title: 'LEGO Architecture Set',
            description: 'Build famous landmarks with this detailed LEGO architecture set.',
            price: 79.99,
            rating: 4.8,
            stock: 20,
            images: ['https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&h=500&fit=crop']
        },
        {
            title: 'Remote Control Drone',
            description: 'Easy-to-fly drone with HD camera and stable flight controls.',
            price: 149.99,
            rating: 4.5,
            stock: 15,
            images: ['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&h=500&fit=crop']
        },
        {
            title: 'Board Game Collection',
            description: 'Family-friendly board game with strategic gameplay for all ages.',
            price: 39.99,
            rating: 4.6,
            stock: 25,
            images: ['https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500&h=500&fit=crop']
        },
        {
            title: 'Educational Robot Kit',
            description: 'Build and program your own robot - perfect for STEM learning.',
            price: 99.99,
            rating: 4.7,
            stock: 18,
            images: ['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=500&fit=crop']
        },
        {
            title: 'Art Supply Set',
            description: 'Complete art set with paints, brushes, and drawing materials.',
            price: 29.99,
            rating: 4.4,
            stock: 30,
            images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=500&fit=crop']
        }
    ]
};

// Clear existing data
const clearData = async () => {
    try {
        await Product.deleteMany({});
        await Category.deleteMany({});
        console.log('Existing data cleared ✅');
    } catch (error) {
        console.error('Error clearing data:', error);
    }
};

// Seed categories
const seedCategories = async () => {
    try {
        const categories = await Category.insertMany(categoriesData);
        console.log(`${categories.length} categories seeded ✅`);
        return categories;
    } catch (error) {
        console.error('Error seeding categories:', error);
        throw error;
    }
};

// Seed products
const seedProducts = async (categories) => {
    try {
        let totalProducts = 0;

        for (const category of categories) {
            const categoryProducts = productsData[category.name];

            if (categoryProducts && categoryProducts.length > 0) {
                // Add category reference to each product
                const productsWithCategory = categoryProducts.map(product => ({
                    ...product,
                    category: category._id
                }));

                const insertedProducts = await Product.insertMany(productsWithCategory);
                console.log(`${insertedProducts.length} products seeded for ${category.name} ✅`);
                totalProducts += insertedProducts.length;
            }
        }

        console.log(`Total ${totalProducts} products seeded across all categories ✅`);
    } catch (error) {
        console.error('Error seeding products:', error);
        throw error;
    }
};

// Main seeder function
const runSeeder = async () => {
    try {
        console.log('🌱 Starting database seeder...');

        // Connect to database
        await connectDB();

        // Clear existing data
        await clearData();

        // Seed categories first
        const categories = await seedCategories();

        // Seed products with category references
        await seedProducts(categories);

        console.log('🎉 Database seeding completed successfully!');

        // Display summary
        const categoryCount = await Category.countDocuments();
        const productCount = await Product.countDocuments();

        console.log(`\n📊 Summary:`);
        console.log(`Categories: ${categoryCount}`);
        console.log(`Products: ${productCount}`);

        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

// Run the seeder
if (require.main === module) {
    runSeeder();
}

module.exports = { runSeeder, clearData, seedCategories, seedProducts };
