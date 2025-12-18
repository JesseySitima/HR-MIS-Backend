import Department from "../models/Department.js";
import User from "../models/User.js";

// Create new department
export const createDepartment = async (req, res) => {
  try {
    const { name, description, managerId } = req.body;

    const existingDept = await Department.findOne({ name });
    if (existingDept)
      return res.status(400).json({ message: "Department already exists" });

    // Optional manager validation
    let manager = null;
    if (managerId) {
      manager = await User.findById(managerId);
      if (!manager)
        return res.status(400).json({ message: "Manager not found" });
    }

    let department = await Department.create({
      name,
      description,
      manager: manager ? manager._id : null
    });

    // Populate manager for response
    department = await department.populate("manager", "firstName lastName email");

    res.status(201).json({ message: "Department created", department });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate("manager", "firstName lastName email");
    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single department by ID
export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate("manager", "firstName lastName email");
    if (!department) return res.status(404).json({ message: "Department not found" });
    res.json(department);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update department
export const updateDepartment = async (req, res) => {
  try {
    const { name, description, managerId } = req.body;

    let manager = null;
    if (managerId) {
      manager = await User.findById(managerId);
      if (!manager)
        return res.status(400).json({ message: "Manager not found" });
    }

    let department = await Department.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        manager: manager ? manager._id : null
      },
      { new: true } // return the updated document
    );

    if (!department)
      return res.status(404).json({ message: "Department not found" });

    // Populate manager for response
    department = await department.populate("manager", "firstName lastName email");

    res.json({ message: "Department updated", department });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete department
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ message: "Department not found" });
    res.json({ message: "Department deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
