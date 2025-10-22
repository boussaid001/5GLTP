const Review = require('../models/Review');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Add a review to a course
// @route   POST /api/courses/:courseId/reviews
// @access  Public
const addReviewToCourse = async (req, res) => {
    try {
        const { rating, comment, userId } = req.body;
        const courseId = req.params.courseId;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user has already reviewed this course
        const existingReview = await Review.findOne({
            course: courseId,
            user: userId
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'User has already reviewed this course'
            });
        }

        const review = await Review.create({
            rating,
            comment,
            course: courseId,
            user: userId
        });

        // Populate user data
        await review.populate('user', 'username email');

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all reviews for a course
// @route   GET /api/courses/:courseId/reviews
// @access  Public
const getCourseReviews = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        const reviews = await Review.find({ course: courseId })
            .populate('user', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update a review
// @route   PUT /api/reviews/:reviewId
// @access  Public
const updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const reviewId = req.params.reviewId;

        const review = await Review.findByIdAndUpdate(
            reviewId,
            { rating, comment },
            { new: true, runValidators: true }
        ).populate('user', 'username email');

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Public
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        await Review.findByIdAndDelete(req.params.reviewId);

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'username email')
            .populate('course', 'title description instructor')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addReviewToCourse,
    getCourseReviews,
    updateReview,
    deleteReview,
    getAllReviews
};
