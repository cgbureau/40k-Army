import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const generateMetadata = (): Metadata => ({
  title:
    "Chaos Space Marines Army Cost (Warhammer 40K) – Full Price Breakdown",
  description:
    "See how much a Warhammer 40K Chaos Space Marines army really costs. Estimate model box prices, list sizes, and total army cost using our calculator.",
});

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col page-bg text-[#231F20] font-plex-mono">
      <div className="max-w-6xl w-full mx-auto py-4 px-4 flex flex-col min-h-screen">
        <SiteHeader />
        <main className="max-w-xl mx-auto p-6 flex-grow">
          <h1 className="font-workbench text-lg uppercase">
            Chaos Space Marines Army Cost
          </h1>

          <p className="mt-4 text-sm leading-relaxed">
            Building a Chaos Space Marines army in Warhammer 40K can vary widely in
            price, from lists focused on elite, heavily armoured warriors to forces
            packed with vehicles and daemon-infused monstrosities.
          </p>

          <div className="text-center my-12">
            <p className="mb-4 text-sm opacity-80">
              Ready to estimate the real cost of your army?
            </p>

            <a
              href="/"
              className="inline-block bg-[#231F20] text-[#B2C4AE] px-6 py-3 font-workbench uppercase tracking-wider text-sm hover:opacity-85 transition"
            >
              OPEN THE 40K ARMY CALCULATOR
            </a>

            <p className="mt-3 text-xs opacity-70">
              Estimate model costs before you buy miniatures.
            </p>
          </div>

      <h2 className="mt-4 text-sm font-workbench uppercase">
        Typical Chaos Space Marines Army Cost
      </h2>
      <p className="mt-2 text-sm leading-relaxed">
        At Games Workshop retail prices, a 2000-point Chaos Space Marines army
        usually represents several hundred pounds in miniatures, with vehicle- and
        daemon-heavy lists often sitting at the higher end of that range.
      </p>

          <p className="mt-3 text-sm leading-relaxed">
            The mix of core infantry, elite units, characters, daemon engines,
            boxed sets, and individual kits all shapes the final cost of bringing a
            Chaos warband to the table.
          </p>

          <p className="mt-3 text-sm leading-relaxed">
            The Warhammer 40K army cost calculator lets you explore different legion
            themes and unit combinations, helping you understand the real-world price
            of a Chaos Space Marines army before you commit to buying models.
          </p>

          <section className="mt-6">
            <h2 className="mt-4 text-sm font-workbench uppercase">
              Explore other Warhammer 40K army cost guides
            </h2>
            <ul className="mt-2 text-sm leading-relaxed font-plex-mono underline space-y-1">
              <li>
                <Link href="/space-marines-army-cost" className="underline">
                  Space Marines army cost
                </Link>
              </li>
              <li>
                <Link href="/orks-army-cost" className="underline">
                  Orks army cost
                </Link>
              </li>
              <li>
                <Link href="/necrons-army-cost" className="underline">
                  Necrons army cost
                </Link>
              </li>
              <li>
                <Link href="/tyranids-army-cost" className="underline">
                  Tyranids army cost
                </Link>
              </li>
              <li>
                <Link href="/adeptus-custodes-army-cost" className="underline">
                  Adeptus Custodes army cost
                </Link>
              </li>
            </ul>
          </section>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}

