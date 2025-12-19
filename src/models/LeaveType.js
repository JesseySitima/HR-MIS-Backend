import mongoose from "mongoose";

const leaveTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String
    },
    daysPerYear: {
      type: Number,
      required: true,
      min: 0
    },
    maxConsecutiveDays: {
      type: Number,
      required: true,
      min: 0
    },
    requiresApproval: {
      type: Boolean,
      default: true
    },
    canCarryOver: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const LeaveType = mongoose.model("LeaveType", leaveTypeSchema);
export default LeaveType;
