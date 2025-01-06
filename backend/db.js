const mongoose = require("mongoose");

const mongoURI = "mongodb+srv://foodapp:foodapp1234@foodapp.wh1e4.mongodb.net/foodapp?retryWrites=true&w=majority&appName=foodapp";

// Connection options
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    autoIndex: true,
};

const mongoDB = async (callback) => {
    try {
        // Set up MongoDB connection handlers
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to MongoDB Atlas');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
        });

        // Connect to MongoDB
        await mongoose.connect(mongoURI, options);
        
        const db = mongoose.connection.db;
        
        // Verify database connection
        await db.command({ ping: 1 });
        console.log("Database connection verified successfully");

        try {
            // Get collections with error handling
            const fetched_data = db.collection("food_items");
            const foodCategory = db.collection("foodCategory");

            // Verify collections exist
            const collections = await db.listCollections().toArray();
            const collectionNames = collections.map(c => c.name);
            
            if (!collectionNames.includes('food_items') || !collectionNames.includes('foodCategory')) {
                throw new Error(`Required collections not found. Available collections: ${collectionNames.join(', ')}`);
            }

            // Fetch data with timeout
            const [foodItemsData, foodCategoryData] = await Promise.all([
                fetched_data.find({}).toArray(),
                foodCategory.find({}).toArray()
            ]);

            // Validate data
            if (!foodItemsData?.length) {
                console.warn('Warning: No food items found in database');
            }

            if (!foodCategoryData?.length) {
                console.warn('Warning: No food categories found in database');
            }

            // Log successful data fetch
            console.log(`Successfully fetched ${foodItemsData.length} food items and ${foodCategoryData.length} categories`);

            // Execute callback with data
            callback(null, foodItemsData, foodCategoryData);

        } catch (dataError) {
            console.error("Error fetching data:", {
                message: dataError.message,
                type: dataError.name,
                stack: dataError.stack
            });
            callback(dataError, null, null);
        }

    } catch (connectionError) {
        console.error("MongoDB Connection Error:", {
            message: connectionError.message,
            type: connectionError.name,
            stack: connectionError.stack
        });
        callback(connectionError, null, null);
    }
};

// Handle process termination
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('Mongoose connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error closing Mongoose connection:', err);
        process.exit(1);
    }
});

module.exports = mongoDB;