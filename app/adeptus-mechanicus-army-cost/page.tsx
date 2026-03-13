import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const generateMetadata = (): Metadata => ({
  title: "Adeptus Mechanicus Army Cost (Warhammer 40K) – Full Price Breakdown",
  description:
    "See how much a Warhammer 40K Adeptus Mechanicus army really costs. Estimate model box prices, list sizes, and total army cost using our calculator.",
});

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col page-bg text-[#231F20] font-plex-mono">
      <div className="max-w-6xl w-full mx-auto py-4 px-4 flex flex-col min-h-screen">
        <SiteHeader />
        <main className="max-w-xl mx-auto p-6 flex-grow">
          <h1 className="font-workbench text-lg uppercase">
            Adeptus Mechanicus Army Cost
          </h1>

          <p className="mt-4 text-sm leading-relaxed">
            Building an Adeptus Mechanicus army in Warhammer 40K can vary a lot in
            price depending on how many Skitarii, elite units, and vehicles you
            take, and whether you favour smaller, elite forces or broader gunline
            lists.
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
            Typical Adeptus Mechanicus Army Cost
          </h2>
          <p className="mt-2 text-sm leading-relaxed">
            At Games Workshop retail prices, a full 2000-point Adeptus Mechanicus
            army will usually come to several hundred pounds in miniatures, with
            the exact cost shaped by how many infantry squads, heavy units, and
            larger kits you add.
          </p>

          <p className="mt-3 text-sm leading-relaxed">
            Your choice of Skitarii units, Kataphrons, characters, Onager
            Dunecrawlers, and other vehicles—as well as how many boxed sets you
            use—all influence the final spend on the army.
          </p>

          <p className="mt-3 text-sm leading-relaxed">
            The Warhammer 40K army cost calculator helps you estimate the real cost
            of an Adeptus Mechanicus force before you buy models, letting you test
            different list ideas and see how points and budget move together.
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
                <Link href="/chaos-space-marines-army-cost" className="underline">
                  Chaos Space Marines army cost
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

