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

const DEFAULT_REPO_ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
);
const DEFAULT_OUTPUT_DIR = "data/normalized/legacy-kits";

type LegacyKitEntry = {
  display_name?: string;
  image?: string;
  models?: number | null;
  prices?: Record<string, number | null>;
  slug_short?: string;
  year?: number | null;
};

type LegacyKitSourceEntry = {
  source_file: string;
  source_faction_slug: string;
  legacy_kit_slug: string;
  display_name: string | null;
  slug_short: string | null;
  model_count: number | null;
  image_url: string | null;
  gw_year: number | null;
};

export type NormalizedLegacyKitProduct = {
  kit_slug: string;
  legacy_kit_slugs: string[];
  display_name: string | null;
  display_name_values: string[];
  slug_short: string | null;
  slug_short_values: string[];
  model_count: number | null;
  model_count_values: number[];
  image_url: string | null;
  image_url_values: string[];
  gw_year: number | null;
  gw_year_values: number[];
  source_files: string[];
  source_faction_slugs: string[];
  source_entries: LegacyKitSourceEntry[];
  quality_flags: string[];
};

export type NormalizedLegacyKitPriceObservation = {
  kit_slug: string;
  legacy_kit_slug: string;
  currency: string;
  price: number;
  price_source: "legacy_data_kits";
  price_source_file: string;
  source_faction_slug: string;
  observed_date: null;
};

export type NormalizedLegacyKitUnitMappingCandidate = {
  source_file: string;
  source_faction_slug: string;
  unit_slug: string;
  source_value_kind: "string" | "array";
  component_index: number | null;
  legacy_kit_reference: string;
  kit_slug: string | null;
  reference_status: "resolved" | "unresolved" | "invalid";
  quality_flags: string[];
};

export type NormalizedLegacyKitSummary = {
  schema_version: 1;
  generated_by: "scripts/normalize-legacy-kit-data.ts";
  source_roots: {
    catalog: "data/kits";
    mappings: "data/kit-mappings";
  };
  output_files: {
    products: string;
    price_observations: string;
    unit_mapping_candidates: string;
    summary: string;
  };
  counts: {
    legacy_catalog_files: number;
    legacy_catalog_rows: number;
    normalized_products: number;
    products_with_duplicate_source_rows: number;
    products_with_missing_model_count: number;
    products_with_conflicting_model_counts: number;
    products_with_conflicting_display_names: number;
    products_with_conflicting_images: number;
    products_with_conflicting_years: number;
    price_observations: number;
    legacy_mapping_files: number;
    legacy_mapping_entries: number;
    unit_mapping_candidates: number;
    resolved_unit_mapping_candidates: number;
    unresolved_unit_mapping_candidates: number;
    invalid_unit_mapping_candidates: number;
  };
};

export type NormalizedLegacyKitData = {
  products: NormalizedLegacyKitProduct[];
  priceObservations: NormalizedLegacyKitPriceObservation[];
  unitMappingCandidates: NormalizedLegacyKitUnitMappingCandidate[];
  summary: NormalizedLegacyKitSummary;
};

type ProductAccumulator = {
  kitSlug: string;
  legacySlugs: Set<string>;
  displayNames: Set<string>;
  slugShorts: Set<string>;
  modelCounts: Set<number>;
  imageUrls: Set<string>;
  gwYears: Set<number>;
  sourceFiles: Set<string>;
  sourceFactionSlugs: Set<string>;
  sourceEntries: LegacyKitSourceEntry[];
  missingModelCount: boolean;
};

type MappingReference = {
  value: string;
  kind: "string" | "array";
  componentIndex: number | null;
};

type LegacyCatalogStats = {
  files: number;
  rows: number;
};

type LegacyMappingStats = {
  files: number;
  entries: number;
};

export function buildNormalizedLegacyKitData(
  options: { repoRoot?: string; outputDir?: string } = {},
): NormalizedLegacyKitData {
  const repoRoot = options.repoRoot ?? DEFAULT_REPO_ROOT;
  const outputDir = options.outputDir ?? DEFAULT_OUTPUT_DIR;
  const catalogRoot = resolve(repoRoot, "data/kits");
  const mappingRoot = resolve(repoRoot, "data/kit-mappings");
  const catalogFiles = collectJsonFiles(catalogRoot);
  const mappingFiles = collectJsonFiles(mappingRoot);
  const productsBySlug = new Map<string, ProductAccumulator>();
  const priceObservations: NormalizedLegacyKitPriceObservation[] = [];
  const catalogStats: LegacyCatalogStats = {
    files: catalogFiles.length,
    rows: 0,
  };

  for (const catalogFile of catalogFiles) {
    const sourceFile = toRelativePath(repoRoot, catalogFile);
    const sourceFactionSlug = sourceFactionSlugFromFile(sourceFile);
    const catalog = readJsonRecord<LegacyKitEntry>(catalogFile);
    catalogStats.rows += Object.keys(catalog).length;

    for (const [legacyKitSlug, entry] of Object.entries(catalog)) {
      const kitSlug = normalizeKitSlug(legacyKitSlug);
      const accumulator =
        productsBySlug.get(kitSlug) ?? createProductAccumulator(kitSlug);
      const sourceEntry: LegacyKitSourceEntry = {
        source_file: sourceFile,
        source_faction_slug: sourceFactionSlug,
        legacy_kit_slug: legacyKitSlug,
        display_name: cleanString(entry.display_name),
        slug_short: cleanString(entry.slug_short),
        model_count: normalizeNumber(entry.models),
        image_url: cleanString(entry.image),
        gw_year: normalizeNumber(entry.year),
      };

      accumulator.legacySlugs.add(legacyKitSlug);
      accumulator.sourceFiles.add(sourceFile);
      accumulator.sourceFactionSlugs.add(sourceFactionSlug);
      accumulator.sourceEntries.push(sourceEntry);
      addStringValue(accumulator.displayNames, sourceEntry.display_name);
      addStringValue(accumulator.slugShorts, sourceEntry.slug_short);
      addStringValue(accumulator.imageUrls, sourceEntry.image_url);

      if (sourceEntry.model_count === null) {
        accumulator.missingModelCount = true;
      } else {
        accumulator.modelCounts.add(sourceEntry.model_count);
      }

      if (sourceEntry.gw_year !== null) {
        accumulator.gwYears.add(sourceEntry.gw_year);
      }

      productsBySlug.set(kitSlug, accumulator);

      for (const observation of priceObservationsForEntry({
        kitSlug,
        legacyKitSlug,
        entry,
        sourceFile,
        sourceFactionSlug,
      })) {
        priceObservations.push(observation);
      }
    }
  }

  const products = [...productsBySlug.values()]
    .map(normalizeProduct)
    .sort((left, right) => left.kit_slug.localeCompare(right.kit_slug));
  const productSlugs = new Set(products.map((product) => product.kit_slug));
  const mappingStats: LegacyMappingStats = {
    files: mappingFiles.length,
    entries: 0,
  };
  const unitMappingCandidates: NormalizedLegacyKitUnitMappingCandidate[] = [];

  for (const mappingFile of mappingFiles) {
    const sourceFile = toRelativePath(repoRoot, mappingFile);
    const sourceFactionSlug = sourceFactionSlugFromFile(sourceFile);
    const mappings = readJsonRecord<unknown>(mappingFile);
    mappingStats.entries += Object.keys(mappings).length;

    for (const [unitSlug, value] of Object.entries(mappings)) {
      for (const reference of mappingReferences(value)) {
        const normalizedKitSlug = normalizeKitSlug(reference.value);
        const isInvalid = normalizedKitSlug.length === 0;
        const isResolved = productSlugs.has(normalizedKitSlug);
        const qualityFlags = new Set<string>();

        if (reference.kind === "array") {
          qualityFlags.add("multi_component_mapping");
        }
        if (isInvalid) {
          qualityFlags.add("invalid_kit_reference");
        } else if (!isResolved) {
          qualityFlags.add("unresolved_kit_reference");
        }

        unitMappingCandidates.push({
          source_file: sourceFile,
          source_faction_slug: sourceFactionSlug,
          unit_slug: unitSlug,
          source_value_kind: reference.kind,
          component_index: reference.componentIndex,
          legacy_kit_reference: reference.value,
          kit_slug: isInvalid ? null : normalizedKitSlug,
          reference_status: isInvalid
            ? "invalid"
            : isResolved
              ? "resolved"
              : "unresolved",
          quality_flags: [...qualityFlags].sort(),
        });
      }
    }
  }

  unitMappingCandidates.sort((left, right) =>
    [
      left.source_file,
      left.unit_slug,
      String(left.component_index ?? ""),
      left.legacy_kit_reference,
    ]
      .join("\0")
      .localeCompare(
        [
          right.source_file,
          right.unit_slug,
          String(right.component_index ?? ""),
          right.legacy_kit_reference,
        ].join("\0"),
      ),
  );
  priceObservations.sort((left, right) =>
    [
      left.kit_slug,
      left.currency,
      left.price_source_file,
      left.legacy_kit_slug,
    ]
      .join("\0")
      .localeCompare(
        [
          right.kit_slug,
          right.currency,
          right.price_source_file,
          right.legacy_kit_slug,
        ].join("\0"),
      ),
  );

  return {
    products,
    priceObservations,
    unitMappingCandidates,
    summary: buildSummary({
      outputDir,
      catalogStats,
      mappingStats,
      products,
      priceObservations,
      unitMappingCandidates,
    }),
  };
}

export function writeNormalizedLegacyKitData(
  options: { repoRoot?: string; outputDir?: string } = {},
): void {
  const repoRoot = options.repoRoot ?? DEFAULT_REPO_ROOT;
  const outputDir = options.outputDir ?? DEFAULT_OUTPUT_DIR;
  const data = buildNormalizedLegacyKitData({ repoRoot, outputDir });
  const resolvedOutputDir = resolve(repoRoot, outputDir);

  mkdirSync(resolvedOutputDir, { recursive: true });
  writeJson(resolve(resolvedOutputDir, "products.json"), data.products);
  writeJson(
    resolve(resolvedOutputDir, "price_observations.json"),
    data.priceObservations,
  );
  writeJson(
    resolve(resolvedOutputDir, "unit_mapping_candidates.json"),
    data.unitMappingCandidates,
  );
  writeJson(resolve(resolvedOutputDir, "summary.json"), data.summary);
}

function buildSummary(input: {
  outputDir: string;
  catalogStats: LegacyCatalogStats;
  mappingStats: LegacyMappingStats;
  products: NormalizedLegacyKitProduct[];
  priceObservations: NormalizedLegacyKitPriceObservation[];
  unitMappingCandidates: NormalizedLegacyKitUnitMappingCandidate[];
}): NormalizedLegacyKitSummary {
  const outputBase = input.outputDir.replace(/\/$/, "");

  return {
    schema_version: 1,
    generated_by: "scripts/normalize-legacy-kit-data.ts",
    source_roots: {
      catalog: "data/kits",
      mappings: "data/kit-mappings",
    },
    output_files: {
      products: `${outputBase}/products.json`,
      price_observations: `${outputBase}/price_observations.json`,
      unit_mapping_candidates: `${outputBase}/unit_mapping_candidates.json`,
      summary: `${outputBase}/summary.json`,
    },
    counts: {
      legacy_catalog_files: input.catalogStats.files,
      legacy_catalog_rows: input.catalogStats.rows,
      normalized_products: input.products.length,
      products_with_duplicate_source_rows: input.products.filter(
        (product) => product.source_entries.length > 1,
      ).length,
      products_with_missing_model_count: input.products.filter((product) =>
        product.quality_flags.includes("missing_model_count"),
      ).length,
      products_with_conflicting_model_counts: input.products.filter((product) =>
        product.quality_flags.includes("conflicting_model_counts"),
      ).length,
      products_with_conflicting_display_names: input.products.filter((product) =>
        product.quality_flags.includes("conflicting_display_names"),
      ).length,
      products_with_conflicting_images: input.products.filter((product) =>
        product.quality_flags.includes("conflicting_image_urls"),
      ).length,
      products_with_conflicting_years: input.products.filter((product) =>
        product.quality_flags.includes("conflicting_gw_years"),
      ).length,
      price_observations: input.priceObservations.length,
      legacy_mapping_files: input.mappingStats.files,
      legacy_mapping_entries: input.mappingStats.entries,
      unit_mapping_candidates: input.unitMappingCandidates.length,
      resolved_unit_mapping_candidates: input.unitMappingCandidates.filter(
        (candidate) => candidate.reference_status === "resolved",
      ).length,
      unresolved_unit_mapping_candidates: input.unitMappingCandidates.filter(
        (candidate) => candidate.reference_status === "unresolved",
      ).length,
      invalid_unit_mapping_candidates: input.unitMappingCandidates.filter(
        (candidate) => candidate.reference_status === "invalid",
      ).length,
    },
  };
}

function createProductAccumulator(kitSlug: string): ProductAccumulator {
  return {
    kitSlug,
    legacySlugs: new Set(),
    displayNames: new Set(),
    slugShorts: new Set(),
    modelCounts: new Set(),
    imageUrls: new Set(),
    gwYears: new Set(),
    sourceFiles: new Set(),
    sourceFactionSlugs: new Set(),
    sourceEntries: [],
    missingModelCount: false,
  };
}

function normalizeProduct(
  accumulator: ProductAccumulator,
): NormalizedLegacyKitProduct {
  const qualityFlags = new Set<string>();
  const displayNameValues = sortedStrings(accumulator.displayNames);
  const slugShortValues = sortedStrings(accumulator.slugShorts);
  const modelCountValues = sortedNumbers(accumulator.modelCounts);
  const imageUrlValues = sortedStrings(accumulator.imageUrls);
  const gwYearValues = sortedNumbers(accumulator.gwYears);

  if (accumulator.sourceEntries.length > 1) {
    qualityFlags.add("duplicate_source_rows");
  }
  if (accumulator.missingModelCount) {
    qualityFlags.add("missing_model_count");
  }
  if (displayNameValues.length > 1) {
    qualityFlags.add("conflicting_display_names");
  }
  if (slugShortValues.length > 1) {
    qualityFlags.add("conflicting_slug_shorts");
  }
  if (modelCountValues.length > 1) {
    qualityFlags.add("conflicting_model_counts");
  }
  if (imageUrlValues.length > 1) {
    qualityFlags.add("conflicting_image_urls");
  }
  if (gwYearValues.length > 1) {
    qualityFlags.add("conflicting_gw_years");
  }

  return {
    kit_slug: accumulator.kitSlug,
    legacy_kit_slugs: sortedStrings(accumulator.legacySlugs),
    display_name: chooseString(displayNameValues),
    display_name_values: displayNameValues,
    slug_short: chooseString(slugShortValues),
    slug_short_values: slugShortValues,
    model_count: modelCountValues.length === 1 ? modelCountValues[0] : null,
    model_count_values: modelCountValues,
    image_url: imageUrlValues.length === 1 ? imageUrlValues[0] : null,
    image_url_values: imageUrlValues,
    gw_year: gwYearValues.length === 1 ? gwYearValues[0] : null,
    gw_year_values: gwYearValues,
    source_files: sortedStrings(accumulator.sourceFiles),
    source_faction_slugs: sortedStrings(accumulator.sourceFactionSlugs),
    source_entries: accumulator.sourceEntries.sort((left, right) =>
      [left.source_file, left.legacy_kit_slug]
        .join("\0")
        .localeCompare([right.source_file, right.legacy_kit_slug].join("\0")),
    ),
    quality_flags: sortedStrings(qualityFlags),
  };
}

function priceObservationsForEntry(input: {
  kitSlug: string;
  legacyKitSlug: string;
  entry: LegacyKitEntry;
  sourceFile: string;
  sourceFactionSlug: string;
}): NormalizedLegacyKitPriceObservation[] {
  const observations: NormalizedLegacyKitPriceObservation[] = [];

  for (const [currency, price] of Object.entries(input.entry.prices ?? {})) {
    if (typeof price !== "number" || !Number.isFinite(price)) {
      continue;
    }

    observations.push({
      kit_slug: input.kitSlug,
      legacy_kit_slug: input.legacyKitSlug,
      currency: currency.trim().toLowerCase(),
      price,
      price_source: "legacy_data_kits",
      price_source_file: input.sourceFile,
      source_faction_slug: input.sourceFactionSlug,
      observed_date: null,
    });
  }

  return observations;
}

function mappingReferences(value: unknown): MappingReference[] {
  if (typeof value === "string") {
    return [{ value, kind: "string", componentIndex: null }];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      typeof item === "string"
        ? [{ value: item, kind: "array", componentIndex: index }]
        : [],
    );
  }

  return [];
}

function normalizeKitSlug(value: string): string {
  return value
    .trim()
    .replace(/[’']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function sourceFactionSlugFromFile(sourceFile: string): string {
  const withoutPrefix = sourceFile
    .replace(/^data\/kits\//, "")
    .replace(/^data\/kit-mappings\//, "")
    .replace(/\.json$/, "")
    .replace(/\.NEW$/, "");
  const parts = withoutPrefix.split("/");
  const factionPart = parts[parts.length - 1] ?? withoutPrefix;

  if (factionPart === "tau") {
    return "tau_empire";
  }
  if (factionPart === "emperor-s-children") {
    return "emperors_children";
  }
  if (factionPart === "custodes") {
    return "adeptus_custodes";
  }

  return factionPart.replace(/-/g, "_");
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

function readJsonRecord<T>(filePath: string): Record<string, T> {
  return JSON.parse(readFileSync(filePath, "utf8")) as Record<string, T>;
}

function writeJson(filePath: string, value: unknown): void {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function addStringValue(values: Set<string>, value: string | null): void {
  if (value) {
    values.add(value);
  }
}

function cleanString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function sortedStrings(values: Iterable<string>): string[] {
  return [...values].sort((left, right) => left.localeCompare(right));
}

function sortedNumbers(values: Iterable<number>): number[] {
  return [...values].sort((left, right) => left - right);
}

function chooseString(values: string[]): string | null {
  if (values.length === 0) {
    return null;
  }

  return [...values].sort(
    (left, right) => right.length - left.length || left.localeCompare(right),
  )[0];
}

function toRelativePath(root: string, filePath: string): string {
  return relative(root, filePath).split(/[\\/]/).join("/");
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
  writeNormalizedLegacyKitData({
    repoRoot: DEFAULT_REPO_ROOT,
    outputDir: process.argv[2] ?? DEFAULT_OUTPUT_DIR,
  });
}
