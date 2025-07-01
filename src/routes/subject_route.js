import express from "express";
import { createSubject, updateSubject } from "../controllers/subject_controller.js";
import { isLoggedIn } from "../middlewares/auth_middleware.js";

const router = express.Router();

router.post("/newsubject", isLoggedIn, createSubject);
router.post("/updatesubject/:id", updateSubject);

export default router;