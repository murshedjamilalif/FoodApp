const express = require('express');
const User = require('../models/User');
const Order = require('../models/Orders');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const fetch = require('../middleware/fetchdetails');
const jwtSecret = "HaHa";

// Test route to verify auth functionality
router.get('/test', async (req, res) => {
    try {
        const dbStatus = await User.db.collection('users').stats();
        res.json({
            status: 'success',
            message: 'Auth route working',
            dbStatus: dbStatus ? 'connected' : 'disconnected'
        });
    } catch (error) {
        console.error('Test route error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Create new user
router.post('/createuser', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters')
], async (req, res) => {
    try {
        console.log('Create user request received:', { email: req.body.email, name: req.body.name });
        
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        // Check if user already exists
        let existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "A user with this email already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(req.body.password, salt);
        
        // Create user
        const user = await User.create({
            name: req.body.name,
            password: securePass,
            email: req.body.email,
            location: req.body.location
        });

        // Generate token
        const data = {
            user: {
                id: user.id
            }
        };
        const authToken = jwt.sign(data, jwtSecret);
        
        res.json({ success: true, authToken });
        
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ 
            success: false, 
            error: "Error creating user",
            message: error.message 
        });
    }
});

// Login user
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').exists().withMessage('Password is required')
], async (req, res) => {
    try {
        console.log('Login attempt received for:', req.body.email);

        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find user
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                error: "No user found with this email" 
            });
        }

        // Verify password
        const pwdCompare = await bcrypt.compare(password, user.password);
        if (!pwdCompare) {
            return res.status(400).json({ 
                success: false, 
                error: "Incorrect password" 
            });
        }

        // Generate token
        const data = {
            user: {
                id: user.id
            }
        };
        const authToken = jwt.sign(data, jwtSecret);
        
        res.json({ success: true, authToken });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            error: "Login failed",
            message: error.message 
        });
    }
});

// Get user details
router.post('/getuser', fetch, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ 
            error: "Error fetching user details",
            message: error.message 
        });
    }
});

// Get location
router.post('/getlocation', async (req, res) => {
    try {
        const { lat, long } = req.body.latlong;
        const response = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=74c89b3be64946ac96d777d08b878d43`
        );
        
        const { village, county, state_district, state, postcode } = response.data.results[0].components;
        const location = `${village},${county},${state_district},${state}\n${postcode}`;
        
        res.json({ location });
    } catch (error) {
        console.error('Get location error:', error);
        res.status(500).json({ 
            error: "Error fetching location",
            message: error.message 
        });
    }
});

// Order Data Routes
router.post('/orderData', async (req, res) => {
    try {
        let data = req.body.order_data;
        data.unshift({ Order_date: req.body.order_date });
        
        let eId = await Order.findOne({ 'email': req.body.email });
        if (eId === null) {
            await Order.create({
                email: req.body.email,
                order_data: [data]
            });
        } else {
            await Order.findOneAndUpdate(
                { email: req.body.email },
                { $push: { order_data: data } }
            );
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Order data error:', error);
        res.status(500).json({
            error: "Error saving order data",
            message: error.message
        });
    }
});

router.post('/myOrderData', async (req, res) => {
    try {
        let eId = await Order.findOne({ 'email': req.body.email });
        res.json({ orderData: eId });
    } catch (error) {
        console.error('My order data error:', error);
        res.status(500).json({
            error: "Error fetching order data",
            message: error.message
        });
    }
});

module.exports = router;