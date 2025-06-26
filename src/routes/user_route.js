import express from "express";
import { register, verifyUser } from '../controllers/user_controller.js';

const router = express.Router();

router.post("/", (req,res) => {
    res.send("Hello from Study tracker app")
});

router.post("/register", register);
router.post("/verify/:token", verifyUser);
export default router;