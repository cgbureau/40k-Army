import * as fs from 'fs';
import * as path from 'path';
import { getBestMatch } from './suggest-kit-mappings';

const DATA_DIR = path.join(__dirname, '..', 'data');
const UNITS_FILE = path.join(DATA_DIR, 'army-data-no-legends.json');
const KIT_MAPPINGS_DIR = path.join(DATA_DIR, 'kit-mappings');
const KITS_DIR = path.join(DATA_DIR, 'kits');

const MIN_SIMILARITY = 0.60;

function main() {
  const unitFactionMap = new Map<string, string>();
  const mappedUnitSlugs = new Set<string>();
  const allKitSlugs = new Set<string>();

  // 1. Load units and determine faction for each unit
  if (fs.existsSync(UNITS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(UNITS_FILE, 'utf8'));
      const factions = data.factions || {};
      for (const factionSlug of Object.keys(factions)) {
        const f = factions[factionSlug];
        if (Array.isArray(f.units)) {
          for (const u of f.units) {
            if (u.id) {
              unitFactionMap.set(u.id, factionSlug);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error reading units file:', err);
      process.exit(1);
    }
  } else {
    console.error(`Units file not found at ${UNITS_FILE}`);
    process.exit(1);
  }

  // 2. Load existing kit mappings
  const existingMappingsByFaction = new Map<string, Record<string, string>>();
  
  if (fs.existsSync(KIT_MAPPINGS_DIR)) {
    const files = fs.readdirSync(KIT_MAPPINGS_DIR).filter(f => f.endsWith('.json'));
    for (const file of files) {
      try {
        const factionSlug = file.replace('.json', '');
        const data = JSON.parse(fs.readFileSync(path.join(KIT_MAPPINGS_DIR, file), 'utf8'));
        existingMappingsByFaction.set(factionSlug, data);
        
        for (const unitSlug of Object.keys(data)) {
          if (data[unitSlug]) {
            mappedUnitSlugs.add(unitSlug);
          }
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

  // Identify unmapped units
  const unmappedUnits = Array.from(unitFactionMap.keys()).filter(u => !mappedUnitSlugs.has(u));

  let suggestionsEvaluated = 0;
  let mappingsWrittenByRule = 0;
  let mappingsWrittenBySim = 0;
  let mappingsSkipped = 0;

  const newMappingsByFaction = new Map<string, Record<string, string>>();

  for (const unit of unmappedUnits) {
    suggestionsEvaluated++;
    const match = getBestMatch(unit, allKitSlugs);
    
    if (match && (match.source === "rule" || match.sim >= MIN_SIMILARITY)) {
      const factionSlug = unitFactionMap.get(unit)!;
      
      if (!newMappingsByFaction.has(factionSlug)) {
        newMappingsByFaction.set(factionSlug, {});
      }
      
      newMappingsByFaction.get(factionSlug)![unit] = match.kit;
      if (match.source === "rule") {
        mappingsWrittenByRule++;
      } else {
        mappingsWrittenBySim++;
      }
    } else {
      mappingsSkipped++;
    }
  }

  // Write updated mappings back to disk
  if (!fs.existsSync(KIT_MAPPINGS_DIR)) {
    fs.mkdirSync(KIT_MAPPINGS_DIR, { recursive: true });
  }

  for (const [factionSlug, newMappings] of newMappingsByFaction.entries()) {
    const existingMappings = existingMappingsByFaction.get(factionSlug) || {};
    // Merge new mappings, preserving existing ones
    const merged = { ...existingMappings, ...newMappings };
    
    // Sort keys for consistent output
    const sorted: Record<string, string> = {};
    for (const key of Object.keys(merged).sort()) {
      sorted[key] = merged[key];
    }
    
    // Ensure we use the faction slug exactly as provided from army-data-no-legends.json
    // The path must always resolve like data/kit-mappings/${faction}.json
    // Do NOT replace underscores with hyphens or modify the slug format.
    const outputPath = path.join(KIT_MAPPINGS_DIR, `${factionSlug}.json`);
    
    fs.writeFileSync(
      outputPath,
      JSON.stringify(sorted, null, 2) + '\n',
      'utf8'
    );
  }

  console.log('--------------------------------');
  console.log('AUTO MAPPING RESULTS');
  console.log('--------------------------------\n');
  console.log(`Suggestions evaluated: ${suggestionsEvaluated}`);
  console.log(`Mappings written (Rule): ${mappingsWrittenByRule}`);
  console.log(`Mappings written (Similarity): ${mappingsWrittenBySim}`);
  console.log(`Mappings skipped: ${mappingsSkipped}\n`);
  console.log('--------------------------------');
}

if (require.main === module) {
  main();
}
