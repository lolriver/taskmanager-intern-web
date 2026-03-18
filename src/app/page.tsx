'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { LayoutGrid, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden selection:bg-primary/20">
      {/* Background blob directly matching login/register */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/3 w-[800px] h-[800px] opacity-20 pointer-events-none blur-[120px] bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full z-0" />

      {/* Navigation */}
      <nav className="w-full sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <LayoutGrid className="w-4 h-4 text-primary-foreground" />
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

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-32 z-10 w-full relative">
        {/* Hero */}
        <motion.div
           initial="hidden"
           animate="visible"
           variants={{
             hidden: { opacity: 0 },
             visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
           }}
           className="text-center max-w-3xl space-y-8"
        >
          <motion.h1 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] text-foreground mx-auto"
          >
            Ship your tasks with effortless precision.
          </motion.h1>

          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            The task manager designed for makers. Fast, secure, and elegantly simple. FocusFlow provides an optimal environment to track tasks and achieve massive execution.
          </motion.p>

          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
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
          </motion.div>
        </motion.div>

        {/* Product Demo */}
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
           className="w-full max-w-4xl mt-24 sm:mt-32"
           style={{ perspective: '1200px' }}
        >
          <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl p-2 sm:p-4 transform rotate-x-[2deg] transition-transform duration-700 hover:rotate-x-0 cursor-default">
            {/* The user can drop a video in public/demo.mp4 out-of-the-box later.
                For now we use the interactive Mockup HTML fallback. */}
            <div className="bg-[#0b0b12] rounded-xl overflow-hidden shadow-inner border border-white/10 ring-1 ring-white/5 relative">
              {/* Dashboard Mockup */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <div className="w-5 h-5 rounded-md bg-white text-black flex items-center justify-center"><CheckCircle2 className="w-3 h-3" /></div> FocusFlow
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/50 font-medium">Jane D.</span>
                  <div className="w-6 h-6 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/50">J</div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg leading-none font-bold text-white">Task Dashboard</h3>
                  <div className="bg-white text-black px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm">+ Create Task</div>
                </div>
                <div className="flex gap-3 mb-6 p-2 bg-white/5 border border-white/5 rounded-xl">
                  <div className="flex-1 bg-white/5 rounded-lg px-3 py-1.5 text-xs text-white/40 border border-transparent">Search by title...</div>
                  <div className="bg-white/5 rounded-lg px-3 py-1.5 text-xs text-white/40 w-28 text-center border border-transparent">All Statuses</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { title: "Design system audit", status: "✓ Completed", statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", desc: "Review color tokens and component consistency across all pages.", date: "Mar 14, 2026" },
                    { title: "API integration tests", status: "◔ In Progress", statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/20", desc: "Write end-to-end tests for task CRUD operations.", date: "Mar 16, 2026" },
                    { title: "User onboarding flow", status: "○ Pending", statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/20", desc: "Build the first-time user walkthrough experience.", date: "Mar 18, 2026" }
                  ].map((task, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all hover:bg-white/10">
                      <div className="flex justify-between items-start mb-3 pb-3 border-b border-white/5">
                        <span className="text-sm font-semibold text-white/90">{task.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${task.statusColor}`}>{task.status}</span>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed mb-4">{task.desc}</p>
                      <div className="text-[10px] text-white/30 font-medium">{task.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <div className="w-full max-w-5xl mt-32 space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-3 text-foreground">Everything you need</h2>
            <p className="text-muted-foreground">Powerful features wrapped in absolute simplicity.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: LayoutGrid, title: "Intuitive Dashboard", desc: "Organize tasks with filters, status tracking, and a clean interface that stays out of your way." },
              { icon: ShieldCheck, title: "Secure by Default", desc: "JWT authentication, encrypted hashes, and HTTP-only cookies protect every session tightly." },
              { icon: Zap, title: "Built for Speed", desc: "Optimistic updates and instant feedback. Your workflow never waits on the UI." }
            ].map((Feature, idx) => (
              <motion.div 
                key={idx}
                whileInView={{ opacity: 1, y: 0 }} 
                initial={{ opacity: 0, y: 30 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: 0.1 * idx }}
              >
                <Card className="h-full border-border/50 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-card">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                      <Feature.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{Feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {Feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/40 py-6 px-6 backdrop-blur-xl bg-background/80 z-10 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight text-sm">FocusFlow</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 FocusFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
