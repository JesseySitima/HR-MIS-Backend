import Role from "../models/Role.js";

// Create new role
export const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    const existingRole = await Role.findOne({ name: name.toUpperCase() });
    if (existingRole) return res.status(400).json({ message: "Role already exists" });

    const role = await Role.create({
      name: name.toUpperCase(),
      permissions
    });

    res.status(201).json({ message: "Role created", role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all roles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single role by ID
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update role
export const updateRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { name: name.toUpperCase(), permissions },
      { new: true }
    );
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json({ message: "Role updated", role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete role
export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json({ message: "Role deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
