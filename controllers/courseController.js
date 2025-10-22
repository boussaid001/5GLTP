const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Public
const createCourse = async (req, res) => {
    try {
        const { title, description, instructor } = req.body;

        // Check if course with same title already exists
        const existingCourse = await Course.findOne({ title });
        if (existingCourse) {
            return res.status(400).json({
                success: false,
                message: 'Course with this title already exists'
            });
        }

        const course = await Course.create({
            title,
            description,
            instructor
        });

        res.status(201).json({
            success: true,
            data: course
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('students', 'username email');
        
        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('students', 'username email');
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update course by ID
// @route   PUT /api/courses/:id
// @access  Public
const updateCourse = async (req, res) => {
    try {
        const { title, description, instructor } = req.body;
        const courseId = req.params.id;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if title already exists (excluding current course)
        if (title) {
            const existingCourse = await Course.findOne({
                $and: [
                    { _id: { $ne: courseId } },
                    { title }
                ]
            });

            if (existingCourse) {
                return res.status(400).json({
                    success: false,
                    message: 'Course with this title already exists'
                });
            }
        }

        // Update course
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { title, description, instructor },
            { new: true, runValidators: true }
        ).populate('students', 'username email');

        res.status(200).json({
            success: true,
            data: updatedCourse
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete course by ID
// @route   DELETE /api/courses/:id
// @access  Public
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        await Course.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Enroll user in course
// @route   POST /api/courses/:courseId/enroll
// @access  Public
const enrollUserInCourse = async (req, res) => {
    try {
        const { userId } = req.body;
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

        // Check if user is already enrolled
        if (course.students.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: 'User is already enrolled in this course'
            });
        }

        // Add user to course students array
        course.students.push(userId);
        await course.save();

        // Add course to user courses array
        user.courses.push(courseId);
        await user.save();

        // Populate the updated course
        await course.populate('students', 'username email');

        res.status(200).json({
            success: true,
            message: 'User enrolled successfully',
            data: course
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get students enrolled in a course
// @route   GET /api/courses/:courseId/students
// @access  Public
const getCourseStudents = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).populate('students', 'username email');
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            count: course.students.length,
            data: course.students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get courses for a user
// @route   GET /api/users/:userId/courses
// @access  Public
const getUserCourses = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('courses', 'title description instructor');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            count: user.courses.length,
            data: user.courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    enrollUserInCourse,
    getCourseStudents,
    getUserCourses
};
