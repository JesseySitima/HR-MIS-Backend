import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { hasPermission } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Only Admin/HR can register new users
router.post(
  "/register",
 
  registerUser
);

// Login remains public
router.post("/login", loginUser);

export default router;
