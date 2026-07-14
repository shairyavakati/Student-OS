'use client';

import React from 'react';
import LayoutShell from '@/components/layout-shell';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectService, attendanceService } from '@/services/api-service';
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
import { Award, Check, X, ShieldAlert, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function AttendancePage() {
  const queryClient = useQueryClient();

  // Queries
  const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.list,
  });

  const { data: attendanceList = [], isLoading: loadingAttendance } = useQuery({
    queryKey: ['attendance'],
    queryFn: attendanceService.list,
  });

  // Mutations
  const initializeMutation = useMutation({
    mutationFn: attendanceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Attendance tracker initialized!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Failed to initialize tracker');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { attended_count: number; total_count: number } }) =>
      attendanceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Attendance updated!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Failed to update attendance');
    },
  });

  const handleInitialize = (subjId: string) => {
    initializeMutation.mutate({ subject_id: subjId, attended_count: 0, total_count: 0 });
  };

  const handleLogClass = (attId: string, attendedCount: number, totalCount: number, attended: boolean) => {
    updateMutation.mutate({
      id: attId,
      data: {
        attended_count: attendedCount + (attended ? 1 : 0),
        total_count: totalCount + 1,
      },
    });
  };

  const handleReset = (attId: string) => {
    updateMutation.mutate({
      id: attId,
      data: {
        attended_count: 0,
        total_count: 0,
      },
    });
  };

  // Safe skip calculator logic
  const calculateStatus = (attended: number, total: number) => {
    if (total === 0) return { pct: 0, status: 'Neutral', text: 'No classes logged yet' };
    const pct = (attended / total) * 100;

    if (pct >= 75) {
      // Find how many classes they can skip
      let skippable = 0;
      let tempTotal = total;
      while (((attended) / (tempTotal + 1)) * 100 >= 75) {
        skippable++;
        tempTotal++;
      }
      return {
        pct,
        status: 'Safe',
        text: skippable > 0 ? `You can skip next ${skippable} classes` : 'Attend the next class to stay safe',
        classes: skippable,
      };
    } else {
      // Find how many classes they must attend in a row to reach 75%
      let required = 0;
      let tempAttended = attended;
      let tempTotal = total;
      while ((tempAttended / tempTotal) * 100 < 75) {
        required++;
        tempAttended++;
        tempTotal++;
      }
      return {
        pct,
        status: 'Critical',
        text: `Must attend next ${required} classes`,
        classes: required,
      };
    }
  };

  return (
    <LayoutShell>
      <div className="space-y-8 pb-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Attendance Tracker
          </h1>
          <p className="text-slate-400 text-sm">
            Maintain your 75% attendance threshold with active calculators and quick logs.
          </p>
        </div>

        {/* Subjects Attendance List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loadingSubjects || loadingAttendance ? (
            [1, 2].map((k) => (
              <Card key={k} className="bg-slate-900/40 border-white/5 p-6 animate-pulse space-y-4">
                <div className="h-6 w-32 bg-slate-800 rounded" />
                <div className="h-4 w-48 bg-slate-850 rounded" />
                <div className="h-3 w-full bg-slate-800 rounded" />
              </Card>
            ))
          ) : subjects.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-500 text-sm">
              No subjects found. Please go to <span className="text-primary font-semibold">Timetable</span> and add subjects first!
            </div>
          ) : (
            subjects.map((sub) => {
              const tracker = attendanceList.find((att) => att.subject_id === sub.id);
              const hasTracker = !!tracker;

              const attended = tracker?.attended_count || 0;
              const total = tracker?.total_count || 0;
              const { pct, status, text } = calculateStatus(attended, total);

              return (
                <Card
                  key={sub.id}
                  className="border border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl overflow-hidden hover:border-white/10 transition-all flex flex-col justify-between"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: sub.color }} />
                          <span className="text-[10px] font-bold text-slate-500">{sub.code}</span>
                        </div>
                        <CardTitle className="text-lg font-bold text-white mt-1">
                          {sub.name}
                        </CardTitle>
                      </div>

                      {hasTracker && (
                        <Badge
                          className={`text-[9px] font-semibold px-2 py-0.5 ${
                            status === 'Safe'
                              ? 'bg-success/20 text-success border border-success/15'
                              : status === 'Critical'
                              ? 'bg-error/20 text-error border border-error/15'
                              : 'bg-slate-800 text-slate-400 border border-white/5'
                          }`}
                        >
                          {status}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6 flex-1 py-4">
                    {hasTracker ? (
                      <div className="space-y-4">
                        {/* Attendance Stats bar */}
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="text-3xl font-extrabold text-white">{pct.toFixed(0)}%</span>
                            <span className="text-xs text-slate-400 ml-1.5">({attended}/{total} classes)</span>
                          </div>
                        </div>

                        <Progress value={pct} className="h-2 bg-slate-850" />

                        {/* Status/Calculator Alert */}
                        <div className={`p-3 rounded-xl flex items-center gap-2.5 text-xs font-medium border ${
                          status === 'Safe'
                            ? 'bg-success/10 border-success/10 text-success'
                            : status === 'Critical'
                            ? 'bg-error/10 border-error/10 text-error'
                            : 'bg-slate-950/40 border-white/5 text-slate-400'
                        }`}>
                          {status === 'Critical' && <ShieldAlert className="h-4 w-4 shrink-0 text-error animate-bounce" />}
                          {status === 'Safe' && <Award className="h-4 w-4 shrink-0 text-success" />}
                          <span>{text}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6 text-center space-y-3">
                        <p className="text-xs text-slate-400">Attendance tracking is not initialized for this subject.</p>
                        <Button
                          onClick={() => handleInitialize(sub.id)}
                          size="sm"
                          disabled={initializeMutation.isPending}
                          className="bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs"
                        >
                          {initializeMutation.isPending && initializeMutation.variables?.subject_id === sub.id ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                          ) : (
                            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
                          )}
                          Initialize Tracker
                        </Button>
                      </div>
                    )}
                  </CardContent>

                  {hasTracker && (
                    <div className="p-4 bg-slate-950/40 border-t border-white/5 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLogClass(tracker.id, attended, total, true)}
                        className="flex-1 border-white/10 hover:bg-success/10 hover:text-success text-slate-300 hover:border-success/30 rounded-xl text-xs"
                      >
                        <Check className="h-4 w-4 mr-1" /> Present
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLogClass(tracker.id, attended, total, false)}
                        className="flex-1 border-white/10 hover:bg-error/10 hover:text-error text-slate-300 hover:border-error/30 rounded-xl text-xs"
                      >
                        <X className="h-4 w-4 mr-1" /> Absent
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleReset(tracker.id)}
                        className="border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl h-8 w-8"
                        title="Reset statistics"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </div>
    </LayoutShell>
  );
}
