"use client";

import { useEffect, useState } from "react";

type BackToTopProps = {
  hasMiniOverview: boolean;
  isOverviewExpanded: boolean;
};

export default function BackToTop({
  hasMiniOverview,
  isOverviewExpanded,
}: BackToTopProps) {
  const [hasScrolledEnough, setHasScrolledEnough] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setHasScrolledEnough(window.scrollY > 400);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overviewActuallyExpanded =
    hasMiniOverview && isOverviewExpanded;

  const visible =
    hasScrolledEnough && !overviewActuallyExpanded;
  const bottomOffset = hasMiniOverview ? 120 : 24;

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="
fixed right-6 z-40
w-10 h-10
flex items-center justify-center
bg-[#231F20]
text-[#B2C4AE]
border-2 border-[#231F20]
shadow-[2px_2px_0px_rgba(35,31,32,0.35)]
transition-transform
hover:translate-y-[-1px]
active:translate-y-[1px]
font-plex-mono leading-none text-sm
"
      style={{ bottom: bottomOffset }}
      aria-label="Back to top"
    >
      ▲
    </button>
  );
}

