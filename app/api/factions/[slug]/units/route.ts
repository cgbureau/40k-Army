import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Same path build-all-factions.js / build-faction-dataset.js write to:
// data/factions/{slug}/units.json (relative to app root = warhammer-calculator)
const DATA_DIR = path.join(process.cwd(), "data");
const FACTIONS_DIR = path.join(DATA_DIR, "factions");

type Params = { params: Promise<{ slug: string }> };

function getValidFactionSlugs(): string[] {
  if (!fs.existsSync(FACTIONS_DIR)) return [];

  return fs
    .readdirSync(FACTIONS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const { slug } = await params;

    if (!slug?.trim()) {
      return NextResponse.json(
        { error: "Faction slug required" },
        { status: 400 }
      );
    }

    const safeSlug = slug.replace(/[^a-z0-9-]/gi, "").toLowerCase();

    const validSlugs = getValidFactionSlugs();

    if (!validSlugs.includes(safeSlug)) {
      return NextResponse.json(
        { error: "Faction not found" },
        { status: 404 }
      );
    }

    const unitsPath = path.join(FACTIONS_DIR, safeSlug, "units.json");

    const raw = fs.readFileSync(unitsPath, "utf8");

    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Faction data invalid" },
        { status: 500 }
      );
    }

    return new NextResponse(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("API factions units:", err);

    return NextResponse.json(
      { error: "Failed to load units" },
      { status: 500 }
    );
  }
}