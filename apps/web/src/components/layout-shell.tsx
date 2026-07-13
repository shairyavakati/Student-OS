'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from 'next-themes';
import { aiService } from '@/services/api-service';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  BookOpen,
  Brain,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
  Award,
  User as UserIcon,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/app/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Timetable', href: '/timetable', icon: Calendar },
  { name: 'Attendance', href: '/attendance', icon: Award },
  { name: 'Assignments', href: '/assignments', icon: CheckSquare },
  { name: 'Notes', href: '/notes', icon: BookOpen },
  { name: 'AI Assistant', href: '/ai', icon: Brain },
];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await aiService.getSmartNotifications();
        if (res && res.recommendations) {
          setNotifications(res.recommendations);
          setUnreadCount(res.recommendations.length);
        }
      } catch (err) {
        console.error('Failed to load notifications', err);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItemClass = (href: string) => {
    const isActive = pathname === href || pathname.startsWith(href + '/');
    return `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-primary/20 to-accent/15 border-l-4 border-primary text-white'
        : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
    }`;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-950/40 backdrop-blur-xl border-r border-white/5">
      {/* Brand */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-white/5">
        <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-accent">
          <Sparkles className="h-4.5 w-4.5 text-white" />
        </div>
        <span className="font-bold text-lg text-white">Nexora</span>
      </div>

      {/* Nav Link List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navigation.map((item) => (
          <Link key={item.name} href={item.href} className={navItemClass(item.href)}>
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* User Bar / Footer */}
      <div className="p-4 border-t border-white/5 bg-slate-950/20">
        <div className="flex items-center justify-between gap-2 px-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-white/10">
              <AvatarImage src={user?.avatar_url || ''} />
              <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs uppercase">
                {user?.full_name?.substring(0, 2) || 'ST'}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-xs font-semibold text-white max-w-[120px] truncate">{user?.full_name}</p>
              <p className="text-[10px] text-slate-500 max-w-[120px] truncate">{user?.email}</p>
            </div>
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={logout}
            className="text-slate-400 hover:text-error hover:bg-error/10 h-8 w-8 rounded-lg"
          >
            <LogOut className="h-4.5 w-4.5" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Desktop Sidebar (Persistent) */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Header bar */}
        <header className="h-16 border-b border-white/5 bg-slate-950/40 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Nav Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-slate-400 hover:text-white hover:bg-white/5 rounded-lg">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 bg-slate-950 border-white/5">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h2 className="font-bold text-lg text-slate-100 hidden sm:block">
              {pathname === '/dashboard' && 'Academic Command Center'}
              {pathname === '/timetable' && 'Class Schedule Grid'}
              {pathname === '/attendance' && 'Attendance Insights'}
              {pathname === '/assignments' && 'Assignments & Milestones'}
              {pathname === '/notes' && 'Collaborative Notes'}
              {pathname === '/ai' && 'AI Cognitive Assistant'}
            </h2>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleTheme}
              className="text-slate-400 hover:text-white hover:bg-white/5 rounded-lg h-9 w-9"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </Button>

            {/* Smart Notification Center */}
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setUnreadCount(0);
                }}
                className="text-slate-400 hover:text-white hover:bg-white/5 rounded-lg h-9 w-9 relative"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-slate-950 animate-pulse" />
                )}
              </Button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    {/* Overlay to close */}
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <span className="font-semibold text-sm text-white flex items-center gap-1.5">
                          <Brain className="h-4 w-4 text-primary animate-pulse" />
                          AI Recommendations
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setNotifications([])}
                          className="text-[10px] text-slate-400 hover:text-white h-6 px-2"
                        >
                          Clear all
                        </Button>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                        {notifications.length > 0 ? (
                          notifications.map((notif, idx) => (
                            <div key={idx} className="p-4 hover:bg-white/5 transition-colors text-left space-y-1">
                              <p className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                                {notif.title}
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                                  notif.type === 'alert' ? 'bg-error/20 text-error border border-error/10' : 'bg-primary/20 text-primary border border-primary/10'
                                }`}>
                                  {notif.type}
                                </span>
                              </p>
                              <p className="text-[11px] text-slate-400 leading-normal">{notif.message}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-slate-500 text-xs">
                            No recommendations at this time.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                  <Avatar className="h-8 w-8 border border-white/10">
                    <AvatarImage src={user?.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                      {user?.full_name?.substring(0, 2) || 'ST'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-900 border-white/10 text-white" align="end">
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-white">{user?.full_name}</p>
                    <p className="text-xs leading-none text-slate-400">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem className="focus:bg-white/5 focus:text-white gap-2 p-2">
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  <span>
                    Semester {user?.semester || 1} • {user?.department || 'CS'}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem onClick={logout} className="focus:bg-error/10 focus:text-error text-error gap-2 p-2 cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-slate-950 to-slate-900 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
