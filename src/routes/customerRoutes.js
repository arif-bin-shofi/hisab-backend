import express from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  addBakeya,
  customerReport,
  getDueCustomers,
  getBakeyas,
  getBakeyaById,
  updateBakeya,
  deleteBakeya,

  getAllReports,

} from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, createCustomer)  
  .get(protect, getCustomers);   

router.route("/:id")
  .get(protect, getCustomerById)   
  .put(protect, updateCustomer)   
  .delete(protect, deleteCustomer); 

router.route("/bakeya")
  .post(protect, addBakeya)    
  .get(protect, getBakeyas);    

router.route("/bakeya/:id")
  .get(protect, getBakeyaById)    
  .put(protect, updateBakeya)    
  .delete(protect, deleteBakeya);  

router.get("/reports/all", protect, getAllReports);    
router.get("/reports/due/customers", protect, getDueCustomers); 

router.post("/bakeya", protect, addBakeya);
router.get("/report/:id", protect, customerReport);
router.get("/reports/due/customers", protect, getDueCustomers);

export default router;