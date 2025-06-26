
import User from "../models/user_model.js"
import crypto from "crypto"
import nodemailer from "nodemailer"

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
                message: "user not registered"
            })
        }
    
    
    //generate verification token
const verificationToken = crypto.randomBytes(32).toString("hex");
const verificationTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour in ms
//keep verification in database
user.verificationToken = verificationToken;
user.verificationTokenExpiry = verificationTokenExpiry;
await user.save();
    
    //verify user by sending token as email to user
    const mailoptions = {
        from: 'studytracker@ethereal.email',
        to: user.email,
        subject: "Please Verify your email",
        text: `Please click on this link or paste it in your browser if unable to click to verify your email:
         ${process.env.BASE_URL}/api/v1/users/verify/${verificationToken}` , // plain‑text body
        // html: "<b>Hello world?</b>", // HTML body
    }
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,
  },

});
await transporter.sendMail(mailoptions);

//send success status to user
res.status(201).json({
    message:"User registered successfully",
    success: true,
})

}
catch (error) {
    res.status(400).json({
    message: "User not registered ",
    error,
    success: false,
});
}

};

const verifyUser = async(req, res) =>{
    //get token from url
    const {token} = req.params;
    if(!token){
        return res.status(400).json({
            message: "Invalid Token"
        })
    }
    const user = await User.findOne({verificationToken: token})
    if(!user){
        return res.status(400).json({
            message: "Invalid Token"
        })
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    
    return res.status(201).json({
        message:"User verified"
    })
    
 }

export { register, verifyUser};