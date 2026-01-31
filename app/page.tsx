import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut } from '@clerk/nextjs';


export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent blur-3xl" />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 sm:px-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 min-h-[90vh]">
        <div className="flex-1 space-y-10 text-center lg:text-left">
          <Link href="/">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-600 dark:text-green-400 text-sm font-medium animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>Logic2Agent 1.0 is here</span>
            </div>
          </Link>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Next-Gen <span className="text-green-600 italic">Agent Logic</span> Mastery
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
            Architect sophisticated logic-driven agents that breathe life into your data. Logic2Agent isn't just a tool; it's the bridge between raw intelligence and autonomous execution.
          </p>


          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <SignedOut>

              <Link
                href="/sign-up"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95"
              >
                Get Started Free
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-lg font-semibold transition-all shadow-[0_20px_50px_rgba(34,_197,_94,_0.3)] hover:shadow-green-500/40 active:scale-95 text-center"
              >
                Go to Dashboard
              </Link>
            </SignedIn>

          </div>


          <div className="flex items-center justify-center lg:justify-start space-x-8 pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold">10k+</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Active Nodes</p>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
            <div className="text-center">
              <p className="text-2xl font-bold">99.9%</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Uptime AI</p>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
            <div className="text-center">
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Support</p>
            </div>
          </div>
        </div>

        <div className="flex-1 relative animate-float">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative aspect-square md:aspect-video lg:aspect-square overflow-hidden rounded-[2.5rem] border border-gray-200/50 dark:border-gray-800/50 shadow-2xl">
              <Image
                src="/hero.png"
                alt="NeuralFlow Futuristic Network"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent p-8 flex items-end">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 w-full">
                  <p className="text-white text-sm font-medium tracking-wide">Real-time Node Visualization</p>
                  <div className="flex space-x-1 mt-2">
                    <div className="h-1 bg-blue-500 flex-1 rounded-full animate-pulse" />
                    <div className="h-1 bg-white/30 flex-1 rounded-full" />
                    <div className="h-1 bg-white/30 flex-1 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        </div>
      </section>



      {/* Footer is now globally handled in layout.tsx */}
    </div>
  );
}

