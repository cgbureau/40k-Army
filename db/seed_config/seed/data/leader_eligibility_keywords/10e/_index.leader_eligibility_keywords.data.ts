import type { LeaderEligibilityKeywordConfig } from "../../../../types/_index.types";
import { adeptusMechanicusLeaderEligibilityKeywords10e } from "./adeptus_mechanicus.data";
import { astraMilitarumLeaderEligibilityKeywords10e } from "./astra_militarum.data";
import { chaosDaemonsLeaderEligibilityKeywords10e } from "./chaos_daemons.data";
import { emperorsChildrenLeaderEligibilityKeywords10e } from "./emperors_children.data";
import { genestealerCultsLeaderEligibilityKeywords10e } from "./genestealer_cults.data";
import { imperialAgentsLeaderEligibilityKeywords10e } from "./imperial_agents.data";
import { spaceMarinesLeaderEligibilityKeywords10e } from "./space_marines.data";

export const leaderEligibilityKeywords10e = [
  ...adeptusMechanicusLeaderEligibilityKeywords10e.records,
  ...astraMilitarumLeaderEligibilityKeywords10e.records,
  ...chaosDaemonsLeaderEligibilityKeywords10e.records,
  ...emperorsChildrenLeaderEligibilityKeywords10e.records,
  ...genestealerCultsLeaderEligibilityKeywords10e.records,
  ...imperialAgentsLeaderEligibilityKeywords10e.records,
  ...spaceMarinesLeaderEligibilityKeywords10e.records,
] satisfies LeaderEligibilityKeywordConfig[];
