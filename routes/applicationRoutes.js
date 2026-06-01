import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  applyToProject,
  getProjectApplicants,
  acceptApplication,
  rejectApplication,
  getMyApplications
} from "../controllers/applicationController.js";

const router = express.Router();

router.post(
  "/:projectId",
  protect,
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

export default router;