"use client";

import React, { useState } from "react";

const INPUT_STYLE =
  "w-full border-2 border-[#231F20] bg-[#B2C4AE] px-2 py-1 text-sm text-[#231F20] font-plex-mono focus:outline-none focus:ring-2 focus:ring-[#231F20] rounded-none";
const BTN_STYLE =
  "px-1.5 py-0.5 border-2 border-[#231F20] bg-[#B2C4AE] text-[#231F20] text-sm font-plex-mono hover:bg-[#9FB49A] focus:outline-none rounded-none shadow-none";

export type CalculatorControlsProps = {
  search: string;
  setSearch: (value: string) => void;
  selectedFactionSlug: string;
  setSelectedFactionSlug: (slug: string) => void;
  targetPoints: number;
  setTargetPoints: (value: number) => void;
  discount: number;
  setDiscount: (value: number) => void;
  factions: { slug: string; name: string }[];
  factionAccentColor: string;
  onFactionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
};

function CalculatorControls({
  search,
  setSearch,
  selectedFactionSlug,
  // setSelectedFactionSlug, // handled via onFactionChange to preserve logic
  targetPoints,
  setTargetPoints,
  discount,
  setDiscount,
  factions,
  factionAccentColor,
  onFactionChange,
  searchInputRef,
}: CalculatorControlsProps) {
  const [showDiscountEmpty, setShowDiscountEmpty] = useState(false);

  return (
    <>
      <div className="relative mb-3">
        <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-xs text-[#231F20]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="stroke-[#231F20]"
          >
            <circle
              cx="7"
              cy="7"
              r="4"
              fill="none"
              strokeWidth="1.5"
            />
            <line
              x1="9.5"
              y1="9.5"
              x2="13"
              y2="13"
              strokeWidth="1.5"
            />
          </svg>
        </span>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${INPUT_STYLE} pl-7 pr-7`}
          aria-label="Search units"
        />
        {search.trim().length > 0 && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              if (searchInputRef.current) {
                searchInputRef.current.focus();
              }
            }}
            className="absolute inset-y-0 right-0 px-2 border-l-2 border-[#231F20] bg-[#B2C4AE] text-xs font-plex-mono text-[#231F20] hover:bg-[#9FB49A] focus:outline-none focus:ring-2 focus:ring-[#231F20]"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      <div className="mb-3 space-y-2 lg:space-y-0 lg:flex lg:items-center lg:gap-2">
        <div className="flex items-center w-full min-w-0">
          <label
            htmlFor="target-points"
            className="text-sm font-workbench shrink-0 mr-2"
          >
            Target pts
          </label>
          <div className="flex items-center gap-1 ml-auto min-w-0 overflow-hidden">
            <button
              type="button"
              onClick={() => setTargetPoints(250)}
              className={`${BTN_STYLE} hidden min-[440px]:inline-flex shrink basis-auto px-2`}
            >
              250
            </button>
            <button
              type="button"
              onClick={() => setTargetPoints(500)}
              className={`${BTN_STYLE} shrink basis-auto px-2`}
            >
              500
            </button>
            <button
              type="button"
              onClick={() => setTargetPoints(1000)}
              className={`${BTN_STYLE} shrink basis-auto px-2`}
            >
              1000
            </button>
            <button
              type="button"
              onClick={() => setTargetPoints(2000)}
              className={`${BTN_STYLE} shrink basis-auto px-2`}
            >
              2000
            </button>
            <input
              id="target-points"
              type="number"
              min={0}
              value={targetPoints}
              onFocus={(e) => {
                e.target.select();
              }}
              onChange={(e) => {
                const raw = e.target.value;
                const val = raw.replace(/^0+/, "");
                setTargetPoints(val === "" ? 0 : parseInt(val, 10));
              }}
              onBlur={(e) => {
                if (e.target.value.trim() === "") {
                  setTargetPoints(0);
                }
              }}
              className="ml-1 w-[64px] min-w-[56px] border-2 border-[#231F20] bg-[#B2C4AE] px-1 py-1 text-sm font-plex-mono text-[#231F20] tabular-nums rounded-none shrink-0"
            />
          </div>
        </div>
        <div className="flex items-center w-full min-w-0 gap-2 lg:ml-auto">
          <label
            htmlFor="faction-select"
            className="text-sm font-workbench shrink-0 mr-1"
          >
            Faction
          </label>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <select
              id="faction-select"
              value={selectedFactionSlug}
              onChange={onFactionChange}
              className="border-2 bg-[#B2C4AE] px-2 py-1 text-sm text-[#231F20] font-plex-mono focus:outline-none rounded-none flex-1 min-w-0"
              style={{
                borderColor: factionAccentColor,
              }}
            >
              {factions.map((f) => (
                <option key={f.slug} value={f.slug}>
                  {f.name}
                </option>
              ))}
            </select>
            <span className="text-sm font-workbench px-1">-%</span>
            <input
              type="number"
              min={0}
              max={100}
              value={showDiscountEmpty ? "" : String(discount)}
              onFocus={() => {
                if (discount === 0) {
                  setShowDiscountEmpty(true);
                }
              }}
              onChange={(e) => {
                setShowDiscountEmpty(false);
                const raw = e.target.value;
                const val = raw.replace(/^0+/, "");
                const num = val === "" ? 0 : parseInt(val, 10);
                setDiscount(Math.max(0, Math.min(100, num)));
              }}
              onBlur={(e) => {
                setShowDiscountEmpty(false);
                if (e.target.value.trim() === "") {
                  setDiscount(0);
                }
              }}
              className="w-[70px] min-w-[58px] border-2 border-[#231F20] bg-[#B2C4AE] px-2 py-1 text-sm font-plex-mono text-[#231F20] tabular-nums rounded-none"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(CalculatorControls);

