// create stable ids for seed records from human-readable natural keys

type GameEditionSeedSlug =
  | "rt"
  | "2e"
  | "3e"
  | "4e"
  | "5e"
  | "6e"
  | "7e"
  | "8e"
  | "9e"
  | "10e"
  | "11e";

const gameEditionSeedIds: Record<GameEditionSeedSlug, string> = {
  rt: "01KQZTSBVHY3BV4T71G630NW0Q",
  "2e": "01KQZTSBVNGWT7Y8XAQTVFV02X",
  "3e": "01KQZTSBVN39YRT5GVB9QQ64HF",
  "4e": "01KQZTSBVNXHYKMJWFXV03MWM2",
  "5e": "01KQZTSBVNDHGMYGTZ3DW86K1V",
  "6e": "01KQZTSBVN1P7E8HZF381JHY33",
  "7e": "01KQZTSBVN754VS4CN5CVKHWR9",
  "8e": "01KQZTSBVNKZ5VBS5A1WQX475Q",
  "9e": "01KQZTSBVN0A66ZRZ7GBD3MK3S",
  "10e": "01KQZTSBVNDFJZ0NN5WCC2Z026",
  "11e": "01KQZTSBVNYZ7MZNQXQ7GTRGBM",
};

export const gameEditionId = (slug: GameEditionSeedSlug): string => {
  return gameEditionSeedIds[slug];
};
