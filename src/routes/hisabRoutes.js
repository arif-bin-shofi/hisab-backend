import express from "express";
import { createHisab, getHisab } from "../controllers/hisabController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createHisab);
router.get("/", protect, getHisab);

export default router;