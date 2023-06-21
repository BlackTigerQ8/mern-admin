import express from "express";
const router = express.Router();
import textController from "../controllers/textController.js";

// Get the text
router.get("/", textController.getText);

// Update the text
router.post("/", textController.updateText);

export default router;
