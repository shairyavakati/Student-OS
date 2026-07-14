'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/components/ui/card';
import { Sparkles, Loader2, MailCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmailVerificationPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(true); // Default verified for smooth demo UX

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1500);
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
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-success/20 to-success/40 border border-success/30 shadow-lg shadow-success/10">
              <MailCheck className="h-6 w-6 text-success" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Email Verified
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Your email address has been successfully verified.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4 py-2">
            <p className="text-slate-300 text-sm">
              Thank you for verifying your email. You now have full access to your academic workspaces, notes, AI utilities, and calendar integrations.
            </p>
          </CardContent>
          <CardFooter className="pb-8 pt-4">
            <Link href="/dashboard" className="w-full">
              <Button className="w-full bg-gradient-to-r from-primary to-accent hover:brightness-110 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
