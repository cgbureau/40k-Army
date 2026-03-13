export type FactionPageConfig = {
  slug: string; // URL slug, e.g. "space-marines"
  title: string;
  description: string;
  h1: string;
  intro1: string;
  intro2: string;
  defaultFactionSlug: string; // faction slug used by calculator (API/data)
};

export const FACTION_PAGES: Record<string, FactionPageConfig> = {
  "space-marines": {
    slug: "space-marines",
    title: "Space Marines Army Cost – Warhammer 40K",
    description:
      "Estimate the real-world cost of building a Space Marines army in Warhammer 40K using the 40KArmy calculator.",
    h1: "Space Marines Army Cost",
    intro1:
      "Building a Space Marines army in Warhammer 40K can vary widely in price depending on the list size and units chosen. A typical 2000-point army often requires between 40 and 80 models, which can translate to several hundred pounds in miniatures.",
    intro2:
      "The 40KArmy cost calculator helps estimate the real-world price of building a Space Marines army before buying models. You can quickly experiment with different unit combinations and see how the total points and box costs change.",
    defaultFactionSlug: "space-marines",
  },
  orks: {
    slug: "orks",
    title: "Orks Army Cost – Warhammer 40K",
    description:
      "Estimate the real-world cost of building an Orks army in Warhammer 40K using the 40KArmy calculator.",
    h1: "Orks Army Cost",
    intro1:
      "Building an Orks army in Warhammer 40K can range from a small, elite force to a massive horde of Boyz. A typical 2000-point Orks list often includes a high model count, which can make the total miniature cost add up quickly.",
    intro2:
      "The 40KArmy cost calculator helps estimate the real-world price of collecting an Orks army before buying models. You can experiment with different unit mixes and see how the total points and box costs change as you tweak your list.",
    defaultFactionSlug: "orks",
  },
  necrons: {
    slug: "necrons",
    title: "Necrons Army Cost – Warhammer 40K",
    description:
      "Estimate the real-world cost of building a Necrons army in Warhammer 40K using the 40KArmy calculator.",
    h1: "Necrons Army Cost",
    intro1:
      "Building a Necrons army in Warhammer 40K typically involves a mix of durable infantry, deadly destroyers, and imposing vehicles. A 2000-point Necrons list can vary in price depending on whether you focus on elite units or higher model-count phalanxes.",
    intro2:
      "The 40KArmy cost calculator helps estimate the real-world price of assembling a Necrons army before buying miniatures. You can quickly test different unit combinations and see how the total points and box costs shift as you refine your list.",
    defaultFactionSlug: "necrons",
  },
  tyranids: {
    slug: "tyranids",
    title: "Tyranids Army Cost – Warhammer 40K",
    description:
      "Estimate the real-world cost of building a Tyranids army in Warhammer 40K using the 40KArmy calculator.",
    h1: "Tyranids Army Cost",
    intro1:
      "Building a Tyranids army in Warhammer 40K can range from swarms of smaller creatures to elite monstrous units. A typical 2000-point Tyranids list can include a large number of models, making it important to understand the overall cost before committing to a collection.",
    intro2:
      "The 40KArmy cost calculator helps estimate the real-world price of assembling a Tyranids army before buying miniatures. You can explore different list ideas and see how total points and box costs change as you experiment with various hive fleet builds.",
    defaultFactionSlug: "tyranids",
  },
  "chaos-space-marines": {
    slug: "chaos-space-marines",
    title: "Chaos Space Marines Army Cost – Warhammer 40K",
    description:
      "Estimate the real-world cost of building a Chaos Space Marines army in Warhammer 40K using the 40KArmy calculator.",
    h1: "Chaos Space Marines Army Cost",
    intro1:
      "Building a Chaos Space Marines army in Warhammer 40K can range from elite, heavily armoured warriors to daemon-infused monstrosities. A 2000-point Chaos Space Marines list can involve a mix of infantry, vehicles, and daemonic allies, each contributing to the overall cost.",
    intro2:
      "The 40KArmy cost calculator helps estimate the real-world price of assembling a Chaos Space Marines army before buying models. You can test different legion themes and unit mixes to see how total points and box costs shift as you refine your warband.",
    defaultFactionSlug: "chaos-space-marines",
  },
};

