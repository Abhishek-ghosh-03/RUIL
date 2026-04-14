import express from "express";
import {
  searchComponents,
  createComponent,
  deleteComponent
} from "../controllers/component.controller.js";

const router = express.Router();

router.get("/search", searchComponents);
router.post("/", createComponent);
router.delete("/:id", deleteComponent);

export default router;