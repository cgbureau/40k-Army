import * as fs from 'fs';
import * as path from 'path';

const PRICES_DIR = path.resolve(process.cwd(), 'data', 'prices');
const KITS_DIR = path.resolve(process.cwd(), 'data', 'kits');
const PRODUCTS_FILE = path.join(PRICES_DIR, 'element_products_filtered.json');
const REPORT_FILE = path.join(PRICES_DIR, 'match_report.json');

interface ElementProduct {
  name: string;
  rrp_gbp: number;
}

function normalizeName(name: string): string {
  // 1. lowercase
  let n = name.toLowerCase();

  // 3. replace hyphens with spaces (do this before stripping punctuation)
  n = n.replace(/-/g, ' ');

  // 2. remove punctuation
  n = n.replace(/[^\w\s]/g, '');

  // 4. remove common filler words
  const fillerWords = [
    'warhammer',
    '40k',
    '40000',
    'games',
    'workshop',
    'space',
    'marine',
    'squad',
    'kit',
    'the',
    'a',
    'and'
  ];
  const fillerRegex = new RegExp(`\\b(${fillerWords.join('|')})\\b`, 'g');
  n = n.replace(fillerRegex, ' ');

  // 5. naive singularization: trim trailing "s" for longer words
  const words = n.split(/\s+/).filter(Boolean).map(w => {
    if (w.length > 3 && w.endsWith('s')) {
      return w.slice(0, -1);
    }
    return w;
  });

  // 6. collapse extra whitespace and rebuild
  return words.join(' ').trim();
}

function stringSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1;
  if (str1.length < 2 || str2.length < 2) return 0;

  const getBigrams = (str: string) => {
    const bigrams = [];
    for (let i = 0; i < str.length - 1; i++) {
      bigrams.push(str.substring(i, i + 2));
    }
    return bigrams;
  };

  const bg1 = getBigrams(str1);
  const bg2 = getBigrams(str2);

  let intersectionSize = 0;
  const bg2Map = new Map<string, number>();
  for (const bg of bg2) {
    bg2Map.set(bg, (bg2Map.get(bg) || 0) + 1);
  }

  for (const bg of bg1) {
    if (bg2Map.has(bg) && (bg2Map.get(bg) || 0) > 0) {
      intersectionSize++;
      bg2Map.set(bg, (bg2Map.get(bg) || 0) - 1);
    }
  }

  return (2.0 * intersectionSize) / (bg1.length + bg2.length);
}

function jaccardWordSimilarity(str1: string, str2: string): number {
  const words1 = str1.split(' ');
  const words2 = str2.split(' ');
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  let intersectionSize = 0;
  for (const w of set1) {
    if (set2.has(w)) intersectionSize++;
  }
  const unionSize = set1.size + set2.size - intersectionSize;
  return unionSize === 0 ? 0 : intersectionSize / unionSize;
}

async function matchKits() {
  if (!fs.existsSync(PRODUCTS_FILE)) {
    console.error(`Products file not found: ${PRODUCTS_FILE}`);
    process.exit(1);
  }

  const products: ElementProduct[] = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
  
  const normalizedProducts = products.map(p => ({
    ...p,
    normName: normalizeName(p.name)
  }));

  const kitFiles = fs.readdirSync(KITS_DIR).filter(f => f.endsWith('.json'));
  let matchedCount = 0;
  let unmatchedCount = 0;

  console.log('Starting kit matching...');

  for (const file of kitFiles) {
    const kitFilePath = path.join(KITS_DIR, file);
    const kitsData = JSON.parse(fs.readFileSync(kitFilePath, 'utf-8'));

    for (const [kitSlug, kitInfo] of Object.entries(kitsData)) {
      const kitName = normalizeName(kitSlug);
      
      let bestMatch = null;
      let bestScore = 0;

      for (const prod of normalizedProducts) {
        // Combine Dice coefficient with Jaccard word similarity
        const dice = stringSimilarity(kitName, prod.normName);
        const jaccard = jaccardWordSimilarity(kitName, prod.normName);
        
        let score = (dice + jaccard) / 2;

        // Boost if one name completely contains the other as a whole word substring
        const kitRegex = new RegExp(`\\b${kitName}\\b`, 'i');
        const prodRegex = new RegExp(`\\b${prod.normName}\\b`, 'i');
        
        if (kitRegex.test(prod.normName) || prodRegex.test(kitName)) {
            score = Math.max(score, 0.85);
        }

        if (score > bestScore) {
          bestScore = score;
          bestMatch = prod;
        }
      }

      const MATCH_THRESHOLD = 0.65;

      if (bestScore >= MATCH_THRESHOLD && bestMatch) {
        matchedCount++;
        // assign rrp_gbp in memory
        (kitInfo as any).price_gbp = bestMatch.rrp_gbp;
      } else {
        unmatchedCount++;
      }
    }
  }

  console.log(`Matched kits: ${matchedCount}`);
  console.log(`Unmatched kits: ${unmatchedCount}`);

  const report = {
    matched: matchedCount,
    unmatched: unmatchedCount
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`Report written to ${REPORT_FILE}`);
}

const isMain = process.argv[1] && process.argv[1].endsWith('match-kits.ts');
if (isMain || typeof require === 'undefined' || require.main === module) {
  matchKits().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
