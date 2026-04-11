import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import Component from "./src/models/component.model.js";

dotenv.config();

const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
};

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected");

// read data
const data = JSON.parse(fs.readFileSync("components.json", "utf-8"));

// 🔥 FIX: add slug to every item
const formattedData = data.map((item) => ({
  ...item,
  slug: slugify(item.name)
}));

try {
  await Component.deleteMany(); // optional reset
  await Component.insertMany(formattedData);

  console.log("Data seeded successfully ✅");
  process.exit();
} catch (error) {
  console.error(error);
  process.exit(1);
}