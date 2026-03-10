import * as fs from 'fs';
import * as path from 'path';
import { SHARED_KIT_RULES } from './shared-kit-rules';

const DATA_DIR = path.join(__dirname, '..', 'data');
const UNITS_FILE = path.join(DATA_DIR, 'army-data-no-legends.json');
const KIT_MAPPINGS_DIR = path.join(DATA_DIR, 'kit-mappings');
const KITS_DIR = path.join(DATA_DIR, 'kits');

const GENERIC_KEYWORDS = new Set(['lord', 'captain', 'commander', 'leader', 'champion']);
const PREFIXES = ['space-marine-', 'chaos-', 'tyranid-', 'ork-'];

export function getSimilarity(s1: string, s2: string): number {
  if (s1 === s2) return 1.0;
  
  const getBigrams = (str: string) => {
    const bigrams = [];
    for (let i = 0; i < str.length - 1; i++) {
      bigrams.push(str.slice(i, i + 2));
    }
    return bigrams;
  };

  const bg1 = getBigrams(s1);
  const bg2 = getBigrams(s2);
  
  if (bg1.length === 0 && bg2.length === 0) return 1.0;
  if (bg1.length === 0 || bg2.length === 0) return 0.0;
  
  let intersection = 0;
  const bg2Copy = [...bg2];
  for (const bg of bg1) {
    const idx = bg2Copy.indexOf(bg);
    if (idx !== -1) {
      intersection++;
      bg2Copy.splice(idx, 1);
    }
  }
  
  return (2.0 * intersection) / (bg1.length + bg2.length);
}

export function getBestMatch(unitSlug: string, allKitSlugs: Set<string>): { kit: string; sim: number; source: "rule" | "similarity" } | null {
  // Check shared kit rules first
  for (const rule of SHARED_KIT_RULES) {
    if (rule.pattern.test(unitSlug)) {
      let kitSlug = rule.kit;
      
      if (rule.kitFromUnit) {
        kitSlug = unitSlug.replace(/_/g, "-");
      }

      return { kit: kitSlug!, sim: 1.0, source: "rule" }; // Auto-accept with high confidence
    }
  }

  const u = unitSlug.replace(/_/g, '-');
  
  // 2. Extract core unit keyword by removing suffixes
  const corePart = unitSlug.split(/_of_|_with_|_on_|_in_/)[0];
  const coreUnit = corePart.replace(/_/g, '-');

  // 3. Ignore extremely generic keywords
  let strippedCore = coreUnit;
  for (const p of PREFIXES) {
    if (strippedCore.startsWith(p)) {
      strippedCore = strippedCore.slice(p.length);
      break;
    }
  }
  const isCoreGeneric = GENERIC_KEYWORDS.has(strippedCore);

  const matches: { kit: string; sim: number; source: "similarity" }[] = [];

  for (const kit of allKitSlugs) {
    const k = kit.replace(/_/g, '-');

    // 1. Only suggest matches when unit contains kit OR kit contains core
    const unitContainsKit = u.includes(k);
    const kitContainsCore = !isCoreGeneric && k.includes(coreUnit);

    if (unitContainsKit || kitContainsCore) {
      const sim1 = getSimilarity(u, k);
      const sim2 = getSimilarity(coreUnit, k);
      const maxSim = Math.max(sim1, sim2);

      // 4. Only output suggestions when string similarity >= 0.6
      if (maxSim >= 0.6) {
        matches.push({ kit, sim: maxSim, source: "similarity" });
      }
    }
  }

  if (matches.length === 0) return null;

  // 5. Rank by similarity and only output the best match
  matches.sort((a, b) => b.sim - a.sim);
  return matches[0];
}

function main() {
  const allUnitSlugs = new Set<string>();
  const mappedUnitSlugs = new Set<string>();
  const allKitSlugs = new Set<string>();

  // 1. Load units
  if (fs.existsSync(UNITS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(UNITS_FILE, 'utf8'));
      const factions = data.factions || {};
      for (const f of Object.values<any>(factions)) {
        if (Array.isArray(f.units)) {
          for (const u of f.units) {
            if (u.id) allUnitSlugs.add(u.id);
          }
        }
      }
    } catch (err) {
      console.error('Error reading units file:', err);
    }
  }

  // 2. Load existing kit mappings
  if (fs.existsSync(KIT_MAPPINGS_DIR)) {
    const files = fs.readdirSync(KIT_MAPPINGS_DIR).filter(f => f.endsWith('.json'));
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(KIT_MAPPINGS_DIR, file), 'utf8'));
        for (const unitSlug of Object.keys(data)) {
          if (data[unitSlug]) mappedUnitSlugs.add(unitSlug);
        }
      } catch (err) {
        console.error(`Error reading mapping file ${file}:`, err);
      }
    }
  }

  // 3. Load all kit definitions
  if (fs.existsSync(KITS_DIR)) {
    const files = fs.readdirSync(KITS_DIR).filter(f => f.endsWith('.json'));
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(KITS_DIR, file), 'utf8'));
        for (const kitSlug of Object.keys(data)) {
          allKitSlugs.add(kitSlug);
        }
      } catch (err) {
        console.error(`Error reading kit file ${file}:`, err);
      }
    }
  }

  // 4. Identify units that do NOT currently have a kit mapping
  const unmappedUnits = Array.from(allUnitSlugs).filter(u => !mappedUnitSlugs.has(u));
  unmappedUnits.sort();

  console.log('--------------------------------');
  console.log('MAPPING SUGGESTIONS');
  console.log('--------------------------------\n');

  let foundAny = false;

  for (const unit of unmappedUnits) {
    const match = getBestMatch(unit, allKitSlugs);
    if (match) {
      foundAny = true;
      console.log(`${unit} → ${match.kit}`);
    }
  }

  if (!foundAny) {
    console.log('No suggestions found.');
  }

  console.log('\n--------------------------------');
}

if (require.main === module) {
  main();
}
