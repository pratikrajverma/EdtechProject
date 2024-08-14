const Tags = require('../models/Tag');


const createTag = async (req, res) => {
    try{    
        const {name, description} = req.body;

        if(!name || !description){
            return res.status(400).json({message: 'Please provide name and description'});
        }

        const tagDetails = await Tags.create({name, description});

        console.log('tag details',tagDetails)

        return res.status(200).json({
            success: true,
            message: 'Tag created successfully',
            tag: tagDetails
        })

    }catch(error){
        return res.status(400).json({
            success: false,
            message: 'Failed to create tag',
            error: error.message
        })
    }
}



const showAllTags = async (req, res) => {
    try{
        const allTags = await Tags.findAll({}, {name:true, description:true});

        return res.status(200).json({
            success: true,
            message: 'All tags fetched successfully',
            tags: allTags
        })
    }catch(error){
        return res.status(400).json({
            success: false,
            message: 'Failed to get all tags',
            error: error.message
        })
    }
}


module.exports = {showAllTags, createTag}