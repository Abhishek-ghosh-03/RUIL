import express from "express";
import {
  searchComponents,
  createComponent
} from "../controllers/component.controller.js";

const router = express.Router();

router.get("/search", searchComponents);
router.post("/", createComponent);

export default router;