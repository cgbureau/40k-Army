import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FACTION_PAGES } from "../faction-pages/config";

type PageParams = {
  faction: string;
};

export function generateMetadata({
  params,
}: {
  params: PageParams;
}): Metadata {
  const config = FACTION_PAGES[params.faction];
  if (!config) {
    return {};
  }
  return {
    title: config.title,
    description: config.description,
  };
}

export default function FactionArmyCostPage({
  params,
}: {
  params: PageParams;
}) {
  const config = FACTION_PAGES[params.faction];

  if (!config) {
    notFound();
  }

  return (
    <main className="max-w-xl mx-auto p-6 font-plex-mono">
      <h1 className="font-workbench text-lg uppercase">{config.h1}</h1>

      <p className="mt-4 text-sm leading-relaxed">{config.intro1}</p>

      <p className="mt-3 text-sm leading-relaxed">{config.intro2}</p>

      <Link
        href={`/?faction=${encodeURIComponent(config.defaultFactionSlug)}`}
        className="inline-block mt-6 underline text-sm"
      >
        Open the 40K Army Cost Calculator
      </Link>
    </main>
  );
}

