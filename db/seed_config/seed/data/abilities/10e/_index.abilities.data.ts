import type { AbilityConfig } from "../../../../types/_index.types";
import { adeptaSororitasAbilities10e } from "./adepta_sororitas.data";
import { adeptusCustodesAbilities10e } from "./adeptus_custodes.data";
import { adeptusMechanicusAbilities10e } from "./adeptus_mechanicus.data";
import { aeldariAbilities10e } from "./aeldari.data";
import { astraMilitarumAbilities10e } from "./astra_militarum.data";
import { blackTemplarsAbilities10e } from "./black_templars.data";
import { bloodAngelsAbilities10e } from "./blood_angels.data";
import { chaosDaemonsAbilities10e } from "./chaos_daemons.data";
import { chaosKnightsAbilities10e } from "./chaos_knights.data";
import { chaosSpaceMarinesAbilities10e } from "./chaos_space_marines.data";
import { darkAngelsAbilities10e } from "./dark_angels.data";
import { deathGuardAbilities10e } from "./death_guard.data";
import { deathwatchAbilities10e } from "./deathwatch.data";
import { drukhariAbilities10e } from "./drukhari.data";
import { emperorsChildrenAbilities10e } from "./emperors_children.data";
import { genestealerCultsAbilities10e } from "./genestealer_cults.data";
import { greyKnightsAbilities10e } from "./grey_knights.data";
import { imperialAgentsAbilities10e } from "./imperial_agents.data";
import { imperialFistsAbilities10e } from "./imperial_fists.data";
import { imperialKnightsAbilities10e } from "./imperial_knights.data";
import { ironHandsAbilities10e } from "./iron_hands.data";
import { leaguesOfVotannAbilities10e } from "./leagues_of_votann.data";
import { necronsAbilities10e } from "./necrons.data";
import { orksAbilities10e } from "./orks.data";
import { ravenGuardAbilities10e } from "./raven_guard.data";
import { salamandersAbilities10e } from "./salamanders.data";
import { spaceMarinesAbilities10e } from "./space_marines.data";
import { spaceWolvesAbilities10e } from "./space_wolves.data";
import { tauEmpireAbilities10e } from "./tau_empire.data";
import { thousandSonsAbilities10e } from "./thousand_sons.data";
import { tyranidsAbilities10e } from "./tyranids.data";
import { ultramarinesAbilities10e } from "./ultramarines.data";
import { whiteScarsAbilities10e } from "./white_scars.data";
import { worldEatersAbilities10e } from "./world_eaters.data";

export const abilities10e = [
  ...adeptaSororitasAbilities10e.records,
  ...adeptusCustodesAbilities10e.records,
  ...adeptusMechanicusAbilities10e.records,
  ...aeldariAbilities10e.records,
  ...astraMilitarumAbilities10e.records,
  ...blackTemplarsAbilities10e.records,
  ...bloodAngelsAbilities10e.records,
  ...chaosDaemonsAbilities10e.records,
  ...chaosKnightsAbilities10e.records,
  ...chaosSpaceMarinesAbilities10e.records,
  ...darkAngelsAbilities10e.records,
  ...deathGuardAbilities10e.records,
  ...deathwatchAbilities10e.records,
  ...drukhariAbilities10e.records,
  ...emperorsChildrenAbilities10e.records,
  ...genestealerCultsAbilities10e.records,
  ...greyKnightsAbilities10e.records,
  ...imperialAgentsAbilities10e.records,
  ...imperialFistsAbilities10e.records,
  ...imperialKnightsAbilities10e.records,
  ...ironHandsAbilities10e.records,
  ...leaguesOfVotannAbilities10e.records,
  ...necronsAbilities10e.records,
  ...orksAbilities10e.records,
  ...ravenGuardAbilities10e.records,
  ...salamandersAbilities10e.records,
  ...spaceMarinesAbilities10e.records,
  ...spaceWolvesAbilities10e.records,
  ...tauEmpireAbilities10e.records,
  ...thousandSonsAbilities10e.records,
  ...tyranidsAbilities10e.records,
  ...ultramarinesAbilities10e.records,
  ...whiteScarsAbilities10e.records,
  ...worldEatersAbilities10e.records,
] satisfies AbilityConfig[];
