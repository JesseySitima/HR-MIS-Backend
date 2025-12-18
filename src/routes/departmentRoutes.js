import express from "express";
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} from "../controllers/departmentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { hasPermission } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public: view departments
router.get("/", protect, hasPermission("VIEW_DEPARTMENT"), getDepartments);
router.get("/:id", protect, hasPermission("VIEW_DEPARTMENT"), getDepartmentById);

// Protected: create/update/delete
router.post("/", protect, hasPermission("CREATE_DEPARTMENT"), createDepartment);
router.put("/:id", protect, hasPermission("UPDATE_DEPARTMENT"), updateDepartment);
router.delete("/:id", protect, hasPermission("DELETE_DEPARTMENT"), deleteDepartment);

export default router;
