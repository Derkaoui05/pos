"use client";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Terminal,
  LayoutDashboard,
  ShoppingBag,
  Database,
  Upload,
  ShieldCheck,
  Zap,
  TrendingUp
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans relative overflow-hidden flex flex-col">
      
      {/* Decorative background glow elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-zinc-150/60 dark:bg-zinc-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-zinc-200/50 dark:bg-zinc-900/20 blur-[100px] pointer-events-none" />

      {/* ── Glassmorphic Top Navbar ───────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/70">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8.5 w-8.5 rounded-xl bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center text-white dark:text-zinc-950 font-black text-sm tracking-tighter">
              A
            </div>
            <span className="font-extrabold text-sm tracking-tight text-zinc-900 dark:text-zinc-100 uppercase">
              Apex<span className="text-zinc-400 dark:text-zinc-500 font-medium">POS</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/pos" className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-450 dark:hover:text-zinc-200 transition-colors uppercase tracking-wider">
              Terminal
            </Link>
            <Link href="/dashboard" className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-450 dark:hover:text-zinc-200 transition-colors uppercase tracking-wider">
              Dashboard
            </Link>
            <Link href="/dashboard/products" className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-450 dark:hover:text-zinc-200 transition-colors uppercase tracking-wider">
              Inventory
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/pos" 
              className="h-9 px-4 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98"
            >
              Launch Terminal
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 text-center flex-1 flex flex-col items-center justify-center relative z-10">
        
        {/* Pulsing Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 text-[10px] font-extrabold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest mb-6 animate-pulse select-none">
          <Sparkles className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
          <span>Moroccan Retail Engineered</span>
        </div>

        {/* Master Heading */}
        <h1 className="max-w-3xl text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1] mb-6">
          The Future of Modern <br/>
          <span className="bg-gradient-to-r from-zinc-900 to-zinc-400 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-600">
            Retail & Terminal Checkout
          </span>
        </h1>

        {/* Supporting description */}
        <p className="max-w-xl text-zinc-500 dark:text-zinc-400 text-sm sm:text-base leading-relaxed font-medium mb-10">
          A lightning-fast, high-fidelity checkout system with real-time performance analytics, smart cash bills calculators, and drag-and-drop local image uploading. Designed for speed, styled for extreme luxury.
        </p>

        {/* Dual Actions CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm sm:max-w-none mb-16">
          <Link
            href="/pos"
            className="w-full sm:w-auto h-12 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 flex items-center justify-center gap-2 shadow-md transition-all duration-200 active:scale-95 group"
          >
            <Terminal className="h-4 w-4" />
            Open Cashier Terminal
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto h-12 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider border border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 flex items-center justify-center gap-2 shadow-xs transition-all duration-200 active:scale-95"
          >
            <LayoutDashboard className="h-4 w-4" />
            Manager Dashboard
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left pt-6">
          
          {/* Card 1: Keypad */}
          <div className="border border-zinc-200/80 dark:border-zinc-850/80 rounded-3xl p-6 bg-white dark:bg-zinc-950 hover:shadow-md hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-300 group">
            <div className="h-10 w-10 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-50 mb-5 group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 text-amber-500" />
            </div>
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              Smart Keypad Checkout
            </h3>
            <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              Ditch slow typing. cashier-oriented virtual keypad dialog supports physical inputs, decimal locking, exact cash payouts, and automatic change calculating matching Moroccan MAD bill formats.
            </p>
          </div>

          {/* Card 2: Analytics */}
          <div className="border border-zinc-200/80 dark:border-zinc-850/80 rounded-3xl p-6 bg-white dark:bg-zinc-950 hover:shadow-md hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-300 group">
            <div className="h-10 w-10 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-50 mb-5 group-hover:scale-105 transition-transform">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              Timeline Performance Analyzer
            </h3>
            <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              Gain deep insight. Instantly toggle dashboard graphs to display daily volume, weekly transactions, or monthly aggregate revenues with zero loading lag via local memory cache registers.
            </p>
          </div>

          {/* Card 3: Uploader */}
          <div className="border border-zinc-200/80 dark:border-zinc-850/80 rounded-3xl p-6 bg-white dark:bg-zinc-950 hover:shadow-md hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-300 group">
            <div className="h-10 w-10 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-50 mb-5 group-hover:scale-105 transition-transform">
              <Upload className="h-5 w-5 text-indigo-500" />
            </div>
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              Drag-and-Drop Local Uploads
            </h3>
            <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              Keep assets safe. Drag, drop, or click inside the product editor to upload item images directly to secure local server directories, rendering instant image crop-previews on your grid.
            </p>
          </div>

        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-200/80 dark:border-zinc-850/80 bg-white/40 dark:bg-zinc-950/20 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">
              ApexPOS Retail © 2026. Made with Google Antigravity.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 select-none">
              <Database className="h-3 w-3" />
              Prisma PostgreSQL
            </span>
            <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 select-none">
              <ShieldCheck className="h-3 w-3" />
              AuthJS Secure
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
