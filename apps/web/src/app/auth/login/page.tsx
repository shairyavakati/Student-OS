'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { KeyRound, Mail, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = zod.object({
  email: zod.string().email({ message: 'Please enter a valid email address' }),
  password: zod.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = zod.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(values);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-radial from-slate-900 via-slate-950 to-black px-4 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="space-y-2 text-center pt-8 pb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-accent shadow-lg shadow-primary/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Nexora
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Sign in to manage your academic dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    placeholder="name@university.edu"
                    type="email"
                    className="pl-10 bg-slate-950/40 border-white/10 text-white placeholder-slate-500 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl"
                    disabled={isSubmitting || loading}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-error font-medium mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-300">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-primary hover:text-primary-foreground transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-slate-950/40 border-white/10 text-white placeholder-slate-500 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl"
                    disabled={isSubmitting || loading}
                    {...register('password')}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-error font-medium mt-1">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:brightness-110 text-white font-semibold py-2.5 rounded-xl mt-2 transition-all flex items-center justify-center gap-2"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-8 pt-4 border-t border-white/5">
            <div className="text-center text-xs text-slate-400">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-primary hover:underline font-semibold">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
