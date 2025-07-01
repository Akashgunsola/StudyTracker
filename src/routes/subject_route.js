import express from "express";
import { createSubject } from "../controllers/subject_controller";
import { isLoggedIn } from "../middlewares/auth_middleware";

const router = express.Router();

router.post("/newsubject", isLoggedIn, createSubject);

export default router;