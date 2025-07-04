import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim: true,
    },
    avatar:{
        type: String,
        default: "https://www.freepik.com/free-vector/blue-circle-with-white-user_145857007.htm#fromView=keyword&page=1&position=0&uuid=7a317191-066d-4554-88fc-5a23eaa1e41e&query=Default+Avatar",
    }
    ,
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: "Please enter a valid email address"
        }
    },
    password: {
        required: true,
        type: String,
        minlength: 6,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user" ,
    },
    verificationToken: String,
    verificationTokenExpiry: Date,

},{ 
    timestamps: true,
})
userSchema.pre("save", async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next();
})
const User = mongoose.model("User", userSchema);

export default User;