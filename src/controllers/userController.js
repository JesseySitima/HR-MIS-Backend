import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Role from "../models/Role.js";
import Department from "../models/Department.js";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("role", "_id name permissions")
      .populate("department", "_id name");

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("role", "_id name permissions")
      .populate("department", "_id name");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, roleId, departmentId, password } = req.body;

    const updates = { firstName, lastName, email };

    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) return res.status(400).json({ message: "Invalid role ID" });
      updates.role = role._id;
    }

    if (departmentId) {
      const department = await Department.findById(departmentId);
      if (!department) return res.status(400).json({ message: "Invalid department ID" });
      updates.department = department._id;
    }

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate("role", "_id name permissions")
      .populate("department", "_id name");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
