export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ reply: "Method Not Allowed" });
  }

  try {
    const { message } = req.body;

    // Input Validation
    if (typeof message !== "string") {
      return res.status(400).json({ reply: "Invalid request: message must be a string." });
    }

    // Input Sanitization
    const trimmedMessage = message.trim().substring(0, 500);
    if (!trimmedMessage) {
      return res.status(400).json({ reply: "Message cannot be empty." });
    }

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

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ reply: "API Key not configured on server." });
    }

    const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: FARDIN_INFO },
          { role: "user", content: trimmedMessage },
        ],
      }),
    });

    if (!openRouterRes.ok) {
      throw new Error(`OpenRouter error: ${openRouterRes.statusText}`);
    }

    const openRouterData = await openRouterRes.json();
    const reply = openRouterData.choices?.[0]?.message?.content || "Sorry, I could not generate a response right now.";

    // Apply security headers
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({ reply: "Sorry, I encountered an internal error processing your request." });
  }
}
