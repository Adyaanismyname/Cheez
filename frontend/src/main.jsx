import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import LoginPage from './pages/login.jsx'
import OtpPage from './pages/verify-otp.jsx'
import HomePage from './pages/home.jsx'
import CartPage from './pages/cart.jsx'
import SignupPage from './pages/signup.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Welcome to Cheez</h1>} /> // temporary landing page

        {/** user routes */}
        <Route path="/user/login" element={<LoginPage />} />
        <Route path="/user/verify-otp" element={<OtpPage />} />
        <Route path="/user/home" element={<HomePage />} />
        <Route path="/user/cart" element={<CartPage />} />
        <Route path="/user/signup" element={<SignupPage />} />


      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
