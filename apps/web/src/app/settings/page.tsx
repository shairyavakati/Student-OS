'use client';

import React, { useState } from 'react';
import LayoutShell from '@/components/layout-shell';
import { useAuth } from '@/hooks/use-auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/services/api-service';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { User, Shield, Loader2, Sparkles, Sun, Moon, HelpCircle, Save } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();

  // Form State
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [semester, setSemester] = useState<number>(user?.semester || 1);
  const [department, setDepartment] = useState(user?.department || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  // Mutation
  const updateMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: async () => {
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      toast.success('Profile settings updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Failed to update profile settings');
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !department.trim()) {
      toast.error('Name and department are required');
      return;
    }
    updateMutation.mutate({
      full_name: fullName,
      semester,
      department,
      avatar_url: avatarUrl || undefined,
    });
  };

  return (
    <LayoutShell>
      <div className="max-w-4xl mx-auto space-y-8 pb-10 text-left">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            System Settings
          </h1>
          <p className="text-slate-400 text-sm">
            Manage your personal profile, workspace details, and theme configurations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation/Shortcuts */}
          <div className="space-y-2">
            <Button
              variant="default"
              className="w-full justify-start rounded-xl text-xs font-semibold bg-primary text-white"
            >
              <User className="mr-2 h-4.5 w-4.5" /> Account Profile
            </Button>
            <Button
              variant="ghost"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-full justify-start rounded-xl text-xs font-semibold text-slate-400 hover:bg-white/5 hover:text-white"
            >
              {theme === 'dark' ? <Sun className="mr-2 h-4.5 w-4.5 text-primary" /> : <Moon className="mr-2 h-4.5 w-4.5 text-accent" />}
              Toggle Display Mode
            </Button>
          </div>

          {/* Form Content */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Shield className="h-4.5 w-4.5 text-primary" />
                  Edit Student Profile
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Update your identity card, academic department, and semesters.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSave}>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-slate-350 text-xs">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-slate-950/40 border-white/10 text-white rounded-xl placeholder:text-slate-650"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatarUrl" className="text-slate-350 text-xs">Avatar URL</Label>
                      <Input
                        id="avatarUrl"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="bg-slate-950/40 border-white/10 text-white rounded-xl placeholder:text-slate-650"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-350 text-xs">Academic Semester</Label>
                      <Select value={semester.toString()} onValueChange={(val) => setSemester(parseInt(val))}>
                        <SelectTrigger className="bg-slate-950/40 border-white/10 text-white rounded-xl">
                          <SelectValue placeholder="Semester" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                            <SelectItem key={s} value={s.toString()}>
                              Semester {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-slate-350 text-xs">Department</Label>
                      <Input
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="bg-slate-950/40 border-white/10 text-white rounded-xl placeholder:text-slate-650"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-white/5 bg-slate-950/10 p-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl text-xs gap-1.5"
                  >
                    {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Display/Appearance Settings */}
            <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-accent" />
                  Appearance Preferences
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Customize the interface theme styling for the academic workstation.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-200">Active Theme Mode</p>
                    <p className="text-slate-500 text-[10px]">Switch between light and dark display modes</p>
                  </div>
                  <Select value={theme} onValueChange={(val) => setTheme(val)}>
                    <SelectTrigger className="bg-slate-950/40 border-white/10 text-white rounded-xl w-32">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      <SelectItem value="light">Light Mode</SelectItem>
                      <SelectItem value="dark">Dark Mode</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LayoutShell>
  );
}
