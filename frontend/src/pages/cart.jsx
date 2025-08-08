import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    // Sample cart data - you can replace this with your actual cart logic
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    // const [cartItems, setCartItems] = useState([
    //     {
    //         id: 1,
    //         title: "Premium Wireless Headphones",
    //         price: 129.99,
    //         originalPrice: 199.99,
    //         quantity: 2,
    //         image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center",
    //         category: "Electronics",
    //         inStock: true
    //     },
    //     {
    //         id: 2,
    //         title: "Organic Cotton T-Shirt",
    //         price: 24.99,
    //         originalPrice: 34.99,
    //         quantity: 1,
    //         image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&crop=center",
    //         category: "Clothing",
    //         inStock: true
    //     },
    //     {
    //         id: 3,
    //         title: "Stainless Steel Water Bottle",
    //         price: 18.99,
    //         originalPrice: 25.99,
    //         quantity: 3,
    //         image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop&crop=center",
    //         category: "Accessories",
    //         inStock: false
    //     }
    // ]);
    const [userProfile, setUserProfile] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jwttoken = localStorage.getItem('token');
                if (!jwttoken) {
                    console.error('No token found');
                    return;
                }

                const headers = { authtoken: jwttoken };

                // Make both API calls in parallel
                const [cartResponse, userResponse] = await Promise.all([
                    axios.get('http://localhost:3000/cart/get-cart', { headers }),
                    axios.get('http://localhost:3000/home/fetch-user-profile', { headers })
                ]);



                // Handle cart response
                if (cartResponse.status === 200) {
                    // Transform the cart data to match your frontend structure
                    const transformedItems = cartResponse.data.data.items.map(item => ({
                        id: item._id, // Use cart item ID, not product ID
                        productId: item.product._id, // Keep product ID separate if needed
                        title: item.product.title,
                        price: item.product.price,
                        originalPrice: item.product.originalPrice, // Now comes from backend
                        quantity: item.quantity,
                        image: item.product.images, // Assuming images is a URL or array
                        category: item.product.category,
                        inStock: item.product.inStock // Now comes from backend based on stock > 0
                    }));
                    setCartItems(transformedItems);
                } else {
                    console.error('Failed to fetch cart items');
                }

                // Handle user response
                if (userResponse.status === 200) {
                    console.log('User profile fetched:', userResponse.data.data);
                    setUserProfile(userResponse.data.data);
                } else {
                    console.error('Failed to fetch user profile:', userResponse.data.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);

                if (error.response && error.response.status === 401) {
                    console.error('Unauthorized access, redirecting to login');
                    navigate('/user/login');
                    return;
                }
            }
        };

        fetchData();
    }, []);

    const [searchQuery, setSearchQuery] = useState('');

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    const handleQuantityChange = async (itemId, newQuantity) => {
        console.log('Updating quantity for item:', itemId, 'to', newQuantity);

        try {
            const res = await axios.post('http://localhost:3000/cart/update-cart', {
                itemId: itemId,
                newQuantity: newQuantity
            }, {
                headers: { authtoken: localStorage.getItem('token') }
            });

            if (res.status === 200) {
                console.log('Quantity updated successfully:', res.data.message);

                if (newQuantity === 0) {
                    // Remove the item from the cart
                    setCartItems(prevItems =>
                        prevItems.filter(item => item.id !== itemId)
                    );
                } else {
                    // Update the cartItems state with the new quantity
                    setCartItems(prevItems =>
                        prevItems.map(item =>
                            item.id === itemId ? { ...item, quantity: newQuantity } : item
                        )
                    );
                }
            } else {
                console.error('Failed to update quantity:', res.data.message);
            }
        } catch (error) {
            console.error('Error updating quantity:', error);

            // Check if it's a 401 unauthorized error
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized access, redirecting to login');
                navigate('/user/login'); // Redirect to login page if unauthorized
            }
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
            <TopBar
                userProfile={userProfile}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
                    <p className="text-gray-600">{cartItems.length} items in your cart</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            {/* Cart Header */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900">Cart Items</h2>
                                    <button className="cursor-pointer text-sm text-gray-500 hover:text-red-500 transition-colors">
                                        Clear All
                                    </button>
                                </div>
                            </div>

                            {/* Cart Items List */}
                            <div className="divide-y divide-gray-200">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start space-x-4">
                                            {/* Product Image */}
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                                />
                                                {!item.inStock && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                                        <span className="text-white text-xs font-medium">Out of Stock</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900 truncate">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Category: {item.category}
                                                        </p>
                                                        <div className="flex items-center mt-2 space-x-2">
                                                            <span className="text-lg font-bold" style={{ color: '#17A29F' }}>
                                                                ${item.price}
                                                            </span>
                                                            {item.originalPrice > item.price && (
                                                                <span className="text-sm text-gray-400 line-through">
                                                                    ${item.originalPrice}
                                                                </span>
                                                            )}
                                                            {item.originalPrice > item.price && (
                                                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                                                    Save ${(item.originalPrice - item.price).toFixed(2)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, 0)}
                                                        className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors p-2"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-sm text-gray-600">Quantity:</span>
                                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                                            <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="cursor-pointer p-2 hover:bg-gray-100 transition-colors">
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                                </svg>
                                                            </button>
                                                            <span className="px-4 py-2 font-medium text-gray-900">
                                                                {item.quantity}
                                                            </span>
                                                            <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="cursor-pointer p-2 hover:bg-gray-100 transition-colors">
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>                                                    {/* Item Total */}
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-gray-900">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            ${item.price} each
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Stock Status */}
                                                {!item.inStock && (
                                                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                        <div className="flex items-center">
                                                            <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span className="text-sm text-red-700">
                                                                This item is currently out of stock
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Continue Shopping */}
                            <div className="p-6 border-t border-gray-200">
                                <button className="cursor-pointer flex items-center text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: '#17A29F' }}>
                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-8">
                            {/* Summary Header */}
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                            </div>

                            {/* Summary Details */}
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                                    <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium text-gray-900">
                                        {shipping === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            `$${shipping.toFixed(2)}`
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                                </div>

                                {shipping === 0 && (
                                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                                        🎉 You qualify for FREE shipping!
                                    </div>
                                )}

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <div className="p-6 border-t border-gray-200">
                                <button
                                    className="cursor-pointer w-full py-3 px-4 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: '#17A29F' }}
                                >
                                    Proceed to Checkout
                                </button>

                                {/* Security Notice */}
                                <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Secure checkout powered by SSL
                                </div>
                            </div>

                            {/* Promo Code Section */}
                            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700">Promo Code</label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Enter promo code"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:border-transparent outline-none"
                                            style={{ focusRingColor: '#17A29F' }}
                                        />
                                        <button
                                            className="cursor-pointer px-4 py-2 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                                            style={{ backgroundColor: '#17A29F' }}
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommended Products Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="w-full h-48 bg-gray-200 rounded-t-xl"></div>
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-900 mb-2">Recommended Product {item}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold" style={{ color: '#17A29F' }}>$29.99</span>
                                        <button
                                            className="cursor-pointer p-2 rounded-lg text-white hover:opacity-90 transition-opacity"
                                            style={{ backgroundColor: '#17A29F' }}
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17" />
                                                <circle cx="9" cy="20" r="1" />
                                                <circle cx="20" cy="20" r="1" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
