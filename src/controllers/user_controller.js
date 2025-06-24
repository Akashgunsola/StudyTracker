
import User from "../models/user_model.js"
//register controller
const register = async(req,res) => {
    //Get data from req.body
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        return res.status(400).json({
            message: "All fields are required",
        });
    }
    console.log(email);
    //validate if the data/details is there and is in correct format
    if(!email.includes("@")){
        return res.status(400).json({
            message:"Please enter a valid email"});
    }
    if(password.length < 6){
        return res.status(400).json({
            message: ("Enter password length >6")});
        
    }    
    //check if the user is already exists
    try {
       const existinguser = await User.findOne({email})
       if(existinguser){
            return res.status(400).json({
                message: "User already exist"
                
            })
        }
//create a new user
       const user = await User.create({
            username,
            email,
            password
        })
        if(!user){
            res.status(400).json({
                message: "user not registed"
            })
        }
    }
    catch (error) {
        
    }
    
    //generate verification token
    //keep verification in database
    //verify user by sending token as email to user
    //send success status to user
    //res.send("Hello");
};

export { register };