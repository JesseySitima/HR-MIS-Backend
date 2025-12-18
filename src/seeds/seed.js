import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import Role from "../models/Role.js";
import Department from "../models/Department.js";

dotenv.config();

const seedRoles = async () => {
  const roles = [
    {
      name: "ADMIN",
      permissions: ["*"]
    },
    {
      name: "HR",
      permissions: ["CREATE_USER", "UPDATE_USER", "VIEW_USER"]
    },
    {
      name: "EMPLOYEE",
      permissions: ["VIEW_SELF"]
    }
  ];

  for (const role of roles) {
    await Role.updateOne(
      { name: role.name },
      { $setOnInsert: role },
      { upsert: true }
    );
  }

  console.log("✅ Roles seeded");
};

const seedDepartments = async () => {
  const departments = [
    { name: "Human Resources", description: "HR Department" },
    { name: "Finance", description: "Finance Department" },
    { name: "IT", description: "IT Department" }
  ];

  for (const dept of departments) {
    await Department.updateOne(
      { name: dept.name },
      { $setOnInsert: dept },
      { upsert: true }
    );
  }

  console.log("✅ Departments seeded");
};

const runSeed = async () => {
  try {
    await connectDB();

    await seedRoles();
    await seedDepartments();

    console.log("🌱 Seeding completed");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

runSeed();
