import LeaveType from "../models/LeaveType.js";

// Create new leave type
export const createLeaveType = async (req, res) => {
  try {
    const {
      name,
      description,
      daysPerYear,
      maxConsecutiveDays,
      requiresApproval,
      canCarryOver
    } = req.body;

    const existing = await LeaveType.findOne({ name });
    if (existing)
      return res.status(400).json({ message: "Leave type already exists" });

    const leaveType = await LeaveType.create({
      name,
      description,
      daysPerYear,
      maxConsecutiveDays,
      requiresApproval,
      canCarryOver
    });

    res.status(201).json({ message: "Leave type created", leaveType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all leave types
export const getLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await LeaveType.find();
    res.json(leaveTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get leave type by ID
export const getLeaveTypeById = async (req, res) => {
  try {
    const leaveType = await LeaveType.findById(req.params.id);
    if (!leaveType)
      return res.status(404).json({ message: "Leave type not found" });

    res.json(leaveType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update leave type
export const updateLeaveType = async (req, res) => {
  try {
    const {
      name,
      description,
      daysPerYear,
      maxConsecutiveDays,
      requiresApproval,
      canCarryOver
    } = req.body;

    const leaveType = await LeaveType.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        daysPerYear,
        maxConsecutiveDays,
        requiresApproval,
        canCarryOver
      },
      { new: true }
    );

    if (!leaveType)
      return res.status(404).json({ message: "Leave type not found" });

    res.json({ message: "Leave type updated", leaveType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete leave type
export const deleteLeaveType = async (req, res) => {
  try {
    const leaveType = await LeaveType.findByIdAndDelete(req.params.id);
    if (!leaveType)
      return res.status(404).json({ message: "Leave type not found" });

    res.json({ message: "Leave type deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
