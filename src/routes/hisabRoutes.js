import express from "express";
import {
  createHisab,
  getHisab,
  getHisabById,
  updateHisab,
  deleteHisab,
  getHisabSummary,
  getMonthlyReport,
  getLatestHisab,
  bulkDeleteHisab
} from "../controllers/hisabController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, createHisab)   
  .get(protect, getHisab);      

router.post("/bulk-delete", protect, bulkDeleteHisab); 


router.get("/summary", protect, getHisabSummary);    
router.get("/latest", protect, getLatestHisab);      
router.get("/monthly/:year/:month", protect, getMonthlyReport); 

router.route("/:id")
  .get(protect, getHisabById)   
  .put(protect, updateHisab)    
  .delete(protect, deleteHisab); 

export default router;