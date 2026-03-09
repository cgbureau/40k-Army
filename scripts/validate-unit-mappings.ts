import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(__dirname, '..', 'data');
const UNITS_FILE = path.join(DATA_DIR, 'army-data-no-legends.json');
const KIT_MAPPINGS_DIR = path.join(DATA_DIR, 'kit-mappings');

function main() {
  const allUnitSlugs = new Set<string>();
  const mappedUnitSlugs = new Set<string>();

  // 1. Load units from army-data-no-legends.json
  if (fs.existsSync(UNITS_FILE)) {
    try {
      const content = fs.readFileSync(UNITS_FILE, 'utf8');
      const data = JSON.parse(content);
      
      const factions = data.factions || {};
      for (const factionKey of Object.keys(factions)) {
        const faction = factions[factionKey];
        if (Array.isArray(faction.units)) {
          for (const unit of faction.units) {
            if (unit.id) {
              allUnitSlugs.add(unit.id);
            }
          }
        }
      }
    } catch (err) {
      console.error(`Error reading or parsing ${UNITS_FILE}:`, err);
    }
  } else {
    console.warn(`Warning: Units file not found at ${UNITS_FILE}`);
  }

  // 2. Load mappings from data/kit-mappings/
  if (fs.existsSync(KIT_MAPPINGS_DIR)) {
    const mappingFiles = fs.readdirSync(KIT_MAPPINGS_DIR).filter(f => f.endsWith('.json'));
    for (const file of mappingFiles) {
      const filePath = path.join(KIT_MAPPINGS_DIR, file);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        // Each file maps: unit_slug -> kit_slug
        for (const unitSlug of Object.keys(data)) {
          mappedUnitSlugs.add(unitSlug);
        }
      } catch (err) {
        console.error(`Error reading or parsing ${filePath}:`, err);
      }
    }
  } else {
    console.warn(`Warning: Kit mappings directory not found at ${KIT_MAPPINGS_DIR}`);
  }

  // 3. Compare the datasets
  const missingMappings: string[] = [];
  
  for (const unit of allUnitSlugs) {
    if (!mappedUnitSlugs.has(unit)) {
      missingMappings.push(unit);
    }
  }

  missingMappings.sort();

  // 4. Output report
  console.log('--------------------------------');
  console.log('UNIT → KIT MAPPING VALIDATION');
  console.log('--------------------------------\n');
  
  console.log(`Total units: ${allUnitSlugs.size}`);
  console.log(`Units with kit mappings: ${mappedUnitSlugs.size}\n`);

  if (missingMappings.length > 0) {
    console.log('Missing mappings:');
    for (const unit of missingMappings) {
      console.log(`- ${unit}`);
    }
    console.log('');
  }

  console.log('--------------------------------');

  // 5. Exit with error code if any missing mappings exist
  if (missingMappings.length > 0) {
    process.exit(1);
  }
}

main();
