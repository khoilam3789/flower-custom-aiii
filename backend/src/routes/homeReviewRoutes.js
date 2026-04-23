import express from "express";
import {
  getAdminHomeReviews,
  getPublicHomeReviews,
  updateAdminHomeReviews
} from "../controllers/homeReviewController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getPublicHomeReviews);
router.get("/admin", protect, admin, getAdminHomeReviews);
router.put("/admin", protect, admin, updateAdminHomeReviews);

export default router;
