const Category = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Course = require("../models/Course");
require("dotenv").config();



// Function to create new Course
exports.createCourse = async (req, res) => {
    try {
        // Get user id from request object
        const userId = req.user.id;

        // Get all required fields from request body
        let {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag: _tag,
            category,
            status,
            instructions: _instructions,
        } = req.body;

        // Get thumbnail image from request files
        const thumbnail = req.files.thumbnailImage;

        // Convert the tag and instructions from stringFied Array to Array
        const tag = JSON.parse(_tag);
        const instructions = JSON.parse(_instructions);

        console.log("tag", tag);
        console.log("instructions", instructions);

        // Check if any required fields are missing
        if(
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !tag.length ||
            !thumbnail ||
            !category ||
            !instructions.length
        ) {
            return res.status(400).json({
                success: false,
                message: "All Fields are Mandatory",
            })
        }

        if(!status || status === undefined) {
            status = "Draft"
        }

        // Check if the user is an instructor or not
        const instructorDetails = await User.findById(userId);

        if(instructorDetails.accountType !== 'Instructor') {
            return res.status(404).json({
                success: false,
                message: "Instructor Details Not Found",
            });
        }

        // Check if the tag given is valid
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Details Not Found",
            });
        }

        // Upload the Thumbnail to Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
        console.log(thumbnailImage);

        // Create a new course with the given details
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status: status,
            instructions,
        })

        // Add the new course to the User Schema of the Instructor
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: { courses: newCourse._id },
            },
            { new: true },
        )

        // Add the new course to the Categories
        const categoryDetails2 = await Category.findByIdAndUpdate(
            { _id: category },
            {
                $push: { courses: newCourse._id },
            },
            { new: true }
        )

        console.log("HEREEEEEE", categoryDetails2);

        // Return the new course and a success message
        res.status(200).json({
            success: true,
            data: newCourse,
            message: "Course Created Successfully",
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        })
    }
}

// Edit Course Details
exports.editCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const updates = req.body;
        const course = await Course.findById(courseId);

        if(!course) {
            return res.status(404).json({
                error: "Course not found",
            })
        }

        // If thumbnail image is found, update it
        if(req.files) {
            console.log("Thumbnail update");
            const thumbnail = req.files.thumbnailImage;
            const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
            course.thumbnail = thumbnailImage.secure_url;
        }

        // Update only the field that are present in the request body
        for(const key in updates) {
            if(updates.hasOwnProperty(key) && key !== courseId) {
                if(key === "tag" || key === "instructions") course[key] = JSON.parse(updates[key]);
                else course[key] = updates[key];
            }
        }

        await course.save();

        const updatedCourse = await Course.findOne({ _id: courseId })
                                .populate({
                                    path: "instructor",
                                    populate: {
                                        path: "additionalDetails",
                                    },
                                })
                                .populate("category")
                                .populate("ratingAndReviews")
                                .populate({
                                    path: "courseContent",
                                    populate: {
                                        path: "subSection",
                                    },
                                })
                                .exec();
                            
        return res.json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        })

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

// Get Course List
exports.getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find(
            { status: "Published" },
            {
                courseName: true,
                price: true,
                thumbnail: true,
                instructor: true,
                ratingAndReviews: true,
                studentsEnrolled: true,
            }
        )
        .populate("instructor")
        .exec();

        return res.status(200).json({
            success: true,
            data: allCourses,
        })

    } catch(error) {
        console.log(error);
        return res.status(404).json({
            success: false,
            message: "Can't Fetch Course Data",
            error: error.message,
        })
    }
}

// Get One Single Course Details
exports.getCourseDetails = async(req, res) => {
    try {
        

    } catch(error) {

    }
}