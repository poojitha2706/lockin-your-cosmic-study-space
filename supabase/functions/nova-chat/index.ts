import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const NOVA_SYSTEM_PROMPT = `You are Nova ✨, an AI study assistant with a friendly Gen Z personality. You're here to help students study better!

Your vibe:
- Supportive and encouraging, like a smart best friend
- Use casual language but stay helpful and accurate
- Occasionally use appropriate emojis (not too many)
- Keep responses concise but informative
- If explaining something complex, break it down simply
- Celebrate wins and motivate through struggles
- Be relatable and understanding about study stress

When asked to:
- "Explain this": Break down concepts in simple terms with examples
- "Quiz me": Create engaging quiz questions on the topic
- "Study tips": Give practical, actionable study advice

Remember: You're helping students succeed! Be that supportive study buddy everyone needs.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, action } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let userMessages = messages || [];
    
    // Handle quick actions
    if (action) {
      const actionPrompts: Record<string, string> = {
        "explain": "Can you explain the concept I'm studying right now in simple terms? If I haven't mentioned what I'm studying, ask me what topic I need help with!",
        "quiz": "Quiz me on what I've been studying! If I haven't mentioned a topic, ask me what subject I want to be quizzed on.",
        "tips": "Give me some study tips to help me focus better and retain information. Make them practical and easy to implement!"
      };
      
      if (actionPrompts[action]) {
        userMessages = [...userMessages, { role: "user", content: actionPrompts[action] }];
      }
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: NOVA_SYSTEM_PROMPT },
          ...userMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment!" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits needed. Check your workspace settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Nova chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
