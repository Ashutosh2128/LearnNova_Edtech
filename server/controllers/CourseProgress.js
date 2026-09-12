const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");
const Course = require("../models/Course");
const Section = require("../models/Section");
const mongoose = require("mongoose");

exports.updateCourseProgress = async (req, res) => {
    try {
        const { courseId, subSectionId } = req.body;
        const userId = req.user.id;

        // Check if the subsection is valid
        const subsection = await SubSection.findById(subSectionId);
        if(!subsection) {
            return res.status(404).json({
                error: "Invalid subsection",
            });
        }

        // find the course progress document for the user and course
        let courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        })

        if(!courseProgress) {
            // if course progress doesn't exist, create a new one
            await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [subSectionId],
            })
        } else {
            // if course progress exists, check if the subsection is already completed
            if(courseProgress.completedVideos.includes(subSectionId)) {
                return res.status(400).json({
                    error: "Subsection alredy completed",
                })
            }

            // push the subsection into the completedVideos array
            courseProgress.completedVideos.push(subSectionId);

            // Save the updated course progress
            await courseProgress.save();
        }

        return res.status(200).json({
            message: "Course progress updated",
        })

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error",
        })
    }
}

exports.getProgressPercentage = async (req, res) => {
    const { courseId } = req.body;
    const userId = req.user.id;

    if(!courseId) {
        return res.status(400).json({
            error: "Course ID not provided."
        })
    }

    try {
        // find the course progress document for the user and course
        let courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        })
        .populate({
            path: "courseID",
            populate: {
                path: "courseContent",
            },
        })
        .exec();

        if(!courseProgress) {
            return res.status(400).json({
                error: "Can not find course progress with these IDs.",
            })
        }

        console.log(courseProgress, userId);
        let lectures = 0;
        courseProgress.courseID.courseContent?.forEach((sec) => {
            lectures += sec.subSectionId.length || 0;
        })

        let progressPercentage = (courseProgress.completedVideos.length / lectures) * 100;

        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2);
        progressPercentage = Math.round(progressPercentage * multiplier);

        return res.status(200).json({
            data: progressPercentage,
            message: "Successfully fetched Course progress",
        })

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error",
        })
    }
}