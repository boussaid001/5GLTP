const express = require('express');
const router = express.Router();
const {
    updateReview,
    deleteReview,
    getAllReviews
} = require('../controllers/reviewController');

// @route   GET /api/reviews
// @desc    Get all reviews
router.get('/', getAllReviews);

// @route   PUT /api/reviews/:reviewId
// @desc    Update a review
router.put('/:reviewId', updateReview);

// @route   DELETE /api/reviews/:reviewId
// @desc    Delete a review
router.delete('/:reviewId', deleteReview);

module.exports = router;
