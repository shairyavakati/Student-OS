'use client';

import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Skeleton } from '@/app/components/ui/skeleton';

export default function GroupsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-slate-800" />
          <Skeleton className="h-4 w-96 bg-slate-850" />
        </div>
        <Skeleton className="h-10 w-36 bg-slate-800 rounded-xl" />
      </div>

      {/* Grid Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-slate-900/50 border-white/5 p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-48 bg-slate-800" />
                  <Skeleton className="h-3.5 w-full bg-slate-850" />
                  <Skeleton className="h-3 w-2/3 bg-slate-850" />
                </div>
                <Skeleton className="h-8 w-20 bg-slate-800 rounded-xl" />
              </div>
            </Card>
          ))}
        </div>

        <div>
          <Card className="bg-slate-900/50 border-white/5 p-6 space-y-4">
            <Skeleton className="h-5 w-32 bg-slate-800" />
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 bg-slate-800 rounded-full" />
                    <Skeleton className="h-4 w-24 bg-slate-850" />
                  </div>
                  <Skeleton className="h-5 w-12 bg-slate-800 rounded-full" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
