import express from "express";
import {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole
} from "../controllers/roleController.js";

import { protect } from "../middleware/authMiddleware.js";
import { hasPermission } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public: anyone can view roles
router.get("/", protect, hasPermission("VIEW_ROLE"), getRoles);
router.get("/:id", protect, hasPermission("VIEW_ROLE"), getRoleById);

// Protected: only allowed roles can create/update/delete
router.post("/", protect, hasPermission("CREATE_ROLE"), createRole);
router.put("/:id", protect, hasPermission("UPDATE_ROLE"), updateRole);
router.delete("/:id", protect, hasPermission("DELETE_ROLE"), deleteRole);

export default router;
