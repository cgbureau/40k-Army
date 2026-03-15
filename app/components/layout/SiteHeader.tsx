import Image from "next/image";

function SiteHeaderInner() {
  return (
    <header className="text-center flex-shrink-0 mb-2 relative">
      <div className="max-w-6xl w-full mx-auto pt-6 mb-4 flex flex-col items-center gap-2">
        <Image
          src="/40KArmy_Logo.svg"
          alt="40KArmy logo"
          width={260}
          height={104}
          priority
          className="h-16 w-auto"
        />

        <div className="text-center leading-[1.05]">
          <div className="font-workbench text-[15px] tracking-wide">
            WARHAMMER 40K
          </div>
          <div className="font-workbench text-[15px] tracking-wide">
            ARMY CALCULATOR
          </div>
        </div>

        <div className="px-3 mt-4 text-sm font-plex-mono underline uppercase text-[#1E2A44]">
          JOIN THE COMMAND ROSTER FOR UPDATES
        </div>

        <a
          href="https://buymeacoffee.com/40karmy"
          target="_blank"
          rel="noopener noreferrer"
          className="uppercase tracking-wider underline font-semibold opacity-85 hover:opacity-100 text-[13px]"
        >
          Support project development
        </a>
      </div>
    </header>
  );
}

export const SiteHeader = SiteHeaderInner;
