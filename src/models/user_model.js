import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
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