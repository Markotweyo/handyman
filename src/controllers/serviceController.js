const serviceService = require('../services/serviceService');
const { ApiError, catchAsync } = require('../middleware/errorHandler');

/**
 * Controller for service-related operations
 */

/**
 * Get all services with filtering, sorting, and pagination
 * @route GET /api/services
 */
const getAllServices = catchAsync(async (req, res) => {
  const filters = {
    category: req.query.category,
    price_min: req.query.price_min ? parseFloat(req.query.price_min) : null,
    price_max: req.query.price_max ? parseFloat(req.query.price_max) : null,
    provider_id: req.query.provider_id,
    available: req.query.available !== undefined ? req.query.available === 'true' : null,
    sort_by: req.query.sort_by || 'created_at',
    sort_order: req.query.sort_order || 'desc',
    page: req.query.page ? parseInt(req.query.page) : 1,
    limit: req.query.limit ? parseInt(req.query.limit) : 10
  };

  const { data, count } = await serviceService.getAllServices(filters);

  res.status(200).json({
    success: true,
    count,
    data,
    page: filters.page,
    limit: filters.limit,
    total_pages: Math.ceil(count / filters.limit) || 1
  });
});

/**
 * Get a single service by ID
 * @route GET /api/services/:id
 */
const getServiceById = catchAsync(async (req, res) => {
  const service = await serviceService.getServiceById(req.params.id);
  
  if (!service) {
    throw new ApiError(`Service with ID ${req.params.id} not found`, 404);
  }

  res.status(200).json({
    success: true,
    data: service
  });
});

/**
 * Create a new service
 * @route POST /api/services
 */
const createService = catchAsync(async (req, res) => {
  const { name, description, price, category, is_available } = req.body;

  // Basic validation
  if (!name || !description || !price) {
    throw new ApiError('Name, description, and price are required', 400);
  }

  // Create service data with user ID from auth middleware
  const serviceData = {
    name,
    description,
    price: parseFloat(price),
    category,
    is_available: is_available !== undefined ? is_available : true,
    provider_id: req.user.id // From auth middleware
  };

  const newService = await serviceService.createService(serviceData);

  res.status(201).json({
    success: true,
    data: newService
  });
});

/**
 * Update a service
 * @route PUT /api/services/:id
 */
const updateService = catchAsync(async (req, res) => {
  // First check if service exists
  const service = await serviceService.getServiceById(req.params.id);
  
  if (!service) {
    throw new ApiError(`Service with ID ${req.params.id} not found`, 404);
  }

  // Check if user owns this service
  if (service.provider_id !== req.user.id) {
    throw new ApiError('Not authorized to update this service', 403);
  }

  // Update the service
  const updatedService = await serviceService.updateService(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    data: updatedService
  });
});

/**
 * Delete a service
 * @route DELETE /api/services/:id
 */
const deleteService = catchAsync(async (req, res) => {
  // First check if service exists
  const service = await serviceService.getServiceById(req.params.id);
  
  if (!service) {
    throw new ApiError(`Service with ID ${req.params.id} not found`, 404);
  }

  // Check if user owns this service
  if (service.provider_id !== req.user.id) {
    throw new ApiError('Not authorized to delete this service', 403);
  }

  // Delete the service
  await serviceService.deleteService(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Service deleted successfully'
  });
});

/**
 * Search services by keyword
 * @route GET /api/services/search
 */
const searchServices = catchAsync(async (req, res) => {
  const { keyword } = req.query;
  
  if (!keyword) {
    throw new ApiError('Search keyword is required', 400);
  }

  const services = await serviceService.searchServices(keyword);

  res.status(200).json({
    success: true,
    count: services.length,
    data: services
  });
});

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  searchServices
};
