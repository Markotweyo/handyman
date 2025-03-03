const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { 
    register, 
    login, 
    logout, 
    getCurrentUser,
    updateProfile,
    resetPassword,
    forgotPassword
} = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes (require authentication)
router.use(authMiddleware);
router.post('/logout', logout);
router.get('/me', getCurrentUser);
router.put('/profile', updateProfile);

module.exports = router;
