// Import the required modules
const express = require("express");
const router = express.Router();

// Import the Controllers
// Course Controllers Import
const {
    createCourse,
    getAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    editCourse,
    getInstructorCourse,
    deleteCourse,
} = require("../controllers/Course");

// Categories Controllers Import
const {
    showAllCategories,
    createCategory,
    categoryPageDetails,
} = require("../controllers/Category");

// Selections Controllers Import
const {
    createSection,
    updateSection,
    deleteSection,
} = require("../controllers/Section");

// Sub-Section Controllers Import
const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
} = require("../controllers/SubSection");

// Rating Controllers Import
const {
    createRating,
    getAverageRating,
    getAllRating,
} = require("../controllers/RatingAndReviews");

const {
    updateCourseProgress
} = require("../controllers/CourseProgress");

// Import middlewares
const {
    auth,
    isInstructor,
    isStudent,
    isAdmin
} = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Course can only be created by instructor
router.post("/createCourse", auth, isInstructor, createCourse);
// Add a Section to a course
router.post("/addSection", auth, isInstructor, createSection);
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection);
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection);
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection);
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses);
// Get Details for a specific Courses
router.post("/getCourseDetails", getCourseDetails);
// Get Details for a specific courses
router.post("/getFullCourseDetails", auth, isStudent, getFullCourseDetails);
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse);
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourse", auth, isInstructor, getInstructorCourse);
// Delete a Course
router.delete("/deleteCourse", auth, isInstructor, deleteCourse);

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can only be created by admin
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReview", getAllRating);

module.exports = router;