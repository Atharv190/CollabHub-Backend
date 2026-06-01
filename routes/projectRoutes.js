import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  updateProfile,
  getProfile
} from "../controllers/userController.js";
import { createProject, getAllProjects, getProjectById, getMyProjects, updateProject, deleteProject } from "../controllers/projectController.js";
const router = express.Router();

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.post("/", protect, createProject);

router.get("/", getAllProjects);

router.get("/my", protect, getMyProjects);

router.get("/:id", getProjectById);

router.put(
  "/:id",
  protect,
  updateProject
);

router.delete(
  "/:id",
  protect,
  deleteProject
);

export default router;