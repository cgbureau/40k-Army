import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const generateMetadata = (): Metadata => ({
  title: "Orks Army Cost (Warhammer 40K) – Full Price Breakdown",
  description:
    "See how much a Warhammer 40K Orks army really costs. Estimate model box prices, list sizes, and total army cost using our calculator.",
});

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col page-bg text-[#231F20] font-plex-mono">
      <div className="max-w-6xl w-full mx-auto py-4 px-4 flex flex-col min-h-screen">
        <SiteHeader />
        <main className="max-w-xl mx-auto p-6 flex-grow">
          <h1 className="font-workbench text-lg uppercase">Orks Army Cost</h1>

          <p className="mt-4 text-sm leading-relaxed">
            Building an Orks army in Warhammer 40K can vary hugely in price,
            whether you field a more compact force of elite units or a sprawling
            horde of Boyz, support characters, and big war machines.
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
            Typical Orks Army Cost
          </h2>
          <p className="mt-2 text-sm leading-relaxed">
            At Games Workshop retail prices, a full 2000-point Orks army will often
            come to several hundred pounds in miniatures, with the total strongly
            influenced by how many Boyz mobs, elite units, and larger kits you pack
            into the list.
          </p>

          <p className="mt-3 text-sm leading-relaxed">
            The overall cost is shaped by model count, use of boxed sets, the
            balance between basic infantry and specialist units, and whether you
            invest in bigger centrepiece models like vehicles or monsters.
          </p>

          <p className="mt-3 text-sm leading-relaxed">
            The Warhammer 40K army cost calculator helps you work out the real
            price of collecting an Orks force before you buy, so you can test
            different list ideas and see how the points and miniature budget move
            together.
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

