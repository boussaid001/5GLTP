const Profile = require('../models/Profile');
const User = require('../models/User');

// @desc    Create a profile for a user
// @route   POST /api/users/:userId/profile
// @access  Public
const createProfile = async (req, res) => {
    try {
        const { bio, website } = req.body;
        const userId = req.params.userId;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if profile already exists for this user
        const existingProfile = await Profile.findOne({ user: userId });
        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: 'Profile already exists for this user'
            });
        }

        const profile = await Profile.create({
            user: userId,
            bio,
            website
        });

        // Populate user data
        await profile.populate('user', 'username email');

        res.status(201).json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get profile by user ID
// @route   GET /api/users/:userId/profile
// @access  Public
const getProfileByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const profile = await Profile.findOne({ user: userId }).populate('user', 'username email');
        
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found for this user'
            });
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update profile by user ID
// @route   PUT /api/users/:userId/profile
// @access  Public
const updateProfileByUserId = async (req, res) => {
    try {
        const { bio, website } = req.body;
        const userId = req.params.userId;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const profile = await Profile.findOneAndUpdate(
            { user: userId },
            { bio, website },
            { new: true, runValidators: true }
        ).populate('user', 'username email');

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found for this user'
            });
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete profile by user ID
// @route   DELETE /api/users/:userId/profile
// @access  Public
const deleteProfileByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const profile = await Profile.findOneAndDelete({ user: userId });
        
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found for this user'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createProfile,
    getProfileByUserId,
    updateProfileByUserId,
    deleteProfileByUserId
};
