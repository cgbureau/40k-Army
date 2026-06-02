import { createHash } from "node:crypto";

/**
 * Deterministic ULID generator for rules-data seed records.
 *
 * IDs are derived from a SHA-256 digest of a namespace + slug so the same
 * slug always produces the same ID across seed runs. The "01K" timestamp
 * prefix places these records in a distinct range from other seed data.
 */
const BASE32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

const deterministicUlid = (namespace: string, slug: string): string => {
	const digest = createHash("sha256")
		.update(`${namespace}:${slug}`)
		.digest();
	let bits = 0;
	let buffer = 0;
	let encoded = "";
	for (const byte of digest) {
		buffer = (buffer << 8) | byte;
		bits += 8;
		while (bits >= 5 && encoded.length < 23) {
			bits -= 5;
			encoded += BASE32[(buffer >> bits) & 31];
		}
		if (encoded.length === 23) break;
	}
	return `01K${encoded.padEnd(23, "0")}`;
};

export const modelId = (slug: string): string =>
	deterministicUlid("model", slug);

export const weaponId = (slug: string): string =>
	deterministicUlid("weapon", slug);

export const weaponProfileId = (slug: string): string =>
	deterministicUlid("weapon_profile", slug);

export const weaponProfileKeywordId = (slug: string): string =>
	deterministicUlid("weapon_profile_keyword", slug);

export const unitModelId = (slug: string): string =>
	deterministicUlid("unit_model", slug);

export const unitProfileId = (slug: string): string =>
	deterministicUlid("unit_profile", slug);

export const unitProfileStatId = (slug: string): string =>
	deterministicUlid("unit_profile_stat", slug);

export const unitPointCostId = (slug: string): string =>
	deterministicUlid("unit_point_cost", slug);

export const unitSelectionLimitId = (slug: string): string =>
	deterministicUlid("unit_selection_limit", slug);

export const unitWeaponId = (slug: string): string =>
	deterministicUlid("unit_weapon", slug);

export const unitAbilityId = (slug: string): string =>
	deterministicUlid("unit_ability", slug);

export const unitKeywordId = (slug: string): string =>
	deterministicUlid("unit_keyword", slug);

export const detachmentUnitKeywordId = (slug: string): string =>
	deterministicUlid("detachment_unit_keyword", slug);

export const leaderEligibilityId = (slug: string): string =>
	deterministicUlid("leader_eligibility", slug);

export const leaderEligibilityKeywordId = (slug: string): string =>
	deterministicUlid("leader_eligibility_keyword", slug);
