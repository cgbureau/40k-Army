import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FACTIONS_DIR = path.join(DATA_DIR, "factions");

type Params = { params: Promise<{ slug: string }> };

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
    const unitsPath = path.join(FACTIONS_DIR, safeSlug, "units.json");
    if (!fs.existsSync(unitsPath)) {
      return NextResponse.json(
        { error: "Faction not found" },
        { status: 404 }
      );
    }
    const raw = fs.readFileSync(unitsPath, "utf8");
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (err) {
    console.error("API factions units:", err);
    return NextResponse.json(
      { error: "Failed to load units" },
      { status: 500 }
    );
  }
}
