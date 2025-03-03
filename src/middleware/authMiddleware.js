const supabase = require('../config/supabaseClient');

/**
 * Middleware to verify authentication
 * Extracts the JWT token from Authorization header
 * and verifies it using Supabase
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the request header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided or invalid format' });
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication token is required' });
    }

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    // Set the authenticated user on the request object
    req.user = user;
    
    // Continue to the next middleware/controller
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Server error during authentication' });
  }
};

module.exports = { authMiddleware };
