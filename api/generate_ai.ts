import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ status: "error", error: "Method not allowed" });

  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string" || prompt.trim().length > 1000) {
    return res.status(400).json({ status: "error", error: "Prompt missing or too long (max 1000 chars)" });
  }

  const apiKey = process.env.GROK_API_KEY;

  if (!apiKey) {
    return res.json(getFallback(prompt));
  }

  try {
    const grokRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are FUSION_II_ARCHITECT. Respond ONLY with this exact JSON, no extra text:
{
  "text": "Design overview under 120 words.",
  "systemLayout": {
    "title": "System name",
    "database": "Recommended database",
    "api": "Recommended API layer",
    "rendering": "Recommended UI layer",
    "modules": ["Module 1", "Module 2", "Module 3", "Module 4"]
  }
}`
          },
          {
            role: "user",
            content: `Blueprint for: "${prompt}"`
          }
        ]
      })
    });

    if (!grokRes.ok) throw new Error(`Grok HTTP ${grokRes.status}`);

    let content = (await grokRes.json()).choices?.[0]?.message?.content || "";
    content = content.trim().replace(/^```(json)?\s*/i, "").replace(/```\s*$/g, "").trim();
    return res.json(JSON.parse(content));

  } catch (error: any) {
    return res.json(getFallback(prompt));
  }
}

function getFallback(prompt: string) {
  const lower = prompt.toLowerCase();
  if (lower.includes("saas") || lower.includes("dashboard") || lower.includes("portal")) {
    return {
      text: "Multi-tenant SaaS dashboard pattern with JSON log tracking and customizable user nodes.",
      systemLayout: {
        title: "SaaS Dash Vector Blueprint",
        database: "Supabase PostgreSQL",
        api: "Serverless middleware with JWT auth",
        rendering: "Vite + Tailwind responsive panels",
        modules: ["Multi-tenant Billing", "Live Metric Grids", "Activity Log Tracker", "User Settings Desk"]
      }
    };
  }
  if (lower.includes("ai") || lower.includes("agent") || lower.includes("bot")) {
    return {
      text: "AI orchestration pipeline with vector model interfaces and real-time stream simulation.",
      systemLayout: {
        title: "Autonomous Agent Pipe API",
        database: "Vector DB + Supabase metadata",
        api: "Dual middleware endpoints via Grok API",
        rendering: "Interactive chatbot with real-time streams",
        modules: ["Model Router", "Embedding Cache", "Proxy Relay", "Prompt Diagnostics"]
      }
    };
  }
  if (lower.includes("commerce") || lower.includes("shop") || lower.includes("store")) {
    return {
      text: "Headless commerce architecture with Stripe session tokens and reactive checkout triggers.",
      systemLayout: {
        title: "Commerce Pipeline",
        database: "Supabase PostgreSQL + product cache",
        api: "Stripe Webhooks + shipping gateway",
        rendering: "Pre-rendered catalog with reactive checkout",
        modules: ["Cart Desk", "Payment Bridge", "Webhook Logger", "Receipt Dispatcher"]
      }
    };
  }
  return {
    text: "Standard multi-layer architecture with streamlined JSON storage and operational logs.",
    systemLayout: {
      title: "Integrated Venture Platform",
      database: "Supabase PostgreSQL",
      api: "Node.js REST proxies",
      rendering: "Mobile-first responsive grids",
      modules: ["Role Authorization", "Central Dashboard", "Dynamic Forms", "Operations Log"]
    }
  };
}