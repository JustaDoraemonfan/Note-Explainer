import express from "express";
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  summarizeNote,
} from "../controller/notesController.js"; // Note the .js extension

const router = express.Router();

// Basic CRUD routes
router.route("/").post(createNote).get(getNotes);
router.route("/:id").get(getNoteById).put(updateNote).delete(deleteNote);

// AI Summarization route
router.route("/:id/summarize").post(summarizeNote);

export default router;
