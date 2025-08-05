import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
const TopBar = ({ userProfile = {}, searchQuery = '', onSearchChange = () => { } }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        if (!isDropdownOpen) {
            setIsDropdownOpen(true);
            setIsAnimating(true);
        } else {
            setIsAnimating(false);
            setTimeout(() => setIsDropdownOpen(false), 200); // Wait for animation to complete
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsAnimating(false);
                setTimeout(() => setIsDropdownOpen(false), 200);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);


    const handleLogout = () => {
        localStorage.clear(); // Clear all local storage data
        navigate('/user/login'); // Redirect to login page
    }









    return (
        <header className="shadow-sm border-b border-gray-200" style={{ backgroundColor: '#293038' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div onClick={() => { navigate('/user/home') }} className="cursor-pointer flex items-center">
                        <img
                            src="/static/logo-background-removed.png"
                            alt="Logo"
                            className="h-16 w-auto"
                        />
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl mx-8">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="bg-white w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition duration-200 outline-none"
                                style={{ focusRingColor: '#17A29F' }}
                            />
                            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Profile & Cart */}
                    <div className="flex items-center space-x-4">
                        <button onClick={() => { navigate('/user/cart') }} className="p-2 rounded-lg hover:bg-gray-700 transition duration-200">
                            <svg className="cursor-pointer h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17" />
                                <circle cx="9" cy="20" r="1" />
                                <circle cx="20" cy="20" r="1" />
                            </svg>
                        </button>
                        <div className="relative" ref={dropdownRef}>
                            <div onClick={toggleDropdown} className="flex items-center space-x-3 cursor-pointer">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#17A29F' }}>
                                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span className="text-white text-sm font-medium">{userProfile.username || 'Login or Signup'}</span>
                                {/* Chevron Arrow */}
                                <svg
                                    className={`h-4 w-4 text-white transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {isDropdownOpen && (
                                <div
                                    className={`absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg z-10 origin-top-right transition-all duration-200 ease-out ${isAnimating
                                        ? 'opacity-100 scale-100 translate-y-0'
                                        : 'opacity-0 scale-95 -translate-y-2'
                                        }`}
                                >
                                    <ul className="py-2">
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150">Profile</li>
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150">Settings</li>
                                        <li onClick={handleLogout} className="px-4 py-2 hover:bg-red-50 cursor-pointer transition-colors duration-150 text-red-600">Logout</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
