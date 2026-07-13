'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/components/ui/card';
import { Sparkles, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, value: string) => {
    // Only allow single numbers
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData('text').trim();
    if (pasteData.length === 6 && !isNaN(Number(pasteData))) {
      const newOtp = pasteData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Identity verified successfully!');
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-radial from-slate-900 via-slate-950 to-black px-4 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

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
              Enter OTP
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              We've sent a 6-digit code to your email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between gap-2 max-w-xs mx-auto">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => {
                      if (el) inputRefs.current[idx] = el;
                    }}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={handlePaste}
                    className="w-10 h-12 text-center text-xl font-bold text-white bg-slate-950/50 border border-white/10 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                  />
                ))}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:brightness-110 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-8 pt-4 border-t border-white/5">
            <div className="text-center text-xs text-slate-400">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={() => toast.success('New OTP sent!')}
                className="text-primary hover:underline font-semibold"
              >
                Resend Code
              </button>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="h-3 w-3" />
              Back
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
