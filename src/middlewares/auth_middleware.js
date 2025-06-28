import jwt from "jsonwebtoken";
export const isLoggedIn = async(req, res, next) =>{
const token = req.cookies.token;
        console.log("Token from cookie:", token);
        console.log("JWT_SECRET:", process.env.JWT_SECRET);
    try {
    
    if(!token){
        console.log("No token found");
        
        return res.status(401).json({
            success : false,
            message : "Authentication falied"
        });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded data: ", decoded);
        req.user = decoded;
        next();

    } 
    catch (error) {
        
            return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}