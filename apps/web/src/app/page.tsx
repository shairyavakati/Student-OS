"use client";
import { useState, useEffect, useRef } from "react";
import {
  Home, BookOpen, Calendar, User, Bell, Search, Plus, Clock,
  CheckCircle, Star, Brain, BarChart2, ArrowLeft, Edit3,
  Mic, Tag, CheckSquare, ChevronRight, ChevronDown, Grid, List,
  FileText, Activity, TrendingUp, Award, Target, MessageSquare,
  Send, RefreshCw, WifiOff, Moon, Sun, Globe, Lock, LogOut,
  MoreVertical, Settings, Flame, X, Check, AlertCircle,
  GraduationCap, ArrowRight, Bookmark, ChevronLeft, Sparkles,
  Coffee, Trophy, Pencil, Timer, Filter, MapPin, Database, Play,
  Zap, Circle, BookMarked, Hash
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, Tooltip, RadialBarChart, RadialBar,
  PolarAngleAxis, Cell
} from "recharts";

// ─── DATA ────────────────────────────────────────────────────────────────────

const SUBJECTS = [
  { name: "Physics", code: "PHY-301", color: "#5B6CFF", room: "B-204", prof: "Dr. Sarah Mitchell" },
  { name: "Mathematics", code: "MAT-302", color: "#8A7BFF", room: "A-101", prof: "Prof. James Chen" },
  { name: "Computer Science", code: "CS-303", color: "#06B6D4", room: "Lab-3", prof: "Dr. Priya Sharma" },
  { name: "English Lit", code: "ENG-201", color: "#F59E0B", room: "C-305", prof: "Dr. Emily Watson" },
  { name: "Chemistry", code: "CHE-304", color: "#22C55E", room: "Lab-1", prof: "Prof. Michael Lee" },
];
const SC = (name: string) => SUBJECTS.find(s => s.name === name || name.startsWith(s.name.split(" ")[0]))?.color ?? "#5B6CFF";

const CLASSES_TODAY = [
  { time: "09:00 – 10:30", subject: "Physics", room: "B-204", type: "Lecture", status: "done" },
  { time: "11:00 – 12:30", subject: "Mathematics", room: "A-101", type: "Lecture", status: "now" },
  { time: "14:00 – 16:00", subject: "Computer Science", room: "Lab-3", type: "Lab", status: "next" },
  { time: "16:30 – 17:30", subject: "English Lit", room: "C-305", type: "Tutorial", status: "next" },
];

const ASSIGNMENTS = [
  { id: 1, title: "Quantum Mechanics Problem Set", subject: "Physics", due: "Tomorrow, 11:59 PM", priority: "high", done: false, progress: 60 },
  { id: 2, title: "Differential Equations Ch. 7–9", subject: "Mathematics", due: "Jul 15, 2026", priority: "medium", done: false, progress: 30 },
  { id: 3, title: "Binary Search Tree Implementation", subject: "Computer Science", due: "Jul 18, 2026", priority: "high", done: false, progress: 0 },
  { id: 4, title: "Essay: Modernist Literature", subject: "English Lit", due: "Jul 20, 2026", priority: "low", done: false, progress: 80 },
  { id: 5, title: "Organic Chemistry Lab Report", subject: "Chemistry", due: "Jul 22, 2026", priority: "medium", done: false, progress: 45 },
  { id: 6, title: "Wave Optics Analysis", subject: "Physics", due: "Jul 10, 2026", priority: "high", done: true, progress: 100 },
  { id: 7, title: "Integration Techniques Quiz", subject: "Mathematics", due: "Jul 9, 2026", priority: "medium", done: true, progress: 100 },
  { id: 8, title: "Sorting Algorithms Report", subject: "Computer Science", due: "Jul 8, 2026", priority: "low", done: true, progress: 100 },
];

const NOTES = [
  { id: 1, title: "Quantum Mechanics — Wave-Particle Duality", subject: "Physics", preview: "The wave-particle duality principle states that every particle exhibits both wave and particle properties…", tags: ["quantum", "exam"], pinned: true, date: "Jul 11", words: 847 },
  { id: 2, title: "Fourier Series & Transforms", subject: "Mathematics", preview: "A Fourier series decomposes periodic functions into the sum of simple sinusoidal components…", tags: ["calculus", "transform"], pinned: true, date: "Jul 10", words: 612 },
  { id: 3, title: "Graph Algorithms — Dijkstra & BFS", subject: "Computer Science", preview: "Dijkstra's algorithm finds shortest paths from a source to all nodes in a weighted graph…", tags: ["algorithms", "graphs"], pinned: false, date: "Jul 9", words: 1024 },
  { id: 4, title: "The Great Gatsby — Symbolism Analysis", subject: "English Lit", preview: "Fitzgerald uses the green light at the end of Daisy's dock as a symbol of Gatsby's unattainable dreams…", tags: ["literary", "essay"], pinned: false, date: "Jul 8", words: 489 },
  { id: 5, title: "Organic Reaction Mechanisms", subject: "Chemistry", preview: "Nucleophilic substitution reactions (SN1 and SN2) are fundamental to organic chemistry…", tags: ["organic", "reactions"], pinned: false, date: "Jul 7", words: 732 },
  { id: 6, title: "Special Theory of Relativity", subject: "Physics", preview: "Einstein's special relativity introduces time dilation and length contraction at relativistic speeds…", tags: ["relativity", "einstein"], pinned: false, date: "Jul 6", words: 918 },
];

const ATTENDANCE = [
  { subject: "Physics", short: "PHY", attended: 23, total: 25, color: "#5B6CFF" },
  { subject: "Mathematics", short: "MAT", attended: 21, total: 25, color: "#8A7BFF" },
  { subject: "Comp. Sci", short: "CS", attended: 22, total: 24, color: "#06B6D4" },
  { subject: "English Lit", short: "ENG", attended: 17, total: 22, color: "#F59E0B" },
  { subject: "Chemistry", short: "CHE", attended: 20, total: 23, color: "#22C55E" },
];

const STUDY_DATA = [
  { day: "Mon", hours: 3.5 }, { day: "Tue", hours: 4.2 }, { day: "Wed", hours: 2.8 },
  { day: "Thu", hours: 5.1 }, { day: "Fri", hours: 3.9 }, { day: "Sat", hours: 6.2 }, { day: "Sun", hours: 2.1 },
];

const WEEKLY_DATA = [
  { week: "W1", done: 4, pct: 92 }, { week: "W2", done: 6, pct: 88 },
  { week: "W3", done: 3, pct: 95 }, { week: "W4", done: 7, pct: 82 },
  { week: "W5", done: 5, pct: 90 }, { week: "W6", done: 8, pct: 87 },
];

const NOTIFS = [
  { id: 1, title: "Assignment Due Tomorrow", body: "Quantum Mechanics Problem Set due at 11:59 PM", time: "2m ago", read: false, type: "warn" },
  { id: 2, title: "Class Starting in 15 Minutes", body: "Mathematics lecture at Block A-101 starts at 11:00 AM", time: "13m ago", read: false, type: "info" },
  { id: 3, title: "New Grade Posted", body: "Wave Optics Analysis — A (92/100)", time: "1h ago", read: false, type: "success" },
  { id: 4, title: "Attendance Warning", body: "English Literature: 77%. Minimum 75% required.", time: "3h ago", read: true, type: "danger" },
  { id: 5, title: "Physics Exam in 3 Days", body: "Mid-term exam scheduled for July 15, 2026", time: "Yesterday", read: true, type: "exam" },
  { id: 6, title: "AI Study Plan Ready", body: "7-day study plan generated for Physics mid-term", time: "Yesterday", read: true, type: "ai" },
];

const TIMETABLE: Record<string, { time: string; subject: string; room: string; type: string }[]> = {
  Mon: [
    { time: "09:00 – 10:30", subject: "Physics", room: "B-204", type: "Lecture" },
    { time: "11:00 – 12:30", subject: "Mathematics", room: "A-101", type: "Lecture" },
    { time: "14:00 – 16:00", subject: "Computer Science", room: "Lab-3", type: "Lab" },
  ],
  Tue: [
    { time: "09:00 – 10:30", subject: "English Lit", room: "C-305", type: "Lecture" },
    { time: "11:00 – 13:00", subject: "Chemistry", room: "Lab-1", type: "Lab" },
    { time: "14:00 – 15:30", subject: "Mathematics", room: "A-101", type: "Tutorial" },
  ],
  Wed: [
    { time: "09:00 – 10:30", subject: "Physics", room: "B-204", type: "Lecture" },
    { time: "11:00 – 12:30", subject: "Computer Science", room: "CS-201", type: "Lecture" },
    { time: "15:00 – 16:00", subject: "Chemistry", room: "C-102", type: "Tutorial" },
  ],
  Thu: [
    { time: "10:00 – 11:30", subject: "Mathematics", room: "A-101", type: "Lecture" },
    { time: "13:00 – 14:30", subject: "English Lit", room: "C-305", type: "Seminar" },
    { time: "15:30 – 17:00", subject: "Physics", room: "B-204", type: "Tutorial" },
  ],
  Fri: [
    { time: "09:00 – 11:00", subject: "Computer Science", room: "Lab-3", type: "Lab" },
    { time: "11:30 – 13:00", subject: "Chemistry", room: "Lab-1", type: "Lecture" },
  ],
};

const AI_PROMPTS = [
  "Explain quantum entanglement",
  "Create a 7-day study plan for Physics",
  "Summarize my Fourier notes",
  "Generate 10 MCQs on Graph Algorithms",
  "Help with SN2 reaction mechanism",
  "Analyze Gatsby symbolism",
];
const AI_REPLIES: Record<string, string> = {
  "Explain quantum entanglement": "Quantum entanglement is a phenomenon where two or more particles become correlated so that the quantum state of each cannot be described independently. When you measure one particle, you instantly know the state of its entangled partner — regardless of distance. Einstein famously called this \"spooky action at a distance.\" 🔬\n\nWant me to generate practice questions on this topic?",
  "Create a 7-day study plan for Physics": "Here's your personalized 7-day Physics study plan for the mid-term:\n\n📅 Day 1: Mechanics review + 20 practice problems\n📅 Day 2: Electromagnetism fundamentals\n📅 Day 3: Wave optics + interference patterns\n📅 Day 4: Quantum mechanics basics\n📅 Day 5: Special relativity\n📅 Day 6: Mixed practice test (timed)\n📅 Day 7: Review weak areas + rest\n\nShall I generate flashcards for each topic? ✨",
  "Summarize my Fourier notes": "Based on your notes (612 words, Jul 10), here's a summary:\n\n🔑 Key Concepts:\n• Fourier Series decomposes periodic functions into sinusoidal components\n• Formula: f(x) = a₀/2 + Σ(aₙcos(nπx/L) + bₙsin(nπx/L))\n• Fourier Transform extends this to non-periodic functions\n• Applications: signal processing, image compression, quantum mechanics\n\nWant me to create flashcards from these notes? 🃏",
};

const AI_MSGS = [
  { role: "ai", text: "Hi! I'm your Nexora AI assistant. How can I help you today? 🎓" }
];

const CAL_EVENTS: Record<number, { type: string; label: string }[]> = {
  13: [{ type: "assignment", label: "Physics PS" }],
  15: [{ type: "exam", label: "Physics Mid-term" }],
  18: [{ type: "assignment", label: "CS Assignment" }],
  20: [{ type: "assignment", label: "English Essay" }],
  22: [{ type: "event", label: "Chemistry Lab Report" }],
  25: [{ type: "exam", label: "Mathematics Final" }],
  28: [{ type: "event", label: "Cultural Fest" }],
};

const ONBOARDING = [
  {
    emoji: "🎓",
    title: "All Your Academic Life\nIn One Place",
    desc: "Nexora brings your classes, notes, assignments, attendance, and study tools into a single beautiful workspace.",
    color: "#5B6CFF",
    bg: ["#5B6CFF", "#8A7BFF"],
  },
  {
    emoji: "🧠",
    title: "AI-Powered Study\nAssistant",
    desc: "Get instant explanations, generate quizzes, create study plans, and summarize your notes with an AI tutor built for students.",
    color: "#8A7BFF",
    bg: ["#8A7BFF", "#06B6D4"],
  },
  {
    emoji: "📊",
    title: "Track Progress,\nStay on Top",
    desc: "Monitor your attendance, assignment completion, and study hours with beautiful analytics designed to keep you motivated.",
    color: "#22C55E",
    bg: ["#22C55E", "#06B6D4"],
  },
];

// ─── COLOR FACTORY ──────────────────────────────────────────────────────────

const mk = (dark: boolean) => ({
  bg: dark ? "#0F172A" : "#F8FAFC",
  bg2: dark ? "#1E293B" : "#FFFFFF",
  card: dark ? "rgba(30,41,59,0.92)" : "rgba(255,255,255,0.92)",
  cardSolid: dark ? "#1E293B" : "#FFFFFF",
  text: dark ? "#F1F5F9" : "#0F172A",
  muted: dark ? "#94A3B8" : "#64748B",
  subtle: dark ? "#475569" : "#CBD5E1",
  border: dark ? "rgba(255,255,255,0.08)" : "rgba(91,108,255,0.1)",
  inputBg: dark ? "#1E293B" : "#F1F5F9",
  p: "#5B6CFF", a: "#8A7BFF", s: "#22C55E", w: "#F59E0B", d: "#EF4444", c: "#06B6D4",
});
type C = ReturnType<typeof mk>;

// ─── MICRO COMPONENTS ────────────────────────────────────────────────────────

const glass = (c: C): React.CSSProperties => ({
  background: c.card,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: `1px solid ${c.border}`,
  borderRadius: 20,
});

function Chip({ label, color, small }: { label: string; color: string; small?: boolean }) {
  return (
    <span style={{
      background: `${color}18`, color, fontSize: small ? 10 : 11,
      fontWeight: 700, padding: small ? "2px 7px" : "3px 10px",
      borderRadius: 20, textTransform: "uppercase" as const, letterSpacing: 0.4, whiteSpace: "nowrap" as const,
    }}>{label}</span>
  );
}

function PBar({ value, color, h = 6 }: { value: number; color: string; h?: number }) {
  return (
    <div style={{ height: h, background: `${color}20`, borderRadius: 99 }}>
      <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 99, transition: "width 0.5s ease" }} />
    </div>
  );
}

function Row({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ display: "flex", alignItems: "center", ...style }}>{children}</div>;
}

function Spacer({ h }: { h: number }) {
  return <div style={{ height: h }} />;
}

function SecHead({ title, action, c, onAction }: { title: string; action?: string; c: C; onAction?: () => void }) {
  return (
    <Row style={{ justifyContent: "space-between", marginBottom: 12 }}>
      <span style={{ fontSize: 17, fontWeight: 700, color: c.text, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{title}</span>
      {action && <button onClick={onAction} style={{ fontSize: 13, color: c.p, fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>{action}</button>}
    </Row>
  );
}

function BackBtn({ c, nav, target }: { c: C; nav: (s: string) => void; target: string }) {
  return (
    <button onClick={() => nav(target)} style={{ background: `${c.border.replace("0.08", "0.12").replace("0.1", "0.12")}`, border: `1px solid ${c.border}`, borderRadius: 12, padding: "6px 12px 6px 8px", display: "flex", alignItems: "center", gap: 4, cursor: "pointer", color: c.text, fontSize: 14, fontWeight: 600 }}>
      <ChevronLeft size={16} /> Back
    </button>
  );
}

// ─── BOTTOM NAV ──────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "dashboard", icon: Home, label: "Home" },
  { id: "timetable", icon: Clock, label: "Schedule" },
  { id: "notes", icon: BookOpen, label: "Notes" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
  { id: "profile", icon: User, label: "Profile" },
];

function BottomNav({ active, nav, c }: { active: string; nav: (s: string) => void; c: C }) {
  const tabId = NAV_ITEMS.find(n => n.id === active)?.id || "dashboard";
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
      background: c.card, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
      borderTop: `1px solid ${c.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-around",
      paddingBottom: 12, zIndex: 50,
    }}>
      {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
        const active2 = tabId === id;
        return (
          <button key={id} onClick={() => nav(id)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            background: "none", border: "none", cursor: "pointer",
            color: active2 ? c.p : c.muted, transition: "color 0.2s",
            padding: "4px 12px",
          }}>
            <div style={{
              padding: active2 ? "6px 16px" : "6px 8px",
              background: active2 ? `${c.p}18` : "transparent",
              borderRadius: 12, transition: "all 0.3s ease",
            }}>
              <Icon size={22} strokeWidth={active2 ? 2.5 : 1.8} />
            </div>
            <span style={{ fontSize: 10, fontWeight: active2 ? 700 : 500, letterSpacing: 0.2 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── PHONE FRAME ─────────────────────────────────────────────────────────────

function StatusBar({ c }: { c: C }) {
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 54,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 24px 0", zIndex: 90, pointerEvents: "none",
    }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: c.text, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>9:41</span>
      <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 110, height: 32, background: "#000", borderRadius: 20 }} />
      <Row style={{ gap: 6 }}>
        <Row style={{ gap: 1.5, alignItems: "flex-end" }}>
          {[3, 5, 7, 9].map((h, i) => (
            <div key={i} style={{ width: 3, height: h, background: c.text, borderRadius: 1, opacity: i < 3 ? 0.5 : 1 }} />
          ))}
        </Row>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 2C10.2 2 12.2 2.9 13.6 4.4L15 3C13.2 1.1 10.7 0 8 0C5.3 0 2.8 1.1 1 3L2.4 4.4C3.8 2.9 5.8 2 8 2Z" fill={c.text} opacity="0.4"/>
          <path d="M8 5C9.6 5 11 5.7 12 6.8L13.5 5.3C12 3.9 10.1 3 8 3C5.9 3 4 3.9 2.5 5.3L4 6.8C5 5.7 6.4 5 8 5Z" fill={c.text} opacity="0.7"/>
          <path d="M8 8C9 8 9.8 8.4 10.4 9L12 7.4C11 6.3 9.6 5.5 8 5.5C6.4 5.5 5 6.3 4 7.4L5.6 9C6.2 8.4 7 8 8 8Z" fill={c.text}/>
          <circle cx="8" cy="11" r="1.2" fill={c.text}/>
        </svg>
        <Row style={{ gap: 2 }}>
          <div style={{ width: 22, height: 11, border: `1.5px solid ${c.text}`, borderRadius: 3, padding: 1.5, display: "flex", alignItems: "center" }}>
            <div style={{ width: "78%", height: "100%", background: "#22C55E", borderRadius: 1 }} />
          </div>
          <div style={{ width: 2, height: 5, background: c.text, borderRadius: "0 1px 1px 0", opacity: 0.6 }} />
        </Row>
      </Row>
    </div>
  );
}

// ─── SCREENS ─────────────────────────────────────────────────────────────────

function SplashScreen({ nav }: { nav: (s: string) => void }) {
  useEffect(() => { const t = setTimeout(() => nav("onboarding"), 2200); return () => clearTimeout(t); }, []);
  return (
    <div style={{ height: "100%", background: "linear-gradient(160deg,#3B4FE8 0%,#5B6CFF 40%,#8A7BFF 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0 }}>
      <div style={{ animation: "pulse 2s infinite", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ width: 96, height: 96, background: "rgba(255,255,255,0.18)", borderRadius: 28, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(16px)", border: "1.5px solid rgba(255,255,255,0.3)", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
          <GraduationCap size={48} color="#fff" strokeWidth={1.5} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: -0.5 }}>Nexora</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", marginTop: 4, fontWeight: 500 }}>The Future of Student Productivity.</div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 60, display: "flex", gap: 8 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: i === 0 ? 24 : 8, height: 8, background: i === 0 ? "#fff" : "rgba(255,255,255,0.4)", borderRadius: 99, animation: i === 0 ? "none" : `pulse ${1 + i * 0.3}s infinite` }} />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.7} } @keyframes spin { to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}

function OnboardingScreen({ nav, c }: { nav: (s: string) => void; c: C }) {
  const [step, setStep] = useState(0);
  const ob = ONBOARDING[step];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: c.bg }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px 0", gap: 0 }}>
        <div style={{
          width: 200, height: 200, borderRadius: 48, marginBottom: 32,
          background: `linear-gradient(135deg, ${ob.bg[0]}25, ${ob.bg[1]}15)`,
          border: `1.5px solid ${ob.bg[0]}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          <div style={{ position: "absolute", inset: 20, background: `linear-gradient(135deg, ${ob.bg[0]}40, ${ob.bg[1]}30)`, borderRadius: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 72 }}>{ob.emoji}</span>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: c.text, fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1.2, whiteSpace: "pre-line" }}>{ob.title}</div>
          <div style={{ fontSize: 15, color: c.muted, marginTop: 14, lineHeight: 1.6 }}>{ob.desc}</div>
        </div>
      </div>
      <div style={{ padding: "32px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
        <Row style={{ justifyContent: "center", gap: 8 }}>
          {ONBOARDING.map((_, i) => (
            <div key={i} style={{ width: i === step ? 28 : 8, height: 8, borderRadius: 99, background: i === step ? ob.color : `${ob.color}30`, transition: "all 0.3s ease" }} />
          ))}
        </Row>
        <button
          onClick={() => step < 2 ? setStep(s => s + 1) : nav("login")}
          style={{ width: "100%", padding: "16px", borderRadius: 18, background: `linear-gradient(135deg, ${ob.bg[0]}, ${ob.bg[1]})`, color: "#fff", border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", boxShadow: `0 8px 30px ${ob.color}40` }}>
          {step < 2 ? "Continue" : "Get Started"}
        </button>
        <button onClick={() => nav("login")} style={{ background: "none", border: "none", color: c.muted, fontSize: 14, fontWeight: 500, cursor: "pointer", padding: "4px" }}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

const API_BASE = ""; // Use Next.js API proxy routes to avoid CORS

function LoginScreen({ nav, c }: { nav: (s: string) => void; c: C }) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot" | "otp">("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputStyle: React.CSSProperties = { width: "100%", padding: "14px 16px", borderRadius: 14, background: c.inputBg, border: `1.5px solid ${c.border}`, color: c.text, fontSize: 15, outline: "none", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" as const };

  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    setError("");
    setEmail("");
    setPass("");
    setFullName("");
  };

  const handleSubmit = async () => {
    setError("");
    if (!email.trim() || !pass.trim()) { setError("Please fill in all fields."); return; }
    if (mode === "signup" && !fullName.trim()) { setError("Please enter your full name."); return; }
    setLoading(true);
    try {
      if (mode === "signup") {
        const res = await fetch(`/api/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: pass, full_name: fullName, semester: 1, department: "General" }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Signup failed");
        // Auto-login after signup
        const loginRes = await fetch(`/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: pass }),
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(loginData.detail || "Login after signup failed");
        localStorage.setItem("nexora_token", loginData.access_token);
        nav("dashboard");
      } else {
        const res = await fetch(`/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: pass }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Login failed");
        localStorage.setItem("nexora_token", data.access_token);
        nav("dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (mode === "otp") return (
    <div style={{ height: "100%", background: c.bg, padding: "60px 28px 32px", display: "flex", flexDirection: "column" }}>
      <button onClick={() => setMode("login")} style={{ background: "none", border: "none", color: c.muted, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 14, marginBottom: 32, padding: 0 }}><ChevronLeft size={16} /> Back</button>
      <div style={{ fontSize: 11, fontWeight: 700, color: c.p, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Verification</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: c.text, fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 8 }}>Enter OTP</div>
      <div style={{ fontSize: 14, color: c.muted, marginBottom: 36 }}>We sent a 6-digit code to {email}</div>
      <Row style={{ gap: 10, justifyContent: "center", marginBottom: 36 }}>
        {otp.map((v, i) => (
          <div key={i} style={{ width: 46, height: 56, borderRadius: 14, background: v ? `${c.p}15` : c.inputBg, border: `1.5px solid ${v ? c.p : c.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: c.p }}>
            {v || <div style={{ width: 2, height: 20, background: c.border, borderRadius: 1 }} />}
          </div>
        ))}
      </Row>
      <button onClick={() => nav("dashboard")} style={{ width: "100%", padding: 16, borderRadius: 18, background: `linear-gradient(135deg, ${c.p}, ${c.a})`, color: "#fff", border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", boxShadow: `0 8px 30px ${c.p}40` }}>
        Verify & Continue
      </button>
    </div>
  );

  if (mode === "forgot") return (
    <div style={{ height: "100%", background: c.bg, padding: "60px 28px 32px", display: "flex", flexDirection: "column" }}>
      <button onClick={() => setMode("login")} style={{ background: "none", border: "none", color: c.muted, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 14, marginBottom: 32, padding: 0 }}><ChevronLeft size={16} /> Back to Login</button>
      <div style={{ fontSize: 11, fontWeight: 700, color: c.p, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Password Reset</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: c.text, fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 8 }}>Forgot Password?</div>
      <div style={{ fontSize: 14, color: c.muted, marginBottom: 32 }}>No worries — we'll send reset instructions to your email.</div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: c.muted, display: "block", marginBottom: 8 }}>University Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="you@university.edu" />
      </div>
      <button onClick={() => setMode("otp")} style={{ width: "100%", padding: 16, borderRadius: 18, background: `linear-gradient(135deg, ${c.p}, ${c.a})`, color: "#fff", border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", boxShadow: `0 8px 30px ${c.p}40` }}>
        Send Reset Code
      </button>
    </div>
  );

  return (
    <div style={{ height: "100%", background: c.bg, overflowY: "auto", scrollbarWidth: "none" }}>
      <div style={{ height: 180, background: `linear-gradient(160deg, ${c.p}E0, ${c.a}E0)`, display: "flex", alignItems: "flex-end", padding: "0 28px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, background: "rgba(255,255,255,0.08)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: 20, right: 40, width: 80, height: 80, background: "rgba(255,255,255,0.06)", borderRadius: "50%" }} />
        <div>
          <Row style={{ gap: 8, marginBottom: 6 }}>
            <GraduationCap size={20} color="#fff" />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>Nexora</span>
          </Row>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            {mode === "login" ? "Welcome back 👋" : "Create account ✨"}
          </div>
        </div>
      </div>
      <div style={{ padding: "28px 28px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
        <Row style={{ background: c.inputBg, borderRadius: 14, padding: 4, gap: 2 }}>
          {(["login", "signup"] as const).map(m => (
            <button key={m} onClick={() => switchMode(m)} style={{ flex: 1, padding: "10px", borderRadius: 11, background: mode === m ? c.p : "transparent", color: mode === m ? "#fff" : c.muted, border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </Row>

        {error && (
          <div style={{ padding: "12px 14px", borderRadius: 12, background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: 13, fontWeight: 500 }}>
            ⚠️ {error}
          </div>
        )}
        {mode === "signup" && (
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: c.muted, display: "block", marginBottom: 8 }}>Full Name</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} placeholder="Your full name" />
          </div>
        )}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: c.muted, display: "block", marginBottom: 8 }}>University Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="you@university.edu" />
        </div>
        <div>
          <Row style={{ justifyContent: "space-between", marginBottom: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: c.muted }}>Password</label>
            {mode === "login" && <button onClick={() => setMode("forgot")} style={{ fontSize: 13, color: c.p, background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 600 }}>Forgot?</button>}
          </Row>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} style={inputStyle} placeholder="••••••••" />
        </div>
        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: 16, borderRadius: 18, background: loading ? c.muted : `linear-gradient(135deg, ${c.p}, ${c.a})`, color: "#fff", border: "none", fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", boxShadow: loading ? "none" : `0 8px 30px ${c.p}40`, transition: "all 0.2s", opacity: loading ? 0.7 : 1 }}>
          {loading ? (mode === "login" ? "Signing in…" : "Creating account…") : (mode === "login" ? "Sign In to Nexora" : "Create Account")}
        </button>

        <Row style={{ gap: 12, alignItems: "center" }}>
          <div style={{ flex: 1, height: 1, background: c.border }} />
          <span style={{ fontSize: 12, color: c.muted }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: c.border }} />
        </Row>
        <Row style={{ gap: 12 }}>
          {[
            { label: "Google", bg: "#fff", border: "#e5e7eb", emoji: "G" },
            { label: "Apple", bg: c.cardSolid, border: c.border, emoji: "" },
          ].map(({ label, bg, border, emoji }) => (
            <button key={label} style={{ flex: 1, padding: "12px", borderRadius: 14, background: bg, border: `1.5px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, color: c.text }}>
              {label === "Apple" ? <span style={{ fontSize: 16 }}></span> : <span style={{ fontSize: 14, fontWeight: 800, color: "#4285F4" }}>G</span>}
              {label}
            </button>
          ))}
        </Row>
      </div>
    </div>
  );
}

function DashboardScreen({ nav, c }: { nav: (s: string) => void; c: C }) {
  const overallAtt = Math.round(ATTENDANCE.reduce((s, a) => s + a.attended / a.total, 0) / ATTENDANCE.length * 100);
  const pending = ASSIGNMENTS.filter(a => !a.done).length;
  return (
    <div style={{ paddingBottom: 90, background: c.bg, minHeight: "100%" }}>
      {/* Hero header */}
      <div style={{ background: `linear-gradient(160deg, ${c.p}F0 0%, ${c.a}D0 100%)`, padding: "60px 20px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 180, height: 180, background: "rgba(255,255,255,0.07)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -50, right: 40, width: 120, height: 120, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
        <Row style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 500, marginBottom: 4 }}>Sunday, July 12, 2026</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Good morning,</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif", marginTop: -2 }}>Alex 👋</div>
          </div>
          <Row style={{ gap: 8 }}>
            <button onClick={() => nav("search")} style={{ width: 40, height: 40, borderRadius: 14, background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Search size={18} color="#fff" />
            </button>
            <button onClick={() => nav("notifications")} style={{ width: 40, height: 40, borderRadius: 14, background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
              <Bell size={18} color="#fff" />
              <div style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, background: "#F59E0B", borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.5)" }} />
            </button>
          </Row>
        </Row>
        {/* Quick stats row */}
        <Row style={{ gap: 10, marginTop: 20 }}>
          {[
            { label: "Classes Today", value: "4", sub: "1 ongoing", icon: Clock, color: "#fff" },
            { label: "Attendance", value: `${overallAtt}%`, sub: "Overall", icon: CheckCircle, color: "#fff" },
            { label: "Study Streak", value: "12", sub: "days 🔥", icon: Flame, color: "#fff" },
          ].map(({ label, value, sub, icon: Icon }) => (
            <div key={label} style={{ flex: 1, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", borderRadius: 16, padding: "12px 10px", border: "1px solid rgba(255,255,255,0.2)" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{value}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{label}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{sub}</div>
            </div>
          ))}
        </Row>
      </div>

      <div style={{ padding: "20px 16px 0" }}>
        {/* Today's Schedule */}
        <SecHead title="Today's Schedule" action="Full Timetable" c={c} onAction={() => nav("timetable")} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {CLASSES_TODAY.map((cl, i) => {
            const color = SC(cl.subject);
            const isNow = cl.status === "now";
            return (
              <div key={i} style={{ ...glass(c), padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, border: isNow ? `1.5px solid ${color}50` : `1px solid ${c.border}`, background: isNow ? `${color}10` : c.card }}>
                <div style={{ width: 4, height: 44, background: color, borderRadius: 4, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <Row style={{ justifyContent: "space-between" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: c.text }}>{cl.subject}</span>
                    {isNow && <Chip label="Now" color={color} small />}
                    {cl.status === "done" && <Chip label="Done" color={c.s} small />}
                    {cl.status === "next" && <Chip label="Upcoming" color={c.muted} small />}
                  </Row>
                  <Row style={{ gap: 8, marginTop: 3 }}>
                    <span style={{ fontSize: 12, color: c.muted }}>{cl.time}</span>
                    <span style={{ width: 3, height: 3, borderRadius: "50%", background: c.subtle }} />
                    <span style={{ fontSize: 12, color: c.muted }}>{cl.room}</span>
                    <span style={{ width: 3, height: 3, borderRadius: "50%", background: c.subtle }} />
                    <span style={{ fontSize: 12, color: c.muted }}>{cl.type}</span>
                  </Row>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <SecHead title="Quick Actions" c={c} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
          {[
            { label: "Notes", icon: BookOpen, color: c.p, screen: "notes" },
            { label: "Tasks", icon: CheckSquare, color: c.a, screen: "assignments" },
            { label: "Attendance", icon: BarChart2, color: c.s, screen: "attendance" },
            { label: "AI Study", icon: Brain, color: "#F97316", screen: "ai" },
            { label: "Analytics", icon: TrendingUp, color: c.c, screen: "analytics" },
            { label: "Calendar", icon: Calendar, color: c.w, screen: "calendar" },
            { label: "Search", icon: Search, color: c.muted, screen: "search" },
            { label: "Settings", icon: Settings, color: c.muted, screen: "settings" },
          ].map(({ label, icon: Icon, color, screen }) => (
            <button key={label} onClick={() => nav(screen)} style={{ background: c.cardSolid, border: `1px solid ${c.border}`, borderRadius: 16, padding: "14px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={20} color={color} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: c.text }}>{label}</span>
            </button>
          ))}
        </div>

        {/* AI Assistant Card */}
        <div onClick={() => nav("ai")} style={{ borderRadius: 20, background: `linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`, padding: "20px", marginBottom: 24, cursor: "pointer", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, background: `${c.p}20`, borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: -30, right: 30, width: 80, height: 80, background: `${c.a}15`, borderRadius: "50%" }} />
          <Row style={{ gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: `linear-gradient(135deg, ${c.p}, ${c.a})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 8px 24px ${c.p}50` }}>
              <Brain size={24} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>AI Study Assistant</span>
                <Chip label="Pro" color={c.a} small />
              </Row>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 4, lineHeight: 1.5 }}>
                Physics exam in 3 days. Tap to start your personalized study session.
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                {["Study Plan", "Quiz Me", "Summarize"].map(t => (
                  <span key={t} style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.9)", fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.15)" }}>{t}</span>
                ))}
              </div>
            </div>
          </Row>
        </div>

        {/* Upcoming Assignments */}
        <SecHead title="Due Soon" action="All Tasks" c={c} onAction={() => nav("assignments")} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {ASSIGNMENTS.filter(a => !a.done).slice(0, 3).map(a => {
            const pc = { high: c.d, medium: c.w, low: c.s }[a.priority] || c.p;
            return (
              <div key={a.id} style={{ ...glass(c), padding: "14px 16px" }}>
                <Row style={{ justifyContent: "space-between", marginBottom: 8 }}>
                  <Chip label={a.priority} color={pc} small />
                  <span style={{ fontSize: 12, color: c.muted }}>{a.due}</span>
                </Row>
                <div style={{ fontSize: 14, fontWeight: 600, color: c.text, marginBottom: 4 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: SC(a.subject), fontWeight: 600, marginBottom: 10 }}>{a.subject}</div>
                <Row style={{ gap: 10, alignItems: "center" }}>
                  <div style={{ flex: 1 }}><PBar value={a.progress} color={SC(a.subject)} h={5} /></div>
                  <span style={{ fontSize: 11, color: c.muted, fontWeight: 600, minWidth: 28 }}>{a.progress}%</span>
                </Row>
              </div>
            );
          })}
        </div>

        {/* Exam Alert */}
        <div style={{ borderRadius: 20, background: `${c.d}12`, border: `1px solid ${c.d}30`, padding: "16px", marginBottom: 24 }}>
          <Row style={{ gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: `${c.d}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertCircle size={22} color={c.d} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: c.text }}>Physics Mid-term in 3 days</div>
              <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>July 15, 2026 — Block B Examination Hall</div>
            </div>
            <ChevronRight size={16} color={c.muted} />
          </Row>
        </div>

        {/* Recent Notes */}
        <SecHead title="Recent Notes" action="All Notes" c={c} onAction={() => nav("notes")} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {NOTES.slice(0, 2).map(n => (
            <div key={n.id} onClick={() => nav("note-editor")} style={{ ...glass(c), padding: "14px 16px", cursor: "pointer" }}>
              <Row style={{ justifyContent: "space-between", marginBottom: 6 }}>
                <Chip label={n.subject} color={SC(n.subject)} small />
                <span style={{ fontSize: 11, color: c.muted }}>{n.date}</span>
              </Row>
              <div style={{ fontSize: 14, fontWeight: 700, color: c.text, marginBottom: 4 }}>{n.title}</div>
              <div style={{ fontSize: 12, color: c.muted, lineHeight: 1.5 }}>{n.preview.slice(0, 80)}…</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimetableScreen({ nav, c }: { nav: (s: string) => void; c: C }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const [activeDay, setActiveDay] = useState("Mon");
  const classes = TIMETABLE[activeDay] || [];
  return (
    <div style={{ paddingBottom: 90, background: c.bg, minHeight: "100%" }}>
      <div style={{ background: `linear-gradient(160deg, ${c.p}E0, ${c.a}D0)`, padding: "60px 20px 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Schedule</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Weekly Timetable</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>Semester 5 — Computer Science</div>
      </div>
      {/* Day selector */}
      <div style={{ padding: "16px 16px 0", overflowX: "auto", scrollbarWidth: "none", display: "flex", gap: 10 }}>
        {days.map(d => {
          const active = d === activeDay;
          return (
            <button key={d} onClick={() => setActiveDay(d)} style={{ flexShrink: 0, padding: "10px 20px", borderRadius: 14, background: active ? c.p : c.cardSolid, color: active ? "#fff" : c.muted, border: `1px solid ${active ? "transparent" : c.border}`, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", boxShadow: active ? `0 4px 16px ${c.p}40` : "none", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              {d}
              {d === "Mon" && <div style={{ width: 4, height: 4, borderRadius: "50%", background: active ? "rgba(255,255,255,0.7)" : c.p, margin: "4px auto 0" }} />}
            </button>
          );
        })}
      </div>

      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {classes.map((cl, i) => {
            const color = SC(cl.subject);
            const isFirst = i === 0 && activeDay === "Mon";
            return (
              <div key={i} style={{ display: "flex", gap: 12 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: isFirst ? color : c.border, border: `2px solid ${isFirst ? color : c.subtle}`, flexShrink: 0 }} />
                  {i < classes.length - 1 && <div style={{ width: 2, flex: 1, background: `linear-gradient(to bottom, ${color}60, transparent)`, minHeight: 40, margin: "4px 0" }} />}
                </div>
                <div style={{ flex: 1, ...glass(c), padding: "14px 16px", border: isFirst ? `1.5px solid ${color}40` : `1px solid ${c.border}` }}>
                  <Row style={{ justifyContent: "space-between", marginBottom: 6 }}>
                    <Chip label={cl.type} color={color} small />
                    <span style={{ fontSize: 12, color: c.muted, fontWeight: 600 }}>{cl.time}</span>
                  </Row>
                  <div style={{ fontSize: 16, fontWeight: 700, color: c.text, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{cl.subject}</div>
                  <Row style={{ gap: 6, marginTop: 6 }}>
                    <MapPin size={12} color={c.muted} />
                    <span style={{ fontSize: 12, color: c.muted }}>{cl.room}</span>
                    <span style={{ fontSize: 12, color: color, fontWeight: 600, marginLeft: "auto" }}>
                      {SUBJECTS.find(s => s.name === cl.subject)?.prof}
                    </span>
                  </Row>
                </div>
              </div>
            );
          })}
          {classes.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: c.text, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>No Classes!</div>
              <div style={{ fontSize: 14, color: c.muted, marginTop: 4 }}>Enjoy your free day</div>
            </div>
          )}
        </div>

        {/* Legend */}
        <Spacer h={20} />
        <SecHead title="Subjects" c={c} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {SUBJECTS.map(s => (
            <Row key={s.name} style={{ gap: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: 4, background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: c.text, flex: 1 }}>{s.name}</span>
              <span style={{ fontSize: 12, color: c.muted }}>{s.code}</span>
            </Row>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotesScreen({ nav, c }: { nav: (s: string) => void; c: C }) {
  const [isGrid, setIsGrid] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSubj, setFilterSubj] = useState("All");
  const pinned = NOTES.filter(n => n.pinned);
  const subjects = ["All", ...SUBJECTS.map(s => s.name)];
  const filtered = NOTES.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
    const matchSubj = filterSubj === "All" || n.subject === filterSubj;
    return matchSearch && matchSubj;
  });
  return (
    <div style={{ background: c.bg, minHeight: "100%", paddingBottom: 100 }}>
      <div style={{ background: `linear-gradient(160deg, ${c.p}E0, ${c.a}D0)`, padding: "60px 20px 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Knowledge Base</div>
        <Row style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>My Notes</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{NOTES.length} notes across {SUBJECTS.length} subjects</div>
          </div>
          <Row style={{ gap: 8 }}>
            <button onClick={() => setIsGrid(true)} style={{ width: 36, height: 36, borderRadius: 10, background: isGrid ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Grid size={16} color="#fff" />
            </button>
            <button onClick={() => setIsGrid(false)} style={{ width: 36, height: 36, borderRadius: 10, background: !isGrid ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <List size={16} color="#fff" />
            </button>
          </Row>
        </Row>
        <div style={{ marginTop: 16, display: "flex", gap: 10, background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.2)", alignItems: "center" }}>
          <Search size={16} color="rgba(255,255,255,0.8)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes, tags, subjects…" style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 14, flex: 1 }} />
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {/* Subject filter pills */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 8, marginBottom: 16 }}>
          {subjects.map(s => {
            const active = s === filterSubj;
            const color = s === "All" ? c.p : SC(s);
            return (
              <button key={s} onClick={() => setFilterSubj(s)} style={{ flexShrink: 0, padding: "7px 16px", borderRadius: 20, background: active ? color : `${color}12`, color: active ? "#fff" : color, border: `1px solid ${active ? "transparent" : `${color}30`}`, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                {s === "All" ? "All Notes" : s.split(" ")[0]}
              </button>
            );
          })}
        </div>

        {/* Pinned */}
        {filterSubj === "All" && !search && (
          <>
            <SecHead title="📌 Pinned" c={c} />
            <div style={{ display: "grid", gridTemplateColumns: isGrid ? "1fr 1fr" : "1fr", gap: 12, marginBottom: 20 }}>
              {pinned.map(n => <NoteCard key={n.id} note={n} c={c} isGrid={isGrid} nav={nav} />)}
            </div>
            <SecHead title="All Notes" c={c} />
          </>
        )}
        <div style={{ display: "grid", gridTemplateColumns: isGrid ? "1fr 1fr" : "1fr", gap: 12 }}>
          {filtered.filter(n => filterSubj !== "All" || search || !n.pinned).map(n => <NoteCard key={n.id} note={n} c={c} isGrid={isGrid} nav={nav} />)}
        </div>
      </div>

      {/* FAB */}
      <button onClick={() => nav("note-editor")} style={{ position: "fixed", bottom: 96, right: 24, width: 56, height: 56, borderRadius: 20, background: `linear-gradient(135deg, ${c.p}, ${c.a})`, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: `0 8px 30px ${c.p}60`, zIndex: 40 }}>
        <Plus size={26} color="#fff" />
      </button>
    </div>
  );
}

function NoteCard({ note: n, c, isGrid, nav }: { note: typeof NOTES[0]; c: C; isGrid: boolean; nav: (s: string) => void }) {
  const color = SC(n.subject);
  return (
    <div onClick={() => nav("note-editor")} style={{ ...glass(c), padding: isGrid ? "14px" : "14px 16px", cursor: "pointer", borderLeft: `3px solid ${color}` }}>
      <Row style={{ justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap" as const, gap: 4 }}>
        <Chip label={n.subject.split(" ")[0]} color={color} small />
        <span style={{ fontSize: 11, color: c.muted }}>{n.date}</span>
      </Row>
      <div style={{ fontSize: isGrid ? 13 : 14, fontWeight: 700, color: c.text, marginBottom: 6, lineHeight: 1.3, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{n.title}</div>
      {!isGrid && <div style={{ fontSize: 12, color: c.muted, lineHeight: 1.5, marginBottom: 8 }}>{n.preview.slice(0, 100)}…</div>}
      <Row style={{ gap: 6, marginTop: isGrid ? 8 : 0 }}>
        <FileText size={12} color={c.muted} />
        <span style={{ fontSize: 11, color: c.muted }}>{n.words} words</span>
      </Row>
    </div>
  );
}

function NoteEditorScreen({ nav, c }: { nav: (s: string) => void; c: C }) {
  const note = NOTES[0];
  const [title, setTitle] = useState(note.title);
  const tools = [
    { icon: "B", action: "bold" }, { icon: "I", action: "italic" }, { icon: "H", action: "heading" },
    { icon: "•", action: "list" }, { icon: "✓", action: "checklist" },
  ];
  return (
    <div style={{ background: c.bg, minHeight: "100%", paddingBottom: 40 }}>
      {/* Top bar */}
      <div style={{ padding: "60px 16px 12px", background: c.bg, borderBottom: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <BackBtn c={c} nav={nav} target="notes" />
        <Row style={{ gap: 8 }}>
          <button style={{ width: 36, height: 36, borderRadius: 10, background: `${c.p}15`, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Mic size={16} color={c.p} />
          </button>
          <button style={{ padding: "8px 16px", borderRadius: 12, background: c.p, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Save</button>
        </Row>
      </div>

      {/* Rich text toolbar */}
      <div style={{ padding: "10px 16px", background: c.cardSolid, borderBottom: `1px solid ${c.border}`, display: "flex", gap: 4, overflowX: "auto", scrollbarWidth: "none" }}>
        {["B", "I", "U", "H1", "—", "• List", "✓ Check", "🖼 Image", "# Tag", "🔗"].map((t, i) => (
          <button key={i} style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 8, background: `${c.p}12`, border: "none", color: c.p, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: "20px 20px" }}>
        <Row style={{ gap: 8, marginBottom: 12 }}>
          <Chip label={note.subject} color={SC(note.subject)} />
          <Chip label="exam" color={c.p} />
          <Chip label="quantum" color={c.a} />
        </Row>
        <input value={title} onChange={e => setTitle(e.target.value)} style={{ width: "100%", fontSize: 22, fontWeight: 800, color: c.text, background: "none", border: "none", outline: "none", fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 8 }} />
        <div style={{ fontSize: 12, color: c.muted, marginBottom: 20 }}>Last edited Jul 11, 2026 · 847 words</div>

        <div style={{ fontSize: 14, color: c.text, lineHeight: 1.8 }}>
          <p style={{ marginBottom: 16 }}>The <strong>wave-particle duality</strong> principle is one of the most profound concepts in quantum mechanics. It states that every particle or quantum entity can exhibit both wave-like and particle-like properties.</p>
          <div style={{ borderLeft: `3px solid ${c.p}`, paddingLeft: 16, marginBottom: 16, fontStyle: "italic", color: c.muted }}>
            "Not only is the universe stranger than we think, it is stranger than we can think." — Werner Heisenberg
          </div>
          <p style={{ marginBottom: 16, fontWeight: 700 }}>Key Concepts:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {["de Broglie wavelength: λ = h/p where h is Planck's constant", "Double-slit experiment demonstrates interference patterns", "Measurement collapses the wave function (Copenhagen interpretation)", "Heisenberg uncertainty principle: Δx·Δp ≥ ℏ/2"].map((item, i) => (
              <Row key={i} style={{ gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: `${c.s}20`, border: `1.5px solid ${c.s}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <Check size={12} color={c.s} />
                </div>
                <span style={{ fontSize: 13, color: c.text, lineHeight: 1.5 }}>{item}</span>
              </Row>
            ))}
          </div>
          <div style={{ background: `${c.p}10`, borderRadius: 14, padding: "14px 16px", border: `1px solid ${c.p}25` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: c.p, marginBottom: 6 }}>📝 Exam Note</div>
            <div style={{ fontSize: 13, color: c.text, lineHeight: 1.5 }}>Focus on deriving the de Broglie wavelength equation and explaining the double-slit experiment setup.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssignmentsScreen({ nav, c }: { nav: (s: string) => void; c: C }) {
  const [tab, setTab] = useState<"upcoming" | "pending" | "completed">("upcoming");
  const pending = ASSIGNMENTS.filter(a => !a.done && a.progress < 100);
  const upcoming = pending.filter(a => a.due.includes("Tomorrow") || a.due.includes("Jul 1"));
  const completed = ASSIGNMENTS.filter(a => a.done);
  const shown = tab === "upcoming" ? pending : tab === "completed" ? completed : pending;
  return (
    <div style={{ background: c.bg, minHeight: "100%", paddingBottom: 90 }}>
      <div style={{ background: `linear-gradient(160deg, ${c.a}E0, #8B5CF6D0)`, padding: "60px 20px 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Task Manager</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Assignments</div>
        <Row style={{ gap: 16, marginTop: 12 }}>
          {[{ label: "Pending", n: pending.length, color: c.w }, { label: "Completed", n: completed.length, color: c.s }].map(({ label, n, color }) => (
            <div key={label} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "8px 16px" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{n}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>{label}</div>
            </div>
          ))}
        </Row>
      </div>

      {/* Tab bar */}
      <div style={{ padding: "16px 16px 0", display: "flex", gap: 0, background: c.cardSolid, borderBottom: `1px solid ${c.border}` }}>
        {(["upcoming", "pending", "completed"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "12px 0", background: "none", border: "none", borderBottom: tab === t ? `2px solid ${c.p}` : "2px solid transparent", color: tab === t ? c.p : c.muted, fontSize: 13, fontWeight: 700, cursor: "pointer", textTransform: "capitalize" as const, transition: "all 0.2s" }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px" }}>
        {shown.map(a => {
          const pc = { high: c.d, medium: c.w, low: c.s }[a.priority] || c.p;
          const color = SC(a.subject);
          return (
            <div key={a.id} style={{ ...glass(c), padding: "16px", marginBottom: 12, borderLeft: `3px solid ${pc}` }}>
              <Row style={{ justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap" as const, gap: 6 }}>
                <Row style={{ gap: 6 }}>
                  <Chip label={a.priority} color={pc} small />
                  <Chip label={a.subject.split(" ")[0]} color={color} small />
                </Row>
                <Row style={{ gap: 6 }}>
                  {a.done && <CheckCircle size={16} color={c.s} />}
                  <span style={{ fontSize: 11, color: a.due.includes("Tomorrow") ? c.d : c.muted, fontWeight: a.due.includes("Tomorrow") ? 700 : 500 }}>{a.due}</span>
                </Row>
              </Row>
              <div style={{ fontSize: 15, fontWeight: 700, color: c.text, marginBottom: 10, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{a.title}</div>
              <Row style={{ gap: 10, alignItems: "center" }}>
                <div style={{ flex: 1 }}><PBar value={a.progress} color={color} h={6} /></div>
                <span style={{ fontSize: 12, fontWeight: 700, color: color, minWidth: 32 }}>{a.progress}%</span>
              </Row>
            </div>
          );
        })}
      </div>
      <button onClick={() => nav("dashboard")} style={{ position: "fixed", bottom: 96, right: 24, width: 56, height: 56, borderRadius: 20, background: `linear-gradient(135deg, ${c.a}, #8B5CF6)`, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: `0 8px 30px ${c.a}60`, zIndex: 40 }}>
        <Plus size={26} color="#fff" />
      </button>
    </div>
  );
}

function AttendanceScreen({ nav, c }: { nav: (s: string) => void; c: C }) {
  const overall = Math.round(ATTENDANCE.reduce((s, a) => s + a.attended / a.total, 0) / ATTENDANCE.length * 100);
  const radialData = [{ value: overall, fill: c.p }];
  return (
    <div style={{ background: c.bg, minHeight: "100%", paddingBottom: 90 }}>
      <div style={{ background: `linear-gradient(160deg, ${c.s}D0, ${c.c}C0)`, padding: "60px 20px 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Attendance Tracker</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Attendance</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>Semester 5 — July 2026</div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        {/* Overall donut */}
        <div style={{ ...glass(c), padding: "20px", marginBottom: 20, textAlign: "center" as const }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: c.text, marginBottom: 4 }}>Overall Attendance</div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative", height: 160 }}>
            <ResponsiveContainer width="100%" height={160}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" barSize={14} data={radialData} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background={{ fill: `${c.p}18` }} dataKey="value" cornerRadius={8} fill={c.p} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: c.p, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{overall}%</div>
              <div style={{ fontSize: 12, color: c.muted }}>Overall</div>
            </div>
          </div>
          <Row style={{ justifyContent: "center", gap: 24, marginTop: 8 }}>
            {[{ label: "Min Required", value: "75%" }, { label: "Safe Zone", value: "85%+" }].map(({ label, value }) => (
              <div key={label} style={{ textAlign: "center" as const }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: c.text }}>{value}</div>
                <div style={{ fontSize: 11, color: c.muted }}>{label}</div>
              </div>
            ))}
          </Row>
        </div>

        {/* Subject-wise */}
        <SecHead title="Subject-wise Breakdown" c={c} />
        <div style={{ ...glass(c), padding: "16px", marginBottom: 20 }}>
          {ATTENDANCE.map((a, i) => {
            const pct = Math.round((a.attended / a.total) * 100);
            const warn = pct < 80;
            return (
              <div key={i} style={{ marginBottom: i < ATTENDANCE.length - 1 ? 16 : 0 }}>
                <Row style={{ justifyContent: "space-between", marginBottom: 6 }}>
                  <Row style={{ gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: a.color }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: c.text }}>{a.subject}</span>
                  </Row>
                  <Row style={{ gap: 8 }}>
                    <span style={{ fontSize: 12, color: c.muted }}>{a.attended}/{a.total}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: warn ? c.d : c.s }}>{pct}%</span>
                    {warn && <AlertCircle size={14} color={c.d} />}
                  </Row>
                </Row>
                <PBar value={pct} color={warn ? c.d : a.color} h={8} />
              </div>
            );
          })}
        </div>

        {/* Study trend chart */}
        <SecHead title="Weekly Study Hours" c={c} />
        <div style={{ ...glass(c), padding: "16px", marginBottom: 20 }}>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={STUDY_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c.p} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={c.p} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: c.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: c.muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: c.cardSolid, border: `1px solid ${c.border}`, borderRadius: 10, fontSize: 12 }} />
              <Area type="monotone" dataKey="hours" stroke={c.p} strokeWidth={2} fill="url(#studyGrad)" dot={{ fill: c.p, strokeWidth: 0, r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Calculator */}
        <div style={{ ...glass(c), padding: "16px", border: `1px solid ${c.w}30`, background: `${c.w}08` }}>
          <Row style={{ gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: `${c.w}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Target size={18} color={c.w} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: c.text }}>Attendance Calculator</div>
              <div style={{ fontSize: 12, color: c.muted }}>Classes needed to reach 75%</div>
            </div>
          </Row>
          {ATTENDANCE.filter(a => Math.round((a.attended / a.total) * 100) < 80).map(a => {
            const needed = Math.ceil((0.75 * (a.total + 5) - a.attended));
            return (
              <Row key={a.subject} style={{ justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${c.border}` }}>
                <span style={{ fontSize: 13, color: c.text }}>{a.subject}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: c.d }}>Attend next {Math.max(0, needed)} classes</span>
              </Row>
            );
          })}
        </div>
      </div>
    </div>
  );
}


function AIAssistantScreen({ nav, c }: { nav: (s: string) => void; c: C }) {
  const [messages, setMessages] = useState(AI_MSGS);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const send = (text: string) => {
    if (!text.trim() || loading) return;
    setMessages(m => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const reply = AI_REPLIES[text] || `That's a great question about "${text}". Let me analyze this for you based on your coursework and notes…\n\nI recommend reviewing your class notes and creating a summary of key concepts. Want me to generate a structured study guide? 📚`;
      setMessages(m => [...m, { role: "ai", text: reply }]);
      setLoading(false);
    }, 1200);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <div style={{ background: c.bg, height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "60px 16px 14px", background: `linear-gradient(160deg, #1a1a2e, #16213e)`, borderBottom: `1px solid ${c.border}`, flexShrink: 0 }}>
        <Row style={{ gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 16, background: `linear-gradient(135deg, ${c.p}, ${c.a})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 16px ${c.p}50` }}>
            <Brain size={22} color="#fff" />
          </div>
          <div>
            <Row style={{ gap: 8 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>AI Study Assistant</div>
              <Chip label="Pro" color={c.a} small />
            </Row>
            <Row style={{ gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.s }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Online · Ready to help</span>
            </Row>
          </div>
        </Row>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "16px 16px 8px" }}>
        {/* Suggested prompts */}
        {messages.length <= 1 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: c.muted, fontWeight: 600, marginBottom: 10, textAlign: "center" as const }}>Quick prompts</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {AI_PROMPTS.map(p => (
                <button key={p} onClick={() => send(p)} style={{ width: "100%", padding: "12px 14px", borderRadius: 14, background: c.cardSolid, border: `1px solid ${c.border}`, color: c.text, fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left" as const, display: "flex", alignItems: "center", gap: 10 }}>
                  <Sparkles size={14} color={c.p} />
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 14, display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>
            {m.role === "ai" && (
              <div style={{ width: 28, height: 28, borderRadius: 10, background: `linear-gradient(135deg, ${c.p}, ${c.a})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Brain size={14} color="#fff" />
              </div>
            )}
            <div style={{ maxWidth: "80%", padding: "12px 14px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.role === "user" ? `linear-gradient(135deg, ${c.p}, ${c.a})` : c.cardSolid, color: m.role === "user" ? "#fff" : c.text, fontSize: 13, lineHeight: 1.6, border: m.role === "ai" ? `1px solid ${c.border}` : "none", whiteSpace: "pre-line" as const }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 10, background: `linear-gradient(135deg, ${c.p}, ${c.a})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Brain size={14} color="#fff" />
            </div>
            <div style={{ padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: c.cardSolid, border: `1px solid ${c.border}`, display: "flex", gap: 4 }}>
              {[0, 0.2, 0.4].map((d, i) => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: c.p, animation: `pulse 1.2s ${d}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "10px 16px 16px", background: c.cardSolid, borderTop: `1px solid ${c.border}`, flexShrink: 0 }}>
        <Row style={{ gap: 10 }}>
          <div style={{ flex: 1, background: c.inputBg, borderRadius: 16, border: `1px solid ${c.border}`, display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send(input)}
              placeholder="Ask anything about your studies…"
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: c.text, fontSize: 14, padding: "12px 0" }}
            />
            <Mic size={16} color={c.muted} />
          </div>
          <button onClick={() => send(input)} style={{ width: 46, height: 46, borderRadius: 14, background: input.trim() ? `linear-gradient(135deg, ${c.p}, ${c.a})` : c.inputBg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() ? "pointer" : "default", boxShadow: input.trim() ? `0 4px 16px ${c.p}50` : "none", transition: "all 0.2s" }}>
            <Send size={18} color={input.trim() ? "#fff" : c.muted} />
          </button>
        </Row>
      </div>
    </div>
  );
}

function CalendarScreen({ nav, c }: { nav: (s: string) => void; c: C }) {
  const [selected, setSelected] = useState(12);
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const blanks = 2; // July 1 = Wed → 2 blanks in Mon-start calendar
  const total = 31;
  const cells = [...Array(blanks).fill(null), ...Array(total).fill(null).map((_, i) => i + 1)];
  const typeColors: Record<string, string> = { assignment: c.w, exam: c.d, event: c.p };

  return (
    <div style={{ background: c.bg, minHeight: "100%", paddingBottom: 90 }}>
      <div style={{ background: `linear-gradient(160deg, ${c.c}D0, ${c.p}C0)`, padding: "60px 20px 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Academic Calendar</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>July 2026</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>3 exams · 5 assignments · 1 event</div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ ...glass(c), padding: "16px 12px", marginBottom: 16 }}>
          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 8 }}>
            {days.map(d => <div key={d} style={{ textAlign: "center" as const, fontSize: 11, fontWeight: 700, color: c.muted, padding: "4px 0" }}>{d}</div>)}
          </div>
          {/* Calendar grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px 0" }}>
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const events = CAL_EVENTS[day] || [];
              const isToday = day === 12;
              const isSelected = day === selected;
              return (
                <button key={i} onClick={() => setSelected(day)} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 0", background: isSelected ? c.p : isToday ? `${c.p}15` : "transparent", borderRadius: 12, border: "none", cursor: "pointer" }}>
                  <span style={{ fontSize: 14, fontWeight: isToday || isSelected ? 700 : 400, color: isSelected ? "#fff" : isToday ? c.p : c.text }}>{day}</span>
                  <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
                    {events.slice(0, 3).map((e, j) => (
                      <div key={j} style={{ width: 4, height: 4, borderRadius: "50%", background: isSelected ? "rgba(255,255,255,0.8)" : typeColors[e.type] || c.p }} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <Row style={{ gap: 16, marginBottom: 16 }}>
          {[{ type: "assignment", label: "Assignment" }, { type: "exam", label: "Exam" }, { type: "event", label: "Event" }].map(({ type, label }) => (
            <Row key={type} style={{ gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: typeColors[type] }} />
              <span style={{ fontSize: 11, color: c.muted, fontWeight: 600 }}>{label}</span>
            </Row>
          ))}
        </Row>

        {/* Upcoming events */}
        <SecHead title="Upcoming Events" c={c} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.entries(CAL_EVENTS).map(([day, events]) =>
            events.map((e, i) => (
              <div key={`${day}-${i}`} style={{ ...glass(c), padding: "14px 16px", borderLeft: `3px solid ${typeColors[e.type]}` }}>
                <Row style={{ gap: 12 }}>
                  <div style={{ textAlign: "center" as const, minWidth: 40 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: typeColors[e.type], fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{day}</div>
                    <div style={{ fontSize: 10, color: c.muted, fontWeight: 600 }}>JUL</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: c.text }}>{e.label}</div>
                    <Chip label={e.type} color={typeColors[e.type]} small />
                  </div>
                </Row>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileScreen({ nav, c }: { nav: (s: string) => void; c: C }) {
  return (
    <div style={{ background: c.bg, minHeight: "100%", paddingBottom: 90 }}>
      <div style={{ background: `linear-gradient(160deg, #1a1a2e, #16213e)`, padding: "60px 20px 28px", textAlign: "center" as const, position: "relative" }}>
        <div style={{ position: "absolute", top: 16, right: 16 }}>
          <button onClick={() => nav("settings")} style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Settings size={16} color="#fff" />
          </button>
        </div>
        <div style={{ width: 88, height: 88, borderRadius: 28, background: `linear-gradient(135deg, ${c.p}, ${c.a})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 36, fontWeight: 800, color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif", boxShadow: `0 12px 40px ${c.p}60` }}>
          AJ
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Alex Johnson</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>Computer Science • Semester 5</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>University of Technology • Batch 2022</div>
        <Row style={{ justifyContent: "center", gap: 4, marginTop: 12 }}>
          <div style={{ background: `${c.s}30`, border: `1px solid ${c.s}50`, borderRadius: 20, padding: "4px 12px", display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.s }} />
            <span style={{ fontSize: 12, color: c.s, fontWeight: 600 }}>Active</span>
          </div>
        </Row>
      </div>

      <div style={{ padding: "20px 16px 0" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
          {[
            { label: "GPA", value: "3.82", icon: Award, color: c.w },
            { label: "Notes", value: "47", icon: BookOpen, color: c.p },
            { label: "Streak", value: "12d", icon: Flame, color: "#F97316" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{ ...glass(c), padding: "14px 12px", textAlign: "center" as const }}>
              <Icon size={20} color={color} style={{ margin: "0 auto 6px" }} />
              <div style={{ fontSize: 20, fontWeight: 800, color: c.text, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{value}</div>
              <div style={{ fontSize: 11, color: c.muted }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <SecHead title="Achievements" c={c} />
        <div style={{ display: "flex", gap: 12, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 8, marginBottom: 24 }}>
          {[
            { emoji: "🏆", label: "Dean's List", sub: "Top 10%", color: c.w },
            { emoji: "🔥", label: "12-Day Streak", sub: "Study champion", color: "#F97316" },
            { emoji: "📚", label: "Note Master", sub: "47 notes created", color: c.p },
            { emoji: "✅", label: "On Track", sub: "All assignments done", color: c.s },
          ].map(({ emoji, label, sub, color }) => (
            <div key={label} style={{ flexShrink: 0, ...glass(c), padding: "14px 16px", textAlign: "center" as const, minWidth: 100 }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: c.text }}>{label}</div>
              <div style={{ fontSize: 10, color: c.muted, marginTop: 2 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Menu items */}
        <SecHead title="Account" c={c} />
        <div style={{ ...glass(c), overflow: "hidden", marginBottom: 16 }}>
          {[
            { icon: User, label: "Edit Profile", color: c.p },
            { icon: GraduationCap, label: "Academic Info", color: c.a },
            { icon: Bell, label: "Notifications", color: c.w, screen: "notifications" },
            { icon: BarChart2, label: "Analytics", color: c.c, screen: "analytics" },
            { icon: Settings, label: "Settings", color: c.muted, screen: "settings" },
          ].map(({ icon: Icon, label, color, screen }, i, arr) => (
            <button key={label} onClick={() => screen && nav(screen)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "none", border: "none", borderBottom: i < arr.length - 1 ? `1px solid ${c.border}` : "none", cursor: "pointer", color: c.text }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={18} color={color} />
              </div>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 600, textAlign: "left" as const }}>{label}</span>
              <ChevronRight size={16} color={c.muted} />
            </button>
          ))}
        </div>
        <button style={{ width: "100%", padding: "14px", borderRadius: 16, background: `${c.d}10`, border: `1px solid ${c.d}25`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", color: c.d, fontSize: 15, fontWeight: 700 }}>
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

function SettingsScreen({ nav, c, isDark, setIsDark }: { nav: (s: string) => void; c: C; isDark: boolean; setIsDark: (v: boolean) => void }) {
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(true);
  const [sync, setSync] = useState(true);
  const Toggle = ({ on, setOn }: { on: boolean; setOn: (v: boolean) => void }) => (
    <div onClick={() => setOn(!on)} style={{ width: 48, height: 28, borderRadius: 14, background: on ? c.p : c.subtle, cursor: "pointer", position: "relative", transition: "background 0.3s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: on ? 23 : 3, width: 22, height: 22, borderRadius: "50%", background: "#fff", transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
    </div>
  );
  const Section = ({ title }: { title: string }) => (
    <div style={{ fontSize: 11, fontWeight: 700, color: c.muted, letterSpacing: 1.5, textTransform: "uppercase" as const, padding: "20px 16px 8px" }}>{title}</div>
  );
  const Item = ({ icon: Icon, label, color, right }: { icon: any; label: string; color: string; right?: React.ReactNode }) => (
    <Row style={{ padding: "14px 16px", gap: 12, borderBottom: `1px solid ${c.border}` }}>
      <div style={{ width: 36, height: 36, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={18} color={color} />
      </div>
      <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: c.text }}>{label}</span>
      {right || <ChevronRight size={16} color={c.muted} />}
    </Row>
  );

  return (
    <div style={{ background: c.bg, minHeight: "100%", paddingBottom: 90 }}>
      <div style={{ padding: "60px 16px 12px", borderBottom: `1px solid ${c.border}`, background: c.bg }}>
        <BackBtn c={c} nav={nav} target="profile" />
        <div style={{ fontSize: 26, fontWeight: 800, color: c.text, fontFamily: "'Plus Jakarta Sans',sans-serif", marginTop: 12 }}>Settings</div>
      </div>

      <Section title="Appearance" />
      <div style={{ ...glass(c), overflow: "hidden", margin: "0 16px" }}>
        <Item icon={isDark ? Moon : Sun} label="Dark Mode" color={c.p} right={<Toggle on={isDark} setOn={setIsDark} />} />
        <Item icon={Globe} label="Language" color={c.c} right={<span style={{ fontSize: 14, color: c.muted, marginRight: 4 }}>English</span>} />
      </div>

      <Section title="Notifications" />
      <div style={{ ...glass(c), overflow: "hidden", margin: "0 16px" }}>
        <Item icon={Bell} label="Push Notifications" color={c.w} right={<Toggle on={notifications} setOn={setNotifications} />} />
        <Item icon={AlertCircle} label="Assignment Reminders" color={c.d} right={<Toggle on={true} setOn={() => {}} />} />
        <Item icon={Clock} label="Class Reminders" color={c.a} right={<Toggle on={true} setOn={() => {}} />} />
      </div>

      <Section title="Privacy & Security" />
      <div style={{ ...glass(c), overflow: "hidden", margin: "0 16px" }}>
        <Item icon={Lock} label="Biometric Login" color={c.s} right={<Toggle on={biometric} setOn={setBiometric} />} />
        <Item icon={Globe} label="Privacy Policy" color={c.muted} />
      </div>

      <Section title="Data" />
      <div style={{ ...glass(c), overflow: "hidden", margin: "0 16px" }}>
        <Item icon={Database} label="iCloud Sync" color={c.c} right={<Toggle on={sync} setOn={setSync} />} />
        <Item icon={RefreshCw} label="Backup Notes" color={c.a} />
        <Item icon={Activity} label="Export Data" color={c.p} />
      </div>

      <Section title="About" />
      <div style={{ ...glass(c), overflow: "hidden", margin: "0 16px" }}>
        <Item icon={GraduationCap} label="Nexora v2.4.1" color={c.p} right={<span style={{ fontSize: 12, color: c.s, fontWeight: 600, marginRight: 4 }}>Up to date</span>} />
        <Item icon={Star} label="Rate the App" color={c.w} />
      </div>
    </div>
  );
}

function NotificationsScreen({ nav, c }: { nav: (s: string) => void; c: C }) {
  const typeInfo: Record<string, { color: string; emoji: string }> = {
    warn: { color: c.w, emoji: "⏰" },
    info: { color: c.c, emoji: "📢" },
    success: { color: c.s, emoji: "✅" },
    danger: { color: c.d, emoji: "⚠️" },
    exam: { color: "#8B5CF6", emoji: "📝" },
    ai: { color: c.p, emoji: "🧠" },
  };
  const today = NOTIFS.slice(0, 3);
  const yesterday = NOTIFS.slice(3);
  return (
    <div style={{ background: c.bg, minHeight: "100%", paddingBottom: 90 }}>
      <div style={{ padding: "60px 16px 12px", background: c.bg, borderBottom: `1px solid ${c.border}` }}>
        <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: c.text, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Notifications</div>
          <button style={{ fontSize: 13, color: c.p, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Mark all read</button>
        </Row>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        <SecHead title="Today" c={c} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {today.map(n => {
            const { color, emoji } = typeInfo[n.type] || { color: c.p, emoji: "📌" };
            return (
              <div key={n.id} style={{ ...glass(c), padding: "14px 16px", borderLeft: `3px solid ${n.read ? c.subtle : color}`, opacity: n.read ? 0.75 : 1 }}>
                <Row style={{ gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 14, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{emoji}</div>
                  <div style={{ flex: 1 }}>
                    <Row style={{ justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: c.text }}>{n.title}</span>
                      {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.p, flexShrink: 0, marginTop: 4 }} />}
                    </Row>
                    <div style={{ fontSize: 12, color: c.muted, lineHeight: 1.5, marginBottom: 4 }}>{n.body}</div>
                    <span style={{ fontSize: 11, color: c.subtle, fontWeight: 600 }}>{n.time}</span>
                  </div>
                </Row>
              </div>
            );
          })}
        </div>
        <SecHead title="Yesterday" c={c} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {yesterday.map(n => {
            const { color, emoji } = typeInfo[n.type] || { color: c.p, emoji: "📌" };
            return (
              <div key={n.id} style={{ ...glass(c), padding: "14px 16px", opacity: 0.7, borderLeft: `3px solid ${c.subtle}` }}>
                <Row style={{ gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 14, background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: c.text, marginBottom: 4 }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: c.muted, lineHeight: 1.5, marginBottom: 4 }}>{n.body}</div>
                    <span style={{ fontSize: 11, color: c.subtle, fontWeight: 600 }}>{n.time}</span>
                  </div>
                </Row>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SearchScreen({ nav, c }: { nav: (s: string) => void; c: C }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Notes", "Assignments", "Subjects"];
  const results = query.length > 0 ? [
    ...NOTES.filter(n => n.title.toLowerCase().includes(query.toLowerCase())).map(n => ({ type: "note", title: n.title, sub: n.subject, color: SC(n.subject) })),
    ...ASSIGNMENTS.filter(a => a.title.toLowerCase().includes(query.toLowerCase())).map(a => ({ type: "assignment", title: a.title, sub: a.subject, color: SC(a.subject) })),
    ...SUBJECTS.filter(s => s.name.toLowerCase().includes(query.toLowerCase())).map(s => ({ type: "subject", title: s.name, sub: s.code, color: s.color })),
  ].filter(r => filter === "All" || r.type === filter.toLowerCase().slice(0, -1)) : [];
  const typeIcons: Record<string, any> = { note: FileText, assignment: CheckSquare, subject: BookOpen };

  return (
    <div style={{ background: c.bg, minHeight: "100%", paddingBottom: 90 }}>
      <div style={{ padding: "60px 16px 16px", background: c.bg, borderBottom: `1px solid ${c.border}` }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: c.text, fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 14 }}>Search</div>
        <div style={{ display: "flex", gap: 10, background: c.inputBg, borderRadius: 16, padding: "12px 14px", border: `1px solid ${c.border}`, alignItems: "center" }}>
          <Search size={18} color={c.muted} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            placeholder="Search notes, assignments, subjects…"
            style={{ flex: 1, background: "none", border: "none", outline: "none", color: c.text, fontSize: 15 }}
          />
          {query && <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: c.muted, display: "flex" }}><X size={16} /></button>}
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", marginTop: 12 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, background: f === filter ? c.p : `${c.p}12`, color: f === filter ? "#fff" : c.p, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px" }}>
        {query === "" ? (
          <>
            <SecHead title="Recent Searches" c={c} />
            {["Quantum Mechanics", "Fourier Transform", "Dijkstra Algorithm"].map(q => (
              <button key={q} onClick={() => setQuery(q)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 0", background: "none", border: "none", borderBottom: `1px solid ${c.border}`, cursor: "pointer" }}>
                <Clock size={16} color={c.muted} />
                <span style={{ flex: 1, fontSize: 14, color: c.text, textAlign: "left" as const }}>{q}</span>
                <ArrowRight size={14} color={c.muted} />
              </button>
            ))}
            <Spacer h={20} />
            <SecHead title="Browse Subjects" c={c} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {SUBJECTS.map(s => (
                <button key={s.name} style={{ ...glass(c), padding: "14px", textAlign: "left" as const, border: "none", cursor: "pointer" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 12, background: `${s.color}20`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                    <BookOpen size={18} color={s.color} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: c.muted, marginTop: 2 }}>{s.code}</div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, color: c.muted, marginBottom: 14 }}>{results.length} results for "{query}"</div>
            {results.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: c.text }}>No results found</div>
                <div style={{ fontSize: 14, color: c.muted, marginTop: 4 }}>Try a different search term</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {results.map((r, i) => {
                  const Icon = typeIcons[r.type] || FileText;
                  return (
                    <div key={i} style={{ ...glass(c), padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 14, background: `${r.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={18} color={r.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: c.text }}>{r.title}</div>
                        <Row style={{ gap: 6, marginTop: 3 }}>
                          <Chip label={r.type} color={c.muted} small />
                          <span style={{ fontSize: 12, color: r.color, fontWeight: 600 }}>{r.sub}</span>
                        </Row>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AnalyticsScreen({ nav, c }: { nav: (s: string) => void; c: C }) {
  return (
    <div style={{ background: c.bg, minHeight: "100%", paddingBottom: 90 }}>
      <div style={{ background: `linear-gradient(160deg, ${c.c}D0, ${c.p}C0)`, padding: "60px 20px 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Performance</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Analytics</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>Week of July 7–12, 2026</div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        {/* Key stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
          {[
            { label: "Study Hours", value: "27.8h", trend: "+12%", color: c.p, icon: Timer },
            { label: "Assignments Done", value: "3/5", trend: "+1 this week", color: c.s, icon: CheckSquare },
            { label: "Avg Attendance", value: "87%", trend: "-2% vs last wk", color: c.w, icon: BarChart2 },
            { label: "Notes Created", value: "6", trend: "+2 this week", color: c.a, icon: FileText },
          ].map(({ label, value, trend, color, icon: Icon }) => (
            <div key={label} style={{ ...glass(c), padding: "14px" }}>
              <Row style={{ justifyContent: "space-between", marginBottom: 8 }}>
                <Icon size={18} color={color} />
                <span style={{ fontSize: 10, color: trend.includes("+") ? c.s : c.d, fontWeight: 700 }}>{trend}</span>
              </Row>
              <div style={{ fontSize: 22, fontWeight: 800, color: c.text, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{value}</div>
              <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Study hours chart */}
        <SecHead title="Daily Study Hours" c={c} />
        <div style={{ ...glass(c), padding: "16px", marginBottom: 20 }}>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={STUDY_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c.p} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={c.p} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: c.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: c.muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: c.cardSolid, border: `1px solid ${c.border}`, borderRadius: 10, fontSize: 12, color: c.text }} />
              <Area type="monotone" dataKey="hours" stroke={c.p} strokeWidth={2.5} fill="url(#areaGrad)" dot={{ fill: c.p, strokeWidth: 0, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly progress */}
        <SecHead title="Weekly Assignment Completion" c={c} />
        <div style={{ ...glass(c), padding: "16px", marginBottom: 20 }}>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={WEEKLY_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: c.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: c.muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: c.cardSolid, border: `1px solid ${c.border}`, borderRadius: 10, fontSize: 12, color: c.text }} />
              <Bar dataKey="done" radius={[6, 6, 0, 0]}>
                {WEEKLY_DATA.map((_, i) => <Cell key={i} fill={i === WEEKLY_DATA.length - 1 ? c.p : `${c.p}60`} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Subject performance */}
        <SecHead title="Subject Performance" c={c} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SUBJECTS.map(s => {
            const pct = Math.round(65 + Math.random() * 30);
            return (
              <div key={s.name} style={{ ...glass(c), padding: "14px 16px" }}>
                <Row style={{ justifyContent: "space-between", marginBottom: 8 }}>
                  <Row style={{ gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{s.name}</span>
                  </Row>
                  <span style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{85 + Math.floor(s.name.length % 5) * 2}%</span>
                </Row>
                <PBar value={85 + Math.floor(s.name.length % 5) * 2} color={s.color} h={6} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EmptyStateScreen({ nav, c, type }: { nav: (s: string) => void; c: C; type?: string }) {
  const states: Record<string, { emoji: string; title: string; desc: string; action: string; screen: string }> = {
    notes: { emoji: "📝", title: "No Notes Yet", desc: "Start capturing your first lecture notes. Tap the + button to create a note.", action: "Create First Note", screen: "note-editor" },
    assignments: { emoji: "✅", title: "All Done!", desc: "You have no pending assignments. Great job staying on top of your work!", action: "View Calendar", screen: "calendar" },
    notifications: { emoji: "🔔", title: "All Caught Up", desc: "No new notifications. You're up to date with everything.", action: "Go to Dashboard", screen: "dashboard" },
  };
  const s = states[type || "notes"];
  return (
    <div style={{ background: c.bg, minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 32px", textAlign: "center" as const }}>
      <div style={{ width: 120, height: 120, borderRadius: 36, background: `${c.p}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, fontSize: 52 }}>{s.emoji}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: c.text, fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 10 }}>{s.title}</div>
      <div style={{ fontSize: 15, color: c.muted, lineHeight: 1.6, marginBottom: 32, maxWidth: 280 }}>{s.desc}</div>
      <button onClick={() => nav(s.screen)} style={{ padding: "14px 28px", borderRadius: 16, background: `linear-gradient(135deg, ${c.p}, ${c.a})`, color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: `0 8px 24px ${c.p}40`, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
        {s.action}
      </button>
      <button onClick={() => nav("dashboard")} style={{ marginTop: 14, background: "none", border: "none", color: c.muted, fontSize: 14, cursor: "pointer" }}>Back to Dashboard</button>
    </div>
  );
}

function ErrorStateScreen({ nav, c, type }: { nav: (s: string) => void; c: C; type?: "offline" | "server" }) {
  const isOffline = type !== "server";
  return (
    <div style={{ background: c.bg, minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 32px", textAlign: "center" as const }}>
      <div style={{ width: 120, height: 120, borderRadius: 36, background: isOffline ? `${c.muted}18` : `${c.d}12`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
        {isOffline ? <WifiOff size={52} color={c.muted} /> : <AlertCircle size={52} color={c.d} />}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: c.text, fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 10 }}>
        {isOffline ? "No Internet Connection" : "Something Went Wrong"}
      </div>
      <div style={{ fontSize: 15, color: c.muted, lineHeight: 1.6, marginBottom: 32 }}>
        {isOffline ? "Check your connection and try again. Your offline notes are still available." : "We encountered a server error. Our team has been notified and is working on it."}
      </div>
      <button style={{ padding: "14px 28px", borderRadius: 16, background: `linear-gradient(135deg, ${c.p}, ${c.a})`, color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 8px 24px ${c.p}40` }}>
        <RefreshCw size={18} /> Try Again
      </button>
      <button onClick={() => nav("dashboard")} style={{ marginTop: 14, background: "none", border: "none", color: c.muted, fontSize: 14, cursor: "pointer" }}>Go Offline</button>
    </div>
  );
}

function LoadingScreen({ c }: { c: C }) {
  const Skel = ({ w = "100%", h = 16, r = 8 }: { w?: string | number; h?: number; r?: number }) => (
    <div style={{ width: w, height: h, borderRadius: r, background: `linear-gradient(90deg, ${c.subtle}60 25%, ${c.border}40 50%, ${c.subtle}60 75%)`, backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
  );
  return (
    <div style={{ background: c.bg, minHeight: "100%", padding: "16px" }}>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      {/* Header skeleton */}
      <div style={{ height: 120, borderRadius: 20, background: `${c.p}20`, marginBottom: 20 }} />
      <div style={{ ...glass(c), padding: "16px", marginBottom: 16 }}>
        <Skel w="60%" h={14} r={6} />
        <div style={{ height: 10 }} />
        <Skel w="100%" h={12} r={6} />
        <div style={{ height: 8 }} />
        <Skel w="80%" h={12} r={6} />
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ ...glass(c), padding: "16px", marginBottom: 12 }}>
          <Row style={{ gap: 12, marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: `${c.subtle}60` }} />
            <div style={{ flex: 1 }}>
              <Skel w="70%" h={14} r={6} />
              <div style={{ height: 8 }} />
              <Skel w="45%" h={10} r={6} />
            </div>
          </Row>
          <Skel w="100%" h={6} r={3} />
        </div>
      ))}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[1, 2].map(i => (
          <div key={i} style={{ ...glass(c), padding: "16px" }}>
            <Skel w="100%" h={60} r={12} />
            <div style={{ height: 10 }} />
            <Skel w="80%" h={12} r={6} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DEMO SCREEN PICKER ──────────────────────────────────────────────────────

function ScreenPicker({ current, onPick, c }: { current: string; onPick: (s: string) => void; c: C }) {
  const screens = [
    ["splash", "Splash"], ["onboarding", "Onboarding"], ["login", "Auth"],
    ["dashboard", "Dashboard"], ["timetable", "Timetable"], ["notes", "Notes"],
    ["note-editor", "Note Editor"], ["assignments", "Assignments"], ["attendance", "Attendance"],
    ["ai", "AI Assistant"], ["calendar", "Calendar"], ["profile", "Profile"],
    ["settings", "Settings"], ["notifications", "Notifications"], ["search", "Search"],
    ["analytics", "Analytics"], ["empty", "Empty State"], ["error", "Error State"], ["loading", "Loading"],
  ];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", maxWidth: 420 }}>
      {screens.map(([id, label]) => (
        <button key={id} onClick={() => onPick(id)} style={{
          padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
          background: current === id ? "#5B6CFF" : "rgba(255,255,255,0.08)",
          color: current === id ? "#fff" : "rgba(255,255,255,0.65)",
          transition: "all 0.2s",
        }}>{label}</button>
      ))}
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

const MAIN_TABS = ["dashboard", "timetable", "notes", "calendar", "profile"];
const SHOW_NAV = ["dashboard", "timetable", "notes", "calendar", "profile", "assignments", "attendance", "ai", "analytics", "search", "notifications"];

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [isDark, setIsDark] = useState(false);
  const c = mk(isDark);

  const nav = (s: string) => setScreen(s);
  const activeTab = MAIN_TABS.includes(screen) ? screen : (MAIN_TABS.find(t => screen.startsWith(t)) || "dashboard");

  const renderScreen = () => {
    const props = { nav, c, isDark, setIsDark };
    switch (screen) {
      case "splash": return <SplashScreen nav={nav} />;
      case "onboarding": return <OnboardingScreen nav={nav} c={c} />;
      case "login": return <LoginScreen nav={nav} c={c} />;
      case "dashboard": return <DashboardScreen nav={nav} c={c} />;
      case "timetable": return <TimetableScreen nav={nav} c={c} />;
      case "notes": return <NotesScreen nav={nav} c={c} />;
      case "note-editor": return <NoteEditorScreen nav={nav} c={c} />;
      case "assignments": return <AssignmentsScreen nav={nav} c={c} />;
      case "attendance": return <AttendanceScreen nav={nav} c={c} />;
      case "ai": return <AIAssistantScreen nav={nav} c={c} />;
      case "calendar": return <CalendarScreen nav={nav} c={c} />;
      case "profile": return <ProfileScreen nav={nav} c={c} />;
      case "settings": return <SettingsScreen nav={nav} c={c} isDark={isDark} setIsDark={setIsDark} />;
      case "notifications": return <NotificationsScreen nav={nav} c={c} />;
      case "search": return <SearchScreen nav={nav} c={c} />;
      case "analytics": return <AnalyticsScreen nav={nav} c={c} />;
      case "empty": return <EmptyStateScreen nav={nav} c={c} type="notes" />;
      case "error": return <ErrorStateScreen nav={nav} c={c} type="offline" />;
      case "loading": return <LoadingScreen c={c} />;
      default: return <DashboardScreen nav={nav} c={c} />;
    }
  };

  const showNav = SHOW_NAV.includes(screen);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #060918 0%, #0D0B2B 40%, #091525 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 24,
      padding: "32px 16px",
      fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glows */}
      <div style={{ position: "absolute", top: "10%", left: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(91,108,255,0.12) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 300, height: 300, background: "radial-gradient(circle, rgba(138,123,255,0.1) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg, #5B6CFF, #8A7BFF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <GraduationCap size={20} color="#fff" strokeWidth={1.8} />
        </div>
        <span style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: -0.3 }}>Nexora</span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, background: "rgba(91,108,255,0.2)", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(91,108,255,0.3)" }}>Design System</span>
      </div>

      {/* Phone frame */}
      <div style={{
        width: 390, height: 844,
        borderRadius: 52,
        background: isDark ? "#0F172A" : "#F8FAFC",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 50px 120px rgba(0,0,0,0.6), 0 0 0 1.5px rgba(255,255,255,0.12), 0 0 0 8px rgba(255,255,255,0.04)",
        flexShrink: 0,
      }}>
        {/* Status bar */}
        <StatusBar c={c} />

        {/* Screen content */}
        <div style={{ position: "absolute", top: 54, bottom: showNav ? 80 : 0, left: 0, right: 0, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none" }}>
          <style>{`
            ::-webkit-scrollbar { display: none; }
            * { box-sizing: border-box; }
            button { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
            input, textarea { font-family: 'Inter', sans-serif; }
          `}</style>
          {renderScreen()}
        </div>

        {/* Bottom nav */}
        {showNav && (
          <BottomNav
            active={activeTab}
            nav={(tab) => { setScreen(tab); }}
            c={c}
          />
        )}
      </div>

      {/* Screen picker */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, maxWidth: 500 }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Jump to screen</div>
        <ScreenPicker current={screen} onPick={nav} c={c} />
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 20px", borderRadius: 24,
          background: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
        Switch to {isDark ? "Light" : "Dark"} Mode
      </button>
    </div>
  );
}
