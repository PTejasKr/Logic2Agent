import { NextResponse } from "next/server";
import { groq } from "@/config/GroqModel";
import OpenAI from "openai";

const PROMPT = `
You are an expert AI Agent Architect.
Your task is to analyze the "Agent Workflow Configuration" (JSON) and generate a deterministic "System Configuration" for an autonomous AI agent.

INPUT STRUCTURE:
The input JSON contains:
- 'startNode': The ID of the entry point.
- 'flow': An array of nodes. Each node has:
    - 'id': Unique ID.
    - 'type': (e.g., StartNode, AgentNode, ApiNode, IfElseNode).
    - 'settings': THIS IS CRITICAL. It contains user-defined values like 'url', 'method', 'headers', 'instruction', 'model', etc.
    - 'next': The ID(s) of the following node(s).

OUTPUT STRUCTURE:
You MUST output a single valid JSON object with the EXACT following structure:

{
  "systemPrompt": "A high-level overview of the entire system's purpose.",
  "primaryAgentName": "Name of the first AgentNode.",
  "agents": [
    {
      "id": "node_id",
      "name": "Agent Name",
      "model": "Extract from settings.model or default to 'llama-3.3-70b-versatile'",
      "instruction": "Behavioral guidance. Incorporate logic from connected IfElse/While nodes.",
      "includeHistory": true,
      "output": "Text",
      "tools": ["ids_of_connected_api_nodes"]
    }
  ],
  "tools": [
    {
      "id": "node_id",
      "name": "Tool Name",
      "description": "Look at settings.description",
      "url": "Look at settings.url",
      "method": "Look at settings.method",
      "includeApiKey": true,
      "apiKey": "Look at settings.apiKey",
      "apiKeyParamName": "Look at settings.apiKeyParamName or default to 'key'",
      "assignedAgent": "Name of agent using it",
      "parameters": { "param": "type" },
      "usage": []
    }
  ]
}

Rules:
1. DATA EXTRACTION: You MUST look inside the 'settings' object of each node to find:
    - For ApiNode: 'url', 'method', 'apiKey', 'includeApiKey', 'bodyParams', 'apiKeyParamName', 'description'.
    - For AgentNode: 'name', 'instructions', 'model', 'includeChatHistory'.
    - For IfElseNode/WhileNode: 'condition'.
2. BRANCHING & LOGIC: 
    - The 'systemPrompt' should strictly instruct the agent to be ULTRA-MINIMALIST, WARM, NATURAL, and DOMAIN-SPECIFIC.
    - Agent 'instructions' should EXPLICITLY state: "You HAVE tools! Speak naturally and briefly. STRICTLY only answer questions related to your domain (e.g., weather). Politely refuse anything else."
3. OUTPUT: ONLY the JSON object. No markdown, no backticks.
`;

function safeParseJSON(text: string) {
    try {
        // Remove potential markdown blocks
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("SafeParse Error. Raw text:", text);
        throw new Error("AI returned invalid JSON formatting.");
    }
}

export async function POST(req: Request) {
    console.log("🚀 API Route Hit: /api/generate-agent-tool-config");
    try {
        console.log("📥 Parsing request body...");
        const body = await req.json();
        const { jsonConfig } = body;

        console.log("📬 Config Request Body Received");
        console.log("🔍 jsonConfig present:", !!jsonConfig);

        if (!jsonConfig) {
            console.error("❌ Missing jsonConfig in request body");
            return NextResponse.json({ error: "Missing jsonConfig" }, { status: 400 });
        }

        // 🚀 Primary: Attempt with Groq
        try {
            console.log("📥 Attempting Groq for config generation...");
            console.log("🔑 GROQ_API_KEY present:", !!process.env.GROQ_API_KEY);

            if (!process.env.GROQ_API_KEY) {
                console.error("❌ Missing Groq API Key");
                throw new Error("Missing Groq API Key");
            }

            const response = await groq.chat.completions.create({
                model: "qwen/qwen3-32b",
                messages: [
                    { role: "system", content: PROMPT },
                    { role: "user", content: JSON.stringify(jsonConfig) }
                ],
                response_format: { type: "json_object" }
            });

            const outputText = response.choices[0].message.content || "{}";
            console.log("✅ Groq RAW Output:", outputText);

            const parsed = safeParseJSON(outputText);
            return NextResponse.json(parsed);

        } catch (groqError: any) {
            // 🚨 Check for Rate Limit (429)
            if (groqError.status === 429 || groqError.message?.includes("rate_limit_exceeded")) {
                console.warn("⚠️ Groq Rate Limit reached. Falling back to OpenAI...");

                if (!process.env.OPENAI_API_KEY) {
                    console.error("❌ OpenAI API Key is missing. Cannot fallback.");
                    return NextResponse.json(
                        { error: "Groq rate limit reached and OpenAI API Key is not configured. Please add OPENAI_API_KEY to your .env file or wait for Groq rate limit to reset." },
                        { status: 503 }
                    );
                }

                try {
                    const openai = new OpenAI({
                        apiKey: process.env.OPENAI_API_KEY,
                    });

                    const response = await openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: [
                            { role: "system", content: PROMPT },
                            { role: "user", content: JSON.stringify(jsonConfig) }
                        ],
                        response_format: { type: "json_object" }
                    });

                    const outputText = response.choices[0].message.content || "{}";
                    console.log("✅ OpenAI RAW Output:", outputText);

                    const parsedData = safeParseJSON(outputText);

                    return NextResponse.json({
                        ...parsedData,
                        _fallback: true,
                        _fallback_reason: "Groq Rate Limit (OpenAI Fallback)"
                    });
                } catch (openaiError: any) {
                    console.error("❌ OpenAI Fallback Error:", openaiError);
                    return NextResponse.json(
                        { error: `OpenAI fallback failed: ${openaiError.message}` },
                        { status: 500 }
                    );
                }
            }
            // Re-throw if not a rate limit error
            console.error("❌ Groq Error (non-rate-limit):", groqError);
            return NextResponse.json(
                { error: `Groq API Error: ${groqError.message || 'Unknown error'}` },
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error("Config API Route Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}