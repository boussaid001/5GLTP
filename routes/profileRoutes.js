const express = require('express');
const router = express.Router();
const {
    createProfile,
    getProfileByUserId,
    updateProfileByUserId,
    deleteProfileByUserId
} = require('../controllers/profileController');

// @route   POST /api/users/:userId/profile
// @desc    Create a profile for a user
router.post('/:userId/profile', createProfile);

// @route   GET /api/users/:userId/profile
// @desc    Get profile by user ID
router.get('/:userId/profile', getProfileByUserId);

// @route   PUT /api/users/:userId/profile
// @desc    Update profile by user ID
router.put('/:userId/profile', updateProfileByUserId);

// @route   DELETE /api/users/:userId/profile
// @desc    Delete profile by user ID
router.delete('/:userId/profile', deleteProfileByUserId);

module.exports = router;
