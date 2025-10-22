const express = require('express');
const router = express.Router();
const {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    enrollUserInCourse,
    getCourseStudents,
    getUserCourses
} = require('../controllers/courseController');
const {
    addReviewToCourse,
    getCourseReviews
} = require('../controllers/reviewController');

// @route   POST /api/courses
// @desc    Create a new course
router.post('/', createCourse);

// @route   GET /api/courses
// @desc    Get all courses
router.get('/', getAllCourses);

// @route   GET /api/courses/:id
// @desc    Get course by ID
router.get('/:id', getCourseById);

// @route   PUT /api/courses/:id
// @desc    Update course by ID
router.put('/:id', updateCourse);

// @route   DELETE /api/courses/:id
// @desc    Delete course by ID
router.delete('/:id', deleteCourse);

// @route   POST /api/courses/:courseId/enroll
// @desc    Enroll user in course
router.post('/:courseId/enroll', enrollUserInCourse);

// @route   GET /api/courses/:courseId/students
// @desc    Get students enrolled in a course
router.get('/:courseId/students', getCourseStudents);

// @route   GET /api/users/:userId/courses
// @desc    Get courses for a user
router.get('/users/:userId/courses', getUserCourses);

// @route   POST /api/courses/:courseId/reviews
// @desc    Add a review to a course
router.post('/:courseId/reviews', addReviewToCourse);

// @route   GET /api/courses/:courseId/reviews
// @desc    Get all reviews for a course
router.get('/:courseId/reviews', getCourseReviews);

module.exports = router;
