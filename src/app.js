import express, { urlencoded } from "express";
import cors from "cors";
import userRoutes from "./routes/user_route.js"
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(urlencoded({extended:true}))
app.use(cors({
    origin: process.env.BASE_URL,
    methods: ['GET','POST', 'DELETE','PUT'],
    allowedHeaders: ['Content-type', 'Authorization']
}))
app.use(cookieParser());
app.use('/api/v1/users', userRoutes);

export default app;