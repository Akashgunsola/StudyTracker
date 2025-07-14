import express, { urlencoded } from "express";
import cors from "cors";
import userRoutes from "./routes/user_route.js"
import cookieParser from "cookie-parser"
import subjectRoutes from "./routes/subject_route.js"
import topicRoutes from "./routes/topic_route.js"
import streakRoutes from "./routes/streak_route.js"
import sessionRoutes from "./routes/session_route.js"

const app = express();
app.use(express.json());
app.use(urlencoded({extended:true}))
app.use(cors({
    origin: "http://localhost:5173", // or "*" for all origins (not recommended for production)
    credentials: true,
    methods: ['GET','POST', 'DELETE','PUT'],
    allowedHeaders: ['Content-type', 'Authorization']
}))
app.use(cookieParser());
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/subjects',subjectRoutes);
app.use('/api/v1/topics',topicRoutes);
app.use('/api/v1/streaks',streakRoutes);
app.use('/api/v1/sessions',sessionRoutes);

export default app;