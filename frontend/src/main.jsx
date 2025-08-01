import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import LoginPage from './pages/login.jsx'
import OtpPage from './pages/verify-otp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Welcome to Cheez</h1>} />

        {/** user routes */}
        <Route path="/user/login" element={<LoginPage />} />
        <Route path="/user/verify-otp" element={<OtpPage />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
