import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import notesRoutes from "./routes/notesRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const app = express();

app.use(cors());
app.use(express.json()); // Parse JSON body
app.use(cors({ origin: CLIENT_URL, credentials: true }));

// -----------------------Routes-------------------------------
app.use("/api/notes", notesRoutes);

// -------------------- START SERVER --------------------------
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running in ${NODE_ENV} mode on port ${PORT}`);
    });

    process.on("SIGINT", () => {
      console.log("🛑 Server shutting down...");
      server.close(() => {
        console.log("💾 Closing DB connection...");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
