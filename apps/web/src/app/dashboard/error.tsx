'use client';

import React, { useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/components/ui/card';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="border border-error/20 bg-slate-900/60 backdrop-blur-xl shadow-2xl max-w-md w-full">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error/15 text-error mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold text-white">Something went wrong!</CardTitle>
          <CardDescription className="text-slate-400 text-sm mt-1">
            An error occurred while loading your dashboard metrics.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-4 text-xs text-slate-500 font-mono bg-slate-950/40 rounded-xl max-h-40 overflow-y-auto">
          {error.message || 'Unknown runtime error'}
        </CardContent>
        <CardFooter className="flex gap-4 pt-6">
          <Button
            variant="outline"
            className="flex-1 border-white/10 hover:bg-white/5 text-white hover:text-white rounded-xl"
            onClick={() => reset()}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Link href="/" className="flex-1">
            <Button className="w-full bg-primary hover:bg-primary/95 text-white rounded-xl">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
