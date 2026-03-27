export type AmazonRegion = "US" | "UK";

type AmazonStorefrontConfig = {
  domain: string;
  tag: string;
};

const AMAZON_STOREFRONTS: Record<AmazonRegion, AmazonStorefrontConfig> = {
  US: {
    domain: "www.amazon.com",
    tag: "40karmy-20",
  },
  UK: {
    domain: "www.amazon.co.uk",
    tag: "40karmy-21",
  },
};

const AMAZON_FACTION_QUERY_OVERRIDES: Partial<Record<string, string>> = {};

export function detectAmazonRegion(): AmazonRegion {
  if (typeof navigator === "undefined" || typeof navigator.language !== "string") {
    return "US";
  }

  const language = navigator.language.toLowerCase();
  if (language.includes("en-gb")) {
    return "UK";
  }

  return "US";
}

export function buildAmazonFactionQuery(factionName: string): string {
  const normalizedFactionName = factionName.trim();
  const override = AMAZON_FACTION_QUERY_OVERRIDES[normalizedFactionName];
  const factionQueryName = override ?? normalizedFactionName;

  return `warhammer 40k ${factionQueryName}`;
}

type BuildAmazonAffiliateLinkParams = {
  factionName: string;
  region?: AmazonRegion;
};

export function buildAmazonAffiliateLink({
  factionName,
  region,
}: BuildAmazonAffiliateLinkParams): string {
  const resolvedRegion = region ?? detectAmazonRegion();
  const storefront = AMAZON_STOREFRONTS[resolvedRegion];
  const query = buildAmazonFactionQuery(factionName);
  const encodedQuery = encodeURIComponent(query);

  return `https://${storefront.domain}/s?k=${encodedQuery}&tag=${storefront.tag}`;
}
