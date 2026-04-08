import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  message: string;
  conversation_id: string;
}

type GroqChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const legalKnowledgeBase: Record<string, string> = {
  "consumer complaint": "To file a consumer complaint in India:\n1. Approach the District Consumer Forum for claims up to ₹1 crore\n2. State Consumer Commission for claims between ₹1-10 crores\n3. National Consumer Commission for claims above ₹10 crores\n\nRequired documents:\n- Copy of bill/receipt\n- Written complaint\n- Supporting evidence\n\nTime limit: Within 2 years from the date of cause of action.",

  "ipc crpc": "Key differences between IPC and CrPC:\n\nIPC (Indian Penal Code, 1860):\n- Defines criminal offenses\n- Prescribes punishments\n- Substantive law\n- Example: Section 302 - Murder\n\nCrPC (Criminal Procedure Code, 1973):\n- Defines procedure for criminal cases\n- How investigation is conducted\n- Procedural law\n- Example: Section 161 - Police interrogation\n\nIn simple terms: IPC defines what is a crime, CrPC defines how to deal with it.",

  "contract": "Essential elements of a valid contract under Indian Contract Act, 1872:\n\n1. Offer and Acceptance\n2. Lawful Consideration\n3. Capacity to Contract (age, sound mind)\n4. Free Consent (no coercion, fraud, misrepresentation)\n5. Lawful Object\n6. Not expressly declared void\n7. Certainty of terms\n8. Possibility of performance\n\nA contract must have all these elements to be legally enforceable in India.",

  "trademark": "To register a trademark in India:\n\n1. Conduct trademark search on IPIndia portal\n2. File application in Form TM-A\n3. Pay prescribed fees (₹4,500 for individuals, ₹9,000 for companies per class)\n4. Application examination by Trademark Registry\n5. Publication in Trademark Journal (if accepted)\n6. Opposition period (4 months)\n7. Registration certificate issued\n\nTotal time: 18-24 months\nValidity: 10 years (renewable)\n\nRequired documents:\n- Applicant details\n- Logo/mark\n- List of goods/services\n- Power of Attorney (if filing through agent)",
};

function findRelevantAnswer(query: string): string {
  const lowerQuery = query.toLowerCase();

  for (const [key, answer] of Object.entries(legalKnowledgeBase)) {
    if (lowerQuery.includes(key)) {
      return answer;
    }
  }

  return "I understand you have a legal question. As an AI legal assistant for India, I can help with:\n\n• Legal procedures and processes\n• Understanding Indian laws (IPC, CrPC, Constitution)\n• Document drafting guidance\n• Contract basics\n• Legal research\n\nPlease note: This is general legal information, not legal advice. For specific legal matters, please consult a licensed attorney.\n\nCould you please be more specific about what you'd like to know?";
}

async function generateWithGroq(message: string): Promise<string> {
  const groqApiKey = Deno.env.get("GROQ_API_KEY");
  if (!groqApiKey) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const model = Deno.env.get("GROQ_MODEL") || "llama-3.1-8b-instant";

  const messages: GroqChatMessage[] = [
    {
      role: "system",
      content:
        "You are LAW AI, a helpful assistant. Provide general legal information for India. " +
        "Do not claim to be a lawyer. Be clear, structured, and include steps where relevant. " +
        "If the user asks for jurisdiction outside India or requests definitive legal advice, recommend consulting a licensed attorney.",
    },
    { role: "user", content: message },
  ];

  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${groqApiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.3,
      max_tokens: 700,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Groq error (${resp.status}): ${text}`);
  }

  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("Groq returned empty response");
  }
  return content.trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message, conversation_id }: RequestBody = await req.json();

    if (!message || !conversation_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    let response: string;
    const useGroq = (Deno.env.get("USE_GROQ") || "true").toLowerCase() !== "false";

    if (useGroq && Deno.env.get("GROQ_API_KEY")) {
      try {
        response = await generateWithGroq(message);
      } catch (groqError) {
        console.error("Groq failed, falling back to knowledge base:", groqError);
        response = findRelevantAnswer(message);
      }
    } else {
      response = findRelevantAnswer(message);
    }

    const fullResponse = `${response}\n\n---\nTip: If Groq is configured, replies come from Groq; otherwise a built-in knowledge base is used.`;

    return new Response(
      JSON.stringify({
        response: fullResponse,
        conversation_id
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request",
        details: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
