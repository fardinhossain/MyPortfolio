export async function handler(event) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ reply: "Method Not Allowed" }),
    };
  }

  try {
    const { message } = JSON.parse(event.body);

    // Input Validation
    if (typeof message !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({ reply: "Invalid request: message must be a string." }),
      };
    }

    // Input Sanitization
    const trimmedMessage = message.trim().substring(0, 500);
    if (!trimmedMessage) {
      return {
        statusCode: 400,
        body: JSON.stringify({ reply: "Message cannot be empty." }),
      };
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
      return {
        statusCode: 500,
        body: JSON.stringify({ reply: "API Key not configured on server." }),
      };
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

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
      },
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error("AI Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Sorry, I encountered an internal error processing your request." }),
    };
  }
}
