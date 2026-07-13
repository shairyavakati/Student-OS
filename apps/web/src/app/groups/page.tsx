'use client';

import React, { useState } from 'react';
import LayoutShell from '@/components/layout-shell';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupService } from '@/services/api-service';
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
import { Users, Plus, CheckCircle2, UserPlus, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function GroupsPage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // Group Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Selected Group for viewing members
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Queries
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: groupService.list,
  });

  const { data: members = [], isLoading: loadingMembers } = useQuery({
    queryKey: ['members', selectedGroupId],
    queryFn: () => (selectedGroupId ? groupService.getMembers(selectedGroupId) : Promise.resolve([])),
    enabled: !!selectedGroupId,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: groupService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setIsOpen(false);
      setName('');
      setDescription('');
      toast.success('Study Group created successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Failed to create group');
    },
  });

  const joinMutation = useMutation({
    mutationFn: groupService.join,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      if (selectedGroupId) {
        queryClient.invalidateQueries({ queryKey: ['members', selectedGroupId] });
      }
      toast.success('Joined study group successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Failed to join group');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Group name is required');
      return;
    }
    createMutation.mutate({ name, description: description || undefined });
  };

  const handleJoin = (groupId: string) => {
    joinMutation.mutate(groupId);
  };

  return (
    <LayoutShell>
      <div className="space-y-8 pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Collaborative Study Groups
            </h1>
            <p className="text-slate-400 text-sm">
              Create peer groups, join academic workspaces, and share milestones with fellow students.
            </p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-accent hover:brightness-110 text-white font-semibold rounded-xl text-xs">
                <Plus className="mr-1.5 h-4 w-4" /> Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
              <DialogHeader>
                <DialogTitle>Create Study Group</DialogTitle>
                <DialogDescription className="text-slate-400 text-xs">
                  Create a new collaboration hub for assignments and study revision.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300 text-xs">Group Name</Label>
                  <Input
                    id="name"
                    placeholder="Linear Algebra Prep Study"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-slate-950/40 border-white/10 text-white rounded-xl placeholder:text-slate-650"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-300 text-xs">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Preparing for the Linear Algebra final exams and midterms."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-slate-950/40 border-white/10 text-white rounded-xl placeholder:text-slate-650"
                  />
                </div>

                <DialogFooter className="pt-4">
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl w-full"
                  >
                    {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Group'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Groups list and details view */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {isLoading ? (
              [1, 2].map((i) => (
                <Card key={i} className="bg-slate-900/40 border-white/5 p-6 animate-pulse space-y-3">
                  <div className="h-5 w-40 bg-slate-800 rounded" />
                  <div className="h-3 w-72 bg-slate-850 rounded" />
                </Card>
              ))
            ) : groups.length === 0 ? (
              <div className="border border-white/5 bg-slate-900/10 rounded-2xl p-16 text-center text-slate-500 text-sm">
                No active study groups. Click "Create Group" to start one!
              </div>
            ) : (
              groups.map((group) => {
                const isSelected = selectedGroupId === group.id;
                return (
                  <Card
                    key={group.id}
                    onClick={() => setSelectedGroupId(group.id)}
                    className={`border transition-all cursor-pointer rounded-2xl overflow-hidden text-left hover:bg-slate-900/60 ${
                      isSelected
                        ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5'
                        : 'bg-slate-900/40 border-white/5'
                    }`}
                  >
                    <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                          <Users className="h-4.5 w-4.5 text-primary shrink-0" />
                          {group.name}
                        </CardTitle>
                        <p className="text-slate-400 text-xs mt-1">{group.description || 'No description provided.'}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoin(group.id);
                          }}
                          disabled={joinMutation.isPending}
                          className="border-white/10 text-xs hover:bg-primary/20 hover:text-white rounded-xl gap-1"
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          Join
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })
            )}
          </div>

          {/* Members Panel */}
          <div>
            {selectedGroupId ? (
              <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl p-6">
                <CardTitle className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="h-4.5 w-4.5 text-accent" />
                  Group Members
                </CardTitle>

                {loadingMembers ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  </div>
                ) : members.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No members listed.</p>
                ) : (
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-left text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="h-6 w-6 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-[10px] uppercase">
                            M
                          </div>
                          <span className="font-semibold text-slate-200">User {member.user_id.substring(0, 5)}</span>
                        </div>
                        <Badge
                          className={`text-[9px] capitalize ${
                            member.role === 'creator'
                              ? 'bg-primary/20 text-primary border border-primary/10'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {member.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ) : (
              <div className="border border-white/5 bg-slate-900/10 rounded-2xl p-8 text-center text-slate-500 text-xs">
                Select a study group from the list to view its members.
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutShell>
  );
}
