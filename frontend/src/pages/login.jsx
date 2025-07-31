import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const res = await axios.post('http://localhost:3000/login/login', {
                username: username,
                password: password,
                rememberMe: rememberMe
            });

            const { email } = res.data;


            if (res.status === 200) {
                console.log('Login successful');

                localStorage.setItem('email', email); // Store email
                localStorage.setItem('rememberMe', rememberMe); // Store rememberMe preference
                navigate('/user/verify-otp'); // redirect to OTP verification page
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };



    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#33373D' }}>
            <div className="max-w-md w-full rounded-2xl shadow-xl p-8 shadow-gray-800/20 " style={{ backgroundColor: '#293038' }}>
                {/* Header */}
                <div className="text-center mb-8">
                    <img
                        src="/static/logo-background-removed.png"
                        alt="Logo"
                        className="mx-auto mb-6 h-30 w-auto"
                    />
                    <p className="text-gray-300 font-medium">Sign in to your account</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
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

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="cursor-pointer h-4 w-4 border-gray-300 rounded"
                                style={{ accentColor: '#17A29F' }}
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                                Remember me
                            </label>
                        </div>
                        <a onClick={() => navigate('/user/forgot-password')} href="#" className="cursor-pointer text-sm hover:opacity-80 transition duration-200" style={{ color: '#17A29F' }}>
                            Forgot password?
                        </a>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="cursor-pointer w-full text-white py-3 px-4 rounded-lg hover:opacity-90 focus:ring-2 focus:ring-offset-2 transition duration-200 font-medium"
                        style={{
                            backgroundColor: '#17A29F',
                            focusRingColor: '#17A29F'
                        }}
                    >
                        Sign In
                    </button>
                </form>

                {/* Sign Up Link */}
                <p className="mt-8 text-center text-sm text-gray-300">
                    Don't have an account?{' '}
                    <a href="#" className="font-medium transition duration-200 hover:opacity-80" style={{ color: '#17A29F' }}>
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;