import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  rulesFactionDetachmentsDataset,
  rulesFactionsDataset,
  rulesFactionSourcesDataset,
  rulesFactionUnitsDataset,
} from "../db/seed_config/seed/data/_index.data";

export const DATASET_INVENTORY_COLUMNS = [
  { key: "rules_factions", label: "rules_factions" },
  { key: "rules_faction_units", label: "rules_faction_units" },
  { key: "rules_faction_sources", label: "rules_faction_sources" },
  { key: "rules_faction_detachments", label: "rules_faction_detachments" },
  { key: "leader_eligibilities", label: "leader_eligibilities" },
  { key: "leader_eligibility_keywords", label: "leader_eligibility_keywords" },
  { key: "unit_models", label: "unit_models" },
  { key: "unit_point_costs", label: "unit_point_costs" },
  { key: "unit_profile_stats", label: "unit_profile_stats" },
  { key: "unit_profiles", label: "unit_profiles" },
  { key: "unit_weapons", label: "unit_weapons" },
  { key: "models", label: "models" },
] as const;

export type DatasetInventoryColumnKey =
  (typeof DATASET_INVENTORY_COLUMNS)[number]["key"];

export type CountCell = {
  actual: number;
  expected: string;
};

export type DatasetInventoryRow = {
  factionName: string;
  factionSlug: string;
  datasheetFolder: string;
  hasDatasheetFolder: boolean;
  cells: Record<DatasetInventoryColumnKey, CountCell>;
};

export type DatasetInventory = {
  rows: DatasetInventoryRow[];
  columnTotals: Record<DatasetInventoryColumnKey, CountCell>;
  missingDatasheetRows: DatasetInventoryRow[];
  bsDataRoot: string;
  hasBsDataExpectedCounts: boolean;
};

type TargetFaction = {
  name: string;
  slug: string;
  datasheetFolder: string;
};

type RulesFactionLinkedRecord = {
  rules_faction_id: string;
};

type BsDataExpectedCounts = Partial<Record<DatasetInventoryColumnKey, number>>;

const DEFAULT_REPO_ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
);
const DEFAULT_OUTPUT_PATH = "docs/dataset_inventory.md";
const DEFAULT_BSDATA_ROOT =
  process.env.BSDATA_40K_ROOT ?? "/Users/mikeearley/code/wh40k-10e";
const BSDATA_EXPECTED_COLUMNS = new Set<DatasetInventoryColumnKey>([
  "rules_faction_units",
  "unit_models",
  "unit_point_costs",
  "unit_profile_stats",
  "unit_profiles",
  "unit_weapons",
  "models",
]);

const TARGET_FACTIONS: TargetFaction[] = [
  { name: "Adepta Sororitas", slug: "adepta_sororitas", datasheetFolder: "adepta-sororitas" },
  { name: "Adeptus Custodes", slug: "adeptus_custodes", datasheetFolder: "adeptus-custodes" },
  { name: "Adeptus Mechanicus", slug: "adeptus_mechanicus", datasheetFolder: "adeptus-mechanicus" },
  { name: "Astra Militarum", slug: "astra_militarum", datasheetFolder: "astra-militarum" },
  { name: "Grey Knights", slug: "grey_knights", datasheetFolder: "grey-knights" },
  { name: "Imperial Agents", slug: "imperial_agents", datasheetFolder: "imperial-agents" },
  { name: "Imperial Knights", slug: "imperial_knights", datasheetFolder: "imperial-knights" },
  { name: "Space Marines", slug: "space_marines", datasheetFolder: "space-marines" },
  { name: "Black Templars", slug: "black_templars", datasheetFolder: "black-templars" },
  { name: "Blood Angels", slug: "blood_angels", datasheetFolder: "blood-angels" },
  { name: "Dark Angels", slug: "dark_angels", datasheetFolder: "dark-angels" },
  { name: "Deathwatch", slug: "deathwatch", datasheetFolder: "deathwatch" },
  { name: "Imperial Fists", slug: "imperial_fists", datasheetFolder: "imperial-fists" },
  { name: "Iron Hands", slug: "iron_hands", datasheetFolder: "iron-hands" },
  { name: "Raven Guard", slug: "raven_guard", datasheetFolder: "raven-guard" },
  { name: "Salamanders", slug: "salamanders", datasheetFolder: "salamanders" },
  { name: "Space Wolves", slug: "space_wolves", datasheetFolder: "space-wolves" },
  { name: "Ultramarines", slug: "ultramarines", datasheetFolder: "ultramarines" },
  { name: "White Scars", slug: "white_scars", datasheetFolder: "white-scars" },
  { name: "Chaos Daemons", slug: "chaos_daemons", datasheetFolder: "chaos-daemons" },
  { name: "Chaos Knights", slug: "chaos_knights", datasheetFolder: "chaos-knights" },
  { name: "Chaos Space Marines", slug: "chaos_space_marines", datasheetFolder: "chaos-space-marines" },
  { name: "Death Guard", slug: "death_guard", datasheetFolder: "death-guard" },
  { name: "Emperor's Children", slug: "emperors_children", datasheetFolder: "emperor-s-children" },
  { name: "Thousand Sons", slug: "thousand_sons", datasheetFolder: "thousand-sons" },
  { name: "World Eaters", slug: "world_eaters", datasheetFolder: "world-eaters" },
  { name: "Aeldari", slug: "aeldari", datasheetFolder: "aeldari" },
  { name: "Drukhari", slug: "drukhari", datasheetFolder: "drukhari" },
  { name: "Genestealer Cults", slug: "genestealer_cults", datasheetFolder: "genestealer-cults" },
  { name: "Leagues of Votann", slug: "leagues_of_votann", datasheetFolder: "leagues-of-votann" },
  { name: "Necrons", slug: "necrons", datasheetFolder: "necrons" },
  { name: "Orks", slug: "orks", datasheetFolder: "orks" },
  { name: "T'au", slug: "tau_empire", datasheetFolder: "t-au-empire" },
  { name: "Tyranids", slug: "tyranids", datasheetFolder: "tyranids" },
];

const FACTION_DATASET_SUFFIXES: Partial<
  Record<DatasetInventoryColumnKey, string>
> = {
  leader_eligibilities: "leader_eligibilities",
  leader_eligibility_keywords: "leader_eligibility_keywords",
  unit_models: "unit_models",
  unit_point_costs: "unit_point_costs",
  unit_profile_stats: "unit_profile_stats",
  unit_profiles: "unit_profiles",
  unit_weapons: "unit_weapons",
};

export function buildDatasetInventory(
  options: { repoRoot?: string; bsDataRoot?: string } = {},
): DatasetInventory {
  const repoRoot = options.repoRoot ?? DEFAULT_REPO_ROOT;
  const bsDataRoot = options.bsDataRoot ?? DEFAULT_BSDATA_ROOT;
  const bsDataExpectedCounts = loadBsDataExpectedCounts(repoRoot, bsDataRoot);
  const factionSlugById = new Map(
    rulesFactionsDataset.records.map((record) => [
      record.id,
      record.rules_faction_slug,
    ]),
  );
  const factionIdsBySlug = new Map(
    rulesFactionsDataset.records.map((record) => [
      record.rules_faction_slug,
      record.id,
    ]),
  );
  const unitCountsByFaction = countByFactionSlug(
    rulesFactionUnitsDataset.records,
    factionSlugById,
  );
  const sourceCountsByFaction = countByFactionSlug(
    rulesFactionSourcesDataset.records,
    factionSlugById,
  );
  const detachmentCountsByFaction = countByFactionSlug(
    rulesFactionDetachmentsDataset.records,
    factionSlugById,
  );

  const rows = TARGET_FACTIONS.map((faction): DatasetInventoryRow => {
    const cells = createDefaultCells();
    const hasRulesFaction = factionIdsBySlug.has(faction.slug);
    const datasheetFolderPath = resolve(
      repoRoot,
      "db/seed_config/seed/data/unit_datasheets",
      faction.datasheetFolder,
    );
    const hasDatasheetFolder = existsSync(datasheetFolderPath);

    cells.rules_factions.actual = hasRulesFaction ? 1 : 0;
    cells.rules_faction_units.actual =
      unitCountsByFaction.get(faction.slug) ?? 0;
    cells.rules_faction_sources.actual =
      sourceCountsByFaction.get(faction.slug) ?? 0;
    cells.rules_faction_detachments.actual =
      detachmentCountsByFaction.get(faction.slug) ?? 0;

    for (const [columnKey, suffix] of Object.entries(FACTION_DATASET_SUFFIXES)) {
      const key = columnKey as DatasetInventoryColumnKey;
      cells[key].actual = countFactionDatasetRecords(
        repoRoot,
        faction.datasheetFolder,
        suffix,
      );
    }

    cells.models.actual = countFactionModels(repoRoot, faction.datasheetFolder);
    applyBsDataExpectedCounts(cells, bsDataExpectedCounts.get(faction.slug));

    return {
      factionName: faction.name,
      factionSlug: faction.slug,
      datasheetFolder: faction.datasheetFolder,
      hasDatasheetFolder,
      cells,
    };
  });

  return {
    rows,
    columnTotals: calculateColumnTotals(rows),
    missingDatasheetRows: rows.filter((row) => !row.hasDatasheetFolder),
    bsDataRoot,
    hasBsDataExpectedCounts: bsDataExpectedCounts.size > 0,
  };
}

export function renderDatasetInventoryMarkdown(inventory: DatasetInventory): string {
  const lines = [
    "<!-- Generated by scripts/generate-dataset-inventory.ts. Do not edit this matrix by hand. -->",
    "",
    "# Dataset Inventory",
    "",
    "This document inventories seed dataset coverage by the current 40karmy target faction list.",
    "",
    "Cell format: `actual / expected`.",
    "",
    "- `actual` is the current seed row count in this repository.",
    "- `expected` is the BSData-derived target count when the generator has a defensible extractor for that table. Cells marked `?` still need a table-specific BSData mapping.",
    "- Faction-scoped datasheet columns count physical files under `db/seed_config/seed/data/unit_datasheets/<faction>/`, not inherited or effective access through `rules_faction_units`.",
    "- `models` counts distinct `model_id` references in the faction's `unit_models` file. The global `models` table itself does not carry a direct `rules_faction_id`.",
    `- BSData root: \`${inventory.bsDataRoot}\`${inventory.hasBsDataExpectedCounts ? "" : " (not found or unavailable; expected-count cells remain `?`)"}.`,
    "",
    "Regenerate with:",
    "",
    "```bash",
    "npm run docs:dataset-inventory",
    "```",
    "",
    "## Matrix",
    "",
    renderMatrix(inventory.rows),
    "",
    "## Column Totals",
    "",
    "These totals are row sums from the matrix above. They are useful for coverage tracking, but they are not global deduplicated table counts.",
    "",
    renderTotalsTable(inventory.columnTotals),
    "",
    "## BSData Extraction Rules",
    "",
    "- `rules_faction_units` expected counts come from BSData unit/model selection entries in the mapped faction catalog. Space Marine chapter factions include the base Space Marines catalog plus their chapter catalog, de-duplicated by unit name.",
    "- `unit_models` and `models` expected counts come from BSData model selection entries within each expected unit. Single-model unit entries count as one model when they do not contain nested model selections.",
    "- `unit_point_costs` expected counts come from unique BSData `pts` cost values and points-setting modifiers under each expected unit.",
    "- `unit_profiles` and `unit_profile_stats` expected counts come from BSData profiles whose `typeName` is `Unit` and their profile characteristics.",
    "- `unit_weapons` expected counts come from BSData profiles whose `typeName` is `Melee Weapons` or `Ranged Weapons`; this is a profile-count proxy, not a fully normalized loadout-row count.",
    "- `rules_faction_sources`, `rules_faction_detachments`, `leader_eligibilities`, and `leader_eligibility_keywords` remain `?` because their BSData structures need table-specific mapping rules before the counts are comparable.",
    "",
    "## Table Completion Workflow",
    "",
    "Use this loop for each dataset/table family before moving on to the next one:",
    "",
    "1. Implement or update the table-specific BSData importer/parser.",
    "2. Regenerate or reconcile the seed data for that table across target factions.",
    "3. Run focused validation for the table plus the seed/faction contract tests.",
    "4. Update this matrix with `npm run docs:dataset-inventory`.",
    "5. Update project memory under `/Users/mikeearley/code/ai-team-projects/40karmy/memory`.",
    "6. Commit the completed table slice.",
    "7. Move to the next table.",
    "",
    "## Missing Faction-Scoped Datasheet Folders",
    "",
    renderMissingDatasheetFolders(inventory.missingDatasheetRows),
    "",
    "## BSData Expected Extraction Status",
    "",
    renderExtractionStatusTable(inventory),
    "",
  ];

  return `${lines.join("\n")}`;
}

export function countDatasetRecordsInSource(source: string): number {
  const match = source.match(/records:\s*\[([\s\S]*?)\]\s+satisfies/);
  if (!match) {
    return 0;
  }

  const body = match[1]?.trim();
  if (!body) {
    return 0;
  }

  return body
    .split("\n")
    .filter((line) => /^\s*[A-Za-z_$][\w$]*,\s*(?:\/\/.*)?$/.test(line))
    .length;
}

function createDefaultCells(): Record<DatasetInventoryColumnKey, CountCell> {
  const cells = {} as Record<DatasetInventoryColumnKey, CountCell>;

  for (const column of DATASET_INVENTORY_COLUMNS) {
    cells[column.key] = {
      actual: 0,
      expected: column.key === "rules_factions" ? "1" : "?",
    };
  }

  return cells;
}

function applyBsDataExpectedCounts(
  cells: Record<DatasetInventoryColumnKey, CountCell>,
  expectedCounts: BsDataExpectedCounts | undefined,
): void {
  if (!expectedCounts) {
    return;
  }

  for (const column of DATASET_INVENTORY_COLUMNS) {
    const expected = expectedCounts[column.key];
    if (typeof expected !== "number" || !Number.isFinite(expected)) {
      continue;
    }

    cells[column.key].expected = String(expected);
  }
}

function countByFactionSlug(
  records: readonly RulesFactionLinkedRecord[],
  factionSlugById: Map<string, string>,
): Map<string, number> {
  const counts = new Map<string, number>();

  for (const record of records) {
    const factionSlug = factionSlugById.get(record.rules_faction_id);
    if (!factionSlug) {
      continue;
    }

    counts.set(factionSlug, (counts.get(factionSlug) ?? 0) + 1);
  }

  return counts;
}

function countFactionDatasetRecords(
  repoRoot: string,
  datasheetFolder: string,
  suffix: string,
): number {
  const source = readFactionDatasetSource(repoRoot, datasheetFolder, suffix);
  if (!source) {
    return 0;
  }

  return countDatasetRecordsInSource(source);
}

function countFactionModels(repoRoot: string, datasheetFolder: string): number {
  const source = readFactionDatasetSource(
    repoRoot,
    datasheetFolder,
    "unit_models",
  );
  if (!source) {
    return 0;
  }

  return new Set(
    Array.from(source.matchAll(/model_id:\s*modelId\("([^"]+)"\)/g)).map(
      (match) => match[1],
    ),
  ).size;
}

function readFactionDatasetSource(
  repoRoot: string,
  datasheetFolder: string,
  suffix: string,
): string | null {
  const filePath = resolve(
    repoRoot,
    "db/seed_config/seed/data/unit_datasheets",
    datasheetFolder,
    `${datasheetFolder}_${suffix}.data.ts`,
  );

  if (!existsSync(filePath)) {
    return null;
  }

  return readFileSync(filePath, "utf8");
}

function calculateColumnTotals(
  rows: DatasetInventoryRow[],
): Record<DatasetInventoryColumnKey, CountCell> {
  const totals = createDefaultCells();

  for (const column of DATASET_INVENTORY_COLUMNS) {
    totals[column.key].actual = rows.reduce(
      (sum, row) => sum + row.cells[column.key].actual,
      0,
    );
    totals[column.key].expected = calculateExpectedTotal(
      rows.map((row) => row.cells[column.key].expected),
    );
  }

  return totals;
}

function calculateExpectedTotal(expectedValues: string[]): string {
  if (!expectedValues.every((value) => /^\d+$/.test(value))) {
    return "?";
  }

  return String(
    expectedValues.reduce((sum, value) => sum + Number.parseInt(value, 10), 0),
  );
}

function renderMatrix(rows: DatasetInventoryRow[]): string {
  const header = [
    "Faction",
    ...DATASET_INVENTORY_COLUMNS.map((column) => `\`${column.label}\``),
  ];
  const alignments = ["---", ...DATASET_INVENTORY_COLUMNS.map(() => "---:")];
  const body = rows.map((row) => [
    escapeMarkdownTableCell(row.factionName),
    ...DATASET_INVENTORY_COLUMNS.map((column) => formatCell(row.cells[column.key])),
  ]);

  return renderTable([header, alignments, ...body]);
}

function renderTotalsTable(
  totals: Record<DatasetInventoryColumnKey, CountCell>,
): string {
  const rows = DATASET_INVENTORY_COLUMNS.map((column) => [
    `\`${column.label}\``,
    formatCell(totals[column.key]),
  ]);

  return renderTable([
    ["Dataset", "Row-Sum Total"],
    ["---", "---:"],
    ...rows,
  ]);
}

function renderMissingDatasheetFolders(rows: DatasetInventoryRow[]): string {
  if (rows.length === 0) {
    return "None.";
  }

  return rows
    .map(
      (row) =>
        `- ${row.factionName} (\`${row.factionSlug}\`) - missing \`${row.datasheetFolder}\``,
    )
    .join("\n");
}

function renderExtractionStatusTable(inventory: DatasetInventory): string {
  const rows = DATASET_INVENTORY_COLUMNS.map((column) => [
    `\`${column.label}\``,
    extractionStatusForColumn(column.key, inventory),
  ]);

  return renderTable([
    ["Dataset", "Expected Count Status"],
    ["---", "---"],
    ...rows,
  ]);
}

function extractionStatusForColumn(
  columnKey: DatasetInventoryColumnKey,
  inventory: DatasetInventory,
): string {
  if (columnKey === "rules_factions") {
    return "Target-list expectation is `1` per faction.";
  }

  if (BSDATA_EXPECTED_COLUMNS.has(columnKey)) {
    return inventory.hasBsDataExpectedCounts
      ? "Filled from BSData catalog XML by `scripts/bsdata_expected_counts.py`."
      : "Extractor exists, but the BSData root was unavailable.";
  }

  return "BSData expected-count extractor is pending; cells show `?`.";
}

function loadBsDataExpectedCounts(
  repoRoot: string,
  bsDataRoot: string,
): Map<string, BsDataExpectedCounts> {
  if (!existsSync(bsDataRoot)) {
    return new Map();
  }

  const helperPath = resolve(repoRoot, "scripts/bsdata_expected_counts.py");
  const result = spawnSync(
    "python3",
    [helperPath, "--bsdata-root", bsDataRoot],
    {
      encoding: "utf8",
    },
  );

  if (result.status !== 0) {
    throw new Error(
      `BSData expected-count extraction failed: ${result.stderr || result.stdout}`,
    );
  }

  const parsed: unknown = JSON.parse(result.stdout);
  if (!isRecord(parsed)) {
    return new Map();
  }

  const countsByFaction = new Map<string, BsDataExpectedCounts>();
  for (const [factionSlug, value] of Object.entries(parsed)) {
    if (!isRecord(value)) {
      continue;
    }

    const counts: BsDataExpectedCounts = {};
    for (const column of DATASET_INVENTORY_COLUMNS) {
      const expected = value[column.key];
      if (typeof expected === "number" && Number.isFinite(expected)) {
        counts[column.key] = expected;
      }
    }

    countsByFaction.set(factionSlug, counts);
  }

  return countsByFaction;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function renderTable(rows: string[][]): string {
  return rows.map((row) => `| ${row.join(" | ")} |`).join("\n");
}

function formatCell(cell: CountCell): string {
  return `${cell.actual} / ${cell.expected}`;
}

function escapeMarkdownTableCell(value: string): string {
  return value.replaceAll("|", "\\|");
}

function main(): void {
  const outputFlagIndex = process.argv.indexOf("--output");
  const outputPath =
    outputFlagIndex >= 0 && process.argv[outputFlagIndex + 1]
      ? resolve(DEFAULT_REPO_ROOT, process.argv[outputFlagIndex + 1])
      : resolve(DEFAULT_REPO_ROOT, DEFAULT_OUTPUT_PATH);
  const markdown = renderDatasetInventoryMarkdown(
    buildDatasetInventory({ repoRoot: DEFAULT_REPO_ROOT }),
  );

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, markdown, "utf8");
  console.log(`Wrote ${relative(DEFAULT_REPO_ROOT, outputPath)}`);
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main();
}
