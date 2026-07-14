'use client';

import React, { useState } from 'react';
import LayoutShell from '@/components/layout-shell';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectService, assignmentService } from '@/services/api-service';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Slider } from '@/app/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Plus, Calendar, AlertCircle, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

export default function AssignmentsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [isOpen, setIsOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subjId, setSubjId] = useState<string>('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Queries
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.list,
  });

  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: assignmentService.list,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: assignmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      setIsOpen(false);
      setTitle('');
      setSubjId('');
      setDueDate('');
      toast.success('Assignment created!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Failed to create assignment');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isDone }: { id: string; isDone: boolean }) =>
      assignmentService.update(id, { is_done: isDone, progress_percentage: isDone ? 100 : 0 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });

  const progressMutation = useMutation({
    mutationFn: ({ id, progress }: { id: string; progress: number }) =>
      assignmentService.update(id, { progress_percentage: progress, is_done: progress === 100 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: assignmentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast.success('Assignment deleted');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      toast.error('Assignment title and due date are required');
      return;
    }
    createMutation.mutate({
      title,
      subject_id: subjId || null,
      due_date: new Date(dueDate).toISOString(),
      priority,
      is_done: false,
      progress_percentage: 0,
    });
  };

  const handleToggle = (id: string, currentVal: boolean) => {
    toggleMutation.mutate({ id, isDone: !currentVal });
  };

  const handleProgressChange = (id: string, val: number[]) => {
    progressMutation.mutate({ id, progress: val[0] });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const filteredAssignments = assignments
    .filter((a) => {
      if (filter === 'pending') return !a.is_done;
      if (filter === 'completed') return a.is_done;
      return true;
    })
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  return (
    <LayoutShell>
      <div className="space-y-8 pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Assignments & Tasks
            </h1>
            <p className="text-slate-400 text-sm">
              Keep track of deadlines, monitor progress, and manage academic priorities.
            </p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-accent hover:brightness-110 text-white font-semibold rounded-xl text-xs">
                <Plus className="mr-1.5 h-4 w-4" /> Add Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
              <DialogHeader>
                <DialogTitle>Add Assignment</DialogTitle>
                <DialogDescription className="text-slate-400 text-xs">
                  Create a due assignment or study task milestone.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-300 text-xs">Assignment Title</Label>
                  <Input
                    id="title"
                    placeholder="Lab Report 3: Double Slit Experiment"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-slate-950/40 border-white/10 text-white rounded-xl placeholder:text-slate-650"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-xs">Subject</Label>
                    <Select onValueChange={setSubjId}>
                      <SelectTrigger className="bg-slate-950/40 border-white/10 text-white rounded-xl">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white">
                        <SelectItem value="none">General / None</SelectItem>
                        {subjects.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300 text-xs">Priority</Label>
                    <Select defaultValue="medium" onValueChange={(val: any) => setPriority(val)}>
                      <SelectTrigger className="bg-slate-950/40 border-white/10 text-white rounded-xl">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate" className="text-slate-300 text-xs">Due Date & Time</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-slate-950/40 border-white/10 text-white rounded-xl"
                  />
                </div>

                <DialogFooter className="pt-4">
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl w-full"
                  >
                    {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Assignment'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tab Filters */}
        <div className="flex border-b border-white/5 pb-px gap-4">
          {(['pending', 'completed', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`py-3 px-2 text-sm font-semibold border-b-2 transition-all capitalize ${
                filter === tab ? 'border-primary text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab} ({assignments.filter((a) => (tab === 'pending' ? !a.is_done : tab === 'completed' ? a.is_done : true)).length})
            </button>
          ))}
        </div>

        {/* Assignments Listing */}
        <div className="space-y-4">
          {isLoading ? (
            [1, 2, 3].map((n) => (
              <div key={n} className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl animate-pulse space-y-3">
                <div className="flex justify-between">
                  <div className="h-5 w-48 bg-slate-800 rounded" />
                  <div className="h-5 w-16 bg-slate-800 rounded" />
                </div>
                <div className="h-2 w-full bg-slate-850 rounded" />
              </div>
            ))
          ) : filteredAssignments.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-sm">
              No assignments found matching this filter.
            </div>
          ) : (
            filteredAssignments.map((ass) => {
              const matchedSub = subjects.find((s) => s.id === ass.subject_id);
              const isOverdue = !ass.is_done && new Date(ass.due_date).getTime() < new Date().getTime();

              return (
                <Card
                  key={ass.id}
                  className={`border border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl overflow-hidden hover:border-white/10 transition-all ${
                    ass.is_done ? 'opacity-65' : ''
                  }`}
                >
                  <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <Checkbox
                        checked={ass.is_done}
                        onCheckedChange={() => handleToggle(ass.id, ass.is_done)}
                        className="mt-1 h-5 w-5 border-white/20 rounded-md focus-visible:ring-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className={`text-sm font-semibold truncate ${ass.is_done ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                            {ass.title}
                          </span>
                          {matchedSub && (
                            <Badge
                              variant="outline"
                              className="text-[9px] font-bold border-white/10"
                              style={{ color: matchedSub.color, borderColor: `${matchedSub.color}25` }}
                            >
                              {matchedSub.name}
                            </Badge>
                          )}
                          <Badge
                            className={`text-[9px] capitalize ${
                              ass.priority === 'high'
                                ? 'bg-error/20 text-error border border-error/15'
                                : ass.priority === 'medium'
                                ? 'bg-warning/20 text-warning border border-warning/15'
                                : 'bg-success/20 text-success border border-success/15'
                            }`}
                          >
                            {ass.priority}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-slate-400 text-xs">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(parseISO(ass.due_date), 'MMM dd, yyyy h:mm a')}
                          </span>
                          {isOverdue && (
                            <span className="text-error flex items-center gap-1 font-semibold animate-pulse">
                              <AlertCircle className="h-3.5 w-3.5" />
                              Overdue
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Slider */}
                    <div className="w-full md:w-48 space-y-2">
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <span>Progress</span>
                        <span className="font-semibold text-white">{ass.progress_percentage}%</span>
                      </div>
                      <Slider
                        defaultValue={[ass.progress_percentage]}
                        max={100}
                        step={10}
                        onValueCommit={(val) => handleProgressChange(ass.id, val)}
                        disabled={ass.is_done}
                        className="cursor-pointer"
                      />
                    </div>

                    {/* Actions */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(ass.id)}
                      className="text-slate-500 hover:text-error hover:bg-error/10 h-8 w-8 rounded-lg self-end md:self-center shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </LayoutShell>
  );
}
