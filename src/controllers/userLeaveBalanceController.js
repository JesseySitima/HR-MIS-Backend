import UserLeaveBalance from "../models/UserLeaveBalance.js";
import LeaveType from "../models/LeaveType.js";

// Admin/HR: View all users and their leave balances
export const getAllUserLeaveBalances = async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();

    const balances = await UserLeaveBalance.find({ year })
      .populate("user", "firstName lastName email department")
      .populate("leaveType", "name");

    // Reshape data: group by user
    const result = {};

    balances.forEach(b => {
      const userId = b.user._id.toString();
      if (!result[userId]) {
        result[userId] = {
          user: b.user,
          leaveBalances: {}
        };
      }
      result[userId].leaveBalances[b.leaveType.name] = {
        allocatedDays: b.allocatedDays,
        usedDays: b.usedDays,
        remainingDays: b.remainingDays
      };
    });

    res.json(Object.values(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getMyLeaveBalances = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const year = new Date().getFullYear();

    const balances = await UserLeaveBalance.find({ user: userId, year })
      .populate("leaveType", "name");

    res.json(balances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserLeaveBalances = async (req, res) => {
  try {
    const { userId } = req.params;
    const { year } = req.query;

    const targetYear = year || new Date().getFullYear();

    const balances = await UserLeaveBalance.find({
      user: userId,
      year: targetYear
    }).populate("leaveType", "name");

    res.json(balances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const adjustLeaveBalance = async (req, res) => {
  try {
    const { balanceId } = req.params;
    const { allocatedDays } = req.body;

    if (allocatedDays < 0) {
      return res.status(400).json({ message: "Allocated days cannot be negative" });
    }

    const balance = await UserLeaveBalance.findById(balanceId);
    if (!balance)
      return res.status(404).json({ message: "Leave balance not found" });

    balance.allocatedDays = allocatedDays;
    balance.remainingDays = allocatedDays - balance.usedDays;

    if (balance.remainingDays < 0) {
      balance.remainingDays = 0;
    }

    await balance.save();

    res.json({
      message: "Leave balance updated",
      balance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const syncUserLeaveBalances = async (req, res) => {
  try {
    const { userId } = req.params;
    const year = new Date().getFullYear();

    const leaveTypes = await LeaveType.find();

    const existingBalances = await UserLeaveBalance.find({ user: userId, year });
    const existingTypeIds = existingBalances.map(b => b.leaveType.toString());

    const newBalances = leaveTypes
      .filter(type => !existingTypeIds.includes(type._id.toString()))
      .map(type => ({
        user: userId,
        leaveType: type._id,
        year,
        allocatedDays: type.daysPerYear,
        usedDays: 0,
        remainingDays: type.daysPerYear
      }));

    if (newBalances.length > 0) {
      await UserLeaveBalance.insertMany(newBalances);
    }

    res.json({ message: "Leave balances synced successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
