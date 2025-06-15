const ALLOWED_ORIGIN = [
  "https://yuna-ai.pages.dev",
  "http://localhost:8800"
];

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin") || "";

    const isAllowedOrigin = ALLOWED_ORIGIN.includes(origin);
    const corsHeaders = {
      "Access-Control-Allow-Origin": isAllowedOrigin ? origin : "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400"
    };

    // 🔄 Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // 🔒 Blokir origin tidak dikenal
    if (!isAllowedOrigin) {
      return new Response(JSON.stringify({ error: "Not allowed" }), {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    try {
      const body = await request.json();
      const prompt = body?.prompt?.trim();
      const history = Array.isArray(body.history) ? body.history : [];

      if (!prompt) {
        return new Response(JSON.stringify({ error: "❌ Prompt kosong!" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      }

      const messages = [
        {
          role: "system",
          content: `Kamu adalah YUNA, asisten AI yang ramah dan membantu yang dibuat oleh Putri Dinar cewek cantik dari bandung. Kamu hanya berbicara bahasa Indonesia.`
        },
        ...history,
        {
          role: "user",
          content: prompt
        }
      ];

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages,
          temperature: 0.7,
        }),
      });

      const data = await response.json();

      if (data?.error) {
        return new Response(JSON.stringify({ error: data.error.message || "Terjadi kesalahan Groq API" }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      }

      const reply = data.choices?.[0]?.message?.content || "Maaf, YUNA tidak bisa menjawab.";
      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: "❌ Server error", detail: err.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }
  }
};
