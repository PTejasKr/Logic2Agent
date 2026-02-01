import { NextResponse } from "next/server";
import { groq } from "@/config/GroqModel";
import { openai } from "@/config/OpenAiModel";

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
    You are an autonomous AI agent part of this workflow: ${toolConfig.systemPrompt}
    Your name: ${toolConfig.primaryAgentName}
    
    ### AVAILABLE TOOLS:
    You have access to ${groqTools.length} real-time tools. 
    TOOLS LIST: ${groqTools.map((t: any) => t.function.name).join(", ")}
    
    ### MANDATORY RULES:
    1. **USER-FRIENDLY**: Use simple words. No jargon (pressure, visibility, etc.). Use friendly emojis.
    2. **NO REASONING LEAKS**: NEVER include <think> or any internal reasoning tags in the final response.
    3. **COMMON SENSE**: For ambiguous locations like "Delhi", always use the most famous one (Delhi, India).
    4. **BREVITY**: Be extremely concise. 3-4 bullet points max. No filler.
    5. **FALLBACK**: If a tool fails, state the error briefly.
    
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
        return NextResponse.json({ reply: finalResponse.choices[0].message.content || "Done." });
    }

    return NextResponse.json({ reply: initialMessage.content || "Done." });
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
    You are an autonomous AI agent part of this workflow: ${toolConfig.systemPrompt}
    Your name: ${toolConfig.primaryAgentName}
    
    ### AVAILABLE TOOLS:
    You have access to ${openAiTools.length} real-time tools. 
    TOOLS LIST: ${openAiTools.map((t: any) => t.function.name).join(", ")}
    
    ### MANDATORY RULES:
    1. **USER-FRIENDLY**: Use simple words. No jargon (pressure, visibility, etc.). Use friendly emojis.
    2. **NO REASONING LEAKS**: NEVER include <think> or any internal reasoning tags in the final response.
    3. **COMMON SENSE**: For ambiguous locations like "Delhi", always use the most famous one (Delhi, India).
    4. **BREVITY**: Be extremely concise. 3-4 bullet points max. No filler.
    5. **FALLBACK**: If a tool fails, state the error briefly.
    
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
        return NextResponse.json({ reply: finalResponse.choices[0].message.content || "Done." });
    }

    return NextResponse.json({ reply: initialMessage.content || "Done." });
}
