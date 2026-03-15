"use client";

import React from "react";

type ArmySummaryItem = {
  id: string;
  name: string;
  pointsText: string;
  costText: string | null;
};

export type ArmySummaryProps = {
  items: ArmySummaryItem[];
};

function ArmySummary({ items }: ArmySummaryProps) {
  return (
    <div className="flex-shrink-0 min-w-0">
      <h2 className="font-workbench uppercase text-base tracking-wide mb-1.5 border-b-2 border-[#231F20] pb-1">
        Army Overview
      </h2>
      {items.length === 0 ? (
        <p className="text-sm font-plex-mono py-1.5">
          No units selected.
        </p>
      ) : (
        <ul className="space-y-1 text-sm font-plex-mono">
          {items.map((item) => (
            <li
              key={item.id}
              className="py-1 border-b border-[#231F20]/30 last:border-b-0 min-w-0"
            >
              <div className="font-medium text-[#231F20] uppercase break-words">
                <span>{item.name}</span>
              </div>
              <div className="text-xs text-[#231F20]/90 tabular-nums mt-0.5">
                {item.pointsText}
                {item.costText && ` • ${item.costText}`}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default React.memo(ArmySummary);

