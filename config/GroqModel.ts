import Groq from "groq-sdk";

// Lazy-safe Groq client to avoid throwing during build when env var is missing.
class GroqDummy {
    chat = {
        completions: {
            create: async () => {
                throw new Error("GROQ_API_KEY is not configured. Set the GROQ_API_KEY env var to use Groq features.");
            }
        }
    } as any;
}

export const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : new GroqDummy();
