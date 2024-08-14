const Subsection = require("../models/SubSection");
const Section = require("../models/Section");

const { uploadImage } = require("../utils/imageuploader");
require("dotenv").config();

const createSubsection = async (req, res) => {
    try {
        const { sectionId, title, timeDuration, description } = req.body;

        const video = req.files.videoFile;

        if (!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "All fields are required for section creation ",
            });
        }

        const uploadDetails = await uploadImage(video, process.env.FOLDER_NAME);

        const SubsectionDetails = Subsection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,
        });

        //update section document with this sub-section objectId inside Subsection[]  array
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            { $push: { subSection: SubsectionDetails._id } },
            { new: true }
        )
            .populate()
            .exec();

        return res.status(200).json({
            success: true,
            message: "Subsection created successfully",
            updatedSection,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Something went wrong while creating subsection",
        });
    }
};

const updateSubsection = async (req, res) => {
    try {
        const { subsectionId, title, timeDuration, description } = req.body;

        const video = req.files.videoFile;

        if (!subsectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const uploadDetails = await uploadImage(video, process.env.FOLDER_NAME);
        console.log(uploadDetails);

        const updatedSubsection = await Subsection.findByIdAndUpdate(
            { _id: subsectionId },
            {
                title: title,
                timeDuration: timeDuration,
                description: description,
                videoUrl: uploadDetails.secure_url,
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Subsection updated successfully",
            updatedSubsection,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Something went wrong while updating section",
        });
    }
};

const deleteSubsection = async (req, res) => {
    try {
        // fetch data
        const { subsectionId } = await req.body;

        if (!subsectionId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const deletedSubsection = await Subsection.findByIdAndDelete({
            _id: subsectionId,
        });

        return res.status(200).json({
            success: true,
            message: "Subsection deleted successfully",
            deletedSubsection,
        });
    } catch (console) {
        return res.status(400).json({
            success: false,
            message: "Something went wrong while deleting section",
        });
    }
};

module.exports = { createSubsection, updateSubsection, deleteSubsection };
