import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FACTIONS_DIR = path.join(DATA_DIR, "factions");

export async function GET() {
  try {
    if (!fs.existsSync(FACTIONS_DIR)) {
      return new NextResponse(JSON.stringify([]), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control":
            "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
        },
      });
    }

    const entries = fs.readdirSync(FACTIONS_DIR, { withFileTypes: true });

    const slugs = entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();

    const factions: { slug: string; name: string }[] = [];

    for (const slug of slugs) {
      const unitsPath = path.join(FACTIONS_DIR, slug, "units.json");

      if (!fs.existsSync(unitsPath)) continue;

      try {
        const raw = fs.readFileSync(unitsPath, "utf8");
        const data = JSON.parse(raw);
        const name = typeof data.faction === "string" ? data.faction : slug;

        factions.push({ slug, name });
      } catch {
        factions.push({ slug, name: slug });
      }
    }

    // Deduplicate factions by display name so entries like "Adeptus Custodes"
    // only appear once in the dropdown, preserving original ordering.
    const seenNames = new Set<string>();
    const uniqueFactions = factions.filter((f) => {
      if (seenNames.has(f.name)) return false;
      seenNames.add(f.name);
      return true;
    });

    return new NextResponse(JSON.stringify(uniqueFactions), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("API factions:", err);

    return NextResponse.json(
      { error: "Failed to load factions" },
      { status: 500 }
    );
  }
}