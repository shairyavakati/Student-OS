'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { Skeleton } from '@/app/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-slate-800" />
          <Skeleton className="h-4 w-72 bg-slate-850" />
        </div>
        <Skeleton className="h-10 w-36 bg-slate-800 rounded-xl" />
      </div>

      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-slate-900/50 border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <Skeleton className="h-4 w-24 bg-slate-800" />
              <Skeleton className="h-8 w-8 bg-slate-800 rounded-xl" />
            </CardHeader>
            <CardContent className="space-y-1.5">
              <Skeleton className="h-8 w-16 bg-slate-800" />
              <Skeleton className="h-3.5 w-32 bg-slate-850" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Columns Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900/50 border-white/5 p-6 space-y-4">
            <Skeleton className="h-6 w-32 bg-slate-800" />
            <Skeleton className="h-64 w-full bg-slate-850 rounded-xl" />
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-white/5 p-6 space-y-4">
            <Skeleton className="h-6 w-40 bg-slate-800" />
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex justify-between items-center py-2 border-b border-white/5">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28 bg-slate-800" />
                    <Skeleton className="h-3 w-16 bg-slate-850" />
                  </div>
                  <Skeleton className="h-6 w-12 bg-slate-800 rounded-full" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
