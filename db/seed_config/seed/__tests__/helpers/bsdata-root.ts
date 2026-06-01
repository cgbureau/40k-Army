import { existsSync } from "node:fs";
import { resolve } from "node:path";

export const BSDATA_ROOT =
  process.env.BSDATA_40K_ROOT ?? resolve(process.cwd(), "..", "wh40k-10e");

if (!existsSync(BSDATA_ROOT)) {
  throw new Error(
    `BSData checkout not found at ${BSDATA_ROOT}. Set BSDATA_40K_ROOT or clone BSData/wh40k-10e next to this repository.`,
  );
}
