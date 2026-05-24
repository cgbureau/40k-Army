import { createHash } from "node:crypto";
import type { PlayerConfig, SeedDataset } from "../../types/_index.types";
import { playerUsernames } from "./player_usernames.data";

const ULID_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const PLAYER_ID_TIMESTAMP = "01J0000000";

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

		if (encoded.length === length) {
			break;
		}
	}

	return encoded.padEnd(length, "0");
};

const playerIdForUsername = (username: string): string =>
	`${PLAYER_ID_TIMESTAMP}${toBase32Digest(username, 16)}`;

const slugifyUsername = (username: string): string =>
	username
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.replace(/[^a-zA-Z0-9]+/g, "-")
		.replace(/^-|-$/g, "")
		.toLowerCase();

const playerNamesFromUsername = (
	username: string,
): { player_first_name: string; player_last_name: string } => {
	const displayName = username.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
	const [firstName = username, ...remainingNameParts] = displayName.split(" ");

	return {
		player_first_name: firstName,
		player_last_name: remainingNameParts.join(" "),
	};
};

const players = playerUsernames.map((playerUsername) => {
	const id = playerIdForUsername(playerUsername);
	const playerUsernameSlug = slugifyUsername(playerUsername);

	return {
		id,
		...playerNamesFromUsername(playerUsername),
		player_slug: `${playerUsernameSlug}-${id.slice(-8).toLowerCase()}`,
		player_username: playerUsername,
	};
}) satisfies PlayerConfig[];

/**
 * Typed seed dataset for the `players` table.
 */
export const playersDataset: SeedDataset<"players"> = {
	table: "players",
	records: players,
};
