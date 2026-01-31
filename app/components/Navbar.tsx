"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 h-20 flex items-center border-b border-white/5 ${scrolled
                ? "bg-white/70 dark:bg-black/70 backdrop-blur-md border-gray-200 dark:border-gray-800"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between h-full">
                <Link href="/" className="flex items-center group p-0 m-0 h-full">
                    <div className="flex items-center tracking-tighter transition-all duration-500 ease-out group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <div className="text-3xl font-black flex items-center leading-tight py-2">
                            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-cyan-400 to-blue-500 dark:from-blue-400 dark:via-cyan-300 dark:to-blue-400 drop-shadow-sm transition-transform duration-500 group-hover:scale-105 py-1">Logic</span>
                            <span className="text-4xl sm:text-5xl text-accent mx-1 transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-360 group-hover:drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] flex items-center justify-center">2</span>
                            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-500 via-cyan-400 to-blue-600 dark:from-blue-400 dark:via-cyan-300 dark:to-blue-500 drop-shadow-sm transition-transform duration-500 group-hover:scale-105 py-1">Agent</span>
                        </div>
                    </div>
                </Link>




                <div className="flex items-center space-x-4">
                    <SignedOut>
                        <Link href="/sign-in" className="hidden sm:block text-sm font-medium text-gray-400 hover:text-primary transition-colors">
                            Sign In
                        </Link>
                    </SignedOut>
                    <SignedIn>

                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "w-10 h-10 border border-primary/20 hover:border-accent transition-all shadow-[0_0_15px_rgba(168,162,158,0.1)]"
                                }
                            }}
                        />
                    </SignedIn>
                </div>


            </div>
        </nav>
    );
}
