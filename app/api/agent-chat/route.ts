import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { tool } from "ai";

export async function POST(req: NextRequest) {
    const { input, tools, agents, conversationId } = await req.json();

    // map all tools
    const generatedTools = Object.fromEntries(
        tools.map((t: any) => {
            // Dynamically build zod object for parameters
            const paramSchema = t.parameters ? z.object(
                Object.fromEntries(
                    Object.entries(t.parameters).map(([key, type]) => {
                        if (type === "string") return [key, z.string()];
                        if (type === "number") return [key, z.number()];
                        return [key, z.any()];
                    })
                )
            ) : z.object({});

            return [
                t.name,
                tool({
                    description: t.description,
                    parameters: paramSchema,
                    execute: async (params: any) => {
                        // Replace placeholders in URL
                        let url = t.url;
                        for (const key in params) {
                            url = url.replace(`{{${key}}}`, encodeURIComponent(params[key]));
                        }

                        if (t.includeApiKey && t.apiKey) {
                            url += url.includes("?") ? `&key=${t.apiKey}` : `?key=${t.apiKey}`;
                        }

                        // Make API request
                        const response = await fetch(url);
                        const data = await response.json();

                        // Return raw data (or transform if needed)
                        return data;
                    }
                } as any)
            ];
        })
    );

    const createdAgent = agents.find((a: any) => a.id === conversationId);
    if (!createdAgent) {
        return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Placeholder for LLM call using generatedTools
    return NextResponse.json({ message: "Tools mapped successfully", toolsCount: Object.keys(generatedTools).length });
}
