
const Category = require('../models/Category')

//..........................creating tags................................................................

const createCategory = async (req, res) => {
    try {
        //fetch data
        const { name, description } = req.body;

        //validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all the fields for creating CategoryDetails'
            })
        }

        //create entry in DB
        const CategoryDetails = await Category.create({
            name: name,
            description: description,
        })

        console.log(CategoryDetails);


        //return response
        return res.status(200).json({
            success: true,
            message: 'Category created successfully',
            CategoryDetails
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while creating CategoryDetails'
        })
    }
}



//...........................show all the tags................................................................

const showAllCategory = async (req, res) => {
    try {
        const Categories = await Category.find({}, { name: true, description: true });


        return res.status(200).json({
            success: true,
            message: 'All CategoryDetails were return  successfully',
            Categories
        })


    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while fetching Category'
        })
    }

}


module.exports = { createCategory, showAllCategory }
