import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  kitModelsDataset,
  kitPricesDataset,
  kitTypesDataset,
  kitUnitPriceAllocationsDataset,
  kitUnitsDataset,
  kitsDataset,
  priceMarketCountriesDataset,
  priceMarketsDataset,
  rulesFactionsDataset,
  rulesFactionUnitsDataset,
  unitsDataset,
} from "../db/seed_config/seed/data/_index.data";
import { legacyImportedKitPricesDataset } from "../db/seed_config/seed/data/kit_prices/legacy/all.data";
import { gwImportedKitPricesDataset } from "../db/seed_config/seed/data/kit_prices/gw/all.data";

const DEFAULT_REPO_ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
);
const DEFAULT_OUTPUT_PATH = "docs/kit_dataset_inventory.md";

type LegacyKitEntry = {
  display_name?: string;
  image?: string;
  models?: number;
  prices?: Record<string, number | null>;
  slug_short?: string;
  year?: number | null;
};

type TargetFactionKitSource = {
  factionName: string;
  factionSlug: string;
  catalogFiles: string[];
  mappingFiles: string[];
};

type LegacyKitFileStats = {
  filePath: string;
  kitRows: number;
  kitSlugs: string[];
  displayNameRows: number;
  imageRows: number;
  yearRows: number;
  priceObservations: number;
  currencies: Set<string>;
};

type MappingFileStats = {
  filePath: string;
  mappingEntries: number;
  unitSlugs: Set<string>;
  referencedKitSlugs: Set<string>;
};

type KitInventoryRow = {
  factionName: string;
  factionSlug: string;
  catalogFilesPresent: string[];
  catalogRows: number;
  uniqueCatalogKitSlugs: number;
  globallyDuplicatedCatalogSlugs: number;
  mappingFilesPresent: string[];
  mappingEntries: number;
  mappedUnitSlugs: number;
  referencedKitSlugs: number;
  brokenMappingReferences: number;
  unreferencedCatalogKitSlugs: number;
};

type KitInventory = {
  repoRoot: string;
  rows: KitInventoryRow[];
  legacyCatalog: {
    files: number;
    rawRows: number;
    uniqueKitSlugs: number;
    duplicateUniqueSlugs: number;
    duplicateRowsBeyondFirst: number;
    displayNameRows: number;
    imageRows: number;
    yearRows: number;
    priceObservations: number;
    currencies: string[];
  };
  legacyMappings: {
    files: number;
    mappingEntries: number;
    mappedUnitSlugs: number;
    referencedKitSlugs: number;
    brokenReferenceCount: number;
  };
  currentSeed: {
    kitTypes: number;
    kits: number;
    kitModels: number;
    kitUnits: number;
    kitUnitPriceAllocations: number;
    kitPrices: number;
    kitPricesTcgcsv: number;
    kitPricesLegacy: number;
    kitPricesGw: number;
  };
  duplicateCatalogSlugs: DuplicateCatalogSlug[];
  brokenMappingReferences: BrokenMappingReference[];
  activeUnitKitCoverage: ActiveUnitKitCoverage;
  unmappedCatalogFiles: string[];
  unmappedMappingFiles: string[];
  normalizedLegacy: NormalizedLegacySummary | null;
};

type ActiveUnitKitCoverage = {
  rows: ActiveUnitKitCoverageRow[];
  reviewUnits: ActiveUnitKitReviewUnit[];
};

type ActiveUnitKitCoverageRow = {
  factionName: string;
  factionSlug: string;
  activeUnitCount: number;
  canonicalKitUnitCount: number;
  legacyMappedUnitCount: number;
  missingCanonicalKitUnitCount: number;
  needsSourceReviewCount: number;
};

type ActiveUnitKitReviewUnit = {
  factionName: string;
  factionSlug: string;
  unitName: string;
  unitSlug: string;
};

type DuplicateCatalogSlug = {
  kitSlug: string;
  files: string[];
};

type BrokenMappingReference = {
  mappingFile: string;
  unitSlug: string;
  kitSlug: string;
};

type NormalizedLegacySummary = {
  output_files: {
    products: string;
    price_observations: string;
    unit_mapping_candidates: string;
    summary: string;
  };
  counts: {
    normalized_products: number;
    products_with_duplicate_source_rows: number;
    products_with_missing_model_count: number;
    products_with_conflicting_model_counts: number;
    price_observations: number;
    unit_mapping_candidates: number;
    resolved_unit_mapping_candidates: number;
    unresolved_unit_mapping_candidates: number;
    invalid_unit_mapping_candidates: number;
  };
};

const TARGET_FACTION_KIT_SOURCES: TargetFactionKitSource[] = [
  {
    factionName: "Adepta Sororitas",
    factionSlug: "adepta_sororitas",
    catalogFiles: ["adepta-sororitas.json", "adepta-sororitas.NEW.json"],
    mappingFiles: ["adepta-sororitas.json"],
  },
  {
    factionName: "Adeptus Custodes",
    factionSlug: "adeptus_custodes",
    catalogFiles: ["adeptus-custodes.json", "custodes.json"],
    mappingFiles: ["adeptus-custodes.json", "custodes.json"],
  },
  {
    factionName: "Adeptus Mechanicus",
    factionSlug: "adeptus_mechanicus",
    catalogFiles: ["adeptus-mechanicus.json"],
    mappingFiles: ["adeptus-mechanicus.json"],
  },
  {
    factionName: "Astra Militarum",
    factionSlug: "astra_militarum",
    catalogFiles: ["astra-militarum.json"],
    mappingFiles: ["astra-militarum.json"],
  },
  {
    factionName: "Grey Knights",
    factionSlug: "grey_knights",
    catalogFiles: ["grey-knights.json"],
    mappingFiles: ["grey-knights.json"],
  },
  {
    factionName: "Imperial Agents",
    factionSlug: "imperial_agents",
    catalogFiles: ["imperial-agents.json"],
    mappingFiles: ["imperial-agents.json"],
  },
  {
    factionName: "Imperial Knights",
    factionSlug: "imperial_knights",
    catalogFiles: ["imperial-knights.json"],
    mappingFiles: ["imperial-knights.json"],
  },
  {
    factionName: "Space Marines",
    factionSlug: "space_marines",
    catalogFiles: ["space-marines.json"],
    mappingFiles: ["space-marines.json"],
  },
  {
    factionName: "Black Templars",
    factionSlug: "black_templars",
    catalogFiles: ["space-marines/black-templars.json"],
    mappingFiles: [],
  },
  {
    factionName: "Blood Angels",
    factionSlug: "blood_angels",
    catalogFiles: ["space-marines/blood-angels.json"],
    mappingFiles: [],
  },
  {
    factionName: "Dark Angels",
    factionSlug: "dark_angels",
    catalogFiles: ["space-marines/dark-angels.json"],
    mappingFiles: [],
  },
  {
    factionName: "Deathwatch",
    factionSlug: "deathwatch",
    catalogFiles: ["space-marines/deathwatch.json"],
    mappingFiles: [],
  },
  {
    factionName: "Imperial Fists",
    factionSlug: "imperial_fists",
    catalogFiles: ["space-marines/imperial-fists.json"],
    mappingFiles: [],
  },
  {
    factionName: "Iron Hands",
    factionSlug: "iron_hands",
    catalogFiles: ["space-marines/iron-hands.json"],
    mappingFiles: [],
  },
  {
    factionName: "Raven Guard",
    factionSlug: "raven_guard",
    catalogFiles: ["space-marines/raven-guard.json"],
    mappingFiles: [],
  },
  {
    factionName: "Salamanders",
    factionSlug: "salamanders",
    catalogFiles: ["space-marines/salamanders.json"],
    mappingFiles: [],
  },
  {
    factionName: "Space Wolves",
    factionSlug: "space_wolves",
    catalogFiles: ["space-marines/space-wolves.json"],
    mappingFiles: [],
  },
  {
    factionName: "Ultramarines",
    factionSlug: "ultramarines",
    catalogFiles: ["space-marines/ultramarines.json"],
    mappingFiles: [],
  },
  {
    factionName: "White Scars",
    factionSlug: "white_scars",
    catalogFiles: ["space-marines/white-scars.json"],
    mappingFiles: [],
  },
  {
    factionName: "Chaos Daemons",
    factionSlug: "chaos_daemons",
    catalogFiles: ["chaos-daemons.json"],
    mappingFiles: ["chaos-daemons.json"],
  },
  {
    factionName: "Chaos Knights",
    factionSlug: "chaos_knights",
    catalogFiles: ["chaos-knights.json"],
    mappingFiles: ["chaos-knights.json"],
  },
  {
    factionName: "Chaos Space Marines",
    factionSlug: "chaos_space_marines",
    catalogFiles: ["chaos-space-marines.json"],
    mappingFiles: ["chaos-space-marines.json"],
  },
  {
    factionName: "Death Guard",
    factionSlug: "death_guard",
    catalogFiles: ["death-guard.json"],
    mappingFiles: ["death-guard.json"],
  },
  {
    factionName: "Emperor's Children",
    factionSlug: "emperors_children",
    catalogFiles: ["emperor-s-children.json"],
    mappingFiles: ["emperor-s-children.json"],
  },
  {
    factionName: "Thousand Sons",
    factionSlug: "thousand_sons",
    catalogFiles: ["thousand-sons.json"],
    mappingFiles: ["thousand-sons.json"],
  },
  {
    factionName: "World Eaters",
    factionSlug: "world_eaters",
    catalogFiles: ["world-eaters.json"],
    mappingFiles: ["world-eaters.json"],
  },
  {
    factionName: "Aeldari",
    factionSlug: "aeldari",
    catalogFiles: ["aeldari.json"],
    mappingFiles: ["aeldari.json"],
  },
  {
    factionName: "Drukhari",
    factionSlug: "drukhari",
    catalogFiles: ["drukhari.json"],
    mappingFiles: ["drukhari.json"],
  },
  {
    factionName: "Genestealer Cults",
    factionSlug: "genestealer_cults",
    catalogFiles: ["genestealer-cults.json"],
    mappingFiles: ["genestealer-cults.json"],
  },
  {
    factionName: "Leagues of Votann",
    factionSlug: "leagues_of_votann",
    catalogFiles: ["leagues-of-votann.json"],
    mappingFiles: ["leagues-of-votann.json"],
  },
  {
    factionName: "Necrons",
    factionSlug: "necrons",
    catalogFiles: ["necrons.json"],
    mappingFiles: ["necrons.json"],
  },
  {
    factionName: "Orks",
    factionSlug: "orks",
    catalogFiles: ["orks.json"],
    mappingFiles: ["orks.json"],
  },
  {
    factionName: "T'au",
    factionSlug: "tau_empire",
    catalogFiles: ["tau.json"],
    mappingFiles: ["tau.json"],
  },
  {
    factionName: "Tyranids",
    factionSlug: "tyranids",
    catalogFiles: ["tyranids.json"],
    mappingFiles: ["tyranids.json"],
  },
];

export function buildKitDatasetInventory(
  options: { repoRoot?: string } = {},
): KitInventory {
  const repoRoot = options.repoRoot ?? DEFAULT_REPO_ROOT;
  const catalogRoot = resolve(repoRoot, "data/kits");
  const mappingRoot = resolve(repoRoot, "data/kit-mappings");
  const allCatalogFiles = collectJsonFiles(catalogRoot);
  const allMappingFiles = collectJsonFiles(mappingRoot);
  const catalogFileStats = allCatalogFiles.map((filePath) =>
    readLegacyKitFile(filePath),
  );
  const mappingFileStats = allMappingFiles.map((filePath) =>
    readMappingFile(filePath),
  );
  const catalogStatsByRelativePath = new Map(
    catalogFileStats.map((stats) => [
      toRelativePath(repoRoot, stats.filePath),
      stats,
    ]),
  );
  const mappingStatsByRelativePath = new Map(
    mappingFileStats.map((stats) => [
      toRelativePath(repoRoot, stats.filePath),
      stats,
    ]),
  );
  const catalogSlugFiles = buildCatalogSlugFileMap(repoRoot, catalogFileStats);
  const allReferencedKitSlugs = new Set<string>();

  for (const stats of mappingFileStats) {
    for (const kitSlug of stats.referencedKitSlugs) {
      allReferencedKitSlugs.add(kitSlug);
    }
  }

  const brokenMappingReferences = buildBrokenMappingReferences(
    repoRoot,
    mappingFileStats,
    catalogSlugFiles,
  );
  const rows = TARGET_FACTION_KIT_SOURCES.map((source) =>
    buildFactionRow({
      repoRoot,
      source,
      catalogStatsByRelativePath,
      mappingStatsByRelativePath,
      catalogSlugFiles,
      allReferencedKitSlugs,
      brokenMappingReferences,
    }),
  );
  const activeUnitKitCoverage = buildActiveUnitKitCoverage({
    mappingFileStats,
  });
  const mappedCatalogRelativePaths = new Set(
    TARGET_FACTION_KIT_SOURCES.flatMap((source) =>
      source.catalogFiles.map((file) => `data/kits/${file}`),
    ),
  );
  const mappedMappingRelativePaths = new Set(
    TARGET_FACTION_KIT_SOURCES.flatMap((source) =>
      source.mappingFiles.map((file) => `data/kit-mappings/${file}`),
    ),
  );

  return {
    repoRoot,
    rows,
    legacyCatalog: summarizeLegacyCatalog(catalogFileStats, catalogSlugFiles),
    legacyMappings: summarizeLegacyMappings(
      mappingFileStats,
      brokenMappingReferences,
    ),
    currentSeed: {
      kitTypes: kitTypesDataset.records.length,
      kits: kitsDataset.records.length,
      kitModels: kitModelsDataset.records.length,
      kitUnits: kitUnitsDataset.records.length,
      kitUnitPriceAllocations: kitUnitPriceAllocationsDataset.records.length,
      kitPrices: kitPricesDataset.records.length,
      kitPricesTcgcsv: kitPricesDataset.records.length - legacyImportedKitPricesDataset.records.length - gwImportedKitPricesDataset.records.length,
      kitPricesLegacy: legacyImportedKitPricesDataset.records.length,
      kitPricesGw: gwImportedKitPricesDataset.records.length,
    },
    duplicateCatalogSlugs: duplicateCatalogSlugs(catalogSlugFiles),
    brokenMappingReferences,
    activeUnitKitCoverage,
    unmappedCatalogFiles: allCatalogFiles
      .map((file) => toRelativePath(repoRoot, file))
      .filter((file) => !mappedCatalogRelativePaths.has(file))
      .sort(),
    unmappedMappingFiles: allMappingFiles
      .map((file) => toRelativePath(repoRoot, file))
      .filter((file) => !mappedMappingRelativePaths.has(file))
      .sort(),
    normalizedLegacy: readNormalizedLegacySummary(repoRoot),
  };
}

export function renderKitDatasetInventoryMarkdown(
  inventory: KitInventory,
): string {
  const lines = [
    "<!-- Generated by scripts/generate-kit-dataset-inventory.ts. Do not edit this file by hand. -->",
    "",
    "# Kit Dataset Inventory",
    "",
    "This document inventories the store-side kit data that sits outside BSData. BSData can tell us which units exist and how they are fielded; it cannot tell us which purchasable boxes exist, what each box costs, what models are physically in a box, or how a multi-build kit should satisfy collection and purchasing workflows.",
    "",
    "Regenerate with:",
    "",
    "```bash",
    "npm run docs:kit-dataset-inventory",
    "```",
    "",
    "## Source Roles",
    "",
    renderSourceRolesTable(inventory),
    "",
    "## Kit Content Evidence Gate",
    "",
    renderKitContentEvidenceGate(),
    "",
    "## Legacy Catalog Summary",
    "",
    renderLegacyCatalogSummary(inventory),
    "",
    "## Normalized Legacy Staging",
    "",
    renderNormalizedLegacySummary(inventory),
    "",
    "## Faction Legacy Coverage",
    "",
    "These counts are from the legacy `data/kits` and `data/kit-mappings` JSON files. They are candidate source data only; they are not yet authoritative typed seed rows.",
    "",
    renderFactionCoverageTable(inventory.rows),
    "",
    "## Pricing Infrastructure",
    "",
    renderPricingInfrastructure(),
    "",
    "## Active Unit Kit Coverage",
    "",
    renderActiveUnitKitCoverage(inventory.activeUnitKitCoverage),
    "",
    "## Known Data Quality Flags",
    "",
    renderQualityFlags(inventory),
    "",
    "## Migration Recommendation",
    "",
    "- Treat `kits` and `kit_prices` as sourceable commerce/catalog data. Use old JSON/API snapshots as input, then deduplicate and normalize before generating typed seed rows.",
    "- Treat `kit_units` as curated compatibility data. Name matching can suggest candidates, but canonical rows require `source_kind`, `source_url`, `source_text`, and `review_status` evidence fields.",
    "- Treat `kit_models` as curated physical-contents data. This is the collection/purchasing bridge and should be sourced from product contents, assembly options, or manual review rather than inferred from unit names; the same evidence fields are required there before rows can be seeded.",
    "- Treat `kit_unit_price_allocations` as derived policy data. Rows should be generated only after kit-unit edges and allocation rules are explicit.",
    "- Keep `kit_prices` time/source oriented in the schema. Generated source shards may be grouped for file size, but row identity should not depend on faction because the same kit can serve multiple factions and prices change by region and observation date.",
    "",
  ];

  return `${lines.join("\n")}`;
}

function renderKitContentEvidenceGate(): string {
  return [
    "Canonical `kit_units` and future `kit_models` rows must preserve the evidence used to assert physical kit contents. The schema now requires `source_kind`, `source_text`, and `review_status`; `source_url` is nullable for manual/local sources but should be present for web-imported rows.",
    "",
    renderTable([
      ["Source tier", "Examples", "Canonical seed policy"],
      ["---", "---", "---"],
      [
        "Preferred",
        "Games Workshop product page, Games Workshop PDF, Warhammer Community box-content article",
        "Apply when the content text explicitly names the included unit or model.",
      ],
      [
        "Accepted",
        "Miniset content page with matching product identity",
        "Apply when the page has explicit contents and row quantities reconcile with the kit model count.",
      ],
      [
        "Fallback",
        "Retailer product page or product JSON repeating official contents",
        "Apply only when the content text is explicit and attributable to the product page.",
      ],
      [
        "Staging only",
        "TCGCSV product title, legacy name match, fuzzy product-to-unit match",
        "Do not apply directly to typed `kit_units` or `kit_models`; keep as candidates until reviewed.",
      ],
    ]),
    "",
    "Rows in canonical typed seed data should normally use `review_status: \"approved\"`. Candidate rows that still need review should remain outside canonical seed datasets until a reviewed staging workflow is added.",
  ].join("\n");
}

function renderNormalizedLegacySummary(inventory: KitInventory): string {
  const summary = inventory.normalizedLegacy;

  if (!summary) {
    return "No normalized legacy kit staging files have been generated yet. Run `npm run data:normalize-legacy-kits` before migrating legacy catalog data into typed seed rows.";
  }

  return [
    "The legacy catalog and unit-mapping files have been normalized into generated staging JSON. The detailed products, prices, and mapping-candidate outputs are local generated artifacts ignored by git; `summary.json` is tracked as the compact status artifact. These files are not canonical seed data yet; they are the review layer between legacy source snapshots and future typed `kits`, `kit_prices`, and `kit_units` seed rows.",
    "",
    renderTable([
      ["Artifact", "Path"],
      ["---", "---"],
      ["Products", `\`${summary.output_files.products}\``],
      ["Price observations", `\`${summary.output_files.price_observations}\``],
      [
        "Unit mapping candidates",
        `\`${summary.output_files.unit_mapping_candidates}\``,
      ],
      ["Summary", `\`${summary.output_files.summary}\``],
    ]),
    "",
    renderTable([
      ["Metric", "Count"],
      ["---", "---:"],
      ["Normalized products", String(summary.counts.normalized_products)],
      [
        "Products with duplicate source rows",
        String(summary.counts.products_with_duplicate_source_rows),
      ],
      [
        "Products missing model count",
        String(summary.counts.products_with_missing_model_count),
      ],
      [
        "Products with conflicting model counts",
        String(summary.counts.products_with_conflicting_model_counts),
      ],
      ["Price observations", String(summary.counts.price_observations)],
      ["Unit mapping candidates", String(summary.counts.unit_mapping_candidates)],
      [
        "Resolved mapping candidates",
        String(summary.counts.resolved_unit_mapping_candidates),
      ],
      [
        "Unresolved mapping candidates",
        String(summary.counts.unresolved_unit_mapping_candidates),
      ],
      [
        "Invalid mapping candidates",
        String(summary.counts.invalid_unit_mapping_candidates),
      ],
    ]),
  ].join("\n");
}

function renderSourceRolesTable(inventory: KitInventory): string {
  return renderTable([
    ["Dataset", "Current typed rows", "Candidate source", "Target rule"],
    ["---", "---:", "---", "---"],
    [
      "`kit_types`",
      String(inventory.currentSeed.kitTypes),
      "Curated reference rows",
      "Small controlled list; add types only when purchasing semantics require them.",
    ],
    [
      "`kits`",
      String(inventory.currentSeed.kits),
      `TCGCSV product rows plus ${inventory.legacyCatalog.rawRows} legacy catalog rows / ${inventory.legacyCatalog.uniqueKitSlugs} unique slugs`,
      "Normalize sourceable product facts, then dedupe across shared-faction and alias files.",
    ],
    [
      "`kit_prices`",
      String(inventory.currentSeed.kitPrices),
      `TCGCSV USD observations (all tagged us\\_en) plus ${inventory.legacyCatalog.priceObservations} legacy price observations across ${inventory.legacyCatalog.currencies.join(", ")}`,
      "Source by region, currency, source URL, and observed date; all rows must carry a \`price_market_id\`.",
    ],
    [
      "`kit_units`",
      String(inventory.currentSeed.kitUnits),
      `${inventory.legacyMappings.mappingEntries} legacy unit-to-kit mappings`,
      "Curated unit satisfaction edges; suggestions are allowed, blind inference is not.",
    ],
    [
      "`kit_models`",
      String(inventory.currentSeed.kitModels),
      "Source-backed kit contents are now applied to typed `kits` and `kit_units`; `kit_models` waits for explicit variant/model expansion policy.",
      "Curated physical model contents for collection matching and split-kit workflows.",
    ],
    [
      "`kit_unit_price_allocations`",
      String(inventory.currentSeed.kitUnitPriceAllocations),
      "Derived from kit prices plus kit-unit edges",
      "Generate from explicit allocation policy; do not use as a replacement for kit prices.",
    ],
  ]);
}

function renderPricingInfrastructure(): string {
  const marketCount = priceMarketsDataset.records.length;
  const countryMappingCount = priceMarketCountriesDataset.records.length;
  return [
    `GW sells at region-specific prices that do not map 1:1 to ISO countries. The \`price_markets\` table models GW's regional pricing concepts; \`price_market_countries\` maps every country to exactly one market. All \`kit_prices\` rows carry a \`price_market_id\` FK so price observations are unambiguously attributed to a region.`,
    "",
    renderTable([
      ["Dataset", "Seeded rows", "Notes"],
      ["---", "---:", "---"],
      [
        "`price_markets`",
        String(marketCount),
        "us\\_en, canada\\_en, canada\\_fr, uk\\_en, australia\\_en, new\\_zealand\\_en, eu\\_en, switzerland\\_en, poland\\_pl, japan\\_en, rest\\_of\\_world\\_en",
      ],
      [
        "`price_market_countries`",
        String(countryMappingCount),
        "All 250 ISO countries mapped; canada\\_fr has no country rows (locale variant of canada\\_en; CA maps to canada\\_en for pricing)",
      ],
      [
        "`kit_prices` (us\\_en, TCGCSV)",
        String(kitPricesDataset.records.length - legacyImportedKitPricesDataset.records.length - gwImportedKitPricesDataset.records.length),
        "All TCGCSV USD kit price rows carry price\\_market\\_id = us\\_en",
      ],
      [
        "`kit_prices` (legacy regional)",
        String(legacyImportedKitPricesDataset.records.length),
        "GBP/EUR/AUD/CAD/CHF/PLN prices from legacy catalog data for matched kits",
      ],
      [
        "`kit_prices` (GW direct)",
        String(gwImportedKitPricesDataset.records.length),
        "GBP/AUD/CAD/EUR/CHF/PLN/NZD/JPY prices scraped live from warhammer.com for matched kits",
      ],
    ]),
    "",
    "In progress: expanding GW direct price coverage to remaining kits via product page scraping.",
  ].join("\n");
}

function renderActiveUnitKitCoverage(coverage: ActiveUnitKitCoverage): string {
  const totalActiveUnits = coverage.rows.reduce(
    (sum, row) => sum + row.activeUnitCount,
    0,
  );
  const totalCanonical = coverage.rows.reduce(
    (sum, row) => sum + row.canonicalKitUnitCount,
    0,
  );
  const totalLegacyCandidates = coverage.rows.reduce(
    (sum, row) => sum + row.legacyMappedUnitCount,
    0,
  );
  const totalMissingCanonical = coverage.rows.reduce(
    (sum, row) => sum + row.missingCanonicalKitUnitCount,
    0,
  );
  const totalNeedsReview = coverage.rows.reduce(
    (sum, row) => sum + row.needsSourceReviewCount,
    0,
  );
  const lines = [
    "This compares active non-Legends rules units against canonical typed `kit_units`. Legacy mappings are counted only as review candidates; they do not make a unit canonical.",
    "",
    "The active-unit filter uses the `is_legends` flag and also excludes unit names containing `Legends` plus `_legendary` slugs, because some current seed rows still need a Legends flag cleanup pass.",
    "",
    "Space Marine chapter factions reuse the legacy Space Marines mapping candidates for shared unit review because the old mapping data was monolithic.",
    "",
    "Rows in `Needs source review` are not automatic data defects. They are the units that need a source-backed kit decision before we can call `kit_units` complete.",
    "",
    renderTable([
      [
        "Faction",
        "Active units",
        "Canonical `kit_units`",
        "Legacy candidates",
        "Missing canonical",
        "Needs source review",
      ],
      ["---", "---:", "---:", "---:", "---:", "---:"],
      ...coverage.rows.map((row) => [
        escapeMarkdownTableCell(row.factionName),
        String(row.activeUnitCount),
        String(row.canonicalKitUnitCount),
        String(row.legacyMappedUnitCount),
        String(row.missingCanonicalKitUnitCount),
        String(row.needsSourceReviewCount),
      ]),
      [
        "**Total**",
        String(totalActiveUnits),
        String(totalCanonical),
        String(totalLegacyCandidates),
        String(totalMissingCanonical),
        String(totalNeedsReview),
      ],
    ]),
    "",
    "### Units Needing Source Review",
    "",
  ];

  if (coverage.reviewUnits.length === 0) {
    lines.push("Every active unit has either a canonical `kit_units` row or a legacy mapping candidate.");
    return lines.join("\n");
  }

  lines.push(
    "These active units have neither a canonical typed `kit_units` row nor a legacy mapping candidate for their faction review path.",
    "",
    renderTable([
      ["Faction", "Unit"],
      ["---", "---"],
      ...coverage.reviewUnits.map((unit) => [
        escapeMarkdownTableCell(unit.factionName),
        `${escapeMarkdownTableCell(unit.unitName)} (\`${unit.unitSlug}\`)`,
      ]),
    ]),
  );

  return lines.join("\n");
}

function renderLegacyCatalogSummary(inventory: KitInventory): string {
  return renderTable([
    ["Area", "Count"],
    ["---", "---:"],
    ["Legacy catalog files", String(inventory.legacyCatalog.files)],
    ["Legacy raw kit rows", String(inventory.legacyCatalog.rawRows)],
    ["Legacy unique kit slugs", String(inventory.legacyCatalog.uniqueKitSlugs)],
    [
      "Legacy duplicate unique slugs",
      String(inventory.legacyCatalog.duplicateUniqueSlugs),
    ],
    [
      "Legacy duplicate rows beyond first",
      String(inventory.legacyCatalog.duplicateRowsBeyondFirst),
    ],
    ["Rows with display names", String(inventory.legacyCatalog.displayNameRows)],
    ["Rows with images", String(inventory.legacyCatalog.imageRows)],
    ["Rows with year metadata", String(inventory.legacyCatalog.yearRows)],
    ["Legacy price observations", String(inventory.legacyCatalog.priceObservations)],
    ["Legacy mapping files", String(inventory.legacyMappings.files)],
    ["Legacy mapping entries", String(inventory.legacyMappings.mappingEntries)],
    ["Legacy mapped unit slugs", String(inventory.legacyMappings.mappedUnitSlugs)],
    [
      "Legacy referenced kit slugs",
      String(inventory.legacyMappings.referencedKitSlugs),
    ],
    [
      "Broken mapping references",
      String(inventory.legacyMappings.brokenReferenceCount),
    ],
  ]);
}

function renderFactionCoverageTable(rows: KitInventoryRow[]): string {
  return renderTable([
    [
      "Faction",
      "Catalog files",
      "Catalog rows",
      "Unique kits",
      "Global dupes",
      "Mapping files",
      "Mappings",
      "Mapped units",
      "Referenced kits",
      "Broken refs",
      "Unreferenced kits",
    ],
    ["---", "---:", "---:", "---:", "---:", "---:", "---:", "---:", "---:", "---:", "---:"],
    ...rows.map((row) => [
      escapeMarkdownTableCell(row.factionName),
      String(row.catalogFilesPresent.length),
      String(row.catalogRows),
      String(row.uniqueCatalogKitSlugs),
      String(row.globallyDuplicatedCatalogSlugs),
      String(row.mappingFilesPresent.length),
      String(row.mappingEntries),
      String(row.mappedUnitSlugs),
      String(row.referencedKitSlugs),
      String(row.brokenMappingReferences),
      String(row.unreferencedCatalogKitSlugs),
    ]),
  ]);
}

function renderQualityFlags(inventory: KitInventory): string {
  const factionsWithoutCatalogFiles = inventory.rows.filter(
    (row) => row.catalogFilesPresent.length === 0,
  ).length;
  const factionsWithoutMappingFiles = inventory.rows.filter(
    (row) => row.mappingFilesPresent.length === 0,
  ).length;
  const lines = [
    inventory.currentSeed.kitModels === 0
      ? "- The typed seed currently has no `kit_models` rows; model-level kit contents still require explicit variant/model expansion policy."
      : `- The typed seed has ${inventory.currentSeed.kitModels} source-backed \`kit_models\` rows.`,
    inventory.currentSeed.kitPrices === 0
      ? "- The typed seed currently has no `kit_prices` rows."
      : `- The typed seed has ${inventory.currentSeed.kitPrices} \`kit_prices\` rows: ${inventory.currentSeed.kitPricesTcgcsv} TCGCSV USD (us\\_en), ${inventory.currentSeed.kitPricesLegacy} legacy regional, and ${inventory.currentSeed.kitPricesGw} GW direct (GBP/AUD/CAD/EUR/CHF/PLN/NZD/JPY) for ${Math.round(inventory.currentSeed.kitPricesGw / 8)} kits.`,
    "- The typed `kits` table does not carry a faction foreign key, so faction coverage for typed kit rows must be inferred through `kit_units` or kept in a separate catalog-source inventory.",
    `- Legacy catalog data has ${inventory.legacyCatalog.duplicateUniqueSlugs} duplicated kit slugs across files, representing ${inventory.legacyCatalog.duplicateRowsBeyondFirst} duplicate rows beyond the first occurrence.`,
    `- Legacy unit mappings contain ${inventory.legacyMappings.brokenReferenceCount} references that do not resolve to any legacy kit slug.`,
    `- ${formatCount(factionsWithoutCatalogFiles, "target faction")} currently ${formatHave(factionsWithoutCatalogFiles)} no mapped legacy catalog file.`,
    `- ${formatCount(factionsWithoutMappingFiles, "target faction")} currently ${formatHave(factionsWithoutMappingFiles)} no mapped legacy unit-to-kit mapping file.`,
  ];

  if (inventory.unmappedCatalogFiles.length > 0) {
    lines.push(
      "",
      "### Unassigned Legacy Catalog Files",
      "",
      ...inventory.unmappedCatalogFiles.map((file) => `- \`${file}\``),
    );
  }

  if (inventory.unmappedMappingFiles.length > 0) {
    lines.push(
      "",
      "### Unassigned Legacy Mapping Files",
      "",
      ...inventory.unmappedMappingFiles.map((file) => `- \`${file}\``),
    );
  }

  if (inventory.brokenMappingReferences.length > 0) {
    lines.push(
      "",
      "### Broken Mapping References",
      "",
      renderTable([
        ["Mapping file", "Unit slug", "Referenced kit slug"],
        ["---", "---", "---"],
        ...inventory.brokenMappingReferences
          .slice(0, 50)
          .map((reference) => [
            `\`${reference.mappingFile}\``,
            `\`${reference.unitSlug}\``,
            `\`${reference.kitSlug}\``,
          ]),
      ]),
    );
  }

  if (inventory.duplicateCatalogSlugs.length > 0) {
    lines.push(
      "",
      "### Duplicate Catalog Slugs",
      "",
      renderTable([
        ["Kit slug", "Files"],
        ["---", "---"],
        ...inventory.duplicateCatalogSlugs.slice(0, 50).map((duplicate) => [
          `\`${duplicate.kitSlug}\``,
          duplicate.files.map((file) => `\`${file}\``).join("<br>"),
        ]),
      ]),
    );
  }

  return lines.join("\n");
}

function buildActiveUnitKitCoverage(input: {
  mappingFileStats: MappingFileStats[];
}): ActiveUnitKitCoverage {
  const rulesFactionById = new Map(
    rulesFactionsDataset.records.map((record) => [
      record.id,
      {
        factionSlug: record.rules_faction_slug,
        factionName: record.rules_faction_name,
      },
    ]),
  );
  const unitById = new Map(
    unitsDataset.records.map((record) => [record.id, record]),
  );
  const canonicalKitUnitIds = new Set(
    kitUnitsDataset.records.map((record) => record.unit_id),
  );
  const legacyMappedUnitSlugsByFaction = buildLegacyMappedUnitSlugsByFaction(
    input.mappingFileStats,
  );
  const activeUnitsByFaction = new Map<
    string,
    Map<string, { unitName: string; unitSlug: string }>
  >();

  for (const record of rulesFactionUnitsDataset.records) {
    const faction = rulesFactionById.get(record.rules_faction_id);
    const unit = unitById.get(record.unit_id);

    if (!faction || !unit || !isActiveUnit(unit)) {
      continue;
    }

    const units = activeUnitsByFaction.get(faction.factionSlug) ?? new Map();
    units.set(record.unit_id, {
      unitName: unit.unit_name,
      unitSlug: unit.unit_slug,
    });
    activeUnitsByFaction.set(faction.factionSlug, units);
  }

  const reviewUnits: ActiveUnitKitReviewUnit[] = [];
  const rows = TARGET_FACTION_KIT_SOURCES.map((source) => {
    const activeUnits = activeUnitsByFaction.get(source.factionSlug) ?? new Map();
    const legacyMappedUnitSlugs =
      legacyMappedUnitSlugsByFaction.get(source.factionSlug) ?? new Set();
    let canonicalKitUnitCount = 0;
    let legacyMappedUnitCount = 0;
    let missingCanonicalKitUnitCount = 0;
    let needsSourceReviewCount = 0;

    for (const [unitId, unit] of activeUnits) {
      const hasCanonicalKitUnit = canonicalKitUnitIds.has(unitId);
      const hasLegacyCandidate = legacyMappedUnitSlugs.has(unit.unitSlug);

      if (hasCanonicalKitUnit) {
        canonicalKitUnitCount += 1;
      } else {
        missingCanonicalKitUnitCount += 1;
      }

      if (hasLegacyCandidate) {
        legacyMappedUnitCount += 1;
      }

      if (!hasCanonicalKitUnit && !hasLegacyCandidate) {
        needsSourceReviewCount += 1;
        reviewUnits.push({
          factionName: source.factionName,
          factionSlug: source.factionSlug,
          unitName: unit.unitName,
          unitSlug: unit.unitSlug,
        });
      }
    }

    return {
      factionName: source.factionName,
      factionSlug: source.factionSlug,
      activeUnitCount: activeUnits.size,
      canonicalKitUnitCount,
      legacyMappedUnitCount,
      missingCanonicalKitUnitCount,
      needsSourceReviewCount,
    };
  });

  return {
    rows,
    reviewUnits: reviewUnits.sort((left, right) =>
      `${left.factionName}\0${left.unitName}`.localeCompare(
        `${right.factionName}\0${right.unitName}`,
      ),
    ),
  };
}

function buildLegacyMappedUnitSlugsByFaction(
  mappingFileStats: MappingFileStats[],
): Map<string, Set<string>> {
  const statsByRelativeMappingFile = new Map(
    mappingFileStats.map((stats) => [
      stats.filePath.split(/[\\/]/).slice(-1)[0],
      stats,
    ]),
  );
  const mappedUnitSlugsByFaction = new Map<string, Set<string>>();
  const spaceMarineMappingSlugs =
    statsByRelativeMappingFile.get("space-marines.json")?.unitSlugs ??
    new Set<string>();

  for (const source of TARGET_FACTION_KIT_SOURCES) {
    const mappedSlugs = new Set<string>();

    for (const mappingFile of source.mappingFiles) {
      const fileName = mappingFile.split(/[\\/]/).slice(-1)[0];
      const stats = statsByRelativeMappingFile.get(fileName);
      if (!stats) {
        continue;
      }

      for (const unitSlug of stats.unitSlugs) {
        mappedSlugs.add(unitSlug);
      }
    }

    if (isSpaceMarineChapterFaction(source.factionSlug)) {
      for (const unitSlug of spaceMarineMappingSlugs) {
        mappedSlugs.add(unitSlug);
      }
    }

    mappedUnitSlugsByFaction.set(source.factionSlug, mappedSlugs);
  }

  return mappedUnitSlugsByFaction;
}

function isSpaceMarineChapterFaction(factionSlug: string): boolean {
  return [
    "black_templars",
    "blood_angels",
    "dark_angels",
    "deathwatch",
    "imperial_fists",
    "iron_hands",
    "raven_guard",
    "salamanders",
    "space_wolves",
    "ultramarines",
    "white_scars",
  ].includes(factionSlug);
}

function isActiveUnit(unit: {
  is_legends: boolean;
  unit_name: string;
  unit_slug: string;
}): boolean {
  return (
    !unit.is_legends &&
    !unit.unit_name.toLowerCase().includes("legends") &&
    !unit.unit_slug.toLowerCase().includes("legendary")
  );
}

function buildFactionRow(input: {
  repoRoot: string;
  source: TargetFactionKitSource;
  catalogStatsByRelativePath: Map<string, LegacyKitFileStats>;
  mappingStatsByRelativePath: Map<string, MappingFileStats>;
  catalogSlugFiles: Map<string, string[]>;
  allReferencedKitSlugs: Set<string>;
  brokenMappingReferences: BrokenMappingReference[];
}): KitInventoryRow {
  const catalogStats = input.source.catalogFiles
    .map((file) => input.catalogStatsByRelativePath.get(`data/kits/${file}`))
    .filter((stats): stats is LegacyKitFileStats => Boolean(stats));
  const mappingStats = input.source.mappingFiles
    .map((file) =>
      input.mappingStatsByRelativePath.get(`data/kit-mappings/${file}`),
    )
    .filter((stats): stats is MappingFileStats => Boolean(stats));
  const catalogSlugs = new Set(catalogStats.flatMap((stats) => stats.kitSlugs));
  const referencedKitSlugs = new Set<string>();
  const mappedUnitSlugs = new Set<string>();

  for (const stats of mappingStats) {
    for (const kitSlug of stats.referencedKitSlugs) {
      referencedKitSlugs.add(kitSlug);
    }
    for (const unitSlug of stats.unitSlugs) {
      mappedUnitSlugs.add(unitSlug);
    }
  }

  const brokenMappingFiles = new Set(
    mappingStats.map((stats) => toRelativePath(input.repoRoot, stats.filePath)),
  );
  const brokenMappingReferences = input.brokenMappingReferences.filter(
    (reference) => brokenMappingFiles.has(reference.mappingFile),
  );

  return {
    factionName: input.source.factionName,
    factionSlug: input.source.factionSlug,
    catalogFilesPresent: catalogStats.map((stats) =>
      toRelativePath(input.repoRoot, stats.filePath),
    ),
    catalogRows: catalogStats.reduce((sum, stats) => sum + stats.kitRows, 0),
    uniqueCatalogKitSlugs: catalogSlugs.size,
    globallyDuplicatedCatalogSlugs: [...catalogSlugs].filter(
      (slug) => (input.catalogSlugFiles.get(slug)?.length ?? 0) > 1,
    ).length,
    mappingFilesPresent: mappingStats.map((stats) =>
      toRelativePath(input.repoRoot, stats.filePath),
    ),
    mappingEntries: mappingStats.reduce(
      (sum, stats) => sum + stats.mappingEntries,
      0,
    ),
    mappedUnitSlugs: mappedUnitSlugs.size,
    referencedKitSlugs: referencedKitSlugs.size,
    brokenMappingReferences: brokenMappingReferences.length,
    unreferencedCatalogKitSlugs: [...catalogSlugs].filter(
      (slug) => !input.allReferencedKitSlugs.has(slug),
    ).length,
  };
}

function summarizeLegacyCatalog(
  fileStats: LegacyKitFileStats[],
  catalogSlugFiles: Map<string, string[]>,
): KitInventory["legacyCatalog"] {
  const currencies = new Set<string>();

  for (const stats of fileStats) {
    for (const currency of stats.currencies) {
      currencies.add(currency);
    }
  }

  return {
    files: fileStats.length,
    rawRows: fileStats.reduce((sum, stats) => sum + stats.kitRows, 0),
    uniqueKitSlugs: catalogSlugFiles.size,
    duplicateUniqueSlugs: [...catalogSlugFiles.values()].filter(
      (files) => files.length > 1,
    ).length,
    duplicateRowsBeyondFirst: [...catalogSlugFiles.values()].reduce(
      (sum, files) => sum + Math.max(0, files.length - 1),
      0,
    ),
    displayNameRows: fileStats.reduce(
      (sum, stats) => sum + stats.displayNameRows,
      0,
    ),
    imageRows: fileStats.reduce((sum, stats) => sum + stats.imageRows, 0),
    yearRows: fileStats.reduce((sum, stats) => sum + stats.yearRows, 0),
    priceObservations: fileStats.reduce(
      (sum, stats) => sum + stats.priceObservations,
      0,
    ),
    currencies: [...currencies].sort(),
  };
}

function summarizeLegacyMappings(
  fileStats: MappingFileStats[],
  brokenMappingReferences: BrokenMappingReference[],
): KitInventory["legacyMappings"] {
  const unitSlugs = new Set<string>();
  const referencedKitSlugs = new Set<string>();

  for (const stats of fileStats) {
    for (const unitSlug of stats.unitSlugs) {
      unitSlugs.add(unitSlug);
    }
    for (const kitSlug of stats.referencedKitSlugs) {
      referencedKitSlugs.add(kitSlug);
    }
  }

  return {
    files: fileStats.length,
    mappingEntries: fileStats.reduce(
      (sum, stats) => sum + stats.mappingEntries,
      0,
    ),
    mappedUnitSlugs: unitSlugs.size,
    referencedKitSlugs: referencedKitSlugs.size,
    brokenReferenceCount: brokenMappingReferences.length,
  };
}

function duplicateCatalogSlugs(
  catalogSlugFiles: Map<string, string[]>,
): DuplicateCatalogSlug[] {
  return [...catalogSlugFiles.entries()]
    .filter(([, files]) => files.length > 1)
    .map(([kitSlug, files]) => ({
      kitSlug,
      files,
    }))
    .sort((left, right) => left.kitSlug.localeCompare(right.kitSlug));
}

function buildBrokenMappingReferences(
  repoRoot: string,
  fileStats: MappingFileStats[],
  catalogSlugFiles: Map<string, string[]>,
): BrokenMappingReference[] {
  const broken: BrokenMappingReference[] = [];

  for (const stats of fileStats) {
    const raw = readJsonRecord(stats.filePath);
    for (const [unitSlug, value] of Object.entries(raw)) {
      for (const kitSlug of extractKitReferences(value)) {
        if (catalogSlugFiles.has(kitSlug)) {
          continue;
        }

        broken.push({
          mappingFile: toRelativePath(repoRoot, stats.filePath),
          unitSlug,
          kitSlug,
        });
      }
    }
  }

  return broken.sort((left, right) =>
    `${left.mappingFile}\0${left.unitSlug}\0${left.kitSlug}`.localeCompare(
      `${right.mappingFile}\0${right.unitSlug}\0${right.kitSlug}`,
    ),
  );
}

function buildCatalogSlugFileMap(
  repoRoot: string,
  fileStats: LegacyKitFileStats[],
): Map<string, string[]> {
  const slugFiles = new Map<string, string[]>();

  for (const stats of fileStats) {
    const file = toRelativePath(repoRoot, stats.filePath);
    for (const kitSlug of stats.kitSlugs) {
      const files = slugFiles.get(kitSlug) ?? [];
      files.push(file);
      slugFiles.set(kitSlug, files);
    }
  }

  return slugFiles;
}

function readLegacyKitFile(filePath: string): LegacyKitFileStats {
  const data = readJsonRecord<LegacyKitEntry>(filePath);
  const currencies = new Set<string>();
  let displayNameRows = 0;
  let imageRows = 0;
  let yearRows = 0;
  let priceObservations = 0;

  for (const item of Object.values(data)) {
    if (item.display_name) {
      displayNameRows += 1;
    }
    if (item.image) {
      imageRows += 1;
    }
    if (item.year !== undefined && item.year !== null) {
      yearRows += 1;
    }
    if (item.prices) {
      for (const [currency, price] of Object.entries(item.prices)) {
        currencies.add(currency);
        if (typeof price === "number" && Number.isFinite(price)) {
          priceObservations += 1;
        }
      }
    }
  }

  return {
    filePath,
    kitRows: Object.keys(data).length,
    kitSlugs: Object.keys(data),
    displayNameRows,
    imageRows,
    yearRows,
    priceObservations,
    currencies,
  };
}

function readMappingFile(filePath: string): MappingFileStats {
  const data = readJsonRecord<unknown>(filePath);
  const unitSlugs = new Set<string>();
  const referencedKitSlugs = new Set<string>();

  for (const [unitSlug, value] of Object.entries(data)) {
    unitSlugs.add(unitSlug);
    for (const kitSlug of extractKitReferences(value)) {
      referencedKitSlugs.add(kitSlug);
    }
  }

  return {
    filePath,
    mappingEntries: Object.keys(data).length,
    unitSlugs,
    referencedKitSlugs,
  };
}

function extractKitReferences(value: unknown): string[] {
  if (typeof value === "string") {
    return [value].filter((item) => item.trim().length > 0);
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => extractKitReferences(item));
  }

  if (value && typeof value === "object") {
    return Object.values(value).flatMap((item) => extractKitReferences(item));
  }

  return [];
}

function readJsonRecord<T>(filePath: string): Record<string, T> {
  return JSON.parse(readFileSync(filePath, "utf8")) as Record<string, T>;
}

function readNormalizedLegacySummary(
  repoRoot: string,
): NormalizedLegacySummary | null {
  const summaryPath = resolve(
    repoRoot,
    "data/normalized/legacy-kits/summary.json",
  );

  if (!existsSync(summaryPath)) {
    return null;
  }

  return JSON.parse(readFileSync(summaryPath, "utf8")) as NormalizedLegacySummary;
}

function collectJsonFiles(root: string): string[] {
  if (!existsSync(root)) {
    return [];
  }

  const files: string[] = [];
  for (const entry of readdirSync(root)) {
    const filePath = resolve(root, entry);
    const stats = statSync(filePath);
    if (stats.isDirectory()) {
      files.push(...collectJsonFiles(filePath));
      continue;
    }
    if (entry.endsWith(".json")) {
      files.push(filePath);
    }
  }

  return files.sort();
}

function renderTable(rows: string[][]): string {
  return rows.map((row) => `| ${row.join(" | ")} |`).join("\n");
}

function escapeMarkdownTableCell(value: string): string {
  return value.replace(/\|/g, "\\|");
}

function formatCount(count: number, singular: string): string {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

function formatHave(count: number): string {
  return count === 1 ? "has" : "have";
}

function toRelativePath(root: string, filePath: string): string {
  return relative(root, filePath).split(/[\\/]/).join("/");
}

function writeInventoryDoc(repoRoot: string, outputPath: string): void {
  const inventory = buildKitDatasetInventory({ repoRoot });
  const resolvedOutput = resolve(repoRoot, outputPath);
  mkdirSync(dirname(resolvedOutput), { recursive: true });
  writeFileSync(
    resolvedOutput,
    renderKitDatasetInventoryMarkdown(inventory),
    "utf8",
  );
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
  const outputPath = process.argv[2] ?? DEFAULT_OUTPUT_PATH;
  writeInventoryDoc(DEFAULT_REPO_ROOT, outputPath);
}
