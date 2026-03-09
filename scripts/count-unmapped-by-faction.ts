import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(__dirname, '..', 'data');
const UNITS_FILE = path.join(DATA_DIR, 'army-data-no-legends.json');
const KIT_MAPPINGS_DIR = path.join(DATA_DIR, 'kit-mappings');

function main() {
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

  // 2. Load units and count unmapped by faction
  const unmappedCounts: Record<string, number> = {};
  let totalUnmapped = 0;

  if (fs.existsSync(UNITS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(UNITS_FILE, 'utf8'));
      const factions = data.factions || {};
      
      for (const factionSlug of Object.keys(factions)) {
        const factionData = factions[factionSlug];
        let unmappedInFaction = 0;
        
        if (Array.isArray(factionData.units)) {
          for (const u of factionData.units) {
            if (u.id && !mappedUnitSlugs.has(u.id)) {
              unmappedInFaction++;
            }
          }
        }
        
        if (unmappedInFaction > 0) {
          unmappedCounts[factionSlug] = unmappedInFaction;
          totalUnmapped += unmappedInFaction;
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

  // Sort factions by count descending
  const sortedFactions = Object.keys(unmappedCounts).sort((a, b) => {
    return unmappedCounts[b] - unmappedCounts[a];
  });

  console.log('--------------------------------');
  console.log('UNMAPPED UNITS BY FACTION');
  console.log('--------------------------------\n');

  for (const faction of sortedFactions) {
    console.log(`${faction}: ${unmappedCounts[faction]}`);
  }

  console.log('\n--------------------------------');
  console.log(`Total unmapped units: ${totalUnmapped}`);
  console.log(`Total factions affected: ${sortedFactions.length}`);
  console.log('--------------------------------');
}

if (require.main === module) {
  main();
}
