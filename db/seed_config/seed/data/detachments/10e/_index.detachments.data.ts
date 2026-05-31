import type { DetachmentConfig } from "../../../../types/_index.types";
import { adeptaSororitasDetachments10e } from "./adepta_sororitas.data";
import { adeptusCustodesDetachments10e } from "./adeptus_custodes.data";
import { adeptusMechanicusDetachments10e } from "./adeptus_mechanicus.data";
import { aeldariDetachments10e } from "./aeldari.data";
import { astraMilitarumDetachments10e } from "./astra_militarum.data";
import { blackTemplarsDetachments10e } from "./black_templars.data";
import { bloodAngelsDetachments10e } from "./blood_angels.data";
import { chaosDaemonsDetachments10e } from "./chaos_daemons.data";
import { chaosKnightsDetachments10e } from "./chaos_knights.data";
import { chaosSpaceMarinesDetachments10e } from "./chaos_space_marines.data";
import { darkAngelsDetachments10e } from "./dark_angels.data";
import { deathGuardDetachments10e } from "./death_guard.data";
import { deathwatchDetachments10e } from "./deathwatch.data";
import { drukhariDetachments10e } from "./drukhari.data";
import { emperorsChildrenDetachments10e } from "./emperors_children.data";
import { genestealerCultsDetachments10e } from "./genestealer_cults.data";
import { greyKnightsDetachments10e } from "./grey_knights.data";
import { imperialAgentsDetachments10e } from "./imperial_agents.data";
import { imperialFistsDetachments10e } from "./imperial_fists.data";
import { imperialKnightsDetachments10e } from "./imperial_knights.data";
import { ironHandsDetachments10e } from "./iron_hands.data";
import { leaguesOfVotannDetachments10e } from "./leagues_of_votann.data";
import { necronsDetachments10e } from "./necrons.data";
import { orksDetachments10e } from "./orks.data";
import { ravenGuardDetachments10e } from "./raven_guard.data";
import { salamandersDetachments10e } from "./salamanders.data";
import { spaceWolvesDetachments10e } from "./space_wolves.data";
import { tauEmpireDetachments10e } from "./tau_empire.data";
import { thousandSonsDetachments10e } from "./thousand_sons.data";
import { tyranidsDetachments10e } from "./tyranids.data";
import { ultramarinesDetachments10e } from "./ultramarines.data";
import { whiteScarsDetachments10e } from "./white_scars.data";
import { worldEatersDetachments10e } from "./world_eaters.data";

export const detachments10e = [
  ...adeptaSororitasDetachments10e.records,
  ...adeptusCustodesDetachments10e.records,
  ...adeptusMechanicusDetachments10e.records,
  ...aeldariDetachments10e.records,
  ...astraMilitarumDetachments10e.records,
  ...blackTemplarsDetachments10e.records,
  ...bloodAngelsDetachments10e.records,
  ...chaosDaemonsDetachments10e.records,
  ...chaosKnightsDetachments10e.records,
  ...chaosSpaceMarinesDetachments10e.records,
  ...darkAngelsDetachments10e.records,
  ...deathGuardDetachments10e.records,
  ...deathwatchDetachments10e.records,
  ...drukhariDetachments10e.records,
  ...emperorsChildrenDetachments10e.records,
  ...genestealerCultsDetachments10e.records,
  ...greyKnightsDetachments10e.records,
  ...imperialAgentsDetachments10e.records,
  ...imperialFistsDetachments10e.records,
  ...imperialKnightsDetachments10e.records,
  ...ironHandsDetachments10e.records,
  ...leaguesOfVotannDetachments10e.records,
  ...necronsDetachments10e.records,
  ...orksDetachments10e.records,
  ...ravenGuardDetachments10e.records,
  ...salamandersDetachments10e.records,
  ...spaceWolvesDetachments10e.records,
  ...tauEmpireDetachments10e.records,
  ...thousandSonsDetachments10e.records,
  ...tyranidsDetachments10e.records,
  ...ultramarinesDetachments10e.records,
  ...whiteScarsDetachments10e.records,
  ...worldEatersDetachments10e.records,
] satisfies DetachmentConfig[];
