"use client";

import Link from "next/link";
import Image from "next/image";
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
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? "bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 py-3"
                : "bg-transparent py-5"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5 transition-transform group-hover:scale-110">
                        <div className="bg-white dark:bg-gray-900 w-full h-full rounded-[10px] flex items-center justify-center overflow-hidden">
                            <Image
                                src="/logic_logo.png"
                                alt="Logic2Agent Logo"
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                        </div>
                    </div>
                    <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        Logic2Agent
                    </span>

                </Link>




                <div className="flex items-center space-x-4">
                    <SignedOut>
                        <Link href="/sign-in" className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                            Sign In
                        </Link>

                    </SignedOut>
                    <SignedIn>
                        <Link href="/dashboard" className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                            Dashboard
                        </Link>
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "w-10 h-10"
                                }
                            }}
                        />
                    </SignedIn>
                </div>


            </div>
        </nav>
    );
}
