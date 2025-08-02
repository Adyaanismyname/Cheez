import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopBar from '../components/TopBar';

const HomePage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState({});
    const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
    const [userProfile, setUserProfile] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const scrollRef = useRef(null);

    // Sample data - replace with real data from your backend
    const promotions = [
        {
            id: 1,
            title: "Summer Sale",
            subtitle: "Up to 50% off",
            image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            color: "#17A29F"
        },
        {
            id: 2,
            title: "New Arrivals",
            subtitle: "Fresh styles daily",
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            color: "#33373D"
        },
        {
            id: 3,
            title: "Free Shipping",
            subtitle: "On orders over $100",
            image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            color: "#17A29F"
        }
    ];

    // Auto-scroll promotions and smooth scroll to current promotion
    useEffect(() => {
        // Auto-scroll promotions
        const interval = setInterval(() => {
            setCurrentPromoIndex((prevIndex) =>
                prevIndex === promotions.length - 1 ? 0 : prevIndex + 1
            );
        }, 4000); // Change slide every 4 seconds

        return () => clearInterval(interval);
    }, [promotions.length]);

    useEffect(() => {
        // Smooth scroll to current promotion
        if (scrollRef.current) {
            const scrollWidth = scrollRef.current.scrollWidth / promotions.length;
            scrollRef.current.scrollTo({
                left: scrollWidth * currentPromoIndex,
                behavior: 'smooth'
            });
        }
    }, [currentPromoIndex, promotions.length]);

    // Fetch products and user data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const jwttoken = localStorage.getItem('token');
                console.log('Token from localStorage:', jwttoken);

                if (!jwttoken) {
                    console.error('No token found, redirecting to login');
                    navigate('/user/login');
                    return;
                }

                const headers = { authtoken: jwttoken };

                // Make both API calls in parallel
                const [productsResponse, userResponse] = await Promise.all([
                    axios.post('http://localhost:3000/home/fetch-all-products', {}, { headers }),
                    axios.post('http://localhost:3000/home/fetch-user-profile', {}, { headers })
                ]);

                // Handle products response
                if (productsResponse.status === 200) {
                    setProducts(productsResponse.data.data);
                    console.log('Products fetched:', productsResponse.data.data);
                } else {
                    console.error('Failed to fetch products:', productsResponse.data.message);
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
                if (error.response?.status === 401) {
                    console.log('Token expired or invalid, redirecting to login');
                    localStorage.clear();
                    navigate('/user/login');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const renderStars = (rating) => {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">{rating}</span>
            </div>
        );
    };


    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <TopBar
                userProfile={userProfile}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <main>
                {/* Full-Width Promotions Section */}
                <section className="mb-12">
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto scrollbar-hide"
                        style={{ scrollSnapType: 'x mandatory' }}
                    >
                        {promotions.map((promo, index) => (
                            <div
                                key={promo.id}
                                className="flex-shrink-0  w-full h-96 relative overflow-hidden cursor-pointer"
                                style={{
                                    backgroundColor: promo.color,
                                    scrollSnapAlign: 'start'
                                }}
                            >
                                <img
                                    src={promo.image}
                                    alt={promo.title}
                                    className="w-full h-full object-cover"
                                    onLoad={(e) => {
                                        console.log(`Image ${index + 1} loaded successfully: ${promo.image}`);
                                        e.target.style.opacity = '1';
                                    }}
                                    onError={(e) => {
                                        console.error(`Image ${index + 1} failed to load: ${promo.image}`);
                                        // Try a more reliable fallback
                                        if (!e.target.dataset.fallbackAttempted) {
                                            e.target.dataset.fallbackAttempted = 'true';
                                            console.log(`Trying fallback for image ${index + 1}`);
                                            e.target.src = `https://via.placeholder.com/1200x600/${promo.color.slice(1)}/ffffff?text=${encodeURIComponent(promo.title)}`;
                                        } else {
                                            console.log(`Fallback also failed for image ${index + 1}, using background color`);
                                            e.target.style.display = 'none';
                                            e.target.parentElement.style.backgroundColor = promo.color;
                                        }
                                    }}
                                    style={{ opacity: '0.8', transition: 'opacity 0.5s ease-in-out' }}
                                />

                                <div className="absolute inset-0  flex items-center justify-center">
                                    <div className="text-center text-white max-w-2xl px-4">
                                        <h3 className="text-4xl md:text-5xl font-bold mb-4">{promo.title}</h3>
                                        <p className="text-xl md:text-2xl mb-6">{promo.subtitle}</p>
                                        <button
                                            className="cursor-pointer px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
                                        >
                                            Shop Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Promotion Indicators */}
                    <div className="flex justify-center mt-4 space-x-2">
                        {promotions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPromoIndex(index)}
                                className={`w-3 h-3 rounded-full transition duration-200 ${index === currentPromoIndex
                                    ? 'opacity-100'
                                    : 'opacity-50 hover:opacity-75'
                                    }`}
                                style={{ backgroundColor: '#17A29F' }}
                            />
                        ))}
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Categories and Products */}
                    {isLoading ? (
                        // Loading skeleton
                        <div className="space-y-12">
                            {[1, 2, 3].map((skeleton) => (
                                <section key={skeleton} className="mb-12">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
                                        <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                                    </div>
                                    <div className="flex space-x-6 pb-4">
                                        {[1, 2, 3, 4].map((item) => (
                                            <div key={item} className="flex-shrink-0 w-64 bg-white rounded-xl shadow-md border border-gray-200">
                                                <div className="w-full h-48 bg-gray-200 rounded-t-xl animate-pulse"></div>
                                                <div className="p-4">
                                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                                                        <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    ) : (
                        Object.keys(products).map((categoryName) => (
                            <section key={categoryName} className="mb-12">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">{categoryName}</h2>
                                    <button
                                        className="text-sm font-medium hover:opacity-80 transition duration-200"
                                        style={{ color: '#17A29F' }}
                                    >
                                        View All
                                    </button>
                                </div>

                                <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
                                    {products[categoryName].map((product) => (
                                        <div
                                            key={product._id}
                                            className="flex-shrink-0 w-64 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 cursor-pointer border border-gray-200"
                                        >
                                            <img
                                                src={product.images}
                                                alt={product.name}
                                                className="w-full h-48 object-cover rounded-t-xl"
                                            />
                                            <div className="p-4">
                                                <h3 className="font-semibold text-gray-900 mb-2 truncate">{product.title}</h3>
                                                <div className="mb-2">
                                                    {renderStars(product.rating)}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xl font-bold text-gray-900">${product.price}</span>
                                                    <button
                                                        className="p-2 rounded-lg text-white hover:opacity-90 transition duration-200 flex items-center justify-center"
                                                        style={{ backgroundColor: '#17A29F' }}
                                                        title="Add to Cart"
                                                    >
                                                        <svg className="cursor-pointer h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            </section>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default HomePage;
