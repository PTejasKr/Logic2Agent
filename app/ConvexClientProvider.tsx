"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
    console.warn("NEXT_PUBLIC_CONVEX_URL is not set. Convex features will be disabled.");
}

const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    if (!convex) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">
                <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl border border-red-500/20">
                    <h1 className="text-2xl font-bold mb-4 text-red-500">Configuration Error</h1>
                    <p className="mb-4 text-gray-300">
                        NEXT_PUBLIC_CONVEX_URL is not set.
                    </p>
                    <p className="text-sm text-gray-400">
                        Run <code className="bg-black/30 px-2 py-1 rounded">npx convex dev</code> to generate it.
                    </p>
                </div>
            </div>
        );
    }
    return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
