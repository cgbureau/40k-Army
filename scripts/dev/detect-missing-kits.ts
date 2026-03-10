import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(__dirname, '..', 'data');
const UNITS_FILE = path.join(DATA_DIR, 'army-data-no-legends.json');
const KIT_MAPPINGS_DIR = path.join(DATA_DIR, 'kit-mappings');

function proposeKitSlug(unitSlug: string): string {
  // Replace underscores with hyphens
  let kitSlug = unitSlug.replace(/_/g, '-');
  
  // Remove suffix fragments: -of, -with, -on, -in
  // We want to split at these words when they act as separators or suffixes
  // e.g., "daemon-prince-of-khorne" -> "daemon-prince"
  // "acolyte-hybrids-with-autopistols" -> "acolyte-hybrids"
  
  const fragments = ['-of-', '-with-', '-on-', '-in-'];
  
  for (const frag of fragments) {
    const idx = kitSlug.indexOf(frag);
    if (idx !== -1) {
      kitSlug = kitSlug.substring(0, idx);
    }
  }

  // Also remove them if they are at the very end (unlikely but safe)
  const endFragments = ['-of', '-with', '-on', '-in'];
  for (const frag of endFragments) {
    if (kitSlug.endsWith(frag)) {
      kitSlug = kitSlug.substring(0, kitSlug.length - frag.length);
    }
  }

  return kitSlug;
}

function main() {
  const allUnitSlugs = new Set<string>();
  const mappedUnitSlugs = new Set<string>();

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
      process.exit(1);
    }
  } else {
    console.error(`Units file not found at ${UNITS_FILE}`);
    process.exit(1);
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

  // 3. Identify units that have no mapping
  const unmappedUnits = Array.from(allUnitSlugs).filter(u => !mappedUnitSlugs.has(u));
  unmappedUnits.sort();

  console.log('--------------------------------');
  console.log('POTENTIAL MISSING KITS');
  console.log('--------------------------------\n');

  // 6. Deduplicate results so each kit only appears once.
  const proposedKits = new Map<string, string>(); // kitSlug -> unitSlug (first encountered)
  
  for (const unit of unmappedUnits) {
    const kitSlug = proposeKitSlug(unit);
    if (!proposedKits.has(kitSlug)) {
      proposedKits.set(kitSlug, unit);
    }
  }

  // Print results
  for (const [kitSlug, unitSlug] of proposedKits.entries()) {
    console.log(`${unitSlug} → ${kitSlug}`);
  }

  console.log('\n--------------------------------');
  
  // 7. Print summary
  console.log(`Total unmapped units: ${unmappedUnits.length}`);
  console.log(`Unique potential kits: ${proposedKits.size}`);
  console.log('--------------------------------');
}

if (require.main === module) {
  main();
}
