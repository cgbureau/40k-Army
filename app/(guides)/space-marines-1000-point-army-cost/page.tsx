import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/app/components/layout/SiteHeader";
import { SiteFooter } from "@/app/components/layout/SiteFooter";

export const generateMetadata = (): Metadata => ({
  title:
    "Space Marines 1000 Point Army Cost (Warhammer 40K) – Budget List Breakdown",
  description:
    "See how much a 1000 point Warhammer 40K Space Marines army typically costs. Learn what influences the price of a mid-sized list and estimate your army cost with the calculator.",
});

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col page-bg text-[#231F20] font-plex-mono">
      <div className="max-w-6xl w-full mx-auto py-4 px-4 flex flex-col min-h-screen">
        <SiteHeader />
        <main className="max-w-xl mx-auto p-6 flex-grow">
          <h1 className="font-workbench text-lg uppercase">
            Space Marines 1000 Point Army Cost
          </h1>

          <p className="mt-4 text-sm leading-relaxed">
            A 1000 point Space Marines army for Warhammer 40K is a popular size for
            smaller games and starter collections. At Games Workshop retail prices,
            a typical 1000 point list will usually represent a few hundred pounds in
            miniatures, depending on how many elite units, vehicles, and large kits
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
            What Affects a 1000 Point Space Marines Army Cost?
          </h2>
          <p className="mt-2 text-sm leading-relaxed">
            The cost of a 1000 point Space Marines force is shaped by your choice of
            units. Lists that lean on elite infantry, characters, and vehicles can
            hit the desired points level with fewer boxes but higher-priced kits,
            while armies built around more basic infantry squads may require more
            boxes overall.
          </p>

          <p className="mt-3 text-sm leading-relaxed">
            Boxed sets such as Combat Patrols, the number of characters you add, and
            whether you invest in larger centerpiece models like tanks or dreadnoughts
            all influence how expensive a 1000 point list will be to collect.
          </p>

          <p className="mt-3 text-sm leading-relaxed">
            The Warhammer 40K army cost calculator helps you estimate the real cost
            of different 1000 point Space Marines lists before you buy models, so you
            can explore multiple builds and see how points and budget move together.
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

