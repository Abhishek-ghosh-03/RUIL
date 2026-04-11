import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./src/config/db.js";
import componentRoutes from "./src/routes/component.routes.js";
import aiRoutes from "./src/routes/ai.routes.js";

dotenv.config();

const app = express();

// 🔥 Allow specific origins for CORS
const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:3000",
  "https://ruil.netlify.app",
  "https://ruil.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

connectDB();

app.use("/api/components", componentRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});