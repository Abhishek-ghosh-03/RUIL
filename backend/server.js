import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { connectDB } from "./src/config/db.js";
import componentRoutes from "./src/routes/component.routes.js";
import aiRoutes from "./src/routes/ai.routes.js";
import libraryUpdatesRoutes from "./src/routes/libraryUpdates.routes.js";

dotenv.config();

const app = express();

// 🛡️ Security Middleware
app.use(helmet()); // Set security headers
app.use(express.json({ limit: "10kb" })); // Body parser, limiting data size
app.use(cookieParser()); // Cookie parser for secure sessions
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
app.use(xss()); // Data sanitization against XSS
app.use(hpp()); // Prevent HTTP Parameter Pollution

// 📝 Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// 🚦 Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiter to all routes
app.use("/api", limiter);

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

connectDB();

app.use("/api/components", componentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/library-updates", libraryUpdatesRoutes);

app.get("/", (req, res) => {
  res.send("API Running securely...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});