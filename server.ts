import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));

const PORT = 3000;

// Initialize Google GenAI Client
// Safe helper to lazily load client when process.env.GEMINI_API_KEY is available
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("PLACEHOLDER")) {
    console.warn("⚠️ GEMINI_API_KEY is not configured or uses placeholder. Running in Simulation/Local Mode.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Simulated mock internships database in case AI API is absent or as starting sample
const SAMPLE_INTERNSHIPS = [
  {
    id: "site-intl-001",
    title: "Software Engineer Intern (Frontend focus)",
    company: "DevFlow Technologies",
    location: "Remote (USA/Global)",
    type: "Remote" as const,
    stipend: { hasStipend: true, amount: "$2,500/mo" },
    description: "Looking for an enthusiastic Frontend Developer intern with experience in React, TypeScript, and modern styling libraries. You will work on user-facing application dashboards, write utility hooks, and optimize rendering speed.",
    requirements: ["React", "TypeScript", "Tailwind CSS", "REST APIs"],
    duration: "3 Months",
    postedAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    source: "Auto-scraper" as const,
  },
  {
    id: "site-intl-002",
    title: "AI & Machine Learning Developer Intern",
    company: "Cognitive Labs",
    location: "San Francisco, CA",
    type: "Hybrid" as const,
    stipend: { hasStipend: true, amount: "$3,800/mo" },
    description: "Join our core team to design pipelines for large language model completions, fine-tuning scripts, and automated chatbot routing. Direct experience playing with APIs and vector databases is preferred.",
    requirements: ["Python", "FastAPI", "OpenAI / Gemini SDK", "TensorFlow"],
    duration: "6 Months",
    postedAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
    source: "Partner" as const,
  },
  {
    id: "site-intl-003",
    title: "Product Design (UI/UX) Intern",
    company: "Zenith Creative Agency",
    location: "Remote",
    type: "Remote" as const,
    stipend: { hasStipend: false, amount: "Academic Credit" },
    description: "Seeking a passionate UI/UX designer ready to roll up sleeves and draft gorgeous user interface wireframes, prototypes, and dark/light color palettes. This is an unpaid position, but excellent for building your reference portfolio.",
    requirements: ["Figma", "Wireframing", "Tailwind styling logic", "Design Systems"],
    duration: "3 Months",
    postedAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
    source: "Direct Match" as const,
  },
  {
    id: "site-intl-004",
    title: "Full-Stack Web App Developer Intern",
    company: "Starlight Software",
    location: "Austin, TX",
    type: "Onsite" as const,
    stipend: { hasStipend: true, amount: "$4,200/mo" },
    description: "Help build the future of localized high-speed database analytics! You will bridge the Express server with key components in Vite, integrate PostgreSQL queries, and assist in designing robust security architectures.",
    requirements: ["Express", "Node.js", "React", "PostgreSQL"],
    duration: "6 Months",
    postedAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 24 hours ago
    source: "Auto-scraper" as const,
  },
  {
    id: "site-intl-005",
    title: "Data Analyst & Business Intelligence Intern",
    company: "Metrics Corp",
    location: "Remote",
    type: "Remote" as const,
    stipend: { hasStipend: true, amount: "$1,800/mo" },
    description: "Looking for an analytical mind to extract telemetry graphs, perform keyword aggregation, build clean executive templates and clean raw JSON spreadsheets. Great mentorship included.",
    requirements: ["Python", "Pandas", "SQL", "Tableau / D3.js"],
    duration: "4 Months",
    postedAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    source: "Direct Match" as const,
  },
];

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 1. Search & Scraping Endpoint:
// Generates automated internships using Gemini to search or simulate authentic live postings
app.post("/api/search-internships", async (req, res) => {
  const { query, location, stipendsOnly } = req.body;
  const ai = getAIClient();

  if (!ai) {
    // API client not available: return filtered sample data + a simulated AI-generated record
    let records = [...SAMPLE_INTERNSHIPS];
    if (query) {
      records = records.filter(r =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase()) ||
        r.requirements.some(req => req.toLowerCase().includes(query.toLowerCase()))
      );
    }
    if (location && location.trim().toLowerCase() !== "any") {
      records = records.filter(r => r.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (stipendsOnly) {
      records = records.filter(r => r.stipend.hasStipend === true);
    }
    return res.json({ success: true, mode: "simulation", listings: records });
  }

  try {
    const prompt = `Search for or generate 6 real-world-style internship postings matching these criteria:
- Keyword query: "${query || 'Software Engineering / Tech'}"
- Geographic location: "${location || 'Any'}"
- Must only have stipend? ${stipendsOnly ? 'Yes' : 'No'}

Return the listings strictly as a JSON array matching the specified JSON schema. Provide detailed descriptions with exact skills required, and authentic-sounding company names. Check that the "postedAt" represents realistic current dates close to 2026.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of custom simulated Web scraped internships",
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING, description: "Title of the internship" },
              company: { type: Type.STRING },
              location: { type: Type.STRING },
              type: { type: Type.STRING, description: "Must be 'Remote', 'Onsite', or 'Hybrid'" },
              stipend: {
                type: Type.OBJECT,
                properties: {
                  hasStipend: { type: Type.BOOLEAN },
                  amount: { type: Type.STRING, description: "e.g., $1,500/mo, Academic Credit, or Unpaid" },
                },
                required: ["hasStipend", "amount"],
              },
              description: { type: Type.STRING },
              requirements: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              duration: { type: Type.STRING, description: "e.g., 3 Months" },
              postedAt: { type: Type.STRING, description: "ISO string timestamp" },
              source: { type: Type.STRING, description: "Must be 'Auto-scraper', 'Direct Match', or 'Partner'" },
            },
            required: ["id", "title", "company", "location", "type", "stipend", "description", "requirements", "duration", "postedAt", "source"],
          },
        },
      },
    });

    const parsedListings = JSON.parse(response.text || "[]");
    return res.json({ success: true, mode: "live-gemini", listings: parsedListings });
  } catch (error: any) {
    console.error("Gemini Search post failed:", error);
    // Graceful fallback to samples
    return res.json({
      success: false,
      error: error.message,
      mode: "fallback-simulation",
      listings: SAMPLE_INTERNSHIPS,
    });
  }
});

// 2. Individual Resume & Cover Letter Customization / Tailoring logic:
app.post("/api/generate-tailored-application", async (req, res) => {
  const { userProfile, internship } = req.body;
  const ai = getAIClient();

  // If there's no Gemini key, do a high-quality rules-based mock-up completion
  if (!ai) {
    const defaultCoverLetter = `Dear Hiring Team at ${internship.company},

I am thrilled to submit my application for the ${internship.title} internship. Having closely reviewed the key requirements, I am confident that my experience with ${userProfile.skills.slice(0, 3).join(", ")} aligns perfectly with your goals.

I am particularly excited about the chance to contribute to ${internship.company}'s work environment, and I would love the opportunity to expand my skills in ${internship.requirements.join(", ")}. Thank you for your time and consideration.

Sincerely,
${userProfile.fullName}`;

    const defaultAdaptedBulletPoints = userProfile.experience.map((exp: any) => {
      // Intelligently sprinkle target required tech in fallback customization
      const original = exp.description.split(".")[0] || exp.description;
      const customAddedTech = internship.requirements.slice(0, 2).join(" & ");
      return {
        original: exp.description,
        customized: `${original}, optimizing key workflows and directly integrating modern software design methodologies such as ${customAddedTech} for maximum system robustness.`,
        skillsAddressed: internship.requirements.slice(0, 2),
      };
    });

    const mockAtsScore = Math.floor(Math.random() * 21) + 75; // 75 to 95

    return res.json({
      success: true,
      mode: "simulation",
      adaptedResume: {
        summary: `Highly driven candidate with hands-on proficiency in ${userProfile.skills.slice(0, 4).join(", ")}. Direct candidate alignment with ${internship.requirements.slice(0, 3).join(", ")} which is ideal for the ${internship.title} role.`,
        bulletPoints: defaultAdaptedBulletPoints,
        suggestedSkillsAdded: internship.requirements.filter((sk: string) => !userProfile.skills.includes(sk)),
        atsScore: mockAtsScore,
        explanation: "Simulated optimization summary showing updated keywords aligned with your profile skills.",
      },
      coverLetter: defaultCoverLetter,
    });
  }

  try {
    const prompt = `You are an expert recruiter and Applicant Tracking System (ATS) optimization engine. Your job is to analyze the user's background (profile) and the target internship listing to tailor the application. 

User Profile:
${JSON.stringify(userProfile, null, 2)}

Target Internship:
${JSON.stringify(internship, null, 2)}

Tasks:
1. Write an aligned summary section highlighting how the candidate's skills relate to the job's main needs.
2. For each experience entry in the user's profile, create a tailored bullet point that links their accomplishments safely to core keywords in the listing (such as: ${internship.requirements.join(", ")}). Rephrase it elegantly (keep original intact, add the customized aligned output).
3. Identify the required skills in the listing that are missing from the candidate's direct skills list, and list them in 'suggestedSkillsAdded'.
4. Calculate a realistic ATS alignment score from 0-100 indicating match quality and provide a 2-sentence rationale in 'explanation'.
5. Draft a premium, personalized Cover Letter specifically pitching how the user's background makes them perfect for ${internship.company}. High energy, elegant, clear format.

Format the output precisely to this schema. Do not write any preamble, only valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            adaptedResume: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING, description: "Professional targeted summary" },
                bulletPoints: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      original: { type: Type.STRING, description: "Original experience bullet" },
                      customized: { type: Type.STRING, description: "Tailored bullet emphasizing target requirements" },
                      skillsAddressed: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["original", "customized", "skillsAddressed"],
                  },
                },
                suggestedSkillsAdded: { type: Type.ARRAY, items: { type: Type.STRING } },
                atsScore: { type: Type.INTEGER },
                explanation: { type: Type.STRING, description: "Rationale for the ATS rating" },
              },
              required: ["summary", "bulletPoints", "suggestedSkillsAdded", "atsScore", "explanation"],
            },
            coverLetter: { type: Type.STRING, description: "The tailored cover letter text" },
          },
          required: ["adaptedResume", "coverLetter"],
        },
      },
    });

    const parsedResult = JSON.parse(response.text || "{}");
    return res.json({ success: true, mode: "live-gemini", ...parsedResult });
  } catch (err: any) {
    console.error("Gemini tailoring error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Start listening & mount Vite as middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    // Fallback for * just in case
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Automated Internship Master Hub server active at: http://localhost:${PORT}`);
  });
}

startServer();
