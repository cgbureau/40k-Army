import type { MetadataRoute } from "next";

const BASE_URL = "https://40karmy.com";

const factionArmyCostSlugs = [
  "space-marines-army-cost",
  "orks-army-cost",
  "necrons-army-cost",
  "tyranids-army-cost",
  "chaos-space-marines-army-cost",
  "adeptus-custodes-army-cost",
  "adeptus-mechanicus-army-cost",
  "astra-militarum-army-cost",
  "grey-knights-army-cost",
  "death-guard-army-cost",
  "thousand-sons-army-cost",
  "drukhari-army-cost",
  "aeldari-army-cost",
  "tau-empire-army-cost",
  "leagues-of-votann-army-cost",
  "genestealer-cults-army-cost",
  "adepta-sororitas-army-cost",
];

const thousandPointArmyCostSlugs = [
  "space-marines-1000-point-army-cost",
  "orks-1000-point-army-cost",
  "necrons-1000-point-army-cost",
  "tyranids-1000-point-army-cost",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    ...factionArmyCostSlugs.map((slug) => ({
      url: `${BASE_URL}/${slug}`,
      lastModified,
    })),
    ...thousandPointArmyCostSlugs.map((slug) => ({
      url: `${BASE_URL}/${slug}`,
      lastModified,
    })),
  ];
}
