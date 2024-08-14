const Section = require('../models/Section');
const Course = require('../models/Course');


const createSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body;

        //data validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all the fields'
            })
        }

        const newSection = await Section.create({ sectionName })

        //update Course document with new section objectId inside corseContent[] array
        const updatedCourse = await Course.findByIdAndUpdate(courseId, { $push: { courseContent: newSection._id } }, { new: true }).populate().exec();

        //return response
        return res.status(200).json({
            success: true,
            message: 'Section created successfully',
            updatedCourse
        })



    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create section',
            error,
        });
    }
}

const updateSection = async (req, res) => {
    try {

        const { sectionName, sectionId } = req.body;

        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all the fields'
            })
        }

        //update section
        const updatedSection = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });

        return res.status(200).json({
            success: true,
            message: 'Section updated successfully',
            updatedSection
        })





    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update section',
            error,
        })
    }
}



const deleteSection = async (req, res) => {
    try {
        const { sectionId } = req.params;
        const { courseId } = req.body

        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: 'Please fill sectionId'
            })
        }

        //find course that contains the section to be deleted
        await Course.findByIdAndUpdate(courseId, { $pop: { courseContent: sectionId } }, { new: true })

        //delete section
        await Section.findByIdAndDelete(sectionId);



        return res.status(200).json({
            success: true,
            message: 'Section deleted successfully',

        })





    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete section',
            error,
        })
    }
}



module.exports = {createSection, updateSection, deleteSection}