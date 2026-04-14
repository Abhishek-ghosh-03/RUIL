import express from "express";
import { generateLayout } from "../controllers/ai.controller.js";
import { aiGenerateValidation } from "../middleware/validator.js";

const router = express.Router();
console.log("✅ AI Routes Initialized");

router.post("/generate", aiGenerateValidation, generateLayout);

export default router;
