import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const generateMetadata = (): Metadata => ({
  title:
    "Orks 1000 Point Army Cost (Warhammer 40K) – Budget List Breakdown",
  description:
    "See how much a 1000 point Warhammer 40K Orks army typically costs. Learn what affects the price of a mid-sized Orks list and estimate your army cost with the calculator.",
});

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col page-bg text-[#231F20] font-plex-mono">
      <div className="max-w-6xl w-full mx-auto py-4 px-4 flex flex-col min-h-screen">
        <SiteHeader />
        <main className="max-w-xl mx-auto p-6 flex-grow">
          <h1 className="font-workbench text-lg uppercase">
            Orks 1000 Point Army Cost
          </h1>

          <p className="mt-4 text-sm leading-relaxed">
            A 1000 point Orks army in Warhammer 40K can range from a compact force
            of elite units and vehicles to a smaller but still rowdy horde of Boyz.
            At Games Workshop retail prices, a typical 1000 point Orks list usually
            sits in the low-to-mid hundreds of pounds in miniatures, depending on
            how many big kits you include.
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
            What Affects a 1000 Point Orks Army Cost?
          </h2>
          <p className="mt-2 text-sm leading-relaxed">
            The cost of a 1000 point Orks army is heavily influenced by model count
            and kit choice. Lists built around large mobs of Boyz and support units
            can require more boxes overall, while armies that lean into vehicles,
            elites, and characters may use fewer but higher-priced kits.
          </p>

          <p className="mt-3 text-sm leading-relaxed">
            Boxed sets, the number of characters you include, and whether you invest
            in bigger centrepiece models like battlewagons or planes all play a part
            in the total spend for a 1000 point Orks force.
          </p>

          <p className="mt-3 text-sm leading-relaxed">
            The Warhammer 40K army cost calculator helps you see how different 1000
            point Orks lists translate into real-world prices, so you can experiment
            with builds before committing to new kits.
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
                <Link href="/chaos-space-marines-army-cost" className="underline">
                  Chaos Space Marines army cost
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

