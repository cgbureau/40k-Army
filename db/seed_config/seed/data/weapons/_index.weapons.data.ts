import type { WeaponConfig } from "../../../types/_index.types";
import { adeptaSororitasWeapons } from "./adepta_sororitas.data";
import { adeptusCustodesWeapons } from "./adeptus_custodes.data";
import { adeptusMechanicusWeapons } from "./adeptus_mechanicus.data";
import { aeldariWeapons } from "./aeldari.data";
import { astraMilitarumWeapons } from "./astra_militarum.data";
import { blackTemplarsWeapons } from "./black_templars.data";
import { bloodAngelsWeapons } from "./blood_angels.data";
import { chaosDaemonsWeapons } from "./chaos_daemons.data";
import { chaosKnightsWeapons } from "./chaos_knights.data";
import { chaosSpaceMarinesWeapons } from "./chaos_space_marines.data";
import { darkAngelsWeapons } from "./dark_angels.data";
import { deathGuardWeapons } from "./death_guard.data";
import { deathwatchWeapons } from "./deathwatch.data";
import { drukhariWeapons } from "./drukhari.data";
import { emperorsChildrenWeapons } from "./emperors_children.data";
import { genestealerCultsWeapons } from "./genestealer_cults.data";
import { greyKnightsWeapons } from "./grey_knights.data";
import { imperialAgentsWeapons } from "./imperial_agents.data";
import { imperialFistsWeapons } from "./imperial_fists.data";
import { imperialKnightsWeapons } from "./imperial_knights.data";
import { ironHandsWeapons } from "./iron_hands.data";
import { leaguesOfVotannWeapons } from "./leagues_of_votann.data";
import { necronsWeapons } from "./necrons.data";
import { orksWeapons } from "./orks.data";
import { ravenGuardWeapons } from "./raven_guard.data";
import { salamandersWeapons } from "./salamanders.data";
import { spaceMarinesWeapons } from "./space_marines.data";
import { spaceWolvesWeapons } from "./space_wolves.data";
import { tauEmpireWeapons } from "./tau_empire.data";
import { thousandSonsWeapons } from "./thousand_sons.data";
import { tyranidsWeapons } from "./tyranids.data";
import { ultramarinesWeapons } from "./ultramarines.data";
import { whiteScarsWeapons } from "./white_scars.data";
import { worldEatersWeapons } from "./world_eaters.data";

export const weapons = [
  ...adeptaSororitasWeapons.records,
  ...adeptusCustodesWeapons.records,
  ...adeptusMechanicusWeapons.records,
  ...aeldariWeapons.records,
  ...astraMilitarumWeapons.records,
  ...blackTemplarsWeapons.records,
  ...bloodAngelsWeapons.records,
  ...chaosDaemonsWeapons.records,
  ...chaosKnightsWeapons.records,
  ...chaosSpaceMarinesWeapons.records,
  ...darkAngelsWeapons.records,
  ...deathGuardWeapons.records,
  ...deathwatchWeapons.records,
  ...drukhariWeapons.records,
  ...emperorsChildrenWeapons.records,
  ...genestealerCultsWeapons.records,
  ...greyKnightsWeapons.records,
  ...imperialAgentsWeapons.records,
  ...imperialFistsWeapons.records,
  ...imperialKnightsWeapons.records,
  ...ironHandsWeapons.records,
  ...leaguesOfVotannWeapons.records,
  ...necronsWeapons.records,
  ...orksWeapons.records,
  ...ravenGuardWeapons.records,
  ...salamandersWeapons.records,
  ...spaceMarinesWeapons.records,
  ...spaceWolvesWeapons.records,
  ...tauEmpireWeapons.records,
  ...thousandSonsWeapons.records,
  ...tyranidsWeapons.records,
  ...ultramarinesWeapons.records,
  ...whiteScarsWeapons.records,
  ...worldEatersWeapons.records,
] satisfies WeaponConfig[];
