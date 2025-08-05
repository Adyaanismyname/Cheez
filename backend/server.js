require('dotenv').config();

const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // <-- You need this to parse JSON POST bodies

// server port
const PORT = process.env.PORT || 3000;

// Routes
// Import your login routes properly. For example, if you want to mount them under /login:
const loginRouter = require('./routes/login.js');
const signupRouter = require('./routes/signup.js');
const homeRouter = require('./routes/home.js');
const cartRouter = require('./routes/cart.js'); 
app.use('/login', loginRouter); 
app.use('/signup', signupRouter); 
app.use('/home', homeRouter);
app.use('/cart', cartRouter); 

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// mongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected ✅");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => console.error("MongoDB connection error:", err));
