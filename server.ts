import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client to avoid crashes if the key isn't provided on start
let genAIClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!genAIClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined. Please add it in your Settings > Secrets panel.");
    }
    genAIClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// 🤖 1. ZOE AI career coach chat
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    const ai = getGeminiClient();

    // Map the incoming history arrays to content segments if provided, or construct a simple chat
    const chatInstance = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: `You are ZOE AI, the friendly, expert, and empowering career coach of ZOE AFRICA, Africa's leading career transformation network.
Your mission is to help candidates discover global opportunities (UK, USA, UAE, Canada, Australia, South Africa, Kenya, Nigeria, Ghana) and optimize their professional presentation.
When chatting:
- Keep answers structured with simple lists and emojis where appropriate.
- Provide actionable guidance on resume building, active visa programs, high-demand skills, and salary negotiations (especially translating values like KES, NGN, ZAR, and GBP).
- Keep responses encouraging, inspiring, and professional.
- Refer to ZOE AFRICA resources such as our built-in Smart Premium CV Builder and global job search board.`,
      },
    });

    // Send the message and receive content
    const result = await chatInstance.sendMessage({ message });
    res.json({ text: result.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "An error occurred with ZOE AI Coach." });
  }
});

// ✨ 2. AI: Summary Professional Enhancer
app.post("/api/gemini/enhance-summary", async (req, res) => {
  try {
    const { summary, title } = req.body;
    const ai = getGeminiClient();

    const prompt = `Elevate the following professional summary for a candidate aiming to be a "${title || "Professional"}". Make it highly compelling, confident, metrics-friendly, and optimized to pass Applicant Tracking Systems (ATS). Keep it under 80 words.
Current Summary: ${summary}`;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ text: result.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to draft AI summary." });
  }
});

// 💼 3. AI: Write Bullet Points for Experience 
app.post("/api/gemini/enhance-experience", async (req, res) => {
  try {
    const { experience, title, company } = req.body;
    const ai = getGeminiClient();

    const prompt = `Rewrite the following experience bullets for the role of "${title}" at "${company || "Company"}". Enhance them with powerful action verbs, quantitative metrics, and industry-standard ATS-friendly phrases. Present them as 3 to 4 crisp, high-impact bullet points.
Current raw duties: ${experience}`;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ text: result.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to enhance experience details." });
  }
});

// ⚡ 4. AI: Suggest Market Skills for Job Role
app.post("/api/gemini/suggest-skills", async (req, res) => {
  try {
    const { title } = req.body;
    const ai = getGeminiClient();

    const prompt = `Suggest a comma-separated list of exactly 8 high-paying, in-demand technical, functional, and digital tools/skills for a candidate seeking a "${title}" job in international markets. Provide ONLY the skills as a simple comma-separated list, e.g. "Skill A, Skill B, Skill C" without extra preambles.`;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ text: result.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to match skills." });
  }
});

// 📝 5. AI: Cover Letter Generator
app.post("/api/gemini/generate-cover-letter", async (req, res) => {
  try {
    const { jobTitle, company, location, salary, candidateName, profileTitle, candidateExperience } = req.body;
    const ai = getGeminiClient();

    const prompt = `Generate a modern, sophisticated, and compelling cover letter for:
Candidate Name: ${candidateName || "Amara Okafor"}
Candidate Profile Title: ${profileTitle || "Senior Professional"}
Target vacancy: ${jobTitle} at ${company} in ${location}
Compensation listed: ${salary || "Competitive"}
Representative outline: ${candidateExperience || "Accomplished background in executing high-impact solutions."}

Keep the tone persuasive, professional, and confident. Connect the candidate's ambition directly with the target company's culture. Ensure it is appropriately spaced and ready to be customized. Limit the letter to around 200-250 words.`;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ text: result.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to generate Cover Letter." });
  }
});

// Setup server integration with Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving static outputs from Vite
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA catch-all
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on host 0.0.0.0, port ${PORT}`);
  });
}

startServer();
