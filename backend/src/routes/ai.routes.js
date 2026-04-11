import express from "express";
import { generateLayout } from "../controllers/ai.controller.js";

const router = express.Router();
console.log("✅ AI Routes Initialized");

router.post("/generate", generateLayout);

export default router;
