import type { UnitPointCostConfig } from "../../../../types/_index.types";
import { adeptaSororitasUnitPointCosts10e } from "./adepta_sororitas.data";
import { adeptusCustodesUnitPointCosts10e } from "./adeptus_custodes.data";
import { adeptusMechanicusUnitPointCosts10e } from "./adeptus_mechanicus.data";
import { aeldariUnitPointCosts10e } from "./aeldari.data";
import { astraMilitarumUnitPointCosts10e } from "./astra_militarum.data";
import { blackTemplarsUnitPointCosts10e } from "./black_templars.data";
import { bloodAngelsUnitPointCosts10e } from "./blood_angels.data";
import { chaosDaemonsUnitPointCosts10e } from "./chaos_daemons.data";
import { chaosKnightsUnitPointCosts10e } from "./chaos_knights.data";
import { chaosSpaceMarinesUnitPointCosts10e } from "./chaos_space_marines.data";
import { darkAngelsUnitPointCosts10e } from "./dark_angels.data";
import { deathGuardUnitPointCosts10e } from "./death_guard.data";
import { deathwatchUnitPointCosts10e } from "./deathwatch.data";
import { drukhariUnitPointCosts10e } from "./drukhari.data";
import { emperorsChildrenUnitPointCosts10e } from "./emperors_children.data";
import { genestealerCultsUnitPointCosts10e } from "./genestealer_cults.data";
import { greyKnightsUnitPointCosts10e } from "./grey_knights.data";
import { imperialAgentsUnitPointCosts10e } from "./imperial_agents.data";
import { imperialFistsUnitPointCosts10e } from "./imperial_fists.data";
import { imperialKnightsUnitPointCosts10e } from "./imperial_knights.data";
import { ironHandsUnitPointCosts10e } from "./iron_hands.data";
import { leaguesOfVotannUnitPointCosts10e } from "./leagues_of_votann.data";
import { necronsUnitPointCosts10e } from "./necrons.data";
import { orksUnitPointCosts10e } from "./orks.data";
import { ravenGuardUnitPointCosts10e } from "./raven_guard.data";
import { salamandersUnitPointCosts10e } from "./salamanders.data";
import { spaceMarinesUnitPointCosts10e } from "./space_marines.data";
import { spaceWolvesUnitPointCosts10e } from "./space_wolves.data";
import { tauEmpireUnitPointCosts10e } from "./tau_empire.data";
import { thousandSonsUnitPointCosts10e } from "./thousand_sons.data";
import { tyranidsUnitPointCosts10e } from "./tyranids.data";
import { ultramarinesUnitPointCosts10e } from "./ultramarines.data";
import { whiteScarsUnitPointCosts10e } from "./white_scars.data";
import { worldEatersUnitPointCosts10e } from "./world_eaters.data";

export const unitPointCosts10e = [
  ...adeptaSororitasUnitPointCosts10e.records,
  ...adeptusCustodesUnitPointCosts10e.records,
  ...adeptusMechanicusUnitPointCosts10e.records,
  ...aeldariUnitPointCosts10e.records,
  ...astraMilitarumUnitPointCosts10e.records,
  ...blackTemplarsUnitPointCosts10e.records,
  ...bloodAngelsUnitPointCosts10e.records,
  ...chaosDaemonsUnitPointCosts10e.records,
  ...chaosKnightsUnitPointCosts10e.records,
  ...chaosSpaceMarinesUnitPointCosts10e.records,
  ...darkAngelsUnitPointCosts10e.records,
  ...deathGuardUnitPointCosts10e.records,
  ...deathwatchUnitPointCosts10e.records,
  ...drukhariUnitPointCosts10e.records,
  ...emperorsChildrenUnitPointCosts10e.records,
  ...genestealerCultsUnitPointCosts10e.records,
  ...greyKnightsUnitPointCosts10e.records,
  ...imperialAgentsUnitPointCosts10e.records,
  ...imperialFistsUnitPointCosts10e.records,
  ...imperialKnightsUnitPointCosts10e.records,
  ...ironHandsUnitPointCosts10e.records,
  ...leaguesOfVotannUnitPointCosts10e.records,
  ...necronsUnitPointCosts10e.records,
  ...orksUnitPointCosts10e.records,
  ...ravenGuardUnitPointCosts10e.records,
  ...salamandersUnitPointCosts10e.records,
  ...spaceMarinesUnitPointCosts10e.records,
  ...spaceWolvesUnitPointCosts10e.records,
  ...tauEmpireUnitPointCosts10e.records,
  ...thousandSonsUnitPointCosts10e.records,
  ...tyranidsUnitPointCosts10e.records,
  ...ultramarinesUnitPointCosts10e.records,
  ...whiteScarsUnitPointCosts10e.records,
  ...worldEatersUnitPointCosts10e.records,
] satisfies UnitPointCostConfig[];
