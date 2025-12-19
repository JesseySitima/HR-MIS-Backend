import express from "express";
import {
  createLeaveType,
  getLeaveTypes,
  getLeaveTypeById,
  updateLeaveType,
  deleteLeaveType,
} from "../controllers/leaveTypeController.js";

import { protect } from "../middleware/authMiddleware.js";
import { hasPermission } from "../middleware/roleMiddleware.js";

const router = express.Router();

// View leave types
router.get("/", protect, 
  //hasPermission("VIEW_LEAVE_TYPE"), 
  getLeaveTypes);

router.get("/:id", protect, 
  //hasPermission("VIEW_LEAVE_TYPE"), 
  getLeaveTypeById);

// Manage leave types
router.post("/", protect, hasPermission("CREATE_LEAVE_TYPE"), createLeaveType);
router.put(
  "/:id",
  protect,
  //hasPermission("UPDATE_LEAVE_TYPE"),
  updateLeaveType
);
router.delete(
  "/:id",
  protect,
  hasPermission("DELETE_LEAVE_TYPE"),
  deleteLeaveType
);

export default router;
