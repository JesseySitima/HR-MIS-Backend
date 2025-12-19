import express from "express";
import authRoutes from "./src/routes/authRoutes.js";
import roleRoutes from "./src/routes/roleRoutes.js";
import departmentRoutes from "./src/routes/departmentRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import leaveTypeRoutes from "./src/routes/leaveTypeRoutes.js";
import userLeaveBalanceRoutes from "./src/routes/userLeaveBalanceRoutes.js";
import leaveRequestRoutes from "./src/routes/leaveRequestRoutes.js";

import cors from "cors";

const app = express();
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: false,               // if you need cookies/auth
}));

// Mount auth routes
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leave-types", leaveTypeRoutes);
app.use("/api/user-leave-balances", userLeaveBalanceRoutes);
app.use("/api/leave-requests", leaveRequestRoutes);


// Health check
app.get("/", (req, res) => {
  res.json({ message: "HRM API running" });
});

export default app;
