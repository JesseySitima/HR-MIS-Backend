import mongoose from "mongoose";

const userLeaveBalanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    leaveType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeaveType",
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    allocatedDays: {
      type: Number,
      required: true,
      min: 0
    },
    usedDays: {
      type: Number,
      default: 0,
      min: 0
    },
    remainingDays: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { timestamps: true }
);

// prevent duplicates per year
userLeaveBalanceSchema.index(
  { user: 1, leaveType: 1, year: 1 },
  { unique: true }
);

const UserLeaveBalance = mongoose.model(
  "UserLeaveBalance",
  userLeaveBalanceSchema
);

export default UserLeaveBalance;
