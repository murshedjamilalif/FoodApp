const express = require('express');
const app = express();
const port = 5000;
const mongoDB = require('./db');
const cors = require('cors');

// CORS Configuration
app.use(cors({
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Middleware
app.use(express.json());

// Connect to MongoDB and initialize data
mongoDB((err, foodItems, foodCategory) => {
    if (err) {
        console.error('Failed to initialize data:', err);
        process.exit(1);
    }

    try {
        // Set global variables
        global.food_items = foodItems;
        global.foodCategory = foodCategory;

        console.log('Data initialized successfully:', {
            food_items_length: foodItems?.length,
            foodCategory_length: foodCategory?.length
        });

        // Initialize routes AFTER data is loaded
        const authRouter = require('./Routes/Auth');
        const displayDataRouter = require('./Routes/DisplayData');

        // Mount routes
        app.use('/api/auth', authRouter);
        app.use('/api/auth', displayDataRouter);

        // Global error handler
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({
                error: "Internal Server Error",
                message: err.message
            });
        });

        // Start server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

    } catch (error) {
        console.error('Server initialization error:', error);
        process.exit(1);
    }
});