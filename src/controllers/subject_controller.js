import Subject from "../models/subject_model.js";

const createSubject = async (req, res) => {
    // *create a new subject for a logged in user algo below*
    //make a subject with req.body
    const {title, color} = req.body;
    //if no title or color
    if(!title || !color){
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        })
    }
    //check if subject already exist with title
    try {
       
        const existingsubject = await Subject.findOne({title, user_id: req.user.id});
        if(existingsubject){
           return res.status(400).json({
            success: false,
            message: "subject already exist",
        })
        }
        //create a subject with Subject.create
    const subject = await Subject.create({
        title,
        color,
        user_id: req.user.id,
    })
    if(!subject){
        res.status(400).json({
            success: false,
            message: "error in creating subject",
        })
    }

    res.status(200).json({
            success: true,
            message: "subject created successfully",
            subject,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error creating subject ",error,
        })
    }
    
}



export {createSubject};