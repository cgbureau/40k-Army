"use client";

import React from "react";
import UnitRow from "./UnitRow";

const PANEL_BG = "bg-[#B2C4AE]";

export type UnitTableUnit = {
  id: string;
  name: string;
  points: number;
  models_per_box: number | null;
  box_price: number | null;
  availability?: "retail" | "legends" | "forgeworld";
  prices?: Record<string, number | null> | null;
};

export type UnitTableProps = {
  units: UnitTableUnit[];
  quantities: Record<string, number>;
  currency: "GBP" | "USD" | "EUR" | "AUD" | "CAD";
  formatPrice: (unit: UnitTableUnit, currency: UnitTableProps["currency"]) => string;
  onAdd: (unitId: string) => void;
  onRemove: (unitId: string) => void;
  loading: boolean;
  factionAccentColor: string;
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
}: UnitTableProps) {
  return (
    <>
      <h2
        className="font-workbench uppercase text-base tracking-wide mb-2 pl-2"
        style={{
          borderLeft: `4px solid ${factionAccentColor}`,
          borderBottom: `2px solid ${factionAccentColor}`,
        }}
      >
        Units
      </h2>

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
                availability={unit.availability}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(UnitTable);
