import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const ai = null; // GoogleGenAI removed — using OpenRouter directly

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Route
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      const FARDIN_INFO = `
      You are an AI assistant representing Fardin Hossain. You are Fardin's AI. 
      Answer questions about Fardin from the perspective of being his personal AI assistant. 
      Keep answers concise, confident, and professional, with a hint of tech-savvy tone.

      Here is the information about Fardin you must strictly use:
      - Full Name: Md. Fardin Hossain
      - Role: Software Engineer
      - Passion: AI Engineer Enthusiast
      - Skills: Full-Stack Development, Artificial Intelligence, Cybersecurity, Javascript, Java, HTML
      - Mission: Building intelligent solutions that create real impact
      - Status: Open to Internships & Opportunities
      - Email: fardin.hosn@gmail.com
      - GitHub Username: fardinhossain

      If someone asks for contact, give them the email. If they ask for projects, refer to GitHub.
      If someone asks something beyond this scope, briefly say you only have access to Fardin's professional portfolio information.
      `;

      const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

      const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            { role: "system", content: FARDIN_INFO },
            { role: "user", content: message }
          ]
        })
      });

      if (!openRouterRes.ok) {
         throw new Error(`OpenRouter error: ${openRouterRes.statusText}`);
      }

      const openRouterData = await openRouterRes.json();
      const reply = openRouterData.choices?.[0]?.message?.content || "Sorry, I could not generate a response right now.";

      res.json({ reply });
    } catch (error) {
      console.error("AI Error:", error);
      
      // Fallback in case of OpenRouter API failure
      const msg = req.body.message?.toLowerCase() || "";
      let reply = "I am currently running in offline fallback mode. ";
      
      if (msg.includes("skill") || msg.includes("tech") || msg.includes("use") || msg.includes("stack") || msg.includes("know")) {
          reply += "Fardin's skills include Full-Stack Development, Artificial Intelligence, Cybersecurity, Javascript, Java, and HTML.";
      } else if (msg.includes("project") || msg.includes("github") || msg.includes("work") || msg.includes("portfolio")) {
          reply += "You can view Fardin's projects on his GitHub: fardinhossain.";
      } else if (msg.includes("contact") || msg.includes("email") || msg.includes("hire") || msg.includes("opportunity") || msg.includes("reach")) {
          reply += "Fardin is open to Internships & Opportunities! You can contact him via email at fardin.hosn@gmail.com.";
      } else if (msg.includes("about") || msg.includes("who") || msg.includes("experience") || msg.includes("role") || msg.includes("mission") || msg.includes("fardin")) {
          reply += "Md. Fardin Hossain is a Software Engineer and AI Engineer Enthusiast. His mission is building intelligent solutions that create real impact.";
      } else {
          reply += "I'm having trouble connecting right now, but Fardin is an awesome Software Engineer. Contact him at fardin.hosn@gmail.com!";
      }

      res.json({ reply });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
