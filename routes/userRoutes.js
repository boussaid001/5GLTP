const express = require('express');
const router = express.Router();
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');

// @route   GET /api/users
// @desc    Get all users
router.get('/', getAllUsers);

// @route   POST /api/users
// @desc    Create a new user
router.post('/', createUser);

// @route   GET /api/users/:id
// @desc    Get user by ID
router.get('/:id', getUserById);

// @route   PUT /api/users/:id
// @desc    Update user by ID
router.put('/:id', updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user by ID
router.delete('/:id', deleteUser);

module.exports = router;
