"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Send } from "lucide-react";

function ChatUI() {
    const [loading, setLoading] = useState(false);

    const generateAgentToolConfig = () => {
        setLoading(true);
        // Placeholder for logic
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 overflow-hidden border-l border-gray-200 dark:border-gray-800">
            {/* Header section */}
            <div className="flex justify-between items-center border-b p-4">
                <h2 className="text-lg font-semibold">Agent Name</h2>
                <Button
                    onClick={generateAgentToolConfig}
                    disabled={loading}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${loading && "animate-spin"}`} />
                    Reboot Agent
                </Button>
            </div>

            {/* Chat Container */}
            <div className="w-full flex-1 flex flex-col p-4 overflow-hidden">
                {/* Message Section */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
                    {/* Hardcoded messages */}
                    <div className="flex justify-start">
                        <div className="p-3 rounded-2xl max-w-[80%] bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-200 shadow-sm">
                            <h2 className="text-sm font-medium">Welcome! This is a demo chat.</h2>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <div className="p-3 rounded-2xl max-w-[80%] bg-primary text-primary-foreground shadow-md">
                            <h2 className="text-sm font-medium">Hello! Can you show me a design idea?</h2>
                        </div>
                    </div>

                    <div className="flex justify-start">
                        <div className="p-3 rounded-2xl max-w-[80%] bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-200 shadow-sm">
                            <h2 className="text-sm font-medium">Sure! I suggest a modern dashboard with clean layouts.</h2>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <div className="p-3 rounded-2xl max-w-[80%] bg-primary text-primary-foreground shadow-md">
                            <h2 className="text-sm font-medium">Great! Can we add dark mode?</h2>
                        </div>
                    </div>

                    <div className="flex justify-start">
                        <div className="p-3 rounded-2xl max-w-[80%] bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-200 shadow-sm">
                            <h2 className="text-sm font-medium">Absolutely! Dark mode will make the dashboard look sleek.</h2>
                        </div>
                    </div>

                    {/* Loading state */}
                    {loading && (
                        <div className="flex justify-center items-center p-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                            <span className="ml-3 text-sm text-gray-500 font-medium">Thinking... Working on your request</span>
                        </div>
                    )}
                </div>

                {/* Footer Input */}
                <div className="p-2 pt-4 border-t flex items-center gap-3">
                    <textarea
                        placeholder="Type your message here..."
                        className="flex-1 resize-none border rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm min-h-[50px] max-h-[150px]"
                        rows={1}
                    />
                    <Button size="icon" className="shrink-0 rounded-full h-11 w-11 shadow-lg">
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ChatUI;
