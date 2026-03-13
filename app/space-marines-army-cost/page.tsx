import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const generateMetadata = (): Metadata => ({
  title: "Space Marines Army Cost (Warhammer 40K) – Full Price Breakdown",
  description:
    "See how much a Warhammer 40K Space Marines army really costs. Estimate model box prices, list sizes, and total army cost using our calculator.",
});

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col page-bg text-[#231F20] font-plex-mono">
      <div className="max-w-6xl w-full mx-auto py-4 px-4 flex flex-col min-h-screen">
        <SiteHeader />
        <main className="max-w-xl mx-auto p-6 flex-grow">
          <h1 className="font-workbench text-lg uppercase">
            Space Marines Army Cost
          </h1>

          <p className="mt-4 text-sm leading-relaxed">
            Building a Space Marines army in Warhammer 40K can vary a lot in price
            depending on your list size, unit mix, and whether you lean into elite
            squads, vehicles, or larger infantry blocks.
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
            Typical Space Marines Army Cost
          </h2>
          <p className="mt-2 text-sm leading-relaxed">
            At Games Workshop retail prices, a fully built Space Marines army for
            standard 2000-point games often represents several hundred pounds worth
            of miniatures, with the exact total shaped by how many units and large
            kits you include.
          </p>

          <p className="mt-3 text-sm leading-relaxed">
            Factors such as the number of squads, use of boxed Start Collecting or
            Combat Patrol sets, inclusion of characters, and how vehicle-heavy your
            list is all influence the overall spend.
          </p>

          <p className="mt-3 text-sm leading-relaxed">
            The Warhammer 40K army cost calculator helps you estimate the real cost
            of a Space Marines force before you buy models, so you can explore
            different list ideas and see how points and budget change together.
          </p>

          <section className="mt-6">
            <h2 className="mt-4 text-sm font-workbench uppercase">
              Explore other Warhammer 40K army cost guides
            </h2>
            <ul className="mt-2 text-sm leading-relaxed font-plex-mono underline space-y-1">
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

