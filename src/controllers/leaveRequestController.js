import LeaveRequest from "../models/LeaveRequest.js";
import UserLeaveBalance from "../models/UserLeaveBalance.js";
import { calculateWorkingDays } from "../helpers/dateHelpers.js";
import { PUBLIC_HOLIDAYS } from "../constants/publicHolidays.js";


// CREATE Leave Request
export const createLeaveRequest = async (req, res) => {
  try {
    const { leaveTypeId, startDate, endDate, remarks } = req.body;
    const userId = req.user.id;

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: "End date cannot be before start date" });
    }

    const numberOfWorkDays = calculateWorkingDays(
      startDate,
      endDate,
      PUBLIC_HOLIDAYS
    );

    if (numberOfWorkDays <= 0) {
      return res.status(400).json({ message: "Selected dates result in zero working days" });
    }

    const balance = await UserLeaveBalance.findOne({
      user: userId,
      leaveType: leaveTypeId,
    });

    if (!balance) {
      return res.status(400).json({ message: "No leave balance found" });
    }

    if (numberOfWorkDays > balance.remainingDays) {
      return res.status(400).json({ message: "Not enough leave balance" });
    }

    const leaveRequest = await LeaveRequest.create({
      user: userId,
      leaveType: leaveTypeId,
      startDate,
      endDate,
      numberOfWorkDays,
      remarks,
    });

    res.status(201).json({
      message: "Leave request submitted",
      leaveRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// GET ALL Leave Requests
export const getLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find()
      .populate("user", "firstName lastName email")
      .populate("leaveType", "name")
      .populate("approvedBy", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({ leaveRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET SINGLE Leave Request
export const getLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id)
      .populate("user", "firstName lastName email")
      .populate("leaveType", "name")
      .populate("approvedBy", "firstName lastName email");

    if (!leaveRequest) return res.status(404).json({ message: "Leave request not found" });

    res.status(200).json({ leaveRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE Leave Request
export const updateLeaveRequest = async (req, res) => {
  try {
    const { leaveTypeId, startDate, endDate, remarks, status } = req.body;

    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) return res.status(404).json({ message: "Leave request not found" });

    if (leaveTypeId) leaveRequest.leaveType = leaveTypeId;
    if (startDate) leaveRequest.startDate = startDate;
    if (endDate) leaveRequest.endDate = endDate;
    if (remarks !== undefined) leaveRequest.remarks = remarks;
    if (status && ["Pending", "Approved", "Rejected"].includes(status)) {
      leaveRequest.status = status;
      if (status === "Approved" || status === "Rejected") {
        leaveRequest.approvedBy = req.user.id;
      }
    }

    // Recalculate number of work days if dates changed
    if (startDate || endDate) {
      const start = new Date(leaveRequest.startDate);
      const end = new Date(leaveRequest.endDate);
      const diffTime = Math.abs(end - start);
      leaveRequest.numberOfWorkDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    await leaveRequest.save();
    const updatedRequest = await leaveRequest
      .populate("user", "firstName lastName email")
      .populate("leaveType", "name")
      .populate("approvedBy", "firstName lastName email");

    res.status(200).json({ message: "Leave request updated", leaveRequest: updatedRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE Leave Request
export const deleteLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) return res.status(404).json({ message: "Leave request not found" });

    await leaveRequest.remove();
    res.status(200).json({ message: "Leave request deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// APPROVE / REJECT Leave Request
export const changeLeaveRequestStatus = async (req, res) => {
  try {
    const { status } = req.body; // "Approved" or "Rejected"
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) return res.status(404).json({ message: "Leave request not found" });

    leaveRequest.status = status;
    leaveRequest.approvedBy = req.user.id;
    await leaveRequest.save();

    const updatedRequest = await leaveRequest
      .populate("user", "firstName lastName email")
      .populate("leaveType", "name")
      .populate("approvedBy", "firstName lastName email");

    res.status(200).json({ message: `Leave request ${status.toLowerCase()}`, leaveRequest: updatedRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
