import express from "express";

import protect from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

import {
  applyToProject,
  getProjectApplicants,
  acceptApplication,
  rejectApplication,
  getMyApplications,
  viewResume,
  downloadResume
} from "../controllers/applicationController.js";

const router = express.Router();

router.post(
  "/:projectId",
  protect,
  upload.single("resume"),
  applyToProject
);

router.get(
  "/project/:projectId",
  protect,
  getProjectApplicants
);

router.put(
  "/:applicationId/accept",
  protect,
  acceptApplication
);

router.put(
  "/:applicationId/reject",
  protect,
  rejectApplication
);

router.get(
  "/my",
  protect,
  getMyApplications
);

router.get(
  "/resume/view/:applicationId",
  protect,
  viewResume
);

router.get(
  "/resume/download/:applicationId",
  protect,
  downloadResume
);

export default router;