import { createHash } from "node:crypto";
import type { PlayerConfig, SeedDataset } from "../../types/_index.types";
import { playerFullNames } from "./player_full_names.data";
import { playerUsernames } from "./player_usernames.data";

const ULID_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/**
 * Fixed timestamp prefix shared by all test player ULIDs.
 *
 * All 1 000 test players share this prefix so they sort together and are
 * visually distinguishable from production records in a mixed environment.
 */
const PLAYER_ID_TIMESTAMP = "01J0000000";

/**
 * Encodes `length` ULID-alphabet characters from a SHA-256 digest of `value`.
 *
 * Reads the digest byte-by-byte, accumulating bits into a sliding window and
 * emitting one base-32 character per five bits. Stops as soon as `length`
 * characters have been emitted.
 */
const toBase32Digest = (value: string, length: number): string => {
	const digest = createHash("sha256").update(value).digest();
	let bits = 0;
	let buffer = 0;
	let encoded = "";

	for (const byte of digest) {
		buffer = (buffer << 8) | byte;
		bits += 8;

		while (bits >= 5 && encoded.length < length) {
			bits -= 5;
			encoded += ULID_ALPHABET[(buffer >> bits) & 31];
		}

		if (encoded.length === length) break;
	}

	return encoded.padEnd(length, "0");
};

/**
 * Returns a stable 26-character ULID for the given username.
 *
 * The ID is deterministic: the same username always produces the same value,
 * making repeated seed runs fully idempotent. The random portion is derived
 * from a SHA-256 digest of the username rather than sampled at runtime.
 */
const playerIdForUsername = (username: string): string =>
	`${PLAYER_ID_TIMESTAMP}${toBase32Digest(username, 16)}`;

/**
 * Converts a camelCase or PascalCase username into a kebab-case slug.
 *
 * `UltramarCrusader` → `ultramar-crusader`
 */
const slugifyUsername = (username: string): string =>
	username
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.replace(/[^a-zA-Z0-9]+/g, "-")
		.replace(/^-|-$/g, "")
		.toLowerCase();

/**
 * Test player records built by pairing `playerUsernames` with `playerFullNames`
 * positionally (index 0 with index 0, etc.).
 *
 * Each player's `id` and `player_slug` are derived deterministically from
 * their username, so this array is stable across seed runs as long as neither
 * source array changes order.
 *
 * These are synthetic test fixtures and are **not** migrated to production.
 */
const players = playerUsernames.map((username, index) => {
	const id = playerIdForUsername(username);
	const { first_name, last_name } = playerFullNames[index];

	return {
		id,
		player_first_name: first_name,
		player_last_name: last_name,
		player_slug: `${slugifyUsername(username)}-${id.slice(-8).toLowerCase()}`,
		player_username: username,
	};
}) satisfies PlayerConfig[];

/**
 * Typed seed dataset for the `players` table.
 *
 * Contains 1 000 synthetic test players. Player data is environment-specific
 * and is not seeded into production.
 */
export const playersDataset: SeedDataset<"players"> = {
	table: "players",
	records: players,
};
