require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes

// 404 handler
app.use((req , res , next) => {
    res.status(404).json({ message: 'Route Not Found' });
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error details
  res.status(500).json({ error: 'Internal Server Error' });
});

// Routes
app.get('/login' , require('./routes/login.js'));





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})



