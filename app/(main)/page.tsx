import Image from "next/image";
import Link from "next/link";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { SignedIn, SignedOut } from '@clerk/nextjs';


export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent blur-[120px]" />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 sm:px-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 min-h-[90vh]">
        <div className="flex-1 space-y-10 text-center lg:text-left">
          <Link href="/">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-sm font-semibold tracking-wide animate-fade-in shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
              </span>
              <span className="uppercase text-[10px] tracking-[0.2em]">Logic2Agent 1.0 is here</span>
            </div>
          </Link>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] text-white">
            Next-Gen <span className="text-primary italic drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">Agent Logic</span> <span className="text-accent underline decoration-accent/30 decoration-8 underline-offset-[12px]">Mastery</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
            Logic2Agent is a <span className="text-primary/80 font-medium">visual reasoning compiler</span> that converts drag-and-drop logic flows into <span className="text-secondary/80 font-medium">multi-agent AI behaviors</span>, deployable instantly as a web chatbot.
          </p>


          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <SignedOut>
              <ShimmerButton asChild className="w-full sm:w-auto px-10 py-5 rounded-2xl text-lg font-bold shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
                <Link href="/sign-up">
                  Get Started Free
                </Link>
              </ShimmerButton>
            </SignedOut>
            <SignedIn>
              <ShimmerButton asChild className="w-full sm:w-auto px-10 py-5 rounded-2xl text-lg font-bold shadow-[0_20px_50px_rgba(6,182,212,0.3)] hover:shadow-primary/50 text-center">
                <Link href="/dashboard">
                  Go to Dashboard
                </Link>
              </ShimmerButton>
            </SignedIn>
          </div>


          <div className="flex items-center justify-center lg:justify-start space-x-10 pt-6">
            <div className="text-center">
              <p className="text-3xl font-black text-white">10k+</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mt-1">Active Nodes</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-3xl font-black text-white">99.9%</p>
              <p className="text-[10px] text-secondary uppercase tracking-[0.2em] font-bold mt-1">Uptime AI</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-3xl font-black text-white">24/7</p>
              <p className="text-[10px] text-accent uppercase tracking-[0.2em] font-bold mt-1">Support</p>
            </div>
          </div>
        </div>

        <div className="flex-1 relative animate-float">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-secondary rounded-[3.5rem] blur-3xl opacity-20 group-hover:opacity-40 transition-all duration-700" />
            <div className="relative aspect-square md:aspect-video lg:aspect-square overflow-hidden rounded-[3rem] border border-white/5 bg-black/40 backdrop-blur-2xl shadow-2xl">
              <Image
                src="/hero.png"
                alt="Logic2Agent Brand Mark"
                fill
                className="object-contain p-8 transition-transform duration-1000 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent p-10 flex items-end">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10 w-full shadow-2xl">
                  <p className="text-primary text-[10px] uppercase tracking-[0.2em] font-black">Real-time Node Visualization</p>
                  <div className="flex space-x-2 mt-3">
                    <div className="h-1.5 bg-primary flex-1 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                    <div className="h-1.5 bg-secondary/30 flex-1 rounded-full" />
                    <div className="h-1.5 bg-accent/20 flex-1 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-[80px] animate-pulse" />
          <div className="absolute -bottom-12 -left-12 w-52 h-52 bg-secondary/10 rounded-full blur-[100px] animate-pulse" />
        </div>
      </section>



      {/* Footer is now globally handled in layout.tsx */}
    </div>
  );
}

