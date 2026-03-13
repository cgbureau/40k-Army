import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const generateMetadata = (): Metadata => ({
  title:
    "Necrons 1000 Point Army Cost (Warhammer 40K) – Budget List Breakdown",
  description:
    "See how much a 1000 point Warhammer 40K Necrons army typically costs. Understand the price of a mid-sized Necrons list and estimate your army cost with the calculator.",
});

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col page-bg text-[#231F20] font-plex-mono">
      <div className="max-w-6xl w-full mx-auto py-4 px-4 flex flex-col min-h-screen">
        <SiteHeader />
        <main className="max-w-xl mx-auto p-6 flex-grow">
          <h1 className="font-workbench text-lg uppercase">
            Necrons 1000 Point Army Cost
          </h1>

          <p className="mt-4 text-sm leading-relaxed">
            A 1000 point Necrons army in Warhammer 40K typically mixes Warriors,
            Immortals, characters, and a few heavier units. At Games Workshop retail
            prices, these mid-sized lists commonly sit in the low-to-mid hundreds of
            pounds in miniatures, depending on how many larger kits and elite units
            you include.
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
            What Affects a 1000 Point Necrons Army Cost?
          </h2>
          <p className="mt-2 text-sm leading-relaxed">
            The cost of a 1000 point Necrons army depends on how you balance core
            infantry with more expensive units. Taking more Destroyers, elite units,
            and vehicles can hit 1000 points with fewer boxes, while phalanx-style
            lists with more Warriors and Immortals may require additional kits.
          </p>

          <p className="mt-3 text-sm leading-relaxed">
            Boxed sets, the number of characters you include, and whether you add
            larger centerpiece kits all influence the budget needed for a 1000 point
            Necrons force.
          </p>

          <p className="mt-3 text-sm leading-relaxed">
            The Warhammer 40K army cost calculator lets you compare different 1000
            point Necrons lists and see how they translate into real-world prices
            before you buy models.
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

