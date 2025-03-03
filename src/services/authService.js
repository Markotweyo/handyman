const supabase = require('../config/supabaseClient');

/**
 * Authentication service for interacting with Supabase Auth
 */

/**
 * Register a new user with email and password
 */
const signUp = async (email, password, userData = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: userData }
  });
  
  if (error) throw error;
  return data;
};

/**
 * Sign in a user with email and password
 */
const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
};

/**
 * Sign out the current user
 */
const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
};

/**
 * Get the current user session
 */
const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data;
};

/**
 * Get user by access token
 */
const getUserByToken = async (token) => {
  const { data, error } = await supabase.auth.getUser(token);
  if (error) throw error;
  return data.user;
};

/**
 * Send password reset email
 */
const resetPasswordEmail = async (email, redirectUrl) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl
  });
  
  if (error) throw error;
  return data;
};

/**
 * Update user password
 */
const updatePassword = async (password) => {
  const { data, error } = await supabase.auth.updateUser({
    password
  });
  
  if (error) throw error;
  return data;
};

/**
 * Update user details
 */
const updateUserData = async (userData) => {
  const { data, error } = await supabase.auth.updateUser({
    data: userData
  });
  
  if (error) throw error;
  return data;
};

module.exports = {
  signUp,
  signIn,
  signOut,
  getSession,
  getUserByToken,
  resetPasswordEmail,
  updatePassword,
  updateUserData
};
