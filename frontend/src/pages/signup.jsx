import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (!agreeTerms) {
            alert('Please agree to the terms and conditions');
            return;
        }

        setIsLoading(true);

        try {
            const res = await axios.post('http://localhost:3000/signup/signup', {
                username: username,
                email: email,
                password: password
            });

            const { email: userEmail } = res.data;

            if (res.status === 201) {
                console.log('Signup successful, OTP sent');

                localStorage.setItem('email', userEmail); // Store email for OTP verification
                localStorage.setItem('isSignup', 'true'); // Flag to indicate this is from signup
                navigate('/user/verify-otp'); // redirect to OTP verification page
            }
        } catch (error) {
            console.error('Signup failed:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Signup failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#33373D' }}>
            <div className="max-w-md w-full rounded-2xl shadow-xl p-8 shadow-gray-800/20" style={{ backgroundColor: '#293038' }}>
                {/* Header */}
                <div className="text-center mb-8">
                    <img
                        src="/static/logo-background-removed.png"
                        alt="Logo"
                        className="mx-auto mb-6 h-30 w-auto"
                    />
                    <p className="text-gray-300 font-medium">Create your account</p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username Field */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 outline-none text-white"
                            style={{
                                backgroundColor: '#33373D',
                                borderColor: '#17A29F',
                                focusRingColor: '#17A29F'
                            }}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 outline-none text-white"
                            style={{
                                backgroundColor: '#33373D',
                                borderColor: '#17A29F',
                                focusRingColor: '#17A29F'
                            }}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 outline-none text-white"
                                style={{
                                    backgroundColor: '#33373D',
                                    borderColor: '#17A29F',
                                    focusRingColor: '#17A29F'
                                }}
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="cursor-pointer absolute inset-y-0 right-0 pr-4 flex items-center hover:opacity-80 transition duration-200"
                                style={{ color: '#17A29F' }}
                            >
                                {showPassword ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 outline-none text-white"
                                style={{
                                    backgroundColor: '#33373D',
                                    borderColor: '#17A29F',
                                    focusRingColor: '#17A29F'
                                }}
                                placeholder="Confirm your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="cursor-pointer absolute inset-y-0 right-0 pr-4 flex items-center hover:opacity-80 transition duration-200"
                                style={{ color: '#17A29F' }}
                            >
                                {showConfirmPassword ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-center">
                        <input
                            id="agree-terms"
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            className="cursor-pointer h-4 w-4 border-gray-300 rounded"
                            style={{ accentColor: '#17A29F' }}
                        />
                        <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-300">
                            I agree to the{' '}
                            <a href="#" className="cursor-pointer hover:opacity-80 transition duration-200" style={{ color: '#17A29F' }}>
                                Terms and Conditions
                            </a>
                            {' '}and{' '}
                            <a href="#" className="cursor-pointer hover:opacity-80 transition duration-200" style={{ color: '#17A29F' }}>
                                Privacy Policy
                            </a>
                        </label>
                    </div>

                    {/* Signup Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="cursor-pointer w-full text-white py-3 px-4 rounded-lg hover:opacity-90 focus:ring-2 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: '#17A29F',
                            focusRingColor: '#17A29F'
                        }}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Account...
                            </div>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                {/* Login Link */}
                <p className="mt-8 text-center text-sm text-gray-300">
                    Already have an account?{' '}
                    <a href="/user/login" className="cursor-pointer font-medium transition duration-200 hover:opacity-80" style={{ color: '#17A29F' }}>
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
