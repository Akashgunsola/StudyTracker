import express, { urlencoded } from "express";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(urlencoded({extended:true}))
app.use(cors({
    origin: process.env.BASE_URL,
    methods: ['GET','POST', 'DELETE','PUT'],
    allowedHeaders: ['Content-type', 'Authorization']
}))


export default app;