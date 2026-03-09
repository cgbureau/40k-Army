import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(__dirname, '..', 'data');
const UNITS_FILE = path.join(DATA_DIR, 'army-data-no-legends.json');
const KIT_MAPPINGS_DIR = path.join(DATA_DIR, 'kit-mappings');

function main() {
  const factionArg = process.argv[2];

  if (!factionArg) {
    console.error('Error: Please provide a faction slug.');
    console.error('Usage: npm run diagnose:faction <faction_slug>');
    process.exit(1);
  }

  const requestedFaction = factionArg.trim().toLowerCase();
  const mappedUnitSlugs = new Set<string>();

  // 1. Load all mapping files
  if (fs.existsSync(KIT_MAPPINGS_DIR)) {
    const files = fs.readdirSync(KIT_MAPPINGS_DIR).filter(f => f.endsWith('.json'));
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(KIT_MAPPINGS_DIR, file), 'utf8'));
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

  // 2. Load units
  const unmappedUnits: string[] = [];

  if (fs.existsSync(UNITS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(UNITS_FILE, 'utf8'));
      const factions = data.factions || {};
      
      const factionData = factions[requestedFaction];
      if (!factionData) {
        console.error(`Error: Faction '${requestedFaction}' not found in units dataset.`);
        process.exit(1);
      }

      if (Array.isArray(factionData.units)) {
        for (const u of factionData.units) {
          if (u.id && !mappedUnitSlugs.has(u.id)) {
            unmappedUnits.push(u.id);
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

  unmappedUnits.sort();

  console.log('--------------------------------');
  console.log(`UNMAPPED UNITS — ${requestedFaction}`);
  console.log('--------------------------------\n');

  for (const unit of unmappedUnits) {
    console.log(unit);
  }

  console.log('\n--------------------------------');
  console.log(`Total unmapped units: ${unmappedUnits.length}`);
  console.log('--------------------------------');
}

if (require.main === module) {
  main();
}
