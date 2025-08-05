const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    rating: { type: Number, default: 0 },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    stock: { type: Number, required: true },
    images: [String], // URLs or paths
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
