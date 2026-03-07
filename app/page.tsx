"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { factionColors, DEFAULT_FACTION_COLOR } from "./config/factionColors";

type Unit = {
  id: string;
  name: string;
  points: number;
  models_per_box: number | null;
  box_price: number | null;
  is_legends?: boolean;
};

type FactionListItem = { slug: string; name: string };

type FactionUnitsResponse = { faction: string; units: Unit[] };

function parseArmyParam(
  param: string | null,
  validUnitIds: Set<string>
): Record<string, number> {
  if (!param || !param.trim()) return {};
  const result: Record<string, number> = {};
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

function serializeArmy(quantities: Record<string, number>): string {
  return Object.entries(quantities)
    .filter(([, q]) => q > 0)
    .map(([id, q]) => `${id}:${q}`)
    .join(",");
}

const PANEL_BORDER = "border-2 border-[#231F20]";
const PANEL_BG = "bg-[#B2C4AE]";
const INPUT_STYLE =
  "w-full border-2 border-[#231F20] bg-[#B2C4AE] px-2 py-1 text-sm text-[#231F20] font-plex-mono focus:outline-none focus:ring-2 focus:ring-[#231F20] rounded-none";
const BTN_STYLE =
  "px-1.5 py-0.5 border-2 border-[#231F20] bg-[#B2C4AE] text-[#231F20] text-sm font-plex-mono hover:bg-[#9FB49A] focus:outline-none rounded-none shadow-none";
const BTN_QTY = `${BTN_STYLE} w-7 h-7 flex items-center justify-center p-0 text-base leading-none shrink-0`;

type QuantityMap = Record<string, number>;

function HomeContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [factionList, setFactionList] = useState<FactionListItem[]>([]);
  const [selectedFactionSlug, setSelectedFactionSlug] = useState<string>("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [factionsLoading, setFactionsLoading] = useState(true);
  const [unitsLoading, setUnitsLoading] = useState(true);
  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [search, setSearch] = useState<string>("");
  const [targetPoints, setTargetPoints] = useState<number>(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const unitListScrollRef = useRef<HTMLDivElement>(null);
  const savedScrollTop = useRef(0);

  // Load faction list on mount
  useEffect(() => {
    let cancelled = false;
    setFactionsLoading(true);
    fetch("/api/factions")
      .then((res) => res.json())
      .then((data: FactionListItem[]) => {
        if (cancelled || !Array.isArray(data)) return;
        const sorted = [...data].sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        );
        setFactionList(sorted);
        const defaultSlug =
          sorted.find((f) => f.slug === "space-marines")?.slug ?? sorted[0]?.slug ?? "";
        setSelectedFactionSlug(defaultSlug);
      })
      .catch(() => setFactionList([]))
      .finally(() => setFactionsLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // Load units when faction changes
  useEffect(() => {
    if (!selectedFactionSlug) {
      setUnits([]);
      setUnitsLoading(false);
      return;
    }
    let cancelled = false;
    setUnitsLoading(true);
    setUnits([]);
    fetch(`/api/factions/${encodeURIComponent(selectedFactionSlug)}/units`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load units");
        return res.json();
      })
      .then((data: FactionUnitsResponse) => {
        if (cancelled) return;
        const list = Array.isArray(data.units) ? data.units : [];
        setUnits(list);
      })
      .catch(() => setUnits([]))
      .finally(() => setUnitsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [selectedFactionSlug]);

  // Restore unit list scroll position after quantity changes (no scroll jump)
  useEffect(() => {
    const el = unitListScrollRef.current;
    if (el && savedScrollTop.current !== undefined) {
      const top = savedScrollTop.current;
      requestAnimationFrame(() => {
        el.scrollTop = top;
      });
    }
  }, [quantities]);

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

  const currentFactionName =
    factionList.find((f) => f.slug === selectedFactionSlug)?.name ?? selectedFactionSlug;

  const handleFactionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSlug = e.target.value;
    const hasUnits = Object.values(quantities).some((q) => q > 0);
    if (hasUnits && !confirm("Changing faction will clear your current army. Continue?")) {
      return;
    }
    setSelectedFactionSlug(newSlug);
    setQuantities({});
  };

  const handleChangeQuantity = useCallback((unitId: string, delta: number) => {
    if (unitListScrollRef.current) {
      savedScrollTop.current = unitListScrollRef.current.scrollTop;
    }
    setQuantities((prev) => {
      const current = prev[unitId] ?? 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [unitId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [unitId]: next };
    });
    if (delta === 1) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, []);

  const totals = useMemo(() => {
    let totalPoints = 0;
    let totalBoxes = 0;
    let totalCost = 0;
    for (const unit of units) {
      const qty = quantities[unit.id] ?? 0;
      if (qty <= 0) continue;
      totalPoints += unit.points * qty;
      if (unit.models_per_box != null && unit.box_price != null) {
        const boxesRequired = Math.ceil(qty / unit.models_per_box);
        totalBoxes += boxesRequired;
        totalCost += boxesRequired * unit.box_price;
      }
    }
    return { totalPoints, totalBoxes, totalCost };
  }, [quantities, units]);

  const filteredUnits = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return units;
    return units.filter((u) => u.name.toLowerCase().includes(term));
  }, [search, units]);

  const armySummaryUnits = useMemo(
    () => units.filter((u) => (quantities[u.id] ?? 0) > 0),
    [quantities, units]
  );

  const [copyLinkCopied, setCopyLinkCopied] = useState(false);
  const [exportListCopied, setExportListCopied] = useState(false);

  const handleCopyArmyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyLinkCopied(true);
    setTimeout(() => setCopyLinkCopied(false), 1500);
  };

  const handleExportList = () => {
    const lines = [
      `${currentFactionName} Army List`,
      "",
      ...armySummaryUnits.map((u) => `${u.name} x${quantities[u.id]}`),
      "",
      `Total Points: ${totals.totalPoints}`,
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setExportListCopied(true);
    setTimeout(() => setExportListCopied(false), 1500);
  };

  const armyCostBreakdownUnits = useMemo(
    () =>
      armySummaryUnits.filter(
        (u) => u.models_per_box != null && u.box_price != null
      ),
    [armySummaryUnits]
  );

  const handleResetArmy = () => {
    if (confirm("Clear entire army list?")) setQuantities({});
  };

  const costPer1000 = useMemo(() => {
    if (totals.totalPoints <= 0) return null;
    return Math.round((totals.totalCost / totals.totalPoints) * 1000);
  }, [totals.totalPoints, totals.totalCost]);

  const factionAccentColor =
    factionColors[selectedFactionSlug] ?? DEFAULT_FACTION_COLOR;

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col page-bg text-[#231F20] font-plex-mono">
      <div className="flex flex-col min-h-0 shrink-0 lg:flex-1 lg:shrink max-w-6xl w-full mx-auto py-4 px-4 lg:overflow-hidden relative z-10">
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

        <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3 lg:gap-4">
          <section
            className={`${PANEL_BORDER} ${PANEL_BG} border-l-4 p-3 flex flex-col min-h-0 max-h-[calc(100vh-220px)] h-full rounded-none overflow-hidden`}
            style={{ borderLeftColor: factionAccentColor }}
          >
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${INPUT_STYLE} mb-3`}
              aria-label="Search units"
            />

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
                className="w-20 border-2 border-[#231F20] bg-[#B2C4AE] px-2 py-1 text-sm font-plex-mono text-[#231F20] tabular-nums rounded-none"
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
                  value={selectedFactionSlug}
                  onChange={handleFactionChange}
                  className="w-full border-2 bg-[#B2C4AE] px-2 py-1 text-sm text-[#231F20] font-plex-mono focus:outline-none focus:ring-2 focus:ring-offset-0 rounded-none flex-1 min-w-0 max-w-[180px]"
                  style={{
                    borderColor: factionAccentColor,
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = `0 0 0 2px ${factionAccentColor}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = "none";
                  }}
                >
                  {factionList.map((f) => (
                    <option key={f.slug} value={f.slug}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {targetPoints > 0 &&
              (() => {
                const overPoints = totals.totalPoints - targetPoints;
                const isOver = overPoints > 0;
                const progressPct = Math.min(
                  100,
                  (totals.totalPoints / targetPoints) * 100
                );
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
              ref={unitListScrollRef}
              className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-3 border-2 border-[#231F20] max-h-[calc(100vh-340px)] rounded-none ${PANEL_BG}`}
            >
              {factionsLoading || unitsLoading ? (
                <p className="py-4 text-sm font-plex-mono">Loading...</p>
              ) : (
                <div className="divide-y divide-[#231F20]/40">
                  {filteredUnits.map((unit) => {
                    const qty = quantities[unit.id] ?? 0;
                    return (
                      <div
                        key={unit.id}
                        className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 sm:gap-3 items-center py-2 px-2 text-sm font-plex-mono"
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
              )}
            </div>
          </section>

          <aside
            className={`${PANEL_BORDER} ${PANEL_BG} border-l-4 p-3 flex flex-col gap-3 min-h-0 max-h-[calc(100vh-220px)] h-full rounded-none overflow-hidden min-w-0`}
            style={{ borderLeftColor: factionAccentColor }}
          >
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

            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden min-w-0 pr-1">
              <div className="flex-shrink-0 min-w-0">
                <h2
                  className="font-workbench uppercase text-base tracking-wide mb-1.5 pb-1 border-b-2"
                  style={{
                    borderBottomColor: factionAccentColor,
                  }}
                >
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

              <div className="flex-shrink-0 min-w-0 mt-3">
                <h2 className="font-workbench uppercase text-base tracking-wide mb-1.5 border-b-2 border-[#231F20] pb-1">
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
                        qty / (unit.models_per_box ?? 1)
                      );
                      const cost = boxesRequired * (unit.box_price ?? 0);
                      return (
                        <li
                          key={unit.id}
                          className="flex justify-between gap-2 py-1 border-b border-[#231F20]/30 last:border-b-0 uppercase min-w-0"
                        >
                          <span className="min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">
                            {unit.name}
                          </span>
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

            <div className="mt-auto pt-3 border-t-2 border-[#231F20] flex-shrink-0">
              <h2 className="font-workbench uppercase text-base tracking-wide mb-2">
                Totals
              </h2>
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
          <p>
            40KArmy v1 — unofficial Warhammer army cost calculator - A product
            by the Contemporary Graphics Bureau
          </p>
          <p className="mt-0.5">
            Warhammer 40,000 and all associated names are trademarks of Games
            Workshop. This project is an unofficial fan-made tool.
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
