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
const getallSubject = async(req, res) => {console.log("yeah");

    try {
    const userSubs = await Subject.find({
        user_id: req.user.id
    }).sort({createdAt: -1});
    res.json({success: true, userSubs});

    } catch (error) {
        res.status(500).json(
            { message: "Failed to fetch subjects" }
        )
    }

}
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, user_id: req.user.id });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json({ success: true, subject });
  } catch (error) {
    res.status(500).json({ message: "Error fetching subject" });
  }
};
const updateSubject = async (req, res) => {
  try {
    const { title, color } = req.body;

    const updated = await Subject.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.id },
      { title, color },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json({ success: true, updated });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};
const deleteSubject = async (req, res) => {
  try {
    const deleted = await Subject.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json({ success: true, message: "Subject deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};



export {createSubject, updateSubject, getallSubject, getSubjectById, deleteSubject};

