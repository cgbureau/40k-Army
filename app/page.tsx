"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import armyData from "../data/army-data-no-legends.json";

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

type ArmyData = {
  factions: Record<string, Faction>;
};

type QuantityMap = Record<string, number>;

const { factions } = armyData as ArmyData;
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

export default function Home() {
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

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex items-start justify-center py-12 px-4">
      <main className="w-full max-w-[900px] bg-white shadow-sm rounded-xl border border-zinc-200 p-6 sm:p-8">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
            Space Marines Army Cost Calculator
          </h1>
          <p className="text-sm sm:text-base text-zinc-600">
            Adjust unit quantities to see total points, boxes required, and
            estimated cost. All calculations run client-side.
          </p>
        </header>

        <section className="mb-4">
          <label
            htmlFor="faction-select"
            className="block mb-1.5 text-sm font-medium text-zinc-700"
          >
            Faction
          </label>
          <select
            id="faction-select"
            value={selectedFactionKey}
            onChange={handleFactionChange}
            className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm text-zinc-900"
          >
            {factionKeys.map((key) => (
              <option key={key} value={key}>
                {factions[key].name}
              </option>
            ))}
          </select>
        </section>

        <section className="mb-4">
          <label
            htmlFor="target-points"
            className="block mb-1.5 text-sm font-medium text-zinc-700"
          >
            Target Points
          </label>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {[500, 1000, 2000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTargetPoints(preset)}
                className="px-3 py-1 rounded-md border border-zinc-300 bg-zinc-100 text-sm text-zinc-800 hover:bg-zinc-200"
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
            onChange={(e) => setTargetPoints(Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="w-32 rounded-md border border-zinc-300 bg-white p-2 text-sm text-zinc-900 tabular-nums"
          />
        </section>

        <section className="mb-4">
          <label
            htmlFor="unit-search"
            className="block mb-1.5 text-sm font-medium text-zinc-700"
          >
            Search Units
          </label>
          <input
            id="unit-search"
            type="text"
            placeholder="Type to filter units..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
          />
        </section>

        <section className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {filteredUnits.map((unit) => {
            const qty = quantities[unit.id] ?? 0;
            const hasCostData =
              unit.models_per_box && unit.box_price != null && unit.box_price > 0;

            let boxesRequired: number | null = null;
            let unitCost: number | null = null;

            if (qty > 0 && hasCostData) {
              boxesRequired = Math.ceil(qty / unit.models_per_box!);
              unitCost = boxesRequired * unit.box_price!;
            }

            return (
              <div
                key={unit.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 px-3 py-2"
              >
                <div className="flex flex-col">
                  <div className="font-medium text-sm sm:text-base">
                    {unit.name}
                    {unit.is_legends && (
                      <span className="ml-2 text-[11px] font-normal rounded-full bg-amber-100 text-amber-800 px-2 py-0.5">
                        Legends
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-[13px] text-zinc-600">
                    <span>{unit.points} pts</span>
                    {unit.models_per_box && (
                      <span>· {unit.models_per_box} models / box</span>
                    )}
                    {unit.box_price != null && unit.box_price > 0 && (
                      <span>· £{unit.box_price.toFixed(2)} / box</span>
                    )}
                    {qty > 0 && hasCostData && (
                      <span className="font-medium text-zinc-800">
                        · {boxesRequired} box
                        {boxesRequired && boxesRequired > 1 ? "es" : ""} · £
                        {unitCost?.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleChangeQuantity(unit.id, -1)}
                    className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded border border-zinc-300 bg-zinc-50 text-zinc-700 text-lg leading-none hover:bg-zinc-100 active:bg-zinc-200"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-medium tabular-nums">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleChangeQuantity(unit.id, 1)}
                    className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded border border-zinc-300 bg-zinc-50 text-zinc-700 text-lg leading-none hover:bg-zinc-100 active:bg-zinc-200"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mt-6 sm:mt-8 rounded-lg border border-zinc-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h2 className="text-lg font-semibold">Army Summary</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyArmyLink}
                className="text-sm px-3 py-1 border border-zinc-300 rounded-md bg-white hover:bg-zinc-100 text-zinc-800"
              >
                {copyLinkCopied ? "Copied!" : "Copy Army Link"}
              </button>
              <button
                type="button"
                onClick={handleExportList}
                className="text-sm px-3 py-1 border border-zinc-300 rounded-md bg-white hover:bg-zinc-100 text-zinc-800"
              >
                {exportListCopied ? "Copied List!" : "Export List"}
              </button>
            </div>
          </div>
          {armySummaryUnits.length === 0 ? (
            <p className="text-zinc-600 text-sm">No units selected.</p>
          ) : (
            <ul className="space-y-1 text-sm text-zinc-800">
              {armySummaryUnits.map((unit) => (
                <li key={unit.id}>
                  {unit.name} x{quantities[unit.id]}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-4 rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="text-lg font-semibold mb-3">Army Cost Breakdown</h2>
          {armyCostBreakdownUnits.length === 0 ? (
            <p className="text-zinc-600 text-sm py-2">
              No units with cost data selected.
            </p>
          ) : (
            <div className="divide-y divide-zinc-200">
              {armyCostBreakdownUnits.map((unit) => {
                const qty = quantities[unit.id] ?? 0;
                const boxesRequired = Math.ceil(qty / (unit.models_per_box ?? 1));
                const cost = boxesRequired * (unit.box_price ?? 0);
                return (
                  <div
                    key={unit.id}
                    className="py-2 text-sm border-b border-zinc-200 last:border-b-0"
                  >
                    <div className="font-medium text-zinc-900">{unit.name}</div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-zinc-600">
                      <span>Qty: {qty}</span>
                      <span>Boxes: {boxesRequired}</span>
                      <span>Cost: £{cost.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="sticky bottom-0 left-0 right-0 z-10 mt-6 sm:mt-8 border-t border-zinc-200 bg-white pt-4 sm:pt-6 pb-4 sm:pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.08)]">
          <h2 className="text-lg font-semibold mb-3">Totals</h2>
          <div
            className={`grid grid-cols-1 gap-3 text-sm sm:text-base ${
              targetPoints > 0
                ? "sm:grid-cols-2 lg:grid-cols-4"
                : "sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
              <div className="text-xs uppercase tracking-wide text-zinc-500">
                Current Points
              </div>
              <div className="mt-1 text-lg font-semibold tabular-nums">
                {totals.totalPoints}
              </div>
            </div>
            {targetPoints > 0 && (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                <div className="text-xs uppercase tracking-wide text-zinc-500">
                  Remaining Points
                </div>
                <div
                  className={`mt-1 text-lg font-semibold tabular-nums ${
                    targetPoints - totals.totalPoints < 0 ? "text-red-600" : ""
                  }`}
                >
                  {targetPoints - totals.totalPoints}
                </div>
              </div>
            )}
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
              <div className="text-xs uppercase tracking-wide text-zinc-500">
                Total Boxes Required
              </div>
              <div className="mt-1 text-lg font-semibold tabular-nums">
                {totals.totalBoxes}
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
              <div className="text-xs uppercase tracking-wide text-zinc-500">
                Estimated Cost (£)
              </div>
              <div className="mt-1 text-lg font-semibold tabular-nums">
                £{totals.totalCost.toFixed(2)}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

