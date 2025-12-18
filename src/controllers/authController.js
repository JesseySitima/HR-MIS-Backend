import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Role from "../models/Role.js";
import Department from "../models/Department.js";

// Register new user
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, department } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Validate role and department exist
    const roleObj = await Role.findById(role);
    if (!roleObj) return res.status(400).json({ message: "Invalid role ID" });

    const departmentObj = await Department.findById(department);
    if (!departmentObj) return res.status(400).json({ message: "Invalid department ID" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: roleObj._id,
      department: departmentObj._id
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: roleObj.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and select password
    const user = await User.findOne({ email })
      .select("+password")
      .populate("role")
      .populate("department");

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return token + user info
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name,        // <-- important for frontend
        department: user.department.name // optional
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
