import OpenAI from "openai";

// Lazy-safe OpenAI client wrapper to avoid runtime errors during build when env var is missing.
class OpenAiDummy {
    chat = {
        completions: {
            create: async () => {
                throw new Error("OPENAI_API_KEY is not configured. Set the OPENAI_API_KEY env var to use OpenAI features.");
            }
        }
    } as any;
}

export const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : new OpenAiDummy(); 