'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Sparkles, ArrowRight, BookOpen, Brain, Calendar, Compass, LayoutDashboard, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden selection:bg-primary/30">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-full h-[600px] bg-radial from-primary/10 via-transparent to-transparent opacity-60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-full h-[600px] bg-radial from-accent/10 via-transparent to-transparent opacity-60 blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-accent">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Nexora
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:brightness-110 text-white font-semibold rounded-xl">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-white/10 text-xs font-medium text-slate-300 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
            Empowering Academic Workflows
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white via-slate-100 to-slate-500 bg-clip-text text-transparent leading-none">
            The AI-Powered Academic Operating System
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Consolidate your lecture notes, organize your weekly schedule, track attendance, complete assignments, and collaborate in study groups—all accelerated by advanced AI tools.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:brightness-110 text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
                Create Free Account
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/10 bg-slate-900/50 hover:bg-slate-900 text-white hover:text-white rounded-xl py-3 px-8">
                Access Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          {[
            {
              icon: BookOpen,
              title: 'Structured Notes',
              desc: 'Write notes with folder support, tags, and pin features. Trigger AI summarization or flashcards instantly.',
            },
            {
              icon: Brain,
              title: 'AI Companion',
              desc: 'Generate customized study plans, take smart quizzes, perform semantic searches, and run document OCR.',
            },
            {
              icon: Calendar,
              title: 'Smart Timetable',
              desc: 'A robust grid schedule mapping subjects to weekly slots and calculating attendance requirements.',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="border border-white/5 bg-slate-900/40 backdrop-blur-lg rounded-2xl p-8 text-left hover:border-primary/20 hover:bg-slate-900/60 transition-all group"
            >
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-slate-950 border border-white/10 group-hover:border-primary/30 group-hover:bg-primary/10 transition-colors mb-6">
                <item.icon className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-white transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950 py-12 text-center text-slate-500 text-sm">
        <p>© 2026 Nexora. Production-Ready Academic Console.</p>
      </footer>
    </div>
  );
}
