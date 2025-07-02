import express from "express";
import { getme, login, logout, register, verifyUser } from '../controllers/user_controller.js';
import { isLoggedIn } from "../middlewares/auth_middleware.js";

const router = express.Router();

router.post("/", (req,res) => {
    res.send("Hello from Study tracker app")
});

router.post("/register", register);
router.post("/verify/:token", verifyUser);
router.post("/login", login);
router.get("/logout", isLoggedIn, logout);
router.get("/me", isLoggedIn, getme);



export default router;