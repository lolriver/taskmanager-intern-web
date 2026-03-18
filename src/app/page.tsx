'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, LayoutDashboard, Search, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden selection:bg-primary/20">

      {/* Abstract Glowing Gradients */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] opacity-30 dark:opacity-20 pointer-events-none blur-[120px] bg-gradient-to-bl from-blue-600 to-indigo-600 rounded-full" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] opacity-20 pointer-events-none blur-[100px] bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-full" />

      {/* Navigation */}
      <nav className="w-full border-b border-border/40 backdrop-blur-md bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
              <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">FocusFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-medium hover:bg-primary/10 transition-colors">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-32 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl space-y-8"
        >
          <div className="inline-flex items-center rounded-full border border-border/50 bg-muted/50 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse" />
            Designed for teams & individuals
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] text-foreground">
            Manage your progress with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
              effortless precision.
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Elevate your daily productivity. FocusFlow provides an elegant, fast, and secure environment to track tasks and achieve massive execution.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-base shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                Start for free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-background/50 backdrop-blur-sm border-border hover:bg-muted">
                I already have an account
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid sm:grid-cols-3 gap-6 w-full max-w-5xl mt-32"
        >
          <div className="flex flex-col p-6 bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Intuitive Dashboard</h3>
            <p className="text-muted-foreground leading-relaxed">Organize tasks with interactive filters, seamless status tracking, and a gorgeous, distraction-free UI.</p>
          </div>

          <div className="flex flex-col p-6 bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Bank-grade Security</h3>
            <p className="text-muted-foreground leading-relaxed">Your data is secured via robust JWT authentication, encrypted hashes, and HTTP-only protection.</p>
          </div>

          <div className="flex flex-col p-6 bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4 text-pink-600 dark:text-pink-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Lightning Fast Search</h3>
            <p className="text-muted-foreground leading-relaxed">Find any task immediately with real-time API integrations filtering right from your MongoDB cluster.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
