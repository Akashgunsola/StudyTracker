import express from "express";
import { isLoggedIn } from "../middlewares/auth_middleware.js";
import { getStreak } from "../controllers/streak_controller.js";
const router = express.Router();

router.get("/", isLoggedIn, getStreak);



export default router;