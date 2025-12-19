import express from "express";
import {
  getMyLeaveBalances,
  getUserLeaveBalances,
  adjustLeaveBalance,
  syncUserLeaveBalances, getAllUserLeaveBalances
} from "../controllers/userLeaveBalanceController.js";

import { protect } from "../middleware/authMiddleware.js";
import { hasPermission } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  hasPermission("VIEW_ALL_LEAVE_BALANCES"),
  getAllUserLeaveBalances
);
/**
 * Logged-in user – view own leave balances
 */
router.get(
  "/me",
  protect,
  //hasPermission("VIEW_OWN_LEAVE_BALANCE"),
  getMyLeaveBalances
);

/**
 * Admin / HR – view any user's leave balances
 */
router.get(
  "/user/:userId",
  protect,
  hasPermission("VIEW_USER_LEAVE_BALANCE"),
  getUserLeaveBalances
);

/**
 * Admin / HR – adjust allocated days
 */
router.put(
  "/:balanceId",
  protect,
  hasPermission("UPDATE_LEAVE_BALANCE"),
  adjustLeaveBalance
);

/**
 * Admin / HR – sync missing leave balances
 */
router.post(
  "/sync/:userId",
  protect,
  hasPermission("SYNC_LEAVE_BALANCE"),
  syncUserLeaveBalances
);

export default router;
