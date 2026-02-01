import { NextResponse } from "next/server";
import { groq } from "@/config/GroqModel";
import { openai } from "@/config/OpenAiModel";

// 🧹 Fail-safe: Strip all reasoning tags from AI output
function cleanResponse(text: string): string {
    if (!text) return "Done.";
    // Remove anything between <think> and </think> (including the tags)
    return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

export async function POST(req: Request) {
    try {
        const { messages, toolConfig } = await req.json();

        // 🚀 Primary: Attempt with Groq
        try {
            console.log("🤖 Attempting Groq Chat...");
            if (!process.env.GROQ_API_KEY) throw new Error("Missing Groq API Key");

            return await handleGroqChat(messages, toolConfig);

        } catch (groqError: any) {
            // 🚨 Check for Rate Limit (429)
            if (groqError.status === 429 || groqError.message?.includes("rate_limit_exceeded")) {
                console.warn("⚠️ Groq Chat Rate Limit reached. Falling back to OpenAI...");

                if (!process.env.OPENAI_API_KEY) {
                    throw new Error("Groq limit reached and OpenAI API Key is missing.");
                }

                const result = await handleOpenAiChat(messages, toolConfig);
                const data = await result.json();

                return NextResponse.json({
                    ...data,
                    _fallback: true,
                    _fallback_reason: "Groq Rate Limit (OpenAI Fallback)"
                });
            }
            throw groqError;
        }

    } catch (error: any) {
        console.error("Chat API Route Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// --- Groq Handler ---
async function handleGroqChat(messages: any[], toolConfig: any) {
    const groqTools = toolConfig.tools?.map((tool: any) => {
        const urlPlaceholders = tool.url.match(/\{([^}]+)\}/g)?.map((m: string) => m.slice(1, -1)) || [];
        const properties: any = {};
        const required: string[] = [];

        urlPlaceholders.forEach((param: string) => {
            properties[param] = { type: 'string', description: `The ${param} parameter for the API URL` };
            required.push(param);
        });

        Object.keys(tool.parameters || {}).forEach(key => {
            if (!properties[key]) {
                properties[key] = {
                    type: tool.parameters[key]?.toLowerCase() === 'number' ? 'number' : 'string',
                    description: `The ${key} parameter`
                };
                required.push(key);
            }
        });

        return {
            type: "function",
            function: {
                name: tool.id.replace(/[^a-zA-Z0-9_-]/g, '_'),
                description: tool.description || `Call the ${tool.name}`,
                parameters: { type: "object", properties, required: [...new Set(required)] }
            }
        };
    }) || [];

    const masterSystemPrompt = `
    ### CORE IDENTITY & MISSION:
    You are a warm, helpful AI assistant.
    Workflow Context: ${toolConfig.systemPrompt}
    Your name: ${toolConfig.primaryAgentName}
    
    ### MANDATORY RULES:
    1. **ULTRA-MINIMALIST**: Do NOT use lists or technical labels like "Temperature:". Speak like a human. 
       - Bad: "- Temp: 20C - Condition: Mist"
       - Good: "It's a misty 20°C in Bhopal right now! 🌤️"
    2. **ZERO TECHNICAL JARGON**: No pressure, visibility, or wind speed unless explicitly asked.
    3. **NO REASONING LEAKS**: NEVER include <think>, empty tags, or internal monologues.
    4. **COMMON SENSE**: Assume the most famous location (e.g., Delhi, India) for ambiguous names.
    5. **ONE SENTENCE**: Keep most answers to a single, high-impact sentence.
    
    ### WORKFLOW CONTEXT:
    ${JSON.stringify(toolConfig.agents, null, 2)}
    `;

    const chatMessages = [
        { role: "system", content: masterSystemPrompt },
        ...messages.map((m: any) => ({
            role: m.role === 'agent' ? 'assistant' : m.role,
            content: m.content
        }))
    ];

    const response = await groq.chat.completions.create({
        model: "qwen/qwen3-32b",
        messages: chatMessages,
        ...(groqTools.length > 0 ? { tools: groqTools, tool_choice: "auto" } : {})
    });

    const initialMessage = response.choices[0].message;

    if (initialMessage.tool_calls && initialMessage.tool_calls.length > 0) {
        chatMessages.push(initialMessage as any);
        for (const toolCall of initialMessage.tool_calls) {
            if (toolCall.type !== 'function') continue;
            const functionName = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments);
            const originalTool = toolConfig.tools.find((t: any) => t.id.replace(/[^a-zA-Z0-9_-]/g, '_') === functionName);

            if (originalTool) {
                try {
                    let finalUrl = originalTool.url;
                    Object.keys(args).forEach(key => finalUrl = finalUrl.replace(`{${key}}`, encodeURIComponent(args[key])));
                    if (originalTool.includeApiKey && originalTool.apiKey) {
                        const separator = finalUrl.includes('?') ? '&' : '?';
                        const paramName = originalTool.apiKeyParamName || 'key';
                        finalUrl += `${separator}${paramName}=${originalTool.apiKey}`;
                    }
                    const apiResult = await fetch(finalUrl, { method: originalTool.method || 'GET' });
                    if (!apiResult.ok) throw new Error(`API returned ${apiResult.status}`);
                    const resultData = await apiResult.json();

                    chatMessages.push({
                        tool_call_id: toolCall.id,
                        role: "tool",
                        name: functionName,
                        content: JSON.stringify(resultData),
                    } as any);
                } catch (err: any) {
                    chatMessages.push({
                        tool_call_id: toolCall.id,
                        role: "tool",
                        name: functionName,
                        content: JSON.stringify({ error: err.message }),
                    } as any);
                }
            }
        }
        const finalResponse = await groq.chat.completions.create({
            model: "qwen/qwen3-32b",
            messages: chatMessages,
        });
        return NextResponse.json({ reply: cleanResponse(finalResponse.choices[0].message.content || "") });
    }

    return NextResponse.json({ reply: cleanResponse(initialMessage.content || "") });
}

// --- OpenAI Handler ---
async function handleOpenAiChat(messages: any[], toolConfig: any) {
    const openAiTools = toolConfig.tools?.map((tool: any) => {
        const urlPlaceholders = tool.url.match(/\{([^}]+)\}/g)?.map((m: string) => m.slice(1, -1)) || [];
        const properties: any = {};
        const required: string[] = [];

        urlPlaceholders.forEach((param: string) => {
            properties[param] = { type: 'string', description: `The ${param} parameter for the API URL` };
            required.push(param);
        });

        Object.keys(tool.parameters || {}).forEach(key => {
            if (!properties[key]) {
                properties[key] = {
                    type: tool.parameters[key]?.toLowerCase() === 'number' ? 'number' : 'string',
                    description: `The ${key} parameter`
                };
                required.push(key);
            }
        });

        return {
            type: "function",
            function: {
                name: tool.id.replace(/[^a-zA-Z0-9_-]/g, '_'),
                description: tool.description || `Call the ${tool.name}`,
                parameters: { type: "object", properties, required: [...new Set(required)] }
            }
        };
    }) || [];

    const masterSystemPrompt = `
    ### CORE IDENTITY & MISSION:
    You are a warm, helpful AI assistant.
    Workflow Context: ${toolConfig.systemPrompt}
    Your name: ${toolConfig.primaryAgentName}
    
    ### MANDATORY RULES:
    1. **ULTRA-MINIMALIST**: Do NOT use lists or technical labels like "Temperature:". Speak like a human. 
       - Bad: "- Temp: 20C - Condition: Mist"
       - Good: "It's a misty 20°C in Bhopal right now! 🌤️"
    2. **ZERO TECHNICAL JARGON**: No pressure, visibility, or wind speed unless explicitly asked.
    3. **NO REASONING LEAKS**: NEVER include <think>, empty tags, or internal monologues.
    4. **COMMON SENSE**: Assume the most famous location (e.g., Delhi, India) for ambiguous names.
    5. **ONE SENTENCE**: Keep most answers to a single, high-impact sentence.
    
    ### WORKFLOW CONTEXT:
    ${JSON.stringify(toolConfig.agents, null, 2)}
    `;

    const chatMessages = [
        { role: "system", content: masterSystemPrompt },
        ...messages.map((m: any) => ({
            role: m.role === 'agent' ? 'assistant' : m.role,
            content: m.content
        }))
    ];

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: chatMessages as any,
        ...(openAiTools.length > 0 ? { tools: openAiTools, tool_choice: "auto" } : {})
    });

    const initialMessage = response.choices[0].message;

    if (initialMessage.tool_calls && initialMessage.tool_calls.length > 0) {
        chatMessages.push(initialMessage as any);
        for (const toolCall of initialMessage.tool_calls) {
            if (toolCall.type !== 'function') continue;
            const functionName = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments);
            const originalTool = toolConfig.tools.find((t: any) => t.id.replace(/[^a-zA-Z0-9_-]/g, '_') === functionName);

            if (originalTool) {
                try {
                    let finalUrl = originalTool.url;
                    Object.keys(args).forEach(key => finalUrl = finalUrl.replace(`{${key}}`, encodeURIComponent(args[key])));
                    if (originalTool.includeApiKey && originalTool.apiKey) {
                        const separator = finalUrl.includes('?') ? '&' : '?';
                        const paramName = originalTool.apiKeyParamName || 'key';
                        finalUrl += `${separator}${paramName}=${originalTool.apiKey}`;
                    }
                    const apiResult = await fetch(finalUrl, { method: originalTool.method || 'GET' });
                    if (!apiResult.ok) throw new Error(`API returned ${apiResult.status}`);
                    const resultData = await apiResult.json();

                    chatMessages.push({
                        tool_call_id: toolCall.id,
                        role: "tool",
                        name: functionName,
                        content: JSON.stringify(resultData),
                    } as any);
                } catch (err: any) {
                    chatMessages.push({
                        tool_call_id: toolCall.id,
                        role: "tool",
                        name: functionName,
                        content: JSON.stringify({ error: err.message }),
                    } as any);
                }
            }
        }
        const finalResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: chatMessages as any,
        });
        return NextResponse.json({ reply: cleanResponse(finalResponse.choices[0].message.content || "") });
    }

    return NextResponse.json({ reply: cleanResponse(initialMessage.content || "") });
}
