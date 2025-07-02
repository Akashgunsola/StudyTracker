import express from "express";
import { createTopic, deleteTopic, getTopicsBySubject, toggleTopicCompletion } from "../controllers/topic_controller.js";
import { isLoggedIn } from "../middlewares/auth_middleware.js";

const router = express.Router();

router.post("/", isLoggedIn, createTopic);
router.get("/:subject_id", isLoggedIn, getTopicsBySubject);
router.patch("/:id/toggle", isLoggedIn, toggleTopicCompletion);
router.delete("/:id", isLoggedIn, deleteTopic);




export default router;