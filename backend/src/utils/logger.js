import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, "../../logs");

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, "security.log");

export const logSecurityEvent = (eventType, details) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${eventType.toUpperCase()}] ${JSON.stringify(details)}\n`;
  
  fs.appendFileSync(logFile, logEntry);
  
  if (process.env.NODE_ENV === "development") {
    console.log(`🛡️  Security Log: [${eventType.toUpperCase()}]`, details);
  }
};
