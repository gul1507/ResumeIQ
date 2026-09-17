import React from 'react';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`skeleton rounded-lg ${className}`} />
);

/** Full candidate card skeleton for loading state */
export const CandidateCardSkeleton: React.FC = () => (
  <div className="p-4 bg-obsidian-900 border border-white/[0.07] rounded-xl space-y-3 animate-fade-in-up">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-xl" />
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-2.5 w-20" />
        </div>
      </div>
      <Skeleton className="h-8 w-16 rounded-lg" />
    </div>
    <div className="space-y-1.5">
      <Skeleton className="h-2 w-full" />
      <Skeleton className="h-1.5 w-full rounded-full" />
    </div>
    <div className="flex gap-1.5">
      <Skeleton className="h-5 w-14 rounded-md" />
      <Skeleton className="h-5 w-16 rounded-md" />
      <Skeleton className="h-5 w-12 rounded-md" />
    </div>
  </div>
);

/** Score gauge skeleton */
export const ScoreGaugeSkeleton: React.FC = () => (
  <div className="p-6 bg-obsidian-900 border border-white/[0.08] rounded-2xl flex flex-col items-center gap-4 animate-fade-in-up">
    <Skeleton className="h-3 w-24" />
    <Skeleton className="h-48 w-48 rounded-full" />
    <Skeleton className="h-6 w-32 rounded-full" />
    <div className="w-full space-y-3 pt-4 border-t border-white/[0.08]">
      <div className="space-y-1">
        <div className="flex justify-between">
          <Skeleton className="h-2.5 w-32" />
          <Skeleton className="h-2.5 w-10" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <Skeleton className="h-2.5 w-28" />
          <Skeleton className="h-2.5 w-10" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </div>
  </div>
);

/** Pipeline step skeleton */
export const PipelineStepsSkeleton: React.FC = () => (
  <div className="bg-obsidian-900 border border-white/[0.08] rounded-2xl p-5 animate-fade-in-up">
    <div className="flex items-center gap-2 mb-4">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-3 w-40" />
    </div>
    <div className="grid grid-cols-4 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-3 rounded-xl border border-white/[0.06] flex items-center gap-2.5">
          <Skeleton className="h-4 w-4 rounded-full shrink-0" />
          <Skeleton className="h-3 flex-1" />
        </div>
      ))}
    </div>
  </div>
);

export { Skeleton };
