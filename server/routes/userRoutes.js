const express = require('express');
const router = express.Router();
const {
  getDonors,
  getDonorById,
  updateProfile,
  updateAvailability,
  getAllDonorsForHospital,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/donors', protect, getDonors);
router.get('/donors/:id', protect, getDonorById);
router.put('/profile', protect, updateProfile);
router.put('/availability', protect, authorize('donor'), updateAvailability);
router.get('/hospital/donors', protect, authorize('hospital'), getAllDonorsForHospital);

module.exports = router;
