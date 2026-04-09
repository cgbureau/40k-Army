import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(__dirname, '..', 'data');
const KIT_MAPPINGS_DIR = path.join(DATA_DIR, 'kit-mappings');
const KITS_DIR = path.join(DATA_DIR, 'kits');

function main() {
  const definedKits = new Set<string>();

  // 1. Load all kit definitions
  if (fs.existsSync(KITS_DIR)) {
    const kitFiles = fs.readdirSync(KITS_DIR).filter(f => f.endsWith('.json'));
    for (const file of kitFiles) {
      const filePath = path.join(KITS_DIR, file);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        for (const kitSlug of Object.keys(data)) {
          definedKits.add(kitSlug);
        }
      } catch (err) {
        console.error(`Error reading or parsing ${filePath}:`, err);
      }
    }
  } else {
    console.warn(`Warning: Kit directory not found at ${KITS_DIR}`);
  }

  let totalMappingsChecked = 0;
  let invalidKitReferences = 0;

  // 2. Load unit -> kit mappings
  if (fs.existsSync(KIT_MAPPINGS_DIR)) {
    const mappingFiles = fs.readdirSync(KIT_MAPPINGS_DIR).filter(f => f.endsWith('.json'));
    for (const file of mappingFiles) {
      const filePath = path.join(KIT_MAPPINGS_DIR, file);
      const faction = file.replace('.json', '');
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        
        for (const unitSlug of Object.keys(data)) {
          const kitSlug = data[unitSlug];
          totalMappingsChecked++;
          
          if (!definedKits.has(kitSlug)) {
            invalidKitReferences++;
            console.log('INVALID KIT REFERENCE');
            console.log(`faction: ${faction}`);
            console.log(`unit: ${unitSlug}`);
            console.log(`kit: ${kitSlug}\n`);
          }
        }
      } catch (err) {
        console.error(`Error reading or parsing ${filePath}:`, err);
      }
    }
  } else {
    console.warn(`Warning: Kit mappings directory not found at ${KIT_MAPPINGS_DIR}`);
  }

  console.log('--------------------------------');
  console.log('KIT MAPPING VALIDATION');
  console.log('--------------------------------');
  console.log(`total mappings checked: ${totalMappingsChecked}`);
  console.log(`invalid kit references: ${invalidKitReferences}`);
  console.log('--------------------------------');

  if (invalidKitReferences > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
