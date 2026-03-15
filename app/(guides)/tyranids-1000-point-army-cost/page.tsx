import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/app/components/layout/SiteHeader";
import { SiteFooter } from "@/app/components/layout/SiteFooter";

export const generateMetadata = (): Metadata => ({
  title:
    "Tyranids 1000 Point Army Cost (Warhammer 40K) – Budget List Breakdown",
  description:
    "See how much a 1000 point Warhammer 40K Tyranids army typically costs. Learn what drives the price of a mid-sized Tyranids swarm and estimate your army cost with the calculator.",
});

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col page-bg text-[#231F20] font-plex-mono">
      <div className="max-w-6xl w-full mx-auto py-4 px-4 flex flex-col min-h-screen">
        <SiteHeader />
        <main className="max-w-xl mx-auto p-6 flex-grow">
          <h1 className="font-workbench text-lg uppercase">
            Tyranids 1000 Point Army Cost
          </h1>

          <p className="mt-4 text-sm leading-relaxed">
            A 1000 point Tyranids army in Warhammer 40K can be built around dense
            swarms of smaller creatures, a tighter mix of monsters, or something in
            between. At Games Workshop retail prices, most 1000 point lists land in
            the low-to-mid hundreds of pounds in miniatures, depending on how
            monster-heavy you go.
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
            What Affects a 1000 Point Tyranids Army Cost?
          </h2>
          <p className="mt-2 text-sm leading-relaxed">
            The cost of a 1000 point Tyranids army depends on how many gaunts,
            warriors, and large creatures you field. Swarm-heavy lists tend to need
            more boxes overall, while monster-focused builds use fewer but more
            expensive kits.
          </p>

          <p className="mt-3 text-sm leading-relaxed">
            Boxed sets, synapse characters, and big centerpiece monsters all
            contribute to the total budget you will need to bring a 1000 point
            Tyranids force to the table.
          </p>

          <p className="mt-3 text-sm leading-relaxed">
            The Warhammer 40K army cost calculator makes it easier to explore
            different 1000 point Tyranids lists and see how they translate into
            real-world prices before you buy models.
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

