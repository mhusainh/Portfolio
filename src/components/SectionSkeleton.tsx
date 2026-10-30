import React from "react";

export function SectionSkeleton({
  cardsCount = 2,
  cardHeight = "h-48",
  cols = "grid-cols-1 md:grid-cols-2",
}: {
  cardsCount?: number;
  cardHeight?: string;
  cols?: string;
}) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-14 border-t-2 border-black dark:border-white">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="w-32 h-6 neo-skeleton border-2 border-black dark:border-white mb-2"></div>
        <div className="w-64 h-9 neo-skeleton border-2 border-black dark:border-white mb-2"></div>
        <div className="w-96 max-w-full h-4 neo-skeleton border border-black dark:border-white"></div>
      </div>

      {/* Cards Skeleton Grid */}
      <div className={`grid ${cols} gap-6`}>
        {Array.from({ length: cardsCount }).map((_, i) => (
          <div
            key={i}
            className={`w-full ${cardHeight} neo-skeleton border-2 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] p-6 flex flex-col justify-between`}
          >
            <div className="space-y-3">
              <div className="w-24 h-5 bg-black/10 dark:bg-white/10 rounded"></div>
              <div className="w-3/4 h-7 bg-black/15 dark:bg-white/15 rounded"></div>
              <div className="w-full h-4 bg-black/10 dark:bg-white/10 rounded"></div>
            </div>
            <div className="flex gap-2">
              <div className="w-16 h-6 bg-black/10 dark:bg-white/10 rounded"></div>
              <div className="w-16 h-6 bg-black/10 dark:bg-white/10 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
