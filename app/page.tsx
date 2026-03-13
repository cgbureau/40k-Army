"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { factionColors, DEFAULT_FACTION_COLOR } from "./config/factionColors";
import adeptaSororitasKitMappings from "../data/kit-mappings/adepta-sororitas.json";
import adeptusCustodesKitMappings from "../data/kit-mappings/adeptus-custodes.json";
import adeptusMechanicusKitMappings from "../data/kit-mappings/adeptus-mechanicus.json";
import aeldariKitMappings from "../data/kit-mappings/aeldari.json";
import astraMilitarumKitMappings from "../data/kit-mappings/astra-militarum.json";
import chaosDaemonsKitMappings from "../data/kit-mappings/chaos-daemons.json";
import chaosSpaceMarinesKitMappings from "../data/kit-mappings/chaos-space-marines.json";
import custodesKitMappings from "../data/kit-mappings/custodes.json";
import deathGuardKitMappings from "../data/kit-mappings/death-guard.json";
import drukhariKitMappings from "../data/kit-mappings/drukhari.json";
import emperorsChildrenKitMappings from "../data/kit-mappings/emperor-s-children.json";
import genestealerCultKitMappings from "../data/kit-mappings/genestealer-cults.json";
import greyKnightsKitMappings from "../data/kit-mappings/grey-knights.json";
import imperialAgentsKitMappings from "../data/kit-mappings/imperial-agents.json";
import imperialKnightsKitMappings from "../data/kit-mappings/imperial-knights.json";
import leaguesOfVotannKitMappings from "../data/kit-mappings/leagues-of-votann.json";
import necronsKitMappings from "../data/kit-mappings/necrons.json";
import orksKitMappings from "../data/kit-mappings/orks.json";
import spaceMarinesKitMappings from "../data/kit-mappings/space-marines.json";
import tauKitMappings from "../data/kit-mappings/tau.json";
import thousandSonsKitMappings from "../data/kit-mappings/thousand-sons.json";
import tyranidsKitMappings from "../data/kit-mappings/tyranids.json";
import worldEatersKitMappings from "../data/kit-mappings/world-eaters.json";

import adeptaSororitasKits from "../data/kits/adepta-sororitas.json";
import adeptusCustodesKits from "../data/kits/adeptus-custodes.json";
import adeptusMechanicusKits from "../data/kits/adeptus-mechanicus.json";
import aeldariKits from "../data/kits/aeldari.json";
import astraMilitarumKits from "../data/kits/astra-militarum.json";
import chaosDaemonsKits from "../data/kits/chaos-daemons.json";
import chaosSpaceMarinesKits from "../data/kits/chaos-space-marines.json";
import custodesKits from "../data/kits/custodes.json";
import deathGuardKits from "../data/kits/death-guard.json";
import drukhariKits from "../data/kits/drukhari.json";
import emperorsChildrenKits from "../data/kits/emperor-s-children.json";
import genestealerCultKits from "../data/kits/genestealer-cults.json";
import greyKnightsKits from "../data/kits/grey-knights.json";
import imperialAgentsKits from "../data/kits/imperial-agents.json";
import imperialKnightsKits from "../data/kits/imperial-knights.json";
import leaguesOfVotannKits from "../data/kits/leagues-of-votann.json";
import necronsKits from "../data/kits/necrons.json";
import orksKits from "../data/kits/orks.json";
import spaceMarinesKits from "../data/kits/space-marines.json";
import tauKits from "../data/kits/tau.json";
import thousandSonsKits from "../data/kits/thousand-sons.json";
import tyranidsKits from "../data/kits/tyranids.json";
import worldEatersKits from "../data/kits/world-eaters.json";

type Unit = {
  id: string;
  name: string;
  points: number;
  models_per_box: number | null;
  box_price: number | null;
  prices?: {
    GBP?: number | null;
    USD?: number | null;
    EUR?: number | null;
    AUD?: number | null;
    CAD?: number | null;
  };
  is_legends?: boolean;
  availability?: "retail" | "legends" | "forgeworld";
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

const CURRENCY_SYMBOLS: Record<"GBP" | "USD" | "EUR" | "AUD" | "CAD", string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  AUD: "$",
  CAD: "$",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getUnitPrice(
  unit: Unit,
  currency: "GBP" | "USD" | "EUR" | "AUD" | "CAD"
): number | null {
  const value = unit.prices?.[currency];

  if (value != null && value > 0) {
    return value;
  }

  const fallback = unit.prices?.GBP;

  if (fallback != null && fallback > 0) {
    return fallback;
  }

  return null;
}

function getCurrencySymbol(currency: "GBP" | "USD" | "EUR" | "AUD" | "CAD"): string {
  return CURRENCY_SYMBOLS[currency];
}

type QuantityMap = Record<string, number>;

const KIT_MAPPINGS_REGISTRY: Record<string, Record<string, string>> = {
  "adepta-sororitas": adeptaSororitasKitMappings as Record<string, string>,
  "adeptus-custodes": adeptusCustodesKitMappings as Record<string, string>,
  "adeptus-mechanicus": adeptusMechanicusKitMappings as Record<string, string>,
  aeldari: aeldariKitMappings as Record<string, string>,
  "astra-militarum": astraMilitarumKitMappings as Record<string, string>,
  "chaos-daemons": chaosDaemonsKitMappings as Record<string, string>,
  "chaos-space-marines": chaosSpaceMarinesKitMappings as Record<string, string>,
  custodes: custodesKitMappings as Record<string, string>,
  "death-guard": deathGuardKitMappings as Record<string, string>,
  drukhari: drukhariKitMappings as Record<string, string>,
  "emperor-s-children": emperorsChildrenKitMappings as Record<string, string>,
  "genestealer-cults": genestealerCultKitMappings as Record<string, string>,
  "grey-knights": greyKnightsKitMappings as Record<string, string>,
  "imperial-agents": imperialAgentsKitMappings as Record<string, string>,
  "imperial-knights": imperialKnightsKitMappings as Record<string, string>,
  "leagues-of-votann": leaguesOfVotannKitMappings as Record<string, string>,
  necrons: necronsKitMappings as Record<string, string>,
  orks: orksKitMappings as Record<string, string>,
  "space-marines": spaceMarinesKitMappings as Record<string, string>,
  tau: tauKitMappings as Record<string, string>,
  "thousand-sons": thousandSonsKitMappings as Record<string, string>,
  tyranids: tyranidsKitMappings as Record<string, string>,
  "world-eaters": worldEatersKitMappings as Record<string, string>,
};

const KIT_REGISTRY: Record<
  string,
  Record<string, { models?: number | null; prices?: Unit["prices"] | null }>
> = {
  "adepta-sororitas": adeptaSororitasKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  "adeptus-custodes": adeptusCustodesKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  "adeptus-mechanicus": adeptusMechanicusKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  aeldari: aeldariKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  "astra-militarum": astraMilitarumKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  "chaos-daemons": chaosDaemonsKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  "chaos-space-marines": chaosSpaceMarinesKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  custodes: custodesKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  "death-guard": deathGuardKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  drukhari: drukhariKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  "emperor-s-children": emperorsChildrenKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  "genestealer-cults": genestealerCultKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  "grey-knights": greyKnightsKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  "imperial-agents": imperialAgentsKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  "imperial-knights": imperialKnightsKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  "leagues-of-votann": leaguesOfVotannKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  necrons: necronsKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  orks: orksKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  "space-marines": spaceMarinesKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  tau: tauKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  "thousand-sons": thousandSonsKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  tyranids: tyranidsKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
  "world-eaters": worldEatersKits as Record<
    string,
    { models?: number | null; prices?: Unit["prices"] | null }
  >,
};

function enrichUnitsWithKits(units: Unit[], factionSlug: string): Unit[] {
  const mappings = KIT_MAPPINGS_REGISTRY[factionSlug] ?? {};
  const kits = KIT_REGISTRY[factionSlug] ?? {};

  return units.map((unit) => {
    const kitSlug = mappings[unit.id];
    const kit = kitSlug ? kits[kitSlug] : null;

    return {
      id: unit.id,
      name: unit.name,
      points: unit.points,
      availability: unit.availability,
      models_per_box: kit?.models ?? null,
      box_price: unit.box_price ?? null,
      prices: (kit?.prices as Unit["prices"]) ?? unit.prices,
    };
  });
}

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
  const [currency, setCurrency] = useState<"GBP" | "USD" | "EUR" | "AUD" | "CAD">("GBP");
  const [mobilePanel, setMobilePanel] = useState<"summary" | "cost" | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailValue, setEmailValue] = useState("");
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
        const urlFaction = searchParams.get("faction");
        const defaultSlug =
          sorted.find((f) => f.slug === urlFaction)?.slug ??
          sorted.find((f) => f.slug === "space-marines")?.slug ??
          sorted[0]?.slug ??
          "";
        setSelectedFactionSlug(defaultSlug);
      })
      .catch(() => setFactionList([]))
      .finally(() => setFactionsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

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
        const enriched = enrichUnitsWithKits(list, selectedFactionSlug);
        setUnits(enriched);
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

  const kitMappingsForFaction = useMemo(
    () => KIT_MAPPINGS_REGISTRY[selectedFactionSlug] ?? {},
    [selectedFactionSlug]
  );

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
      const boxCount = Math.floor(qty / (unit.models_per_box || 1));
      totalPoints += unit.points * boxCount;
      const price = getUnitPrice(unit, currency);
      if (unit.models_per_box != null && price != null) {
        const boxesRequired = Math.ceil(qty / unit.models_per_box);
        totalBoxes += boxesRequired;
        totalCost += boxesRequired * price;
      }
    }
    const discountedCost = totalCost * (1 - discount / 100);
    return { totalPoints, totalBoxes, totalCost: discountedCost };
  }, [quantities, units, currency, discount]);

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
    () => armySummaryUnits,
    [armySummaryUnits]
  );

  const handleResetArmy = () => {
    setQuantities({});
  };

  const costPer1000 = useMemo(() => {
    if (totals.totalPoints <= 0) return null;
    return Math.round((totals.totalCost / totals.totalPoints) * 1000);
  }, [totals.totalPoints, totals.totalCost]);

  const factionAccentColor =
    factionColors[selectedFactionSlug] ?? DEFAULT_FACTION_COLOR;

  const handleEmailSubmit = async () => {
    const email = emailValue.trim();
    if (!email) return;

    if (!EMAIL_REGEX.test(email)) {
      alert("Enter a valid email");
      return;
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setEmailValue("");
        alert("Thanks — you're on the list.");
      } else {
        alert("Something went wrong.");
      }
    } catch {
      alert("Network error.");
    }
  };

  return (
    <div className="min-h-[auto] max-w-full overflow-x-hidden flex flex-col page-bg text-[#231F20] font-plex-mono max-[900px]:min-h-screen max-[900px]:overflow-y-auto lg:h-screen lg:overflow-hidden">
      <div
        className={`flex flex-col min-h-0 shrink-0 max-[900px]:flex-1 max-[900px]:min-h-0 max-[900px]:overflow-visible lg:flex-1 lg:shrink max-w-6xl w-full mx-auto mt-[20px] py-4 px-4 lg:overflow-hidden relative z-10 ${
          armySummaryUnits.length > 0 ? "max-[900px]:pb-[220px]" : ""
        }`}
      >
        <header className="text-center flex-shrink-0 mb-2 relative">
          {/* Desktop: header row with Join/Support left, logo center, currency right */}
          <div className="hidden md:flex relative items-start justify-between max-w-6xl mx-auto pt-6 mb-4 min-h-[120px]">
            <div className="flex flex-col items-start gap-1 text-left">
              <button
                type="button"
                className="text-xs font-plex-mono underline cursor-pointer uppercase text-[#1E2A44]"
                onClick={() => setEmailOpen(!emailOpen)}
              >
                JOIN THE COMMAND ROSTER FOR UPDATES
              </button>
              <a
                href="https://buymeacoffee.com/40karmy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] uppercase tracking-wider underline font-semibold opacity-85 hover:opacity-100"
              >
                Support project development
              </a>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 mt-[-6px] flex flex-col items-center gap-1">
              <Image
                src="/40KArmy_Logo.svg"
                alt="40KArmy logo"
                width={260}
                height={104}
                priority
                className="h-16 w-auto min-h-[64px]"
              />
              <div className="text-center leading-[1.05] mt-1">
                <div className="font-workbench text-[15px] tracking-wide">
                  WARHAMMER 40K
                </div>
                <div className="font-workbench text-[15px] tracking-wide">
                  ARMY CALCULATOR
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <select
                id="currency-select"
                value={currency}
                onChange={(e) =>
                  setCurrency(
                    e.target.value as "GBP" | "USD" | "EUR" | "AUD" | "CAD"
                  )
                }
                className="border-2 border-[#231F20] bg-[#B2C4AE] px-2 py-1 text-sm text-[#231F20] font-plex-mono focus:outline-none focus:ring-2 focus:ring-[#231F20] rounded-none"
                aria-label="Select currency"
              >
                <option value="GBP">GBP (£)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="AUD">AUD ($)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>
          </div>

          {/* Mobile: two-column — left = logo (64px), right = title (2 lines) + currency */}
          <div className="max-[900px]:flex max-[900px]:flex-row max-[900px]:items-stretch max-[900px]:gap-3 max-[900px]:w-full md:hidden">
            <div className="max-[900px]:shrink-0 max-[900px]:flex max-[900px]:items-center">
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
              <div className="max-[900px]:text-right">
                <div className="text-right leading-[1.05]">
                  <div className="font-workbench text-[15px] tracking-wide">
                    WARHAMMER 40K
                  </div>
                  <div className="font-workbench text-[15px] tracking-wide">
                    ARMY CALCULATOR
                  </div>
                </div>
              </div>
              <div className="max-[900px]:flex max-[900px]:justify-end max-[900px]:items-center max-[900px]:mt-1.5">
                <select
                  id="currency-select-mobile"
                  value={currency}
                  onChange={(e) =>
                    setCurrency(e.target.value as "GBP" | "USD" | "EUR" | "AUD" | "CAD")
                  }
                  className="border-2 border-[#231F20] bg-[#B2C4AE] px-2 py-1.5 text-sm text-[#231F20] font-plex-mono focus:outline-none focus:ring-2 focus:ring-[#231F20] rounded-none"
                  aria-label="Select currency"
                >
                  <option value="GBP">GBP (£)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="AUD">AUD ($)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>
            </div>
          </div>
          <div
            className="px-3 mt-4 mb-3 text-sm font-plex-mono font-semibold underline cursor-pointer uppercase text-[#1E2A44] md:hidden"
            onClick={() => setEmailOpen(!emailOpen)}
          >
            JOIN THE COMMAND ROSTER FOR UPDATES
          </div>
          <div className="flex justify-center mt-0 mb-1 md:hidden">
            <a
              href="https://buymeacoffee.com/40karmy"
              target="_blank"
              rel="noopener noreferrer"
              className="uppercase tracking-wider underline font-semibold opacity-85 hover:opacity-100 text-[13px]"
            >
              Support project development
            </a>
          </div>
          {emailOpen && (
            <div className="px-3 pt-2 pb-2">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="enter email"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  className="border-2 border-[#231F20] bg-[#B2C4AE] px-2 py-1 text-sm font-plex-mono rounded-none flex-1"
                />
                <button
                  className="border-2 border-[#231F20] px-2 py-1 text-sm font-plex-mono bg-[#B2C4AE] cursor-pointer transition-all duration-150 active:translate-y-[1px] active:scale-[0.97] hover:bg-[#A8BAA3]"
                  onClick={handleEmailSubmit}
                >
                  Join
                </button>
              </div>
            </div>
          )}
        </header>

        <main
          className="flex-1 min-h-0 flex flex-col gap-3 max-[900px]:overflow-visible max-[900px]:min-h-0 lg:grid lg:grid-cols-[1fr_320px] lg:gap-4"
          style={{ overflowAnchor: "none" }}
        >
          <section
            className={`${PANEL_BORDER} ${PANEL_BG} border-l-4 p-3 flex flex-col min-h-0 max-[900px]:min-h-0 max-[900px]:max-h-none max-[900px]:overflow-visible max-h-[calc(100vh-220px)] h-full rounded-none overflow-hidden lg:max-h-[calc(100vh-220px)] lg:overflow-hidden`}
            style={{ borderLeftColor: factionAccentColor }}
          >
            <div className="relative mb-3">
              <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-xs text-[#231F20]">
                {/* simple inline search icon */}
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
                    onChange={handleFactionChange}
                    className="border-2 bg-[#B2C4AE] px-2 py-1 text-sm text-[#231F20] font-plex-mono focus:outline-none rounded-none flex-1 min-w-0"
                    style={{
                      borderColor: factionAccentColor,
                    }}
                  >
                    {factionList.map((f) => (
                      <option key={f.slug} value={f.slug}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm font-workbench px-1">
                    -%
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={discount}
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const val = raw.replace(/^0+/, "");
                      const num = val === "" ? 0 : parseInt(val, 10);
                      setDiscount(Math.max(0, Math.min(100, num)));
                    }}
                    onBlur={(e) => {
                      if (e.target.value.trim() === "") {
                        setDiscount(0);
                      }
                    }}
                    className="w-[70px] min-w-[58px] border-2 border-[#231F20] bg-[#B2C4AE] px-2 py-1 text-sm font-plex-mono text-[#231F20] tabular-nums rounded-none"
                  />
                </div>
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
              className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden border-2 border-[#231F20] rounded-none ${PANEL_BG} max-[900px]:overflow-y-auto max-[900px]:max-h-none max-[900px]:min-h-0 lg:max-h-[calc(100vh-340px)] lg:overflow-y-auto lg:min-h-0`}
            >
              {factionsLoading || unitsLoading ? (
                <p className="py-4 text-sm font-plex-mono">Loading...</p>
              ) : (
                <div className="divide-y divide-[#231F20]/40">
                  {filteredUnits.map((unit, index) => {
                    const qty = quantities[unit.id] ?? 0;
                    const price = getUnitPrice(unit, currency);
                    const currencySymbol = getCurrencySymbol(currency);
                    const priceStr =
                      price !== null
                        ? `${currencySymbol}${price.toFixed(2)}`
                        : "--";
                    const hasKit = !!kitMappingsForFaction[unit.id];
                    const hasBoxData = hasKit;
                    const availability = unit.availability;
                    let statusLabel: "LEGENDS" | "FORGEWORLD" | "AWOL" | null = null;
                    if (availability === "legends") {
                      statusLabel = "LEGENDS";
                    } else if (availability === "forgeworld") {
                      statusLabel = "FORGEWORLD";
                    } else if (!hasKit) {
                      statusLabel = "AWOL";
                    }
                    return (
                      <div
                        key={unit.id}
                        className={`border-t border-[#231F20] px-2 py-[9px] ${
                          index % 2 === 0 ? "bg-[#B2C4AE]" : "bg-[#A8BAA3]"
                        }`}
                      >
                        <div className="mb-[4px] w-full pr-1">
                          <h3
                            className={`text-sm font-plex-mono uppercase leading-tight break-words ${
                              !hasBoxData
                                ? "text-[#5E6E5A]"
                                : "text-[#231F20]"
                            }`}
                          >
                            <span>{unit.name}</span>
                          </h3>
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <div className="text-[13px] font-plex-mono flex items-center gap-2 min-w-0 text-[#231F20]">
                            <span className="font-semibold tabular-nums">
                              {unit.points}pts
                            </span>
                            {unit.models_per_box != null && (
                              <span>
                                • {unit.models_per_box}{" "}
                                {unit.models_per_box === 1 ? "mdl" : "mdls"}
                              </span>
                            )}
                            {price !== null && (
                              <span className="font-semibold tabular-nums">
                                • {currencySymbol}
                                {price.toFixed(2)}
                              </span>
                            )}
                            {statusLabel && (
                              <>
                                <span>•</span>
                                {statusLabel === "LEGENDS" && (
                                  <span className="text-violet-500 font-workbench">
                                    LEGENDS
                                  </span>
                                )}
                                {statusLabel === "FORGEWORLD" && (
                                  <span className="text-orange-500 font-workbench">
                                    FORGEWORLD
                                  </span>
                                )}
                                {statusLabel === "AWOL" && (
                                  <span className="text-[#C23B22] font-workbench">
                                    AWOL
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-[2px] shrink-0 ml-2">
                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() =>
                                handleChangeQuantity(
                                  unit.id,
                                  -(unit.models_per_box || 1)
                                )
                              }
                              className="w-7 h-7 border-2 border-[#231F20] flex items-center justify-center font-plex-mono"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="w-6 text-center font-plex-mono tabular-nums">
                              {Math.floor(qty / (unit.models_per_box || 1))}
                            </span>
                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() =>
                                handleChangeQuantity(
                                  unit.id,
                                  unit.models_per_box || 1
                                )
                              }
                              className="w-7 h-7 border-2 border-[#231F20] flex items-center justify-center font-plex-mono"
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
                <h2 className="font-workbench uppercase text-base tracking-wide mb-1.5 border-b-2 border-[#231F20] pb-1">
                  Army Overview
                </h2>
                {armyCostBreakdownUnits.length === 0 ? (
                  <p className="text-sm font-plex-mono py-1.5">
                    No units selected.
                  </p>
                ) : (
                  <ul className="space-y-1 text-sm font-plex-mono">
                    {armyCostBreakdownUnits.map((unit) => {
                      const qty = quantities[unit.id] ?? 0;
                      const boxCount = Math.floor(
                        qty / (unit.models_per_box ?? 1)
                      );
                      const pointsTotal = unit.points * boxCount;
                      const pricePerBox = getUnitPrice(unit, currency);
                      const sym = getCurrencySymbol(currency);
                      const totalCost =
                        pricePerBox != null ? boxCount * pricePerBox : null;
                      return (
                        <li
                          key={unit.id}
                          className="py-1 border-b border-[#231F20]/30 last:border-b-0 min-w-0"
                        >
                          <div className="font-medium text-[#231F20] uppercase break-words">
                            <span>{unit.name}</span>
                          </div>
                          <div className="text-xs text-[#231F20]/90 tabular-nums mt-0.5">
                            {pointsTotal}pts
                            {totalCost != null &&
                              ` • ${sym}${totalCost.toFixed(2)}`}
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

        <section className="mt-4 w-full px-4 text-xs opacity-80">
          {/* Mobile / tablet stacked layout */}
          <div className="max-w-6xl mx-auto md:hidden">
            <div className="mb-6">
              <h2 className="font-workbench text-sm tracking-wide uppercase mb-2 text-left">
                Warhammer 40K Army Cost Calculator
              </h2>
              <p className="mb-2 text-xs leading-snug text-gray-600">
                This fan-made Warhammer 40K army cost calculator helps estimate the
                real-world cost of building a tabletop army. Select units from your
                faction, track total points, estimate how many model boxes are required,
                and calculate the approximate price of your army list before buying
                miniatures.
              </p>
              <p className="mb-2 text-xs leading-snug text-gray-600">
                Warhammer armies can vary widely in cost depending on faction, model count
                and list size. Use this calculator to quickly understand how expensive
                different Warhammer 40K army builds can be before purchasing models.
              </p>
            </div>
            <div className="mb-10">
              <h3 className="font-workbench text-sm tracking-wide uppercase mb-2 text-left">
                Explore army cost guides
              </h3>
              <ul className="mt-1 text-xs leading-snug text-gray-600 font-plex-mono underline space-y-1">
                <li>
                  <a href="/space-marines-army-cost">Space Marines army cost</a>
                </li>
                <li>
                  <a href="/orks-army-cost">Orks army cost</a>
                </li>
                <li>
                  <a href="/necrons-army-cost">Necrons army cost</a>
                </li>
                <li>
                  <a href="/tyranids-army-cost">Tyranids army cost</a>
                </li>
                <li>
                  <a href="/chaos-space-marines-army-cost">
                    Chaos Space Marines army cost
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Desktop two-column layout aligned with calculator */}
          <div className="hidden md:grid max-w-7xl mx-auto mt-4 grid-cols-2 gap-16">
            <div className="text-left">
              <h2 className="font-workbench text-sm tracking-wide uppercase mb-2">
                Warhammer 40K Army Cost Calculator
              </h2>
              <p className="mb-2 text-xs leading-snug text-gray-600">
                This fan-made Warhammer 40K army cost calculator helps estimate the
                real-world cost of building a tabletop army. Select units from your
                faction, track total points, estimate how many model boxes are required,
                and calculate the approximate price of your army list before buying
                miniatures.
              </p>
              <p className="mb-2 text-xs leading-snug text-gray-600">
                Warhammer armies can vary widely in cost depending on faction, model count
                and list size. Use this calculator to quickly understand how expensive
                different Warhammer 40K army builds can be before purchasing models.
              </p>
            </div>
            <div className="text-right">
              <h3 className="font-workbench text-sm tracking-wide uppercase mb-2">
                Explore army cost guides
              </h3>
              <ul className="mt-1 text-xs leading-snug text-gray-600 font-plex-mono underline space-y-1">
                <li>
                  <a href="/space-marines-army-cost">Space Marines army cost</a>
                </li>
                <li>
                  <a href="/orks-army-cost">Orks army cost</a>
                </li>
                <li>
                  <a href="/necrons-army-cost">Necrons army cost</a>
                </li>
                <li>
                  <a href="/tyranids-army-cost">Tyranids army cost</a>
                </li>
                <li>
                  <a href="/chaos-space-marines-army-cost">
                    Chaos Space Marines army cost
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <footer className="flex-shrink-0">
          <div className="w-full flex justify-center">
            <div className="w-full max-w-full text-xs opacity-70 mt-[12px] break-words text-left md:text-center">
              <p>
                40KArmy v2 — unofficial Warhammer army cost calculator - A product
                by the Contemporary Graphics Bureau
              </p>
              <p className="mt-0.5">
                Warhammer 40,000 and all associated names are trademarks of Games
                Workshop. This project is an unofficial fan-made tool.
              </p>
            </div>
          </div>
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
              {mobilePanel === "cost" && (
                <div>
                  <h3 className="font-workbench uppercase text-sm tracking-wide mb-2 text-[#231F20]">
                    Army Overview
                  </h3>
                  {armyCostBreakdownUnits.length === 0 ? (
                    <p className="text-sm font-plex-mono text-[#231F20]/80">
                      No units selected.
                    </p>
                  ) : (
                    <>
                      <ul className="space-y-2 text-sm font-plex-mono">
                        {armyCostBreakdownUnits.map((unit) => {
                          const qty = quantities[unit.id] ?? 0;
                          const boxCount = Math.floor(
                            qty / (unit.models_per_box ?? 1)
                          );
                          const pointsTotal = unit.points * boxCount;
                          const pricePerBox = getUnitPrice(unit, currency);
                          const sym = getCurrencySymbol(currency);
                          const totalCost =
                            pricePerBox != null ? boxCount * pricePerBox : null;
                          return (
                            <li
                              key={unit.id}
                              className="flex justify-between items-start border-b border-[#231F20]/20 py-2 last:border-b-0"
                            >
                              <div className="font-medium text-[#231F20] uppercase break-words mr-2 leading-tight">
                                <span>{unit.name}</span>
                              </div>
                              <div className="text-right text-xs leading-tight whitespace-nowrap tabular-nums">
                                <div className="opacity-80">
                                  {pointsTotal}pts
                                  {totalCost != null &&
                                    ` • ${sym}${totalCost.toFixed(2)}`}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="flex justify-between items-center text-sm font-plex-mono border-t border-[#231F20]/20 pt-2 mb-2">
                        <span className="opacity-70">Cost / 1000pts</span>
                        <span className="font-medium tabular-nums">
                          {getCurrencySymbol(currency)}
                          {costPer1000 != null
                            ? costPer1000.toFixed(0)
                            : "0"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}
              {/* Copy / Export / Reset — only when panel is open */}
              {mobilePanel && (
                <div className="flex gap-2 justify-center mt-2 mb-1">
                  <button
                    type="button"
                    onClick={handleCopyArmyLink}
                    className={`${BTN_STYLE} flex items-center justify-center py-[2px] px-3`}
                  >
                    {copyLinkCopied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    type="button"
                    onClick={handleExportList}
                    className={`${BTN_STYLE} flex items-center justify-center py-[2px] px-3`}
                  >
                    {exportListCopied ? "Copied List!" : "Export"}
                  </button>
                  <button
                    type="button"
                    onClick={handleResetArmy}
                    className={`${BTN_STYLE} flex items-center justify-center py-[2px] px-3`}
                  >
                    RESET
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sticky bar: totals + Summary / Cost buttons */}
          <div className="px-3 py-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-plex-mono font-semibold tabular-nums text-[#231F20]">
                {totals.totalPoints} pts • {getCurrencySymbol(currency)}
                {totals.totalCost.toFixed(2)}
              </p>
              {discount > 0 && (
                <span className="font-plex-mono text-sm">
                  -{discount}%
                </span>
              )}
            </div>
            <div className="flex gap-2 mt-1.5">
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
                Overview
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
