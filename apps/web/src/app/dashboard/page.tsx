'use client';

import React, { useState } from 'react';
import LayoutShell from '@/components/layout-shell';
import { useQuery } from '@tanstack/react-query';
import {
  subjectService,
  assignmentService,
  attendanceService,
  noteService,
  timetableService,
} from '@/services/api-service';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import {
  GraduationCap,
  Calendar,
  CheckCircle,
  FileText,
  Clock,
  Sparkles,
  TrendingUp,
  BrainCircuit,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

const studyHoursData = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 4.0 },
  { day: 'Wed', hours: 1.5 },
  { day: 'Thu', hours: 5.0 },
  { day: 'Fri', hours: 3.5 },
  { day: 'Sat', hours: 6.0 },
  { day: 'Sun', hours: 4.5 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [aiInput, setAiInput] = useState('');

  // Fetch all necessary data
  const { data: subjects = [] } = useQuery({ queryKey: ['subjects'], queryFn: subjectService.list });
  const { data: assignments = [] } = useQuery({ queryKey: ['assignments'], queryFn: assignmentService.list });
  const { data: attendance = [] } = useQuery({ queryKey: ['attendance'], queryFn: attendanceService.list });
  const { data: notes = [] } = useQuery({ queryKey: ['notes'], queryFn: noteService.list });
  const { data: timetable = [] } = useQuery({ queryKey: ['timetable'], queryFn: timetableService.list });

  // Calculate metrics
  const completedAssignments = assignments.filter((a) => a.is_done).length;
  const totalAssignments = assignments.length;
  const assignmentProgress = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;

  // Attendance stats
  let totalAttended = 0;
  let totalClasses = 0;
  attendance.forEach((att) => {
    totalAttended += att.attended_count;
    totalClasses += att.total_count;
  });
  const overallAttendance = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;

  // Get current day of week (e.g., Mon, Tue)
  const currentDayStr = format(new Date(), 'E').substring(0, 3); // "Mon"
  const todaysClasses = timetable.filter((slot) => slot.day_of_week === currentDayStr);

  // Next upcoming assignment
  const pendingAssignments = assignments
    .filter((a) => !a.is_done)
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  const handleAiSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    router.push(`/ai?q=${encodeURIComponent(aiInput)}`);
  };

  return (
    <LayoutShell>
      <div className="space-y-8 pb-10">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Academic Dashboard
            </h1>
            <p className="text-slate-400 text-sm">
              Real-time insights and scheduling for your current semester
            </p>
          </div>
          <Link href="/ai">
            <Button className="bg-gradient-to-r from-primary to-accent hover:brightness-110 text-white font-semibold rounded-xl flex items-center gap-2">
              <BrainCircuit className="h-4.5 w-4.5" />
              Ask Study AI
            </Button>
          </Link>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* GPA */}
          <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-semibold text-slate-400">Estimated GPA</span>
              <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <GraduationCap className="h-4.5 w-4.5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">3.85 / 4.0</div>
              <p className="text-[10px] text-success flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" /> Top 5% of class
              </p>
            </CardContent>
          </Card>

          {/* Attendance */}
          <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-semibold text-slate-400">Overall Attendance</span>
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center border ${
                overallAttendance >= 75
                  ? 'bg-success/10 border-success/20 text-success'
                  : 'bg-warning/10 border-warning/20 text-warning'
              }`}>
                <Calendar className="h-4.5 w-4.5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {overallAttendance > 0 ? `${overallAttendance.toFixed(1)}%` : 'No data'}
              </div>
              <p className={`text-[10px] flex items-center gap-1 mt-1 ${
                overallAttendance >= 75 ? 'text-success' : 'text-warning'
              }`}>
                {overallAttendance >= 75 ? 'Above 75% threshold' : 'Below recommended 75%'}
              </p>
            </CardContent>
          </Card>

          {/* Completed Assignments */}
          <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-semibold text-slate-400">Assignments Completed</span>
              <div className="h-8 w-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <CheckCircle className="h-4.5 w-4.5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {completedAssignments} / {totalAssignments}
              </div>
              <Progress value={assignmentProgress} className="h-1.5 mt-2 bg-slate-800" />
            </CardContent>
          </Card>

          {/* Notes Saved */}
          <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-semibold text-slate-400">Academic Notes</span>
              <div className="h-8 w-8 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300">
                <FileText className="h-4.5 w-4.5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{notes.length} Documents</div>
              <p className="text-[10px] text-slate-500 mt-1">Across {subjects.length} subjects</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart and Side Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Study Hours Chart */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <CardTitle className="text-lg font-bold text-white">Study Hours Tracker</CardTitle>
                  <CardDescription className="text-slate-400 text-xs">Weekly study hour metrics</CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px] border-white/10 text-slate-400">
                  This Week
                </Badge>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={studyHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5B6CFF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#5B6CFF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }}
                    />
                    <Area type="monotone" dataKey="hours" stroke="#5B6CFF" strokeWidth={2.5} fillOpacity={1} fill="url(#hoursGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* AI Assistant Quick Input Widget */}
            <Card className="border border-white/5 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="h-24 w-24 text-white" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  <span className="font-bold text-sm text-white">AI Quick Assistant</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed max-w-xl">
                  Quickly outline assignments, summarize topics, or ask academic questions right from your study database.
                </p>
                <form onSubmit={handleAiSearchSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask something (e.g. 'Summarize my Quantum Mechanics note')"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    className="flex-1 text-xs bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-primary/50 transition-all placeholder:text-slate-500"
                  />
                  <Button type="submit" size="sm" className="bg-primary hover:bg-primary/95 text-white rounded-xl">
                    Ask AI
                  </Button>
                </form>
              </div>
            </Card>
          </div>

          {/* Right Column: Schedule & Assignments */}
          <div className="space-y-6">
            {/* Today's Schedule Card */}
            <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Today's Schedule
                </h3>
                <Link href="/timetable" className="text-[10px] text-primary hover:underline flex items-center gap-0.5">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="space-y-3">
                {todaysClasses.length > 0 ? (
                  todaysClasses.map((slot, idx) => {
                    const subjectColor = slot.subject?.color || '#5B6CFF';
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-all"
                      >
                        <span className="w-1.5 h-10 rounded-full shrink-0" style={{ backgroundColor: subjectColor }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-100 truncate">{slot.subject?.name || 'Class'}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                            <span>{slot.class_type}</span>
                            <span>•</span>
                            <span>{slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}</span>
                          </p>
                        </div>
                        {slot.room && (
                          <Badge variant="outline" className="text-[9px] border-white/10 text-slate-400 h-5">
                            {slot.room}
                          </Badge>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No classes scheduled for today.
                  </div>
                )}
              </div>
            </Card>

            {/* Upcoming Deadlines Card */}
            <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  Upcoming Deadlines
                </h3>
                <Link href="/assignments" className="text-[10px] text-primary hover:underline flex items-center gap-0.5">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="space-y-3">
                {pendingAssignments.length > 0 ? (
                  pendingAssignments.slice(0, 3).map((ass, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-100 truncate">{ass.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Due: {format(parseISO(ass.due_date), 'MMM dd, h:mm a')}
                        </p>
                      </div>
                      <Badge
                        className={`text-[9px] capitalize px-2 py-0.5 ${
                          ass.priority === 'high'
                            ? 'bg-error/20 text-error border-error/10'
                            : ass.priority === 'medium'
                            ? 'bg-warning/20 text-warning border-warning/10'
                            : 'bg-success/20 text-success border-success/10'
                        }`}
                      >
                        {ass.priority}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No pending assignments.
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </LayoutShell>
  );
}
