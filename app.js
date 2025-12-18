import express from "express";
import authRoutes from "./src/routes/authRoutes.js";
import roleRoutes from "./src/routes/roleRoutes.js";
import departmentRoutes from "./src/routes/departmentRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
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

// Health check
app.get("/", (req, res) => {
  res.json({ message: "HRM API running" });
});

export default app;
