"use client";

import React from "react";
import UnitRow from "./UnitRow";

const PANEL_BG = "bg-[#B2C4AE]";

export type UnitTableUnit = {
  id: string;
  name: string;
  points: number;
  models_per_box: number | null;
  models_per_unit?: number | null;
  box_price: number | null;
  availability?: "retail" | "legends" | "forgeworld" | "allied";
  prices?: Record<string, number | null> | null;
};

export type UnitTableProps = {
  units: UnitTableUnit[];
  quantities: Record<string, number>;
  currency:
    | "GBP"
    | "USD"
    | "EUR"
    | "AUD"
    | "CAD"
    | "CHF"
    | "PLN";
  formatPrice: (unit: UnitTableUnit, currency: UnitTableProps["currency"]) => string;
  onAdd: (unitId: string) => void;
  onRemove: (unitId: string) => void;
  loading: boolean;
  factionAccentColor: string;
  showAwol: boolean;
  setShowAwol: (value: boolean) => void;
  showLegends: boolean;
  setShowLegends: (value: boolean) => void;
  showForgeworld: boolean;
  setShowForgeworld: (value: boolean) => void;
  showAllied: boolean;
  setShowAllied: (value: boolean) => void;
  isChapterUnit?: (unit: UnitTableUnit) => boolean;
  chapterColor?: string;
};

function UnitTable({
  units,
  quantities,
  currency,
  formatPrice,
  onAdd,
  onRemove,
  loading,
  factionAccentColor,
  showAwol,
  setShowAwol,
  showLegends,
  setShowLegends,
  showForgeworld,
  setShowForgeworld,
  showAllied,
  setShowAllied,
  isChapterUnit,
  chapterColor,
}: UnitTableProps) {
  return (
    <>
      <div
        className="relative mb-2 border-b-2"
        style={{ borderColor: factionAccentColor }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-1"
          style={{ backgroundColor: factionAccentColor }}
        />
        <div className="flex items-end justify-between mb-2">
          <h2 className="font-workbench uppercase text-base tracking-wide pl-3">
            Units
          </h2>
          <div className="flex gap-2 justify-end mt-1">
          <button
            type="button"
            onClick={() => setShowAwol(!showAwol)}
            className={`border-2 border-[#231F20] px-2 py-1 text-sm font-workbench uppercase leading-none rounded-none text-[#C23B22] ${
              showAwol ? "bg-red-500/15 opacity-100" : "bg-transparent opacity-40"
            }`}
          >
            AWOL
          </button>
          <button
            type="button"
            onClick={() => setShowLegends(!showLegends)}
            className={`border-2 border-[#231F20] px-2 py-1 text-sm font-workbench uppercase leading-none rounded-none text-violet-500 ${
              showLegends ? "bg-purple-500/15 opacity-100" : "bg-transparent opacity-40"
            }`}
          >
            LGND
          </button>
          <button
            type="button"
            onClick={() => setShowForgeworld(!showForgeworld)}
            className={`border-2 border-[#231F20] px-2 py-1 text-sm font-workbench uppercase leading-none rounded-none text-orange-500 ${
              showForgeworld ? "bg-orange-500/15 opacity-100" : "bg-transparent opacity-40"
            }`}
          >
            FRGW
          </button>
          <button
            type="button"
            onClick={() => setShowAllied(!showAllied)}
            className={`border-2 border-[#231F20] px-2 py-1 text-sm font-workbench uppercase leading-none rounded-none text-[#008235] ${
              showAllied ? "bg-green-500/15 opacity-100" : "bg-transparent opacity-40"
            }`}
          >
            ALLD
          </button>
          </div>
        </div>
      </div>

      <div
        className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden border-2 border-[#231F20] rounded-none ${PANEL_BG} max-[900px]:overflow-y-auto max-[900px]:max-h-none max-[900px]:min-h-0 lg:max-h-[calc(100vh-340px)] lg:overflow-y-auto lg:min-h-0`}
      >
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#B2C4AE]/70 z-10">
              <p className="text-sm font-plex-mono">Loading...</p>
            </div>
          )}

          <div className="divide-y divide-[#231F20]/40">
            {units.map((unit, index) => (
              <UnitRow
                key={unit.id}
                unitId={unit.id}
                unit={unit}
                quantity={quantities[unit.id] ?? 0}
                onAdd={onAdd}
                onRemove={onRemove}
                price={formatPrice(unit, currency)}
                modelsPerBox={unit.models_per_box}
                modelsPerUnit={unit.models_per_unit ?? null}
                availability={unit.availability}
                index={index}
                isChapterUnit={isChapterUnit?.(unit)}
                chapterColor={chapterColor}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(UnitTable);
