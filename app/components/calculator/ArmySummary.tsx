"use client";

import React from "react";
import { useState } from "react";

type ArmySummaryItem = {
  id: string;
  name: string;
  pointsText: string;
  costText: string | null;
};

export type ArmySummaryProps = {
  items: ArmySummaryItem[];
  removeUnit: (unitId: string) => void;
};

function ArmySummary({ items, removeUnit }: ArmySummaryProps) {
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  return (
    <div className="flex-shrink-0 min-w-0">
      <div className="sticky top-0 bg-[#B2C4AE] z-10 pb-2">
        <h2 className="font-workbench uppercase text-base tracking-wide mb-1.5 border-b-2 border-[#231F20] pb-1">
          Army Overview
        </h2>
      </div>
      {items.length === 0 ? (
        <p className="text-sm font-plex-mono py-1.5">
          No units selected.
        </p>
      ) : (
        <ul className="space-y-2 text-sm font-plex-mono">
          {items.map((item) => (
            <li
              key={item.id}
              onClick={() => {
                setSelectedUnitId(item.id === selectedUnitId ? null : item.id);
              }}
              className={`py-1.5 border-b border-[#231F20]/30 last:border-b-0 min-w-0 flex justify-between items-center cursor-pointer ${
                selectedUnitId === item.id ? "bg-[#9FB49A]/40" : ""
              }`}
            >
              <div className="font-medium text-[#231F20] uppercase break-words min-w-0">
                <span>{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#231F20]/90 tabular-nums whitespace-nowrap text-right">
                  {item.pointsText}
                  {item.costText && ` • ${item.costText}`}
                </span>
                {selectedUnitId === item.id && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeUnit(item.id);
                    }}
                    className="ml-2 border px-2 py-0.5 text-xs"
                  >
                    -
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default React.memo(ArmySummary);

