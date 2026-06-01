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
} from "../db/seed_config/seed/data/_index.data";

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
  };
  duplicateCatalogSlugs: DuplicateCatalogSlug[];
  brokenMappingReferences: BrokenMappingReference[];
  unmappedCatalogFiles: string[];
  unmappedMappingFiles: string[];
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
    },
    duplicateCatalogSlugs: duplicateCatalogSlugs(catalogSlugFiles),
    brokenMappingReferences,
    unmappedCatalogFiles: allCatalogFiles
      .map((file) => toRelativePath(repoRoot, file))
      .filter((file) => !mappedCatalogRelativePaths.has(file))
      .sort(),
    unmappedMappingFiles: allMappingFiles
      .map((file) => toRelativePath(repoRoot, file))
      .filter((file) => !mappedMappingRelativePaths.has(file))
      .sort(),
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
    "This document inventories the store-side kit data that sits outside BSData and Wahapedia. BSData can tell us which units exist and how they are fielded; it cannot tell us which purchasable boxes exist, what each box costs, what models are physically in a box, or how a multi-build kit should satisfy collection and purchasing workflows.",
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
    "## Legacy Catalog Summary",
    "",
    renderLegacyCatalogSummary(inventory),
    "",
    "## Faction Legacy Coverage",
    "",
    "These counts are from the legacy `data/kits` and `data/kit-mappings` JSON files. They are candidate source data only; they are not yet authoritative typed seed rows.",
    "",
    renderFactionCoverageTable(inventory.rows),
    "",
    "## Known Data Quality Flags",
    "",
    renderQualityFlags(inventory),
    "",
    "## Migration Recommendation",
    "",
    "- Treat `kits` and `kit_prices` as sourceable commerce/catalog data. Use old JSON/API snapshots as input, then deduplicate and normalize before generating typed seed rows.",
    "- Treat `kit_units` as curated compatibility data. Name matching can suggest candidates, but alternate-build kits, combat patrols, shared transports, upgrade sprues, and bundled character boxes need reviewed edges.",
    "- Treat `kit_models` as curated physical-contents data. This is the collection/purchasing bridge and should be sourced from product contents, assembly options, or manual review rather than inferred from unit names.",
    "- Treat `kit_unit_price_allocations` as derived policy data. Rows should be generated only after kit-unit edges and allocation rules are explicit.",
    "- Keep `kit_prices` time/source oriented. It should not be split by faction because the same kit can serve multiple factions and prices change by region and observation date.",
    "",
  ];

  return `${lines.join("\n")}`;
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
      `${inventory.legacyCatalog.rawRows} legacy catalog rows / ${inventory.legacyCatalog.uniqueKitSlugs} unique slugs`,
      "Normalize sourceable product facts, then dedupe across shared-faction and alias files.",
    ],
    [
      "`kit_prices`",
      String(inventory.currentSeed.kitPrices),
      `${inventory.legacyCatalog.priceObservations} legacy price observations across ${inventory.legacyCatalog.currencies.join(", ")}`,
      "Source by region, currency, source URL, and observed date; preserve current vs superseded observations.",
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
      "No reliable existing source in repo",
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
    "- The typed seed currently has no `kit_models` rows and no `kit_prices` rows.",
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
