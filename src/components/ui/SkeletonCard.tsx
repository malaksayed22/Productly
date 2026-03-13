import React from "react";

export interface SkeletonCardProps {
  count?: number;
}

const SingleSkeleton: React.FC = () => (
  <div
    className="flex flex-col overflow-hidden rounded-2xl"
    style={{
      backgroundColor: "var(--bg-secondary)",
      border: "1px solid var(--border)",
    }}
  >
    {/* Image placeholder */}
    <div className="h-[220px] w-full shimmer" />

    <div className="flex flex-col gap-3 p-4">
      {/* Category badge */}
      <div className="h-4 w-20 rounded-full shimmer" />

      {/* Title */}
      <div className="space-y-2">
        <div className="h-4 w-full rounded-lg shimmer" />
        <div className="h-4 w-2/3 rounded-lg shimmer" />
      </div>

      {/* Price + stock row */}
      <div className="flex items-center justify-between pt-2">
        <div className="h-5 w-16 rounded shimmer" />
        <div className="h-4 w-14 rounded-full shimmer" />
      </div>
    </div>
  </div>
);

const SkeletonCard: React.FC<SkeletonCardProps> = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <SingleSkeleton key={i} />
    ))}
  </>
);

export default SkeletonCard;
