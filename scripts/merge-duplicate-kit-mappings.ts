import * as fs from 'fs';
import * as path from 'path';

const MAPPINGS_DIR = path.join(__dirname, '../data/kit-mappings');

function main() {
  const files = fs.readdirSync(MAPPINGS_DIR).filter(f => f.endsWith('.json'));
  
  const pairs: { hyphenated: string, underscored: string }[] = [];
  
  for (const file of files) {
    if (file.includes('-')) {
      const underscored = file.replace(/-/g, '_');
      if (files.includes(underscored)) {
        pairs.push({ hyphenated: file, underscored: underscored });
      }
    }
  }

  let pairsMerged = 0;
  let conflictsFound = 0;
  const updatedFiles: Set<string> = new Set();

  for (const pair of pairs) {
    const hyphenatedPath = path.join(MAPPINGS_DIR, pair.hyphenated);
    const underscoredPath = path.join(MAPPINGS_DIR, pair.underscored);

    const hyphenatedData: Record<string, string> = JSON.parse(fs.readFileSync(hyphenatedPath, 'utf-8'));
    const underscoredData: Record<string, string> = JSON.parse(fs.readFileSync(underscoredPath, 'utf-8'));

    let fileChanged = false;

    for (const [unitSlug, kitSlug] of Object.entries(hyphenatedData)) {
      if (underscoredData[unitSlug] !== undefined) {
        if (underscoredData[unitSlug] !== kitSlug) {
          conflictsFound++;
          console.warn(`Conflict for "${unitSlug}": ${pair.hyphenated} -> ${kitSlug} | ${pair.underscored} -> ${underscoredData[unitSlug]}. Preferring underscored value.`);
        }
      } else {
        underscoredData[unitSlug] = kitSlug;
        fileChanged = true;
      }
    }

    pairsMerged++;

    if (fileChanged) {
      // Sort the keys for deterministic output
      const sortedKeys = Object.keys(underscoredData).sort();
      const sortedData: Record<string, string> = {};
      for (const key of sortedKeys) {
        sortedData[key] = underscoredData[key];
      }

      fs.writeFileSync(underscoredPath, JSON.stringify(sortedData, null, 2) + '\n', 'utf-8');
      updatedFiles.add(pair.underscored);
    }
  }

  console.log(`--------------------------------`);
  console.log(`KIT MAPPING MERGE REPORT`);
  console.log(`--------------------------------`);
  console.log(`Pairs merged: ${pairsMerged}`);
  console.log(`Conflicts found: ${conflictsFound}`);
  if (updatedFiles.size > 0) {
    console.log(`Updated files:`);
    for (const file of updatedFiles) {
      console.log(`- ${file}`);
    }
  } else {
    console.log(`Updated files: None`);
  }
  console.log(`--------------------------------`);
}

if (require.main === module) {
  main();
}
