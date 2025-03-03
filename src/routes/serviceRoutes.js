const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  searchServices
} = require('../controllers/serviceController');

// Public routes
router.get('/', getAllServices);
router.get('/search', searchServices);
router.get('/:id', getServiceById);

// Protected routes (require authentication)
router.use(authMiddleware);
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

module.exports = router;
