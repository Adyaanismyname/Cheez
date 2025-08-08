import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopBar from '../components/TopBar';

const ProductPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [userProfile, setUserProfile] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setIsLoading(true);
                const jwttoken = localStorage.getItem('token');

                if (!jwttoken) {
                    console.error('No token found, redirecting to login');
                    navigate('/user/login');
                    return;
                }

                const headers = { authtoken: jwttoken };

                // Fetch product details and user profile
                const [productResponse, userResponse] = await Promise.all([
                    axios.get(`http://localhost:3000/home/product/${productId}`, { headers }),
                    axios.get('http://localhost:3000/home/fetch-user-profile', { headers })
                ]);

                if (productResponse.status === 200) {
                    setProduct(productResponse.data.data);

                    // Fetch related products from the same category
                    const relatedResponse = await axios.get(
                        `http://localhost:3000/home/products/category/${productResponse.data.data.category.name}`,
                        { headers }
                    );

                    if (relatedResponse.status === 200) {
                        // Filter out current product and limit to 4 products
                        const filtered = relatedResponse.data.data
                            .filter(p => p._id !== productId)
                            .slice(0, 4);
                        setRelatedProducts(filtered);
                    }
                }

                if (userResponse.status === 200) {
                    setUserProfile(userResponse.data.data);
                }

            } catch (error) {
                console.error('Error fetching product data:', error);
                if (error.response?.status === 401) {
                    localStorage.clear();
                    navigate('/user/login');
                } else if (error.response?.status === 404) {
                    navigate('/user/home');
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (productId) {
            fetchProductData();
        }
    }, [productId, navigate]);

    const handleAddToCart = async () => {
        try {
            const jwttoken = localStorage.getItem('token');
            const headers = { authtoken: jwttoken };

            const response = await axios.post(
                'http://localhost:3000/cart/add-to-cart',
                { product_id: productId, quantity },
                { headers }
            );

            if (response.status === 200 || response.status === 201) {
                console.log('Product added to cart successfully');
                // You could add a toast notification here
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            if (error.response?.status === 401) {
                localStorage.clear();
                navigate('/user/login');
            }
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">({rating})</span>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 overflow-x-hidden">
                <TopBar
                    userProfile={userProfile}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSearchSubmit={() => { }}
                    onSearchReset={() => { }}
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                            <div className="bg-gray-200 rounded-xl h-96"></div>
                            <div className="space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-12 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-20 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 overflow-x-hidden">
                <TopBar
                    userProfile={userProfile}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSearchSubmit={() => { }}
                    onSearchReset={() => { }}
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
                        <button
                            onClick={() => navigate('/user/home')}
                            className="cursor-pointer mt-4 px-6 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition duration-200"
                            style={{ backgroundColor: '#17A29F' }}
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Convert single image to array for consistency
    const productImages = Array.isArray(product.images) ? product.images : [product.images];

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
            <TopBar
                userProfile={userProfile}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearchSubmit={() => { }} // Disabled search on product page
                onSearchReset={() => { }} // Disabled search on product page
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex mb-8" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2 text-sm">
                        <li>
                            <button
                                onClick={() => navigate('/user/home')}
                                className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Home
                            </button>
                        </li>
                        <li className="text-gray-400">/</li>
                        <li>
                            <span className="text-gray-500">{product.category.name}</span>
                        </li>
                        <li className="text-gray-400">/</li>
                        <li className="text-gray-900 font-medium truncate max-w-xs">{product.title}</li>
                    </ol>
                </nav>

                {/* Product Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                                <img
                                    src={productImages[selectedImageIndex]}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Image Thumbnails */}
                            {productImages.length > 1 && (
                                <div className="flex space-x-2 overflow-x-auto">
                                    {productImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={`cursor-pointer flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${selectedImageIndex === index
                                                ? 'border-[#17A29F]'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <img src={image} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                                <div className="flex items-center space-x-4 mb-4">
                                    {renderStars(product.rating)}
                                    <span className="text-sm text-gray-500">•</span>
                                    <span className="text-sm text-gray-500">Category: {product.category.name}</span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline space-x-3">
                                <span className="text-4xl font-bold text-gray-900">${product.price}</span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <>
                                        <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
                                        <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
                                            Save ${(product.originalPrice - product.price).toFixed(2)}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                                </span>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                            </div>

                            {/* Quantity and Add to Cart */}
                            <div className="space-y-4 pt-6 border-t border-gray-200">
                                <div className="flex items-center space-x-4">
                                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="cursor-pointer p-2 hover:bg-gray-100 transition-colors"
                                            disabled={quantity <= 1}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <span className="px-4 py-2 font-medium text-gray-900 min-w-[3rem] text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="cursor-pointer p-2 hover:bg-gray-100 transition-colors"
                                            disabled={quantity >= product.stock}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0}
                                        className="cursor-pointer flex-1 px-8 py-4 rounded-xl text-white font-semibold hover:opacity-90 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                        style={{ backgroundColor: '#17A29F' }}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17" />
                                            <circle cx="9" cy="20" r="1" />
                                            <circle cx="20" cy="20" r="1" />
                                        </svg>
                                        <span>Add to Cart</span>
                                    </button>

                                    <button className="cursor-pointer px-6 py-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition duration-200 flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Total Price */}
                                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                    <span className="text-lg font-medium text-gray-700">Total:</span>
                                    <span className="text-2xl font-bold text-gray-900">
                                        ${(product.price * quantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <div
                                    key={relatedProduct._id}
                                    onClick={() => navigate(`/user/product/${relatedProduct._id}`)}
                                    className="cursor-pointer bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition duration-300 overflow-hidden"
                                >
                                    <img
                                        src={Array.isArray(relatedProduct.images) ? relatedProduct.images[0] : relatedProduct.images}
                                        alt={relatedProduct.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2 truncate">{relatedProduct.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-gray-900">${relatedProduct.price}</span>
                                            <div className="flex items-center">
                                                {renderStars(relatedProduct.rating)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductPage;
