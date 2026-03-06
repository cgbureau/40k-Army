"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import spaceMarinesData from "../data/factions/space-marines/units.json";
import orksData from "../data/factions/orks/units.json";
import chaosSpaceMarinesData from "../data/factions/chaos-space-marines/units.json";
import tyranidsData from "../data/factions/tyranids/units.json";
import necronsData from "../data/factions/necrons/units.json";

type Unit = {
  id: string;
  name: string;
  points: number;
  models_per_box: number | null;
  box_price: number | null;
  is_legends: boolean;
};

type Faction = {
  name: string;
  units: Unit[];
};

type FactionUnitsJson = { faction: string; units: Unit[] };

const factions: Record<string, Faction> = {
  space_marines: {
    name: (spaceMarinesData as FactionUnitsJson).faction,
    units: (spaceMarinesData as FactionUnitsJson).units,
  },
  orks: {
    name: (orksData as FactionUnitsJson).faction,
    units: (orksData as FactionUnitsJson).units,
  },
  chaos_space_marines: {
    name: (chaosSpaceMarinesData as FactionUnitsJson).faction,
    units: (chaosSpaceMarinesData as FactionUnitsJson).units,
  },
  tyranids: {
    name: (tyranidsData as FactionUnitsJson).faction,
    units: (tyranidsData as FactionUnitsJson).units,
  },
  necrons: {
    name: (necronsData as FactionUnitsJson).faction,
    units: (necronsData as FactionUnitsJson).units,
  },
};
const factionKeys = Object.keys(factions);
const defaultFactionKey = factionKeys.includes("space_marines") ? "space_marines" : factionKeys[0] ?? "";
const defaultFactionUnits: Unit[] = factions[defaultFactionKey]?.units ?? [];

function parseArmyParam(param: string | null, validUnitIds: Set<string>): QuantityMap {
  if (!param || !param.trim()) return {};
  const result: QuantityMap = {};
  const pairs = param.split(",");
  for (const pair of pairs) {
    const colonIndex = pair.indexOf(":");
    if (colonIndex === -1) continue;
    const id = pair.slice(0, colonIndex).trim();
    const qtyStr = pair.slice(colonIndex + 1).trim();
    const qty = parseInt(qtyStr, 10);
    if (!validUnitIds.has(id) || isNaN(qty) || qty <= 0) continue;
    result[id] = qty;
  }
  return result;
}

function serializeArmy(quantities: QuantityMap): string {
  return Object.entries(quantities)
    .filter(([, q]) => q > 0)
    .map(([id, q]) => `${id}:${q}`)
    .join(",");
}

const PANEL_BORDER = "border-[3px] border-[#231F20]";
const INPUT_STYLE =
  "w-full border-[3px] border-[#231F20] bg-[#B2C4AE] px-2 py-1 text-sm text-[#231F20] font-plex-mono focus:outline-none focus:ring-2 focus:ring-[#231F20] rounded-none";
const BTN_STYLE =
  "px-1.5 py-0.5 border-[3px] border-[#231F20] bg-[#B2C4AE] text-[#231F20] text-sm font-plex-mono hover:bg-[#9FB49A] focus:outline-none rounded-none shadow-none";
const BTN_QTY = `${BTN_STYLE} w-7 h-7 flex items-center justify-center p-0 text-base leading-none shrink-0`;

const FACTION_THEMES: Record<string, string> = {
  "Space Marines": "#A8BDA4",
  Orks: "#A6BE8B",
  Chaos: "#B8A0A0",
  "Chaos Space Marines": "#B8A0A0",
  Tyranids: "#A7B4B8",
  Necrons: "#B8B8B8",
};
const DEFAULT_PANEL_BG = "#A8BDA4";
type QuantityMap = Record<string, number>;

function HomeContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const validIdsForUrlInit = useMemo(
    () => new Set(defaultFactionUnits.map((u) => u.id)),
    [],
  );
  const [quantities, setQuantities] = useState<QuantityMap>(() =>
    parseArmyParam(searchParams.get("army"), validIdsForUrlInit),
  );
  const [search, setSearch] = useState<string>("");
  const [selectedFactionKey, setSelectedFactionKey] = useState<string>(defaultFactionKey);
  const [targetPoints, setTargetPoints] = useState<number>(0);

  useEffect(() => {
    const nextArmy = serializeArmy(quantities);
    const currentArmy = searchParams.get("army") ?? "";
    if (nextArmy === currentArmy) return;
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (nextArmy) params.set("army", nextArmy);
    else params.delete("army");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [quantities, pathname, searchParams, router]);

  const currentFaction = factions[selectedFactionKey];
  const units: Unit[] = currentFaction?.units ?? [];

  const handleFactionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextKey = e.target.value;
    setSelectedFactionKey(nextKey);
    setQuantities({});
  };

  const handleChangeQuantity = (unitId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[unitId] ?? 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [unitId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [unitId]: next };
    });
  };

  const totals = useMemo(() => {
    let totalPoints = 0;
    let totalBoxes = 0;
    let totalCost = 0;

    for (const unit of units) {
      const qty = quantities[unit.id] ?? 0;
      if (qty <= 0) continue;

      totalPoints += unit.points * qty;

      if (unit.models_per_box && unit.box_price != null) {
        const boxesRequired = Math.ceil(qty / unit.models_per_box);
        totalBoxes += boxesRequired;
        totalCost += boxesRequired * unit.box_price;
      }
    }

    return {
      totalPoints,
      totalBoxes,
      totalCost,
    };
  }, [quantities, units]);

  const filteredUnits = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return units;
    return units.filter((unit) =>
      unit.name.toLowerCase().includes(term),
    );
  }, [search, units]);

  const armySummaryUnits = useMemo(() => {
    return units.filter((unit) => (quantities[unit.id] ?? 0) > 0);
  }, [quantities, units]);

  const [copyLinkCopied, setCopyLinkCopied] = useState(false);
  const [exportListCopied, setExportListCopied] = useState(false);

  const handleCopyArmyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyLinkCopied(true);
    setTimeout(() => setCopyLinkCopied(false), 1500);
  };

  const handleExportList = () => {
    const lines = [
      `${currentFaction?.name ?? "Army"} Army List`,
      "",
      ...armySummaryUnits.map((u) => `${u.name} x${quantities[u.id]}`),
      "",
      `Total Points: ${totals.totalPoints}`,
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setExportListCopied(true);
    setTimeout(() => setExportListCopied(false), 1500);
  };

  const armyCostBreakdownUnits = useMemo(() => {
    return armySummaryUnits.filter(
      (u) => u.models_per_box != null && u.box_price != null,
    );
  }, [armySummaryUnits]);

  const handleResetArmy = () => {
    if (confirm("Clear entire army list?")) setQuantities({});
  };

  const costPer1000 = useMemo(() => {
    if (totals.totalPoints <= 0) return null;
    return Math.round((totals.totalCost / totals.totalPoints) * 1000);
  }, [totals.totalPoints, totals.totalCost]);

  const panelBgColor = FACTION_THEMES[currentFaction?.name ?? ""] ?? DEFAULT_PANEL_BG;

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col page-bg text-[#231F20] font-plex-mono">
      <div className="flex flex-col min-h-0 shrink-0 lg:flex-1 lg:shrink max-w-6xl w-full mx-auto py-4 px-4 lg:overflow-hidden relative z-10">
        {/* Header zone */}
        <header className="text-center flex-shrink-0 mb-4">
          <div className="flex justify-center mb-2">
            <Image
              src="/40KArmy_Logo.svg"
              alt="40KArmy"
              width={260}
              height={104}
              priority
              className="h-auto w-auto max-h-24 sm:max-h-28"
            />
          </div>
          <p className="font-workbench uppercase text-lg sm:text-xl tracking-wide text-[#231F20]">
            WARHAMMER 40K ARMY CALCULATOR
          </p>
        </header>

        {/* Two-panel main */}
        <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3 lg:gap-4">
          {/* Left panel: Army Builder */}
          <section
            className={`${PANEL_BORDER} p-3 flex flex-col min-h-0 max-h-[calc(100vh-220px)] h-full rounded-none overflow-hidden`}
            style={{ backgroundColor: panelBgColor }}
          >
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${INPUT_STYLE} mb-3`}
              aria-label="Search units"
            />

            {/* Controls row */}
            <div className="flex flex-wrap items-center gap-2 gap-y-2 mb-3">
              <label htmlFor="target-points" className="text-sm font-workbench mr-1">
                Target pts
              </label>
              <div className="flex items-center gap-1">
                {[500, 1000, 2000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTargetPoints(preset)}
                    className={BTN_STYLE}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <input
                id="target-points"
                type="number"
                min={0}
                value={targetPoints}
                onChange={(e) =>
                  setTargetPoints(Math.max(0, parseInt(e.target.value, 10) || 0))
                }
                className="w-20 border-[3px] border-[#231F20] bg-[#B2C4AE] px-2 py-1 text-sm font-plex-mono text-[#231F20] tabular-nums rounded-none"
              />
              <div className="flex-1 lg:flex-none lg:ml-auto flex items-center gap-1">
                <label
                  htmlFor="faction-select"
                  className="text-sm font-workbench whitespace-nowrap"
                >
                  Faction
                </label>
                <select
                  id="faction-select"
                  value={selectedFactionKey}
                  onChange={handleFactionChange}
                  className={`${INPUT_STYLE} flex-1 min-w-0 max-w-[180px]`}
                >
                  {factionKeys.map((key) => (
                    <option key={key} value={key}>
                      {factions[key].name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Army progress bar - only when target points set */}
            {targetPoints > 0 && (() => {
              const overPoints = totals.totalPoints - targetPoints;
              const isOver = overPoints > 0;
              const progressPct = Math.min(100, (totals.totalPoints / targetPoints) * 100);
              return (
                <div className="mb-3">
                  <p className="font-workbench uppercase text-xs tracking-wide mb-1">
                    ARMY PROGRESS
                  </p>
                  <div
                    className="h-[10px] border-2 border-[#231F20] bg-[#B2C4AE] rounded-none overflow-hidden"
                    role="progressbar"
                    aria-valuenow={totals.totalPoints}
                    aria-valuemin={0}
                    aria-valuemax={targetPoints}
                  >
                    <div
                      className="h-full transition-[width] duration-200"
                      style={{
                        width: `${progressPct}%`,
                        backgroundColor: isOver ? "#7A1C1C" : "#231F20",
                      }}
                    />
                  </div>
                  <p className="text-xs font-plex-mono tabular-nums mt-1">
                    {totals.totalPoints} / {targetPoints} pts
                    {isOver && ` (+${overPoints})`}
                  </p>
                </div>
              );
            })()}

            <h2 className="font-workbench uppercase text-base tracking-wide mb-2">Units</h2>

            {/* Scrollable unit list - table-like */}
            <div
              className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-3 border-[3px] border-[#231F20] max-h-[calc(100vh-340px)] rounded-none"
              style={{ backgroundColor: panelBgColor }}
            >
              <div className="divide-y divide-[#231F20]/40">
                {filteredUnits.map((unit) => {
                  const qty = quantities[unit.id] ?? 0;

                  return (
                    // TODO: Future feature
                    // Display 8-bit unit portrait when unit is selected.
                    // Images will be loaded from /public/unit-images/{faction}/{unit}.png
                    <div
                      key={unit.id}
                      className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 sm:gap-3 items-center py-[6px] px-2 text-sm font-plex-mono"
                    >
                      <div className="min-w-0 font-medium truncate sm:whitespace-normal text-[#231F20] uppercase">
                        {unit.name}
                      </div>
                      <span className="tabular-nums whitespace-nowrap">
                        {unit.points}pts
                      </span>
                      <span className="tabular-nums whitespace-nowrap">
                        {unit.models_per_box != null
                          ? `${unit.models_per_box}mdls/pb`
                          : "--"}
                      </span>
                      <span className="tabular-nums whitespace-nowrap">
                        {unit.box_price != null && unit.box_price > 0
                          ? `£${unit.box_price.toFixed(2)}`
                          : "--"}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleChangeQuantity(unit.id, -1)}
                          className={BTN_QTY}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-6 text-center tabular-nums">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleChangeQuantity(unit.id, 1)}
                          className={BTN_QTY}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Right panel: Summary, Breakdown, Totals - fixed 320px */}
          <aside
            className={`${PANEL_BORDER} p-3 flex flex-col gap-3 min-h-0 max-h-[calc(100vh-220px)] h-full rounded-none overflow-hidden min-w-0`}
            style={{ backgroundColor: panelBgColor }}
          >
            {/* Top action row */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleCopyArmyLink}
                className={`${BTN_STYLE} flex-1`}
              >
                {copyLinkCopied ? "Copied!" : "Copy"}
              </button>
              <button
                type="button"
                onClick={handleExportList}
                className={`${BTN_STYLE} flex-1`}
              >
                {exportListCopied ? "Copied List!" : "Export"}
              </button>
              <button
                type="button"
                onClick={handleResetArmy}
                className={`${BTN_STYLE} flex-1`}
              >
                RESET
              </button>
            </div>

            {/* Scrollable summary + breakdown */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden min-w-0 pr-1">
              {/* Army Summary */}
              <div className="flex-shrink-0 min-w-0">
              <h2 className="font-workbench uppercase text-base tracking-wide mb-1.5 border-b-[3px] border-[#231F20] pb-1">
                Army Summary
              </h2>
              {armySummaryUnits.length === 0 ? (
                <p className="text-sm font-plex-mono py-1.5">
                  No units selected.
                  <br />
                  Add units from the list →
                </p>
              ) : (
                <ul className="space-y-0.5 text-sm font-plex-mono">
                  {armySummaryUnits.map((unit) => (
                    <li
                      key={unit.id}
                      className="flex items-center gap-2 uppercase min-w-0"
                    >
                      <span className="min-w-0 overflow-hidden whitespace-nowrap text-ellipsis flex-1">
                        {unit.name}
                      </span>
                      <span className="tabular-nums whitespace-nowrap shrink-0">
                        x{quantities[unit.id]}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleChangeQuantity(unit.id, -1)}
                        className={BTN_QTY}
                        aria-label={`Remove one ${unit.name}`}
                      >
                        −
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Cost Breakdown */}
            <div className="flex-shrink-0 min-w-0 mt-3">
              <h2 className="font-workbench uppercase text-base tracking-wide mb-1.5 border-b-[3px] border-[#231F20] pb-1">
                Cost Breakdown
              </h2>
              {armyCostBreakdownUnits.length === 0 ? (
                <p className="text-sm font-plex-mono py-1.5">
                  No units with cost data selected.
                </p>
              ) : (
                <ul className="space-y-1 text-sm font-plex-mono">
                  {armyCostBreakdownUnits.map((unit) => {
                    const qty = quantities[unit.id] ?? 0;
                    const boxesRequired = Math.ceil(
                      qty / (unit.models_per_box ?? 1),
                    );
                    const cost = boxesRequired * (unit.box_price ?? 0);
                    return (
                      <li
                        key={unit.id}
                        className="flex justify-between gap-2 py-1 border-b border-[#231F20]/30 last:border-b-0 uppercase min-w-0"
                      >
                        <span className="min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">{unit.name}</span>
                        <span className="tabular-nums whitespace-nowrap shrink-0">
                          Qty:{qty} Bxs:{boxesRequired} £
                          {cost.toFixed(2)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            </div>

            {/* Totals - integrated block */}
            <div className="mt-auto pt-3 border-t-[3px] border-[#231F20] flex-shrink-0">
              <h2 className="font-workbench uppercase text-base tracking-wide mb-2">Totals</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm font-plex-mono">
                <div>
                  <div className="text-[#231F20]/80">Current Points</div>
                  <div className="tabular-nums font-semibold">
                    {totals.totalPoints}pts
                  </div>
                </div>
                {targetPoints > 0 && (
                  <div>
                    <div className="text-[#231F20]/80">Remaining</div>
                    <div
                      className={`tabular-nums font-semibold ${
                        targetPoints - totals.totalPoints < 0
                          ? "text-red-700"
                          : ""
                      }`}
                    >
                      {targetPoints - totals.totalPoints}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-[#231F20]/80">Total Boxes</div>
                  <div className="tabular-nums font-semibold">
                    {totals.totalBoxes}
                  </div>
                </div>
                <div>
                  <div className="text-[#231F20]/80">Est. Cost</div>
                  <div className="tabular-nums font-semibold">
                    £{totals.totalCost.toFixed(2)}
                  </div>
                </div>
                {costPer1000 != null && (
                  <div className="col-span-2">
                    <div className="text-[#231F20]/80">Cost / 1000pts</div>
                    <div className="tabular-nums font-semibold">
                      £{costPer1000.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </main>

        <footer className="text-center text-xs opacity-70 mt-[12px] flex-shrink-0">
          <p>40KArmy v1 — unofficial Warhammer army cost calculator - A product by the Contemporary Graphics Bureau</p>
          <p className="mt-0.5">
            Warhammer 40,000 and all associated names are trademarks of Games Workshop.
            This project is an unofficial fan-made tool.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen page-bg flex items-center justify-center text-[#231F20] font-plex-mono">
          Loading...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
