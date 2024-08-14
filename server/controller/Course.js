const Course = require('../models/Course')
const Category = require('../models/Category')
const User = require('../models/User')
const imageuploader = require('../utils/imageuploader');

const createCourse = async (req, res) => {
    try {

        const userId = req.user.id;

        const instructorDetails = await User.findById({ userId });


        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: 'Instructor   not found'
            })
        }
        
        const { courseName, courseDescription, whatYouWillLearn, price, category } = req.body;

        const thumbnail = req.files.thumbnailImage;

        if (!courseDescription || !courseName || !price || !category || !thumbnail || !whatYouWillLearn) {
            return res.status(400).json({
                success: false,
                message: 'all fields of course are required for creating course'
            })
        }




        const categoryDetails = await Category.findById({ category })

        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: 'Invalid category'
            })
        }

        //upload image to cloudinary
        const thumbnailImage = await imageuploader(thumbnail, process.env.FOLDER_NAME)

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url

        })


        //add new course to User schema of instructor
        await User.findByIdAndUpdate(instructorDetails._id, { $push: { courses: newCourse._id } }, { new: true }).populate()


        //update Category
        await Category.findByIdAndUpdate(categoryDetails._id, { $push: { courses: newCourse._id } }, { new: true })

        //return response
        return res.status(200).json({
            success: true,
            message: 'Course created successfully',
            newCourse
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            error,
        })
    }
}



const showAllCourse = async (req, res) => {
    try {
        const allCourse = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReview: true,
            studentsEnrolled: true,
        }).populate('instructor').exec();


        return res.status(200).json({
            success: true,
            message: 'All courses fetched successfully',
            allCourse
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to get all courses',
            error
        })
    }
}


module.exports = { createCourse, showAllCourse };