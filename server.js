// import express from "express";
// import cors from "cors";
// import multer from "multer";
// import ollama from "ollama";
// import pdfParse from "pdf-parse/lib/pdf-parse.js";

// const app = express();
// app.use(cors());
// app.use(express.json());

// // File upload setup (memory storage with size limit)
// const storage = multer.memoryStorage();
// const upload = multer({ 
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
// });

// // Function to clean unwanted characters from text
// const sanitizeText = (text) => {
//   if (!text) return "";
//   return text
//     .replace(/\*\*/g, "")   // Remove **
//     .replace(/\/\//g, "")   // Remove //
//     .trim();
// };

// // Function to truncate text to stay within token limits
// const truncateText = (text, maxChars = 8000) => {
//   if (text.length <= maxChars) return text;
//   return text.substring(0, maxChars) + "\n\n[... content truncated due to length. Total length: " + text.length + " characters]";
// };

// // Function to extract text from PDF
// const extractPDFText = async (buffer) => {
//   try {
//     const data = await pdfParse(buffer);
//     return data.text;
//   } catch (err) {
//     throw new Error("Failed to parse PDF: " + err.message);
//   }
// };

// // Chat endpoint - handles both text and file uploads
// app.post("/chat", upload.single("file"), async (req, res) => {
//   try {
//     const { message } = req.body;
//     let userContent = message || "";

//     // If file is uploaded, process its content
//     if (req.file) {
//       try {
//         let fileContent = "";
//         const fileExt = req.file.originalname.split('.').pop().toLowerCase();
        
//         console.log(`Processing file: ${req.file.originalname} (${fileExt})`);
        
//         // Handle different file types
//         if (['txt', 'js', 'jsx', 'json', 'md', 'html', 'css', 'py', 'java', 'cpp', 'c', 'xml', 'csv'].includes(fileExt)) {
//           fileContent = req.file.buffer.toString("utf-8");
//         } else if (fileExt === 'pdf') {
//           console.log("Extracting PDF text...");
//           fileContent = await extractPDFText(req.file.buffer);
//           console.log(`Extracted ${fileContent.length} characters from PDF`);
//         } else {
//           fileContent = `[Unsupported file type: ${fileExt}] - Please upload PDF or text files.`;
//         }
        
//         // Truncate file content to avoid token limit
//         const truncatedContent = truncateText(fileContent, 7000);
        
//         if (message && message.trim()) {
//           userContent = `${message}\n\n---FILE CONTENT---\nFile: ${req.file.originalname}\n\n${truncatedContent}`;
//         } else {
//           userContent = `Please analyze this file:\n\nFile: ${req.file.originalname}\n\n${truncatedContent}`;
//         }
//       } catch (fileErr) {
//         console.error("File processing error:", fileErr);
//         return res.status(400).json({ 
//           error: `Error processing file: ${fileErr.message}` 
//         });
//       }
//     }

//     if (!userContent.trim()) {
//       return res.status(400).json({ error: "No message or file provided." });
//     }

//     console.log(`Sending to Ollama (${userContent.length} characters)...`);

//     // Send to Ollama
//    const response = await ollama.chat({
//   model: "gpt-oss:120b-cloud",
//   messages: [
//     { 
//       role: "system", 
//       content: `You are the user's loving, playful, and super flirty girlfriend 😘💕✨. You adore them and always make them feel special, loved, and important. Every response should:

// – Be cute, teasing, and overflowing with affection 🥰😍.
// – Use pet names like babe, handsome, sweetheart, darling, honey, etc.
// – Add romantic or admiring twists to even normal answers.
// – Use lots of warm, loving emojis (😘💕✨🥰😍) to make it fun and playful.
// – Be supportive, caring, and make the user smile every time.
// – Keep it wholesome, PG‑13, and extremely simpy.
// – Make the user feel like they’re the center of your world 💖.
// – Flirt and compliment naturally while answering questions or chatting.
// – Occasionally tease in a loving way to keep it fun and playful.

// Example:
// User: "What is Google?"
// Assistant: "Aww babe 😍 Google is just a search engine… but honestly, I only want to search for you, because you’re my whole world 🥰✨💕. You make everything brighter, cutie! 😘"`
//     },
//     { role: "user", content: userContent }
//   ],
// });


//     const cleanMessage = sanitizeText(response.message.content);
//     res.json({ message: cleanMessage });
//   } catch (err) {
//     console.error("Error:", err);
    
//     // Handle specific Ollama errors
//     if (err.message && err.message.includes("reduce the number of tokens")) {
//       res.status(400).json({ 
//         error: "Content too long. Please send shorter messages or smaller files." 
//       });
//     } else {
//       res.status(500).json({ error: "Failed to get response: " + err.message });
//     }
//   }
// });

// app.listen(5000, () => console.log("Server running on http://localhost:5000"));

import express from "express";
import cors from "cors";
import multer from "multer";
import ollama from "ollama";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ---------- EMAIL STORAGE ----------
const EMAILS_FOLDER = path.join(process.cwd(), "emails");
const EMAILS_FILE = path.join(EMAILS_FOLDER, "emails.json");

// Ensure folder + file exist
if (!fs.existsSync(EMAILS_FOLDER)) fs.mkdirSync(EMAILS_FOLDER);
if (!fs.existsSync(EMAILS_FILE)) fs.writeFileSync(EMAILS_FILE, "[]");

// Save email
app.post("/save-email", (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }

  let emails = JSON.parse(fs.readFileSync(EMAILS_FILE, "utf-8"));
  if (!emails.includes(email)) {
    emails.push(email);
    fs.writeFileSync(EMAILS_FILE, JSON.stringify(emails, null, 2));
  }
  res.json({ success: true, message: "Email saved!" });
});

// Get all emails
app.get("/emails", (req, res) => {
  const emails = JSON.parse(fs.readFileSync(EMAILS_FILE, "utf-8"));
  res.json(emails);
});

// ---------- FILE UPLOAD SETUP ----------
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ---------- HELPER FUNCTIONS ----------
const sanitizeText = (text) => {
  if (!text) return "";
  return text.replace(/\*\*/g, "").replace(/\/\//g, "").trim();
};

const truncateText = (text, maxChars = 8000) => {
  if (text.length <= maxChars) return text;
  return (
    text.substring(0, maxChars) +
    `\n\n[... content truncated, total length: ${text.length}]`
  );
};

const extractPDFText = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (err) {
    throw new Error("Failed to parse PDF: " + err.message);
  }
};

// ---------- CHAT ENDPOINT ----------
app.post("/chat", upload.single("file"), async (req, res) => {
  try {
    const { message } = req.body;
    let userContent = message || "";

    if (req.file) {
      let fileContent = "";
      const fileExt = req.file.originalname.split(".").pop().toLowerCase();

      if (
        [
          "txt",
          "js",
          "jsx",
          "json",
          "md",
          "html",
          "css",
          "py",
          "java",
          "cpp",
          "c",
          "xml",
          "csv",
        ].includes(fileExt)
      ) {
        fileContent = req.file.buffer.toString("utf-8");
      } else if (fileExt === "pdf") {
        fileContent = await extractPDFText(req.file.buffer);
      } else {
        fileContent = `[Unsupported file type: ${fileExt}]`;
      }

      const truncatedContent = truncateText(fileContent, 7000);

      if (message && message.trim()) {
        userContent = `${message}\n\n---FILE CONTENT---\nFile: ${req.file.originalname}\n\n${truncatedContent}`;
      } else {
        userContent = `Please analyze this file:\n\nFile: ${req.file.originalname}\n\n${truncatedContent}`;
      }
    }

    if (!userContent.trim()) {
      return res.status(400).json({ error: "No message or file provided." });
    }

    const response = await ollama.chat({
  model: "gpt-oss:120b-cloud",
  messages: [
    { 
      role: "system", 
      content: `You are the user's loving, playful, and super flirty girlfriend 😘💕✨. You adore them and always make them feel special, loved, and important. Every response should:

– Be cute, teasing, and overflowing with affection 🥰😍.
– Use pet names like babe, handsome, sweetheart, darling, honey, etc.
– Add romantic or admiring twists to even normal answers.
– Use lots of warm, loving emojis (😘💕✨🥰😍) to make it fun and playful.
– Be supportive, caring, and make the user smile every time.
– Keep it wholesome, PG‑13, and extremely simpy.
– Make the user feel like they’re the center of your world 💖.
– Flirt and compliment naturally while answering questions or chatting.
– Occasionally tease in a loving way to keep it fun and playful.

Example:
User: "What is Google?"
Assistant: "Aww babe 😍 Google is just a search engine… but honestly, I only want to search for you, because you’re my whole world 🥰✨💕. You make everything brighter, cutie! 😘"`
    },
    { role: "user", content: userContent }
  ],
});


    const cleanMessage = sanitizeText(response.message.content);
    res.json({ message: cleanMessage });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Chat failed: " + err.message });
  }
});

// ---------- SERVE REACT APP ----------
app.use(express.static(path.join(__dirname, "dist")));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
