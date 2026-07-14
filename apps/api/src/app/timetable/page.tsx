'use client';

import React, { useState } from 'react';
import LayoutShell from '@/components/layout-shell';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectService, timetableService } from '@/services/api-service';
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
import { Plus, Calendar, MapPin, User, Loader2, Clock, Check } from 'lucide-react';
import { toast } from 'sonner';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CLASS_TYPES = ['Lecture', 'Lab', 'Tutorial', 'Seminar', 'Exam'];
const PRESET_COLORS = [
  '#5B6CFF', // Indigo
  '#7C4DFF', // Purple
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#06B6D4', // Cyan
];

export default function TimetablePage() {
  const queryClient = useQueryClient();
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const [isSlotOpen, setIsSlotOpen] = useState(false);

  // Subject Form State
  const [subjName, setSubjName] = useState('');
  const [subjCode, setSubjCode] = useState('');
  const [subjColor, setSubjColor] = useState(PRESET_COLORS[0]);
  const [subjRoom, setSubjRoom] = useState('');
  const [subjProf, setSubjProf] = useState('');

  // Slot Form State
  const [slotSubjId, setSlotSubjId] = useState('');
  const [slotDay, setSlotDay] = useState('Mon');
  const [slotStart, setSlotStart] = useState('09:00');
  const [slotEnd, setSlotEnd] = useState('10:30');
  const [slotType, setSlotType] = useState('Lecture');
  const [slotRoom, setSlotRoom] = useState('');

  // Queries
  const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.list,
  });

  const { data: timetable = [], isLoading: loadingTimetable } = useQuery({
    queryKey: ['timetable'],
    queryFn: timetableService.list,
  });

  // Mutations
  const createSubjectMutation = useMutation({
    mutationFn: subjectService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setIsSubjectOpen(false);
      setSubjName('');
      setSubjCode('');
      setSubjRoom('');
      setSubjProf('');
      toast.success('Subject added successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Failed to add subject');
    },
  });

  const createSlotMutation = useMutation({
    mutationFn: timetableService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
      setIsSlotOpen(false);
      setSlotSubjId('');
      setSlotRoom('');
      toast.success('Schedule slot added successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Failed to add schedule slot');
    },
  });

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjName.trim() || !subjCode.trim()) {
      toast.error('Subject name and code are required');
      return;
    }
    createSubjectMutation.mutate({
      name: subjName,
      code: subjCode,
      color: subjColor,
      room: subjRoom || undefined,
      professor: subjProf || undefined,
    });
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotSubjId) {
      toast.error('Please select a subject');
      return;
    }
    createSlotMutation.mutate({
      subject_id: slotSubjId,
      day_of_week: slotDay,
      start_time: slotStart,
      end_time: slotEnd,
      class_type: slotType,
      room: slotRoom || undefined,
    });
  };

  return (
    <LayoutShell>
      <div className="space-y-8 pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Weekly Timetable
            </h1>
            <p className="text-slate-400 text-sm">
              Schedule slots, track lectures, and organize classroom details.
            </p>
          </div>
          <div className="flex gap-3">
            {/* Add Subject Button Dialog */}
            <Dialog open={isSubjectOpen} onOpenChange={setIsSubjectOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-xl text-xs">
                  <Plus className="mr-1.5 h-4 w-4" /> Add Subject
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Subject</DialogTitle>
                  <DialogDescription className="text-slate-400 text-xs">
                    Create a core subject to assign slots, tracks, and notes to.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddSubject} className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="subjName" className="text-slate-300 text-xs">Subject Name</Label>
                    <Input
                      id="subjName"
                      placeholder="Quantum Mechanics"
                      value={subjName}
                      onChange={(e) => setSubjName(e.target.value)}
                      className="bg-slate-950/40 border-white/10 text-white rounded-xl placeholder:text-slate-650"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subjCode" className="text-slate-300 text-xs">Code</Label>
                      <Input
                        id="subjCode"
                        placeholder="PHY401"
                        value={subjCode}
                        onChange={(e) => setSubjCode(e.target.value)}
                        className="bg-slate-950/40 border-white/10 text-white rounded-xl placeholder:text-slate-650"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subjProf" className="text-slate-300 text-xs">Professor</Label>
                      <Input
                        id="subjProf"
                        placeholder="Dr. Feynman"
                        value={subjProf}
                        onChange={(e) => setSubjProf(e.target.value)}
                        className="bg-slate-950/40 border-white/10 text-white rounded-xl placeholder:text-slate-650"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-xs">Color Theme</Label>
                    <div className="flex gap-2.5">
                      {PRESET_COLORS.map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setSubjColor(col)}
                          className="h-7 w-7 rounded-full flex items-center justify-center border-2 border-transparent transition-all shrink-0 hover:scale-105"
                          style={{ backgroundColor: col }}
                        >
                          {subjColor === col && <Check className="h-4 w-4 text-white font-bold" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <DialogFooter className="pt-4">
                    <Button
                      type="submit"
                      disabled={createSubjectMutation.isPending}
                      className="bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl w-full"
                    >
                      {createSubjectMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Subject'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Add Schedule Slot Dialog */}
            <Dialog open={isSlotOpen} onOpenChange={setIsSlotOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-accent hover:brightness-110 text-white font-semibold rounded-xl text-xs">
                  <Plus className="mr-1.5 h-4 w-4" /> Add Slot
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Class Slot</DialogTitle>
                  <DialogDescription className="text-slate-400 text-xs">
                    Map a subject to a day and weekly timeslot.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddSlot} className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-xs">Subject</Label>
                    <Select onValueChange={setSlotSubjId}>
                      <SelectTrigger className="bg-slate-950/40 border-white/10 text-white rounded-xl">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white">
                        {subjects.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.name} ({sub.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300 text-xs">Weekday</Label>
                      <Select defaultValue="Mon" onValueChange={setSlotDay}>
                        <SelectTrigger className="bg-slate-950/40 border-white/10 text-white rounded-xl">
                          <SelectValue placeholder="Select Day" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                          {DAYS.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300 text-xs">Class Type</Label>
                      <Select defaultValue="Lecture" onValueChange={setSlotType}>
                        <SelectTrigger className="bg-slate-950/40 border-white/10 text-white rounded-xl">
                          <SelectValue placeholder="Class Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                          {CLASS_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="slotStart" className="text-slate-300 text-xs">Start Time</Label>
                      <Input
                        id="slotStart"
                        type="time"
                        value={slotStart}
                        onChange={(e) => setSlotStart(e.target.value)}
                        className="bg-slate-950/40 border-white/10 text-white rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slotEnd" className="text-slate-300 text-xs">End Time</Label>
                      <Input
                        id="slotEnd"
                        type="time"
                        value={slotEnd}
                        onChange={(e) => setSlotEnd(e.target.value)}
                        className="bg-slate-950/40 border-white/10 text-white rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slotRoom" className="text-slate-300 text-xs">Room / Location (Optional)</Label>
                    <Input
                      id="slotRoom"
                      placeholder="Room 402B"
                      value={slotRoom}
                      onChange={(e) => setSlotRoom(e.target.value)}
                      className="bg-slate-950/40 border-white/10 text-white rounded-xl"
                    />
                  </div>

                  <DialogFooter className="pt-4">
                    <Button
                      type="submit"
                      disabled={createSlotMutation.isPending}
                      className="bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl w-full"
                    >
                      {createSlotMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Slot to Schedule'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Day Select Tabs on Mobile / Quick filter */}
        <div className="flex border-b border-white/5 pb-px overflow-x-auto gap-2">
          {DAYS.map((day) => {
            const daySlotsCount = timetable.filter((s) => s.day_of_week === day).length;
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'border-primary text-white bg-gradient-to-t from-primary/5 to-transparent'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {day}
                {daySlotsCount > 0 && (
                  <span className={`text-[10px] h-4.5 min-w-4.5 flex items-center justify-center rounded-full px-1 ${
                    isSelected ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {daySlotsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Grid / List of slots for the selected day */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingTimetable ? (
            [1, 2, 3].map((k) => (
              <Card key={k} className="bg-slate-900/40 border-white/5 p-6 animate-pulse space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-28 bg-slate-800 rounded" />
                  <div className="h-5 w-12 bg-slate-800 rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-3.5 w-32 bg-slate-850 rounded" />
                  <div className="h-3 w-20 bg-slate-850 rounded" />
                </div>
              </Card>
            ))
          ) : (
            (() => {
              const activeSlots = timetable
                .filter((s) => s.day_of_week === selectedDay)
                .sort((a, b) => a.start_time.localeCompare(b.start_time));

              if (activeSlots.length === 0) {
                return (
                  <div className="col-span-full py-16 text-center text-slate-500 text-sm">
                    No classes scheduled for {selectedDay}. Click "Add Slot" to configure.
                  </div>
                );
              }

              return activeSlots.map((slot) => {
                const subColor = slot.subject?.color || '#5B6CFF';
                return (
                  <Card
                    key={slot.id}
                    className="border border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl hover:border-white/10 transition-all overflow-hidden relative"
                  >
                    <div className="absolute top-0 left-0 bottom-0 w-1.5" style={{ backgroundColor: subColor }} />
                    <CardHeader className="pl-6 pb-2">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="text-xs font-semibold text-slate-400">{slot.subject?.code}</p>
                          <CardTitle className="text-base font-bold text-white mt-0.5 truncate max-w-[180px]">
                            {slot.subject?.name}
                          </CardTitle>
                        </div>
                        <Badge variant="outline" className="border-white/10 text-slate-400 capitalize text-[9px] h-5">
                          {slot.class_type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pl-6 pt-2 space-y-3">
                      <div className="space-y-1.5 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                          <span>
                            {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                          </span>
                        </div>
                        {slot.room && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-slate-500" />
                            <span>{slot.room}</span>
                          </div>
                        )}
                        {slot.subject?.professor && (
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-slate-500" />
                            <span>{slot.subject.professor}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              });
            })()
          )}
        </div>
      </div>
    </LayoutShell>
  );
}
