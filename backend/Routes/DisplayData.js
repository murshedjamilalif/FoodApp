const express = require('express');
const router = express.Router();

router.post('/foodData', (req, res) => {
    try {
        // Debug logging
        console.log("foodData route accessed");
        console.log("Global variables state:", {
            food_items_exists: !!global.food_items,
            foodCategory_exists: !!global.foodCategory,
            food_items_length: global.food_items?.length,
            foodCategory_length: global.foodCategory?.length
        });

        // Validate data exists
        if (!global.food_items || !global.foodCategory) {
            return res.status(500).json({
                error: "Data not initialized",
                debug: {
                    food_items: !!global.food_items,
                    foodCategory: !!global.foodCategory
                }
            });
        }

        // Send response
        res.status(200).json([global.food_items, global.foodCategory]);
        
    } catch (error) {
        console.error("Error in /foodData route:", error);
        res.status(500).json({
            error: "Server Error",
            message: error.message
        });
    }
});

module.exports = router;