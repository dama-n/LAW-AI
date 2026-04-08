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

    const response = findRelevantAnswer(message);

    const fullResponse = `${response}\n\n---\n💡 Tip: For AI-powered responses using GPT or Gemini, you can configure your API key in the settings. The current responses are based on a built-in knowledge base.`;

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
