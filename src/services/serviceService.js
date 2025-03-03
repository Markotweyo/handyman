const supabase = require('../config/supabaseClient');

/**
 * Service functions for interacting with the services table in Supabase
 */

// Table name for services
const TABLE_NAME = 'services';

/**
 * Get all services with optional filtering
 */
const getAllServices = async (filters = {}) => {
  let query = supabase.from(TABLE_NAME).select('*');
  
  // Apply filters if provided
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters.price_min) {
    query = query.gte('price', filters.price_min);
  }
  
  if (filters.price_max) {
    query = query.lte('price', filters.price_max);
  }
  
  if (filters.provider_id) {
    query = query.eq('provider_id', filters.provider_id);
  }
  
  if (filters.available === true || filters.available === false) {
    query = query.eq('is_available', filters.available);
  }
  
  // Add sorting
  if (filters.sort_by) {
    const order = filters.sort_order === 'desc' ? true : false;
    query = query.order(filters.sort_by, { ascending: !order });
  } else {
    // Default sort by created_at
    query = query.order('created_at', { ascending: false });
  }
  
  // Add pagination
  if (filters.page && filters.limit) {
    const from = (filters.page - 1) * filters.limit;
    const to = from + filters.limit - 1;
    query = query.range(from, to);
  }
  
  const { data, error, count } = await query;
  
  if (error) throw error;
  return { data, count };
};

/**
 * Get a service by ID
 */
const getServiceById = async (id) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * Create a new service
 */
const createService = async (serviceData) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([serviceData])
    .select();
  
  if (error) throw error;
  return data[0];
};

/**
 * Update an existing service
 */
const updateService = async (id, serviceData) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(serviceData)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

/**
 * Delete a service
 */
const deleteService = async (id) => {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

/**
 * Search services by keyword
 */
const searchServices = async (keyword, options = {}) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .or(`name.ilike.%${keyword}%,description.ilike.%${keyword}%`);
  
  if (error) throw error;
  return data;
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  searchServices
};
