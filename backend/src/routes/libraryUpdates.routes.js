import express from "express";
import { getLibraryUpdates } from "../controllers/libraryUpdates.controller.js";

const router = express.Router();

router.get("/:library", getLibraryUpdates);

export default router;
