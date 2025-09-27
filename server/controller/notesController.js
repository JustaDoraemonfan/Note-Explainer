import Note from "../models/Notes.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- CRUD FUNCTIONS ---

// @desc    Create a new note
// @route   POST /api/notes
// @access  Public
export const createNote = async (req, res) => {
  try {
    const { content } = req.body;

    // Basic validation
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const note = await Note.create({
      content,
    });

    res.status(201).json(note); // 201 Created
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Server error while creating note" });
  }
};

// @desc    Get all notes
// @route   GET /api/notes
// @access  Public
export const getNotes = async (req, res) => {
  try {
    // Find all notes and sort by the newest first
    const notes = await Note.find({}).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Server error while fetching notes" });
  }
};

// @desc    Get a single note by ID
// @route   GET /api/notes/:id
// @access  Public
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error fetching note by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a note by ID
// @route   PUT /api/notes/:id
// @access  Public
export const updateNote = async (req, res) => {
  try {
    const { content, summary } = req.body;

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { content, summary },
      {
        new: true, // Return the modified document rather than the original
        runValidators: true, // Run model validation on update
      }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Server error while updating note" });
  }
};

// @desc    Delete a note by ID
// @route   DELETE /api/notes/:id
// @access  Public
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note removed successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Server error while deleting note" });
  }
};

// --- AI FUNCTION ---

// @desc    Generate a summary for a note
// @route   POST /api/notes/:id/summarize
// @access  Public
export const summarizeNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // --- Gemini AI Magic Happens Here ---
    // In your summarizeNote function:
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Changed to a standard, reliable model
    const prompt = `${Note.content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();
    // --- End of AI Magic ---

    note.summary = summary;
    await note.save();

    res.status(200).json(note);
  } catch (error) {
    console.error("Error generating summary with Gemini:", error);
    res.status(500).json({ message: "Server error while generating summary" });
  }
};
