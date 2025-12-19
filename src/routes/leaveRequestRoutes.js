import express from "express";
import {
  createLeaveRequest,
  getLeaveRequests,
  getLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
  changeLeaveRequestStatus,
} from "../controllers/leaveRequestController.js";

import { protect } from "../middleware/authMiddleware.js";
import { hasPermission } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * Create a new leave request
 * Logged-in user
 */
router.post("/", protect, createLeaveRequest);

/**
 * Get all leave requests
 * Admin / HR
 */
router.get(
  "/",
  protect,
  //hasPermission("VIEW_ALL_LEAVE_REQUESTS"),
  getLeaveRequests
);

/**
 * Get a single leave request by ID
 * Admin / HR or the request owner
 */
router.get("/:id", protect, getLeaveRequest);

/**
 * Update a leave request
 * Admin / HR or the request owner
 */
router.put("/:id", protect, updateLeaveRequest);

/**
 * Delete a leave request
 * Admin / HR or the request owner
 */
router.delete("/:id", protect, deleteLeaveRequest);

/**
 * Approve / Reject leave request
 * Admin / HR only
 */
router.put(
  "/:id/status",
  protect,
  hasPermission("APPROVE_LEAVE_REQUEST"),
  changeLeaveRequestStatus
);

export default router;
