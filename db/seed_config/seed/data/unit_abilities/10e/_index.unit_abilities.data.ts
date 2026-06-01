import type { UnitAbilityConfig } from "../../../../types/_index.types";
import { adeptaSororitasUnitAbilities10e } from "./adepta_sororitas.data";
import { adeptusCustodesUnitAbilities10e } from "./adeptus_custodes.data";
import { adeptusMechanicusUnitAbilities10e } from "./adeptus_mechanicus.data";
import { aeldariUnitAbilities10e } from "./aeldari.data";
import { astraMilitarumUnitAbilities10e } from "./astra_militarum.data";
import { blackTemplarsUnitAbilities10e } from "./black_templars.data";
import { bloodAngelsUnitAbilities10e } from "./blood_angels.data";
import { chaosDaemonsUnitAbilities10e } from "./chaos_daemons.data";
import { chaosKnightsUnitAbilities10e } from "./chaos_knights.data";
import { chaosSpaceMarinesUnitAbilities10e } from "./chaos_space_marines.data";
import { darkAngelsUnitAbilities10e } from "./dark_angels.data";
import { deathGuardUnitAbilities10e } from "./death_guard.data";
import { deathwatchUnitAbilities10e } from "./deathwatch.data";
import { drukhariUnitAbilities10e } from "./drukhari.data";
import { emperorsChildrenUnitAbilities10e } from "./emperors_children.data";
import { genestealerCultsUnitAbilities10e } from "./genestealer_cults.data";
import { greyKnightsUnitAbilities10e } from "./grey_knights.data";
import { imperialAgentsUnitAbilities10e } from "./imperial_agents.data";
import { imperialFistsUnitAbilities10e } from "./imperial_fists.data";
import { imperialKnightsUnitAbilities10e } from "./imperial_knights.data";
import { ironHandsUnitAbilities10e } from "./iron_hands.data";
import { leaguesOfVotannUnitAbilities10e } from "./leagues_of_votann.data";
import { necronsUnitAbilities10e } from "./necrons.data";
import { orksUnitAbilities10e } from "./orks.data";
import { ravenGuardUnitAbilities10e } from "./raven_guard.data";
import { salamandersUnitAbilities10e } from "./salamanders.data";
import { spaceMarinesUnitAbilities10e } from "./space_marines.data";
import { spaceWolvesUnitAbilities10e } from "./space_wolves.data";
import { tauEmpireUnitAbilities10e } from "./tau_empire.data";
import { thousandSonsUnitAbilities10e } from "./thousand_sons.data";
import { tyranidsUnitAbilities10e } from "./tyranids.data";
import { ultramarinesUnitAbilities10e } from "./ultramarines.data";
import { whiteScarsUnitAbilities10e } from "./white_scars.data";
import { worldEatersUnitAbilities10e } from "./world_eaters.data";

export const unitAbilities10e = [
  ...adeptaSororitasUnitAbilities10e.records,
  ...adeptusCustodesUnitAbilities10e.records,
  ...adeptusMechanicusUnitAbilities10e.records,
  ...aeldariUnitAbilities10e.records,
  ...astraMilitarumUnitAbilities10e.records,
  ...blackTemplarsUnitAbilities10e.records,
  ...bloodAngelsUnitAbilities10e.records,
  ...chaosDaemonsUnitAbilities10e.records,
  ...chaosKnightsUnitAbilities10e.records,
  ...chaosSpaceMarinesUnitAbilities10e.records,
  ...darkAngelsUnitAbilities10e.records,
  ...deathGuardUnitAbilities10e.records,
  ...deathwatchUnitAbilities10e.records,
  ...drukhariUnitAbilities10e.records,
  ...emperorsChildrenUnitAbilities10e.records,
  ...genestealerCultsUnitAbilities10e.records,
  ...greyKnightsUnitAbilities10e.records,
  ...imperialAgentsUnitAbilities10e.records,
  ...imperialFistsUnitAbilities10e.records,
  ...imperialKnightsUnitAbilities10e.records,
  ...ironHandsUnitAbilities10e.records,
  ...leaguesOfVotannUnitAbilities10e.records,
  ...necronsUnitAbilities10e.records,
  ...orksUnitAbilities10e.records,
  ...ravenGuardUnitAbilities10e.records,
  ...salamandersUnitAbilities10e.records,
  ...spaceMarinesUnitAbilities10e.records,
  ...spaceWolvesUnitAbilities10e.records,
  ...tauEmpireUnitAbilities10e.records,
  ...thousandSonsUnitAbilities10e.records,
  ...tyranidsUnitAbilities10e.records,
  ...ultramarinesUnitAbilities10e.records,
  ...whiteScarsUnitAbilities10e.records,
  ...worldEatersUnitAbilities10e.records,
] satisfies UnitAbilityConfig[];
