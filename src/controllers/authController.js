const authService = require('../services/authService');
const { ApiError, catchAsync } = require('../middleware/errorHandler');

/**
 * Register a new user
 * @route POST /api/auth/register
 */
const register = catchAsync(async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    throw new ApiError('Email and password are required', 400);
  }

  // Register user with Supabase
  const data = await authService.signUp(email, password, { name });

  return res.status(201).json({
    success: true,
    message: 'Registration successful. Please check your email for confirmation.',
    user: data.user,
  });
});

/**
 * Log in a user
 * @route POST /api/auth/login
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError('Email and password are required', 400);
  }

  // Login with Supabase
  const data = await authService.signIn(email, password);

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    user: data.user,
    session: data.session,
  });
});

/**
 * Log out a user
 * @route POST /api/auth/logout
 */
const logout = catchAsync(async (req, res) => {
  await authService.signOut();

  return res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});

/**
 * Get the current user's profile
 * @route GET /api/auth/me
 */
const getCurrentUser = catchAsync(async (req, res) => {
  // User is already set in req from the authMiddleware
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

/**
 * Update user profile
 * @route PUT /api/auth/profile
 */
const updateProfile = catchAsync(async (req, res) => {
  const { name, phone, address } = req.body;
  
  // Update user metadata using Supabase
  const data = await authService.updateUserData({
    name,
    phone,
    address,
  });

  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: data.user,
  });
});

/**
 * Reset password with reset token
 * @route POST /api/auth/reset-password
 */
const resetPassword = catchAsync(async (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    throw new ApiError('New password is required', 400);
  }
  
  // Password reset (requires active session from reset link)
  const data = await authService.updatePassword(password);

  return res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
});

/**
 * Send password reset email
 * @route POST /api/auth/forgot-password
 */
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError('Email is required', 400);
  }

  // Send password reset email
  await authService.resetPasswordEmail(email, `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password`);

  return res.status(200).json({
    success: true,
    message: 'Password reset instructions sent to your email',
  });
});

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  resetPassword,
  forgotPassword,
};
