import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(__dirname, '..', 'data');
const KIT_MAPPINGS_DIR = path.join(DATA_DIR, 'kit-mappings');
const KITS_DIR = path.join(DATA_DIR, 'kits');

function main() {
  const definedKits = new Set<string>();
  const referencedKits = new Set<string>();

  // 1. Load all kit definitions
  if (fs.existsSync(KITS_DIR)) {
    const kitFiles = fs.readdirSync(KITS_DIR).filter(f => f.endsWith('.json'));
    for (const file of kitFiles) {
      const filePath = path.join(KITS_DIR, file);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        // Each kit file contains entries where keys are kit slugs
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

  // 2. Load unit -> kit mappings
  if (fs.existsSync(KIT_MAPPINGS_DIR)) {
    const mappingFiles = fs.readdirSync(KIT_MAPPINGS_DIR).filter(f => f.endsWith('.json'));
    for (const file of mappingFiles) {
      const filePath = path.join(KIT_MAPPINGS_DIR, file);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        // Each file maps: unit_slug -> kit_slug
        for (const unitSlug of Object.keys(data)) {
          const kitSlug = data[unitSlug];
          if (kitSlug) {
            referencedKits.add(kitSlug);
          }
        }
      } catch (err) {
        console.error(`Error reading or parsing ${filePath}:`, err);
      }
    }
  } else {
    console.warn(`Warning: Kit mappings directory not found at ${KIT_MAPPINGS_DIR}`);
  }

  // 3. Build sets and report
  const missingKits: string[] = [];
  const unusedKits: string[] = [];

  for (const kit of referencedKits) {
    if (!definedKits.has(kit)) {
      missingKits.push(kit);
    }
  }

  for (const kit of definedKits) {
    if (!referencedKits.has(kit)) {
      unusedKits.push(kit);
    }
  }

  // 4. Output format
  console.log('--------------------------------');
  console.log('KIT REGISTRY VALIDATION');
  console.log('--------------------------------\n');
  
  console.log(`Total kits defined: ${definedKits.size}`);
  console.log(`Total kits referenced: ${referencedKits.size}\n`);

  if (missingKits.length > 0) {
    console.log('Missing kit definitions:');
    for (const kit of missingKits) {
      console.log(`- ${kit}`);
    }
    console.log('');
  }

  if (unusedKits.length > 0) {
    console.log('Unused kits:');
    for (const kit of unusedKits) {
      console.log(`- ${kit}`);
    }
    console.log('');
  }

  console.log('--------------------------------');

  // 6. Exit with error code if any missing kit definitions are detected
  if (missingKits.length > 0) {
    process.exit(1);
  }
}

main();
