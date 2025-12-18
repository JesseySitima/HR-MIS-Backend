import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null // optional
    }
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);
export default Department;
