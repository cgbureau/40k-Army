import type { ModelConfig } from "../../../types/_index.types";
import { adeptaSororitasModels } from "./adepta_sororitas.data";
import { adeptusCustodesModels } from "./adeptus_custodes.data";
import { adeptusMechanicusModels } from "./adeptus_mechanicus.data";
import { aeldariModels } from "./aeldari.data";
import { astraMilitarumModels } from "./astra_militarum.data";
import { blackTemplarsModels } from "./black_templars.data";
import { bloodAngelsModels } from "./blood_angels.data";
import { chaosDaemonsModels } from "./chaos_daemons.data";
import { chaosKnightsModels } from "./chaos_knights.data";
import { chaosSpaceMarinesModels } from "./chaos_space_marines.data";
import { darkAngelsModels } from "./dark_angels.data";
import { deathGuardModels } from "./death_guard.data";
import { deathwatchModels } from "./deathwatch.data";
import { drukhariModels } from "./drukhari.data";
import { emperorsChildrenModels } from "./emperors_children.data";
import { genestealerCultsModels } from "./genestealer_cults.data";
import { greyKnightsModels } from "./grey_knights.data";
import { imperialAgentsModels } from "./imperial_agents.data";
import { imperialFistsModels } from "./imperial_fists.data";
import { imperialKnightsModels } from "./imperial_knights.data";
import { ironHandsModels } from "./iron_hands.data";
import { leaguesOfVotannModels } from "./leagues_of_votann.data";
import { necronsModels } from "./necrons.data";
import { orksModels } from "./orks.data";
import { ravenGuardModels } from "./raven_guard.data";
import { salamandersModels } from "./salamanders.data";
import { spaceMarinesModels } from "./space_marines.data";
import { spaceWolvesModels } from "./space_wolves.data";
import { tauEmpireModels } from "./tau_empire.data";
import { thousandSonsModels } from "./thousand_sons.data";
import { tyranidsModels } from "./tyranids.data";
import { ultramarinesModels } from "./ultramarines.data";
import { whiteScarsModels } from "./white_scars.data";
import { worldEatersModels } from "./world_eaters.data";

export const models = [
  ...adeptaSororitasModels.records,
  ...adeptusCustodesModels.records,
  ...adeptusMechanicusModels.records,
  ...aeldariModels.records,
  ...astraMilitarumModels.records,
  ...blackTemplarsModels.records,
  ...bloodAngelsModels.records,
  ...chaosDaemonsModels.records,
  ...chaosKnightsModels.records,
  ...chaosSpaceMarinesModels.records,
  ...darkAngelsModels.records,
  ...deathGuardModels.records,
  ...deathwatchModels.records,
  ...drukhariModels.records,
  ...emperorsChildrenModels.records,
  ...genestealerCultsModels.records,
  ...greyKnightsModels.records,
  ...imperialAgentsModels.records,
  ...imperialFistsModels.records,
  ...imperialKnightsModels.records,
  ...ironHandsModels.records,
  ...leaguesOfVotannModels.records,
  ...necronsModels.records,
  ...orksModels.records,
  ...ravenGuardModels.records,
  ...salamandersModels.records,
  ...spaceMarinesModels.records,
  ...spaceWolvesModels.records,
  ...tauEmpireModels.records,
  ...thousandSonsModels.records,
  ...tyranidsModels.records,
  ...ultramarinesModels.records,
  ...whiteScarsModels.records,
  ...worldEatersModels.records,
] satisfies ModelConfig[];
