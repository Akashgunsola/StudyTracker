import express from "express";
import { isLoggedIn } from "../middlewares/auth_middleware.js";
import { createSession, deleteSession, getUserSessions, getSessionsByTopic } from "../controllers/session_controller.js";


const router = express.Router();
router.post("/", isLoggedIn, createSession);
router.get("/", isLoggedIn, getUserSessions);
router.delete("/:id", isLoggedIn, deleteSession);
router.get("/topic/:topicId", isLoggedIn, getSessionsByTopic);

export default router;