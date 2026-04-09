"use client";

import React from "react";

export type UnitRowProps = {
  unitId: string;
  unit: {
    id: string;
    name: string;
    points: number;
    models_per_box: number | null;
    models_per_unit?: number | null;
  };
  quantity: number;
  onAdd: (unitId: string) => void;
  onRemove: (unitId: string) => void;
  price: string;
  modelsPerBox: number | null;
  modelsPerUnit: number | null;
  availability: "retail" | "legends" | "forgeworld" | "allied" | undefined;
  index: number;
  isChapterUnit?: boolean;
  chapterColor?: string;
};

function UnitRow({
  unitId,
  unit,
  quantity,
  onAdd,
  onRemove,
  price,
  modelsPerBox,
  modelsPerUnit,
  availability,
  index,
  isChapterUnit,
  chapterColor,
}: UnitRowProps) {
  const hasKitData =
    price !== "--" &&
    (modelsPerBox != null || availability === "retail");
  const modelCountText =
    modelsPerUnit != null && modelsPerBox != null && modelsPerUnit < modelsPerBox
      ? `${modelsPerUnit}/${modelsPerBox}mdls`
      : modelsPerUnit != null
        ? `${modelsPerUnit}mdls`
        : modelsPerBox != null
          ? `${modelsPerBox}mdls`
          : "--";

  return (
    <div
      className={`border-t border-[#231F20] px-2 py-[9px] relative ${
        index % 2 === 0 ? "bg-[#B2C4AE]" : "bg-[#A8BAA3]"
      }`}
    >
      <div className="mb-[4px] w-full pr-1">
        <h3
          className={`text-sm font-plex-mono uppercase leading-tight break-words ${
            !hasKitData ? "text-[#5E6E5A]" : "text-[#231F20]"
          }`}
        >
          <span>{unit.name}</span>
        </h3>
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="text-[13px] font-plex-mono flex items-center gap-2 min-w-0 text-[#231F20]">
          {hasKitData ? (
            <>
              <span className="font-semibold tabular-nums">
                {unit.points}pts
              </span>
              <span>
                {" "}
                • {modelCountText}
              </span>
              <span className="font-semibold tabular-nums">
                {" "}
                • {price}
              </span>
            </>
          ) : (
            <>
              <span className="font-semibold tabular-nums">
                {unit.points}pts
              </span>
              <span>{" "}•{" "}</span>
              {!hasKitData && (
                <>
                  {availability === "legends" && (
                    <span className="text-violet-500 font-workbench">
                      LEGENDS
                    </span>
                  )}

                  {availability === "forgeworld" && (
                    <span className="text-orange-500 font-workbench">
                      FORGEWORLD
                    </span>
                  )}

                  {availability === "allied" && (
                    <span className="text-[#008235] font-workbench">
                      ALLIED
                    </span>
                  )}

                  {!availability && (
                    <span className="text-[#C23B22] font-workbench">
                      AWOL
                    </span>
                  )}
                </>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-[2px] shrink-0 ml-2">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onRemove(unitId)}
            className="w-7 h-7 border-2 border-[#231F20] flex items-center justify-center font-plex-mono"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-6 text-center font-plex-mono tabular-nums">
            {Math.floor(quantity / (unit.models_per_box || 1))}
          </span>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onAdd(unitId)}
            className="w-7 h-7 border-2 border-[#231F20] flex items-center justify-center font-plex-mono"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
      {isChapterUnit && (
        <div
          className="absolute top-0 right-0 h-full w-[3px]"
          style={{ backgroundColor: chapterColor || "#231F20" }}
        />
      )}
    </div>
  );
}

export default React.memo(UnitRow);
