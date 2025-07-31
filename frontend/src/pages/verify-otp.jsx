import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyOTPPage = () => {
    const [otp, setOtp] = useState('');
    const [Email, setEmail] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Use useEffect to get data from localStorage on component mount
    useEffect(() => {
        setEmail(localStorage.getItem('email') || ''); // Retrieve email from localStorage
        setRememberMe(localStorage.getItem('rememberMe') === 'true'); // Retrieve rememberMe preference
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
            alert('Please enter a 6-digit code');
            return;
        }

        setIsLoading(true);

        try {
            console.log('Verifying OTP:', otp);
            // Add your OTP verification logic here
            const res = await axios.post('http://localhost:3000/login/verify-otp', {
                email: Email,
                otp: otp,
                rememberMe: rememberMe
            });

            if (res.status === 200) {
                console.log('OTP verified successfully!');
                localStorage.clear(); // Clear localStorage on successful verification

                const token = res.data.token; // Assuming the token is returned in the response
                localStorage.setItem('token', token); // Store the token if needed

                navigate('/user/home'); // Redirect to home or another page after successful verification
            }





            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('OTP verified successfully!');
        } catch (error) {
            console.error('OTP verification failed:', error);
            alert('Invalid OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = () => {
        setOtp('');
        console.log('Resending OTP...');
        // Add your resend OTP logic here
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
                    <h2 className="text-2xl font-bold text-white mb-2">Verify Your Account</h2>
                    <p className="text-gray-300 text-sm">
                        Enter the 6-digit code sent to your email
                    </p>
                </div>

                {/* OTP Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* OTP Input */}
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">
                            Verification Code
                        </label>
                        <input
                            id="otp"
                            type="text"
                            inputMode="numeric"
                            maxLength="6"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 outline-none text-white text-center text-xl font-mono tracking-widest"
                            style={{
                                backgroundColor: '#33373D',
                                borderColor: '#17A29F',
                                focusRingColor: '#17A29F'
                            }}
                            placeholder="000000"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    {/* Verify Button */}
                    <button
                        type="submit"
                        disabled={isLoading || otp.length !== 6}
                        className="cursor-pointer w-full text-white py-3 px-4 rounded-lg hover:opacity-90 focus:ring-2 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        style={{
                            backgroundColor: '#17A29F',
                            focusRingColor: '#17A29F'
                        }}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Verifying...
                            </>
                        ) : (
                            'Verify Code'
                        )}
                    </button>
                </form>

                {/* Resend Option */}
                <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm mb-2">
                        Didn't receive the code?
                    </p>
                    <button
                        type="button"
                        onClick={handleResendOTP}
                        className="cursor-pointer text-sm font-medium hover:opacity-80 transition duration-200"
                        style={{ color: '#17A29F' }}
                    >
                        Resend Verification Code
                    </button>
                </div>

                {/* Back to Login */}
                <div className="mt-6 text-center">
                    <button
                        type="button"
                        className="inline-flex items-center text-sm text-gray-400 hover:text-gray-300 cursor-pointer transition duration-200"
                        onClick={() => navigate('/user/login')}
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTPPage;