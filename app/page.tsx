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
  prices?: { GBP?: number | null; USD?: number | null; EUR?: number | null };
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
const BTN_QTY = `${BTN_STYLE} w-7 h-7 flex items-center justify-center p-0 text-base leading-none shrink-0 min-[901px]:w-7 min-[901px]:h-7 max-[900px]:min-w-[44px] max-[900px]:min-h-[44px] max-[900px]:w-12`;

const CURRENCY_SYMBOLS: Record<"GBP" | "USD" | "EUR", string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
};

function getUnitPrice(
  unit: Unit,
  currency: "GBP" | "USD" | "EUR"
): number | null {
  if (currency === "GBP") {
    const value = unit.prices?.GBP ?? unit.box_price ?? null;
    return value != null && value > 0 ? value : null;
  }
  const value = unit.prices?.[currency] ?? null;
  return value != null && value > 0 ? value : null;
}

function getCurrencySymbol(currency: "GBP" | "USD" | "EUR"): string {
  return CURRENCY_SYMBOLS[currency];
}

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
  const [currency, setCurrency] = useState<"GBP" | "USD" | "EUR">("GBP");
  const [mobilePanel, setMobilePanel] = useState<"summary" | "cost" | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    setQuantities((prev) => {
      const current = prev[unitId] ?? 0;
      const next = Math.max(0, current + delta);

      if (next === 0) {
        const { [unitId]: _removed, ...rest } = prev;
        return rest;
      }

      return { ...prev, [unitId]: next };
    });
  }, []);

  const totals = useMemo(() => {
    let totalPoints = 0;
    let totalBoxes = 0;
    let totalCost = 0;
    for (const unit of units) {
      const qty = quantities[unit.id] ?? 0;
      if (qty <= 0) continue;
      totalPoints += unit.points * qty;
      const price = getUnitPrice(unit, currency);
      if (unit.models_per_box != null && price != null) {
        const boxesRequired = Math.ceil(qty / unit.models_per_box);
        totalBoxes += boxesRequired;
        totalCost += boxesRequired * price;
      }
    }
    return { totalPoints, totalBoxes, totalCost };
  }, [quantities, units, currency]);

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
        (u) =>
          u.models_per_box != null && getUnitPrice(u, currency) != null
      ),
    [armySummaryUnits, currency]
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
    <div className="min-h-screen flex flex-col page-bg text-[#231F20] font-plex-mono max-[900px]:min-h-screen max-[900px]:overflow-auto lg:h-screen lg:overflow-hidden">
      <div
        className={`flex flex-col min-h-0 shrink-0 max-[900px]:flex-1 max-[900px]:min-h-0 max-[900px]:overflow-visible lg:flex-1 lg:shrink max-w-6xl w-full mx-auto py-4 px-4 lg:overflow-hidden relative z-10 ${armySummaryUnits.length > 0 ? "max-[900px]:pb-[220px]" : ""}`}
      >
        <header className="text-center flex-shrink-0 mb-4 relative">
          {/* Desktop: currency top right */}
          <div className="absolute top-0 right-0 flex items-center gap-1.5 min-[901px]:flex max-[900px]:hidden">
            <label htmlFor="currency-select" className="text-sm font-workbench whitespace-nowrap">
              Currency
            </label>
            <select
              id="currency-select"
              value={currency}
              onChange={(e) =>
                setCurrency(e.target.value as "GBP" | "USD" | "EUR")
              }
              className="border-2 border-[#231F20] bg-[#B2C4AE] px-2 py-1 text-sm text-[#231F20] font-plex-mono focus:outline-none focus:ring-2 focus:ring-[#231F20] rounded-none"
              aria-label="Select currency"
            >
              <option value="GBP">GBP (£)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          {/* Mobile: two-column — left = logo (64px), right = title (2 lines) + currency */}
          <div className="max-[900px]:flex max-[900px]:flex-row max-[900px]:items-stretch max-[900px]:gap-3 max-[900px]:w-full min-[901px]:block">
            <div className="max-[900px]:shrink-0 max-[900px]:flex max-[900px]:items-center min-[901px]:flex min-[901px]:justify-center min-[901px]:mb-2">
              <Image
                src="/40KArmy_Logo.svg"
                alt="40KArmy logo"
                width={260}
                height={104}
                priority
                className="max-[900px]:h-16 max-[900px]:w-auto max-[900px]:min-h-[64px] min-[901px]:h-auto min-[901px]:w-auto min-[901px]:max-h-24 sm:max-h-28"
              />
            </div>
            <div className="max-[900px]:flex-1 max-[900px]:flex max-[900px]:flex-col max-[900px]:justify-between max-[900px]:min-w-0 min-[901px]:contents">
              <div className="max-[900px]:text-right min-[901px]:block min-[901px]:text-center">
                <p className="max-[900px]:font-workbench max-[900px]:uppercase max-[900px]:tracking-wide max-[900px]:text-[#231F20] max-[900px]:text-sm max-[900px]:leading-tight min-[901px]:font-workbench min-[901px]:uppercase min-[901px]:text-lg min-[901px]:sm:text-xl min-[901px]:tracking-wide min-[901px]:text-[#231F20]">
                  <span className="max-[900px]:block">WARHAMMER 40K</span>
                  <span className="max-[900px]:block">ARMY CALCULATOR</span>
                </p>
              </div>
              <div className="max-[900px]:flex max-[900px]:justify-end max-[900px]:items-center max-[900px]:mt-1.5 min-[901px]:hidden">
                <label htmlFor="currency-select-mobile" className="text-sm font-workbench whitespace-nowrap mr-1.5">
                  Currency
                </label>
                <select
                  id="currency-select-mobile"
                  value={currency}
                  onChange={(e) =>
                    setCurrency(e.target.value as "GBP" | "USD" | "EUR")
                  }
                  className="border-2 border-[#231F20] bg-[#B2C4AE] px-2 py-1.5 text-sm text-[#231F20] font-plex-mono focus:outline-none focus:ring-2 focus:ring-[#231F20] rounded-none"
                  aria-label="Select currency"
                >
                  <option value="GBP">GBP (£)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        <main
          className="flex-1 min-h-0 max-[900px]:flex max-[900px]:flex-col max-[900px]:gap-4 max-[900px]:overflow-visible max-[900px]:min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3 lg:gap-4"
          style={{ overflowAnchor: "none" }}
        >
          <section
            className={`${PANEL_BORDER} ${PANEL_BG} border-l-4 p-3 flex flex-col min-h-0 max-[900px]:min-h-0 max-[900px]:max-h-none max-[900px]:overflow-visible max-h-[calc(100vh-220px)] h-full rounded-none overflow-hidden lg:max-h-[calc(100vh-220px)] lg:overflow-hidden`}
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
              className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-3 border-2 border-[#231F20] rounded-none ${PANEL_BG} max-[900px]:overflow-y-auto max-[900px]:max-h-none max-[900px]:min-h-0 lg:max-h-[calc(100vh-340px)] lg:overflow-y-auto lg:min-h-0`}
            >
              {factionsLoading || unitsLoading ? (
                <p className="py-4 text-sm font-plex-mono">Loading...</p>
              ) : (
                <div className="divide-y divide-[#231F20]/40">
                  {filteredUnits.map((unit) => {
                    const qty = quantities[unit.id] ?? 0;
                    const price = getUnitPrice(unit, currency);
                    const priceStr =
                      price !== null
                        ? `${getCurrencySymbol(currency)}${price.toFixed(2)}`
                        : "--";
                    const modelsStr =
                      unit.models_per_box != null
                        ? `${unit.models_per_box} models per box`
                        : "--";
                    const metaStr = `${unit.points}pts • ${modelsStr} • ${priceStr}`;
                    return (
                      <div
                        key={unit.id}
                        className="max-[900px]:py-3 max-[900px]:px-2 grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 sm:gap-3 items-center py-2 px-2 text-sm font-plex-mono max-[900px]:grid-cols-1 max-[900px]:gap-2"
                      >
                        <div className="min-w-0 font-medium text-[#231F20] uppercase max-[900px]:whitespace-normal max-[900px]:break-words min-[901px]:truncate min-[901px]:sm:whitespace-normal">
                          {unit.name}
                        </div>
                        <span className="tabular-nums whitespace-nowrap max-[900px]:hidden">
                          {unit.points}pts
                        </span>
                        <span className="tabular-nums whitespace-nowrap max-[900px]:hidden">
                          {unit.models_per_box != null
                            ? `${unit.models_per_box}mdls/pb`
                            : "--"}
                        </span>
                        <span className="tabular-nums whitespace-nowrap max-[900px]:hidden">
                          {priceStr}
                        </span>
                        <div className="flex items-center gap-0.5 min-[901px]:col-span-1 max-[900px]:flex max-[900px]:items-center max-[900px]:justify-between max-[900px]:gap-2 max-[900px]:w-full">
                          <span className="max-[900px]:text-xs max-[900px]:text-[#231F20]/90 min-[901px]:hidden">
                            {metaStr}
                          </span>
                          <div className="flex items-center gap-0.5 max-[900px]:gap-1">
                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleChangeQuantity(unit.id, -1)}
                              className={BTN_QTY}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="w-6 text-center tabular-nums max-[900px]:min-w-[2rem]">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleChangeQuantity(unit.id, 1)}
                              className={BTN_QTY}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <aside
            className={`${PANEL_BORDER} ${PANEL_BG} border-l-4 p-3 flex flex-col gap-3 min-h-0 max-[900px]:hidden max-[900px]:min-h-0 max-[900px]:overflow-visible max-h-[calc(100vh-220px)] h-full rounded-none overflow-hidden min-w-0 lg:max-h-[calc(100vh-220px)] lg:overflow-hidden`}
            style={{ borderLeftColor: factionAccentColor }}
          >
            <div className="flex gap-2 flex-shrink-0 max-[900px]:order-3">
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

            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden min-w-0 pr-1 max-[900px]:flex-1 max-[900px]:overflow-visible max-[900px]:min-h-0 max-[900px]:order-1 lg:overflow-y-auto lg:min-h-0">
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
                        className="flex items-center gap-2 min-w-0 flex-wrap"
                      >
                        <span className="min-w-0 flex-1 break-words uppercase text-[#231F20]">
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
                      const price = getUnitPrice(unit, currency) ?? 0;
                      const cost = boxesRequired * price;
                      const sym = getCurrencySymbol(currency);
                      return (
                        <li
                          key={unit.id}
                          className="py-1 border-b border-[#231F20]/30 last:border-b-0 min-w-0"
                        >
                          <div className="font-medium text-[#231F20] uppercase break-words">
                            {unit.name}
                          </div>
                          <div className="text-xs text-[#231F20]/90 tabular-nums mt-0.5">
                            Qty:{qty} • Box:{boxesRequired} • {sym}
                            {cost.toFixed(2)}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            <div className="mt-auto pt-3 border-t-2 border-[#231F20] flex-shrink-0 max-[900px]:mt-4 max-[900px]:order-2 max-[900px]:pt-3">
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
                    {getCurrencySymbol(currency)}
                    {totals.totalCost.toFixed(2)}
                  </div>
                </div>
                {costPer1000 != null && (
                  <div className="col-span-2">
                    <div className="text-[#231F20]/80">Cost / 1000pts</div>
                    <div className="tabular-nums font-semibold">
                      {getCurrencySymbol(currency)}
                      {costPer1000.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </main>

        <section className="max-w-3xl mx-auto text-xs opacity-80 mt-6 px-4 leading-relaxed">
          <h2 className="font-workbench uppercase text-sm mb-2">
            Warhammer 40K Army Cost Calculator
          </h2>

          <p className="mb-2">
            This fan-made Warhammer 40K army calculator helps estimate the real-world cost
            of building a tabletop army. Select units from your faction, track total points,
            estimate how many model boxes are required, and calculate the approximate cost
            of your army list.
          </p>

          <p className="mb-2">
            The tool is designed to give players a quick way to understand how expensive
            different Warhammer 40K army builds can be before purchasing miniatures.
            Points values, box quantities, and pricing data are estimates and may change
            with future game updates.
          </p>
        </section>

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

      {/* Mobile-only sticky totals bar (only when at least one unit selected) */}
      {armySummaryUnits.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 min-[901px]:hidden border-t-2 border-[#231F20] bg-[#B2C4AE] shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
          {/* Expandable panel above the bar */}
          <div
            className={`overflow-hidden transition-[max-height] duration-200 ease-out ${
              mobilePanel ? "max-h-[60vh]" : "max-h-0"
            }`}
            aria-hidden={!mobilePanel}
          >
            <div className="overflow-y-auto max-h-[60vh] border-b border-[#231F20]/30 bg-[#B2C4AE] px-3 py-3">
              {mobilePanel === "summary" && (
                <div>
                  <h3 className="font-workbench uppercase text-sm tracking-wide mb-2 text-[#231F20]">
                    Summary
                  </h3>
                  <ul className="space-y-1.5 text-sm font-plex-mono">
                    {armySummaryUnits.map((unit) => (
                      <li
                        key={unit.id}
                        className="text-[#231F20] uppercase break-words"
                      >
                        {unit.name} x{quantities[unit.id]}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {mobilePanel === "cost" && (
                <div>
                  <h3 className="font-workbench uppercase text-sm tracking-wide mb-2 text-[#231F20]">
                    Cost breakdown
                  </h3>
                  {armyCostBreakdownUnits.length === 0 ? (
                    <p className="text-sm font-plex-mono text-[#231F20]/80">
                      No units with cost data selected.
                    </p>
                  ) : (
                    <ul className="space-y-2 text-sm font-plex-mono">
                      {armyCostBreakdownUnits.map((unit) => {
                        const qty = quantities[unit.id] ?? 0;
                        const boxesRequired = Math.ceil(
                          qty / (unit.models_per_box ?? 1)
                        );
                        const price = getUnitPrice(unit, currency) ?? 0;
                        const cost = boxesRequired * price;
                        const sym = getCurrencySymbol(currency);
                        return (
                          <li
                            key={unit.id}
                            className="border-b border-[#231F20]/20 pb-2 last:border-b-0"
                          >
                            <div className="font-medium text-[#231F20] uppercase break-words">
                              {unit.name}
                            </div>
                            <div className="text-xs text-[#231F20]/90 mt-0.5 tabular-nums">
                              Qty:{qty} • Box:{boxesRequired} • {sym}
                              {cost.toFixed(2)}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
              {/* Copy / Export / Reset — only when panel is open */}
              {mobilePanel && (
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#231F20]/30">
                  <button
                    type="button"
                    onClick={handleCopyArmyLink}
                    className={`${BTN_STYLE} min-h-[44px] flex items-center justify-center`}
                  >
                    {copyLinkCopied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    type="button"
                    onClick={handleExportList}
                    className={`${BTN_STYLE} min-h-[44px] flex items-center justify-center`}
                  >
                    {exportListCopied ? "Copied List!" : "Export"}
                  </button>
                  <button
                    type="button"
                    onClick={handleResetArmy}
                    className={`${BTN_STYLE} min-h-[44px] flex items-center justify-center`}
                  >
                    RESET
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sticky bar: totals + Summary / Cost buttons */}
          <div className="px-3 py-2">
            <p className="text-sm font-plex-mono font-semibold tabular-nums text-[#231F20]">
              {totals.totalPoints} pts • {getCurrencySymbol(currency)}
              {totals.totalCost.toFixed(2)}
            </p>
            <div className="flex gap-2 mt-1.5">
              <button
                type="button"
                onClick={() =>
                  setMobilePanel((p) => (p === "summary" ? null : "summary"))
                }
                className={`flex-1 py-2 text-sm font-plex-mono border-2 rounded-none min-h-[44px] ${
                  mobilePanel === "summary"
                    ? "bg-[#231F20] text-[#B2C4AE] border-[#231F20]"
                    : "bg-[#B2C4AE] text-[#231F20] border-[#231F20] hover:bg-[#9FB49A]"
                }`}
              >
                Summary
              </button>
              <button
                type="button"
                onClick={() =>
                  setMobilePanel((p) => (p === "cost" ? null : "cost"))
                }
                className={`flex-1 py-2 text-sm font-plex-mono border-2 rounded-none min-h-[44px] ${
                  mobilePanel === "cost"
                    ? "bg-[#231F20] text-[#B2C4AE] border-[#231F20]"
                    : "bg-[#B2C4AE] text-[#231F20] border-[#231F20] hover:bg-[#9FB49A]"
                }`}
              >
                Cost
              </button>
            </div>
          </div>
        </div>
      )}
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
