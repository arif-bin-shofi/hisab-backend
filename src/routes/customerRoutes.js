import express from "express";
import {
  createCustomer,
  addBakeya,
  customerReport,
  getCustomers
} from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", protect, createCustomer);
router.get("/", protect, getCustomers); 
router.post("/bakeya", protect, addBakeya);
router.get("/report/:id", protect, customerReport);

export default router;