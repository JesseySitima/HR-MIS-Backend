import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { hasPermission } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Read
router.get("/", protect, 
    //hasPermission("VIEW_USER"), 
    getUsers);
router.get("/:id", protect, 
    //hasPermission("VIEW_USER"), 
    getUserById);

// Update
router.put("/:id", protect, 
    //hasPermission("UPDATE_USER"), 
    updateUser);

// Delete
router.delete("/:id", protect, hasPermission("DELETE_USER"), deleteUser);

export default router;
