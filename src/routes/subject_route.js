import express from "express";
import { createSubject, getallSubject, getSubjectById, updateSubject, deleteSubject } from "../controllers/subject_controller.js";
import { isLoggedIn } from "../middlewares/auth_middleware.js";

const router = express.Router();

// Create a new subject
router.post("/", isLoggedIn, createSubject);

// Get all subjects for the logged-in user
router.get("/", isLoggedIn, getallSubject);

// Get a specific subject by ID
router.get("/:id", isLoggedIn, getSubjectById);

// Update a subject (title, color, etc.)
router.put("/:id", isLoggedIn, updateSubject);

// Delete a subject by ID
router.delete("/:id", isLoggedIn, deleteSubject);


export default router;

