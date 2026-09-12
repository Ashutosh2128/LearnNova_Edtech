const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const crypto = require("crypto");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
const CourseProgress = require("../models/CourseProgress");

// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
    const { courses } = req.body;
    const userId = req.user.id;
    if(courses.length === 0) {
        return res.json({
            success: false,
            message: "Please provide course id",
        })
    }

    let total_amount = 0;

    for(const course_id of courses) {
        let course

        try {
            // find the course by it's id
            course = await Course.findById(course_id);

            // If the course is not found, return an error
            if(!course) {
                return res.status(500).json({
                    success: false,
                    message: "Could not find the Course",
                })
            }

            //check if the user is already enrolled in the course
            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)) {
                return res.status(500).json({
                    success: false,
                    message: "Student is alredy enroller",
                })
            }

            // Add the price of the course to the total amount
            total_amount += course.price;

        } catch(error) {

        }
    }
}