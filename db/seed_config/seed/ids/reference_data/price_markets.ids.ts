/**
 * Fixed ULIDs for canonical GW price market seed rows.
 *
 * Markets match Games Workshop's regional pricing selectors.
 * The values are generated once and then checked in so repeated seed runs use
 * the same primary keys. Do not replace these with runtime `ulid()` calls.
 */

type PriceMarketSeedSlug =
  | "us_en"
  | "canada_en"
  | "canada_fr"
  | "uk_en"
  | "australia_en"
  | "new_zealand_en"
  | "eu_en"
  | "switzerland_en"
  | "poland_pl"
  | "japan_en"
  | "rest_of_world_en";

const priceMarketSeedIds: Record<PriceMarketSeedSlug, string> = {
  us_en: "01KTC58AH3GZQGK67KKVKEFCTM",
  canada_en: "01KTC58AH32FJFRKF1GKPSJBFV",
  canada_fr: "01KTC58AH455XWJ3BVR8MBZYJ0",
  uk_en: "01KTC58AH4JT35YDF70PMHYKBK",
  australia_en: "01KTC58AH4VWWWTH3RH8M6H105",
  new_zealand_en: "01KTC58AH4SW0KP8MVREF08EE3",
  eu_en: "01KTC58AH4K2YE36MW4S97QCQ5",
  switzerland_en: "01KTC58AH45BF44TQAW7G997TD",
  poland_pl: "01KTC58AH410SPSR0T49P8P13M",
  japan_en: "01KTC58AH4RR7GS755XTPV9EYX",
  rest_of_world_en: "01KTC58AH42M7B7C5WRQ3J239H",
};

/**
 * Returns the stable database ID for a canonical GW price market slug.
 *
 * @param slug - Canonical market slug such as `us_en`, `uk_en`, or `eu_en`.
 * @returns The fixed ULID assigned to that price market.
 */
export const priceMarketId = (slug: PriceMarketSeedSlug): string => {
  return priceMarketSeedIds[slug];
};
