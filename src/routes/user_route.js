import express from "express";
import { register } from '../controllers/user_controller.js';

const router = express.Router();

router.post("/", (req,res) => {
    res.send("Hello from Study tracker app")
});

router.post("/register", register);

export default router;