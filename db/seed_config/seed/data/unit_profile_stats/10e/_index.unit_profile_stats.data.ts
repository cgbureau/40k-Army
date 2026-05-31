import type { UnitProfileStatConfig } from "../../../../types/_index.types";
import { adeptaSororitasUnitProfileStats10e } from "./adepta_sororitas.data";
import { adeptusCustodesUnitProfileStats10e } from "./adeptus_custodes.data";
import { adeptusMechanicusUnitProfileStats10e } from "./adeptus_mechanicus.data";
import { aeldariUnitProfileStats10e } from "./aeldari.data";
import { astraMilitarumUnitProfileStats10e } from "./astra_militarum.data";
import { blackTemplarsUnitProfileStats10e } from "./black_templars.data";
import { bloodAngelsUnitProfileStats10e } from "./blood_angels.data";
import { chaosDaemonsUnitProfileStats10e } from "./chaos_daemons.data";
import { chaosKnightsUnitProfileStats10e } from "./chaos_knights.data";
import { chaosSpaceMarinesUnitProfileStats10e } from "./chaos_space_marines.data";
import { darkAngelsUnitProfileStats10e } from "./dark_angels.data";
import { deathGuardUnitProfileStats10e } from "./death_guard.data";
import { deathwatchUnitProfileStats10e } from "./deathwatch.data";
import { drukhariUnitProfileStats10e } from "./drukhari.data";
import { emperorsChildrenUnitProfileStats10e } from "./emperors_children.data";
import { genestealerCultsUnitProfileStats10e } from "./genestealer_cults.data";
import { greyKnightsUnitProfileStats10e } from "./grey_knights.data";
import { imperialAgentsUnitProfileStats10e } from "./imperial_agents.data";
import { imperialFistsUnitProfileStats10e } from "./imperial_fists.data";
import { imperialKnightsUnitProfileStats10e } from "./imperial_knights.data";
import { ironHandsUnitProfileStats10e } from "./iron_hands.data";
import { leaguesOfVotannUnitProfileStats10e } from "./leagues_of_votann.data";
import { necronsUnitProfileStats10e } from "./necrons.data";
import { orksUnitProfileStats10e } from "./orks.data";
import { ravenGuardUnitProfileStats10e } from "./raven_guard.data";
import { salamandersUnitProfileStats10e } from "./salamanders.data";
import { spaceMarinesUnitProfileStats10e } from "./space_marines.data";
import { spaceWolvesUnitProfileStats10e } from "./space_wolves.data";
import { tauEmpireUnitProfileStats10e } from "./tau_empire.data";
import { thousandSonsUnitProfileStats10e } from "./thousand_sons.data";
import { tyranidsUnitProfileStats10e } from "./tyranids.data";
import { ultramarinesUnitProfileStats10e } from "./ultramarines.data";
import { whiteScarsUnitProfileStats10e } from "./white_scars.data";
import { worldEatersUnitProfileStats10e } from "./world_eaters.data";

export const unitProfileStats10e = [
  ...adeptaSororitasUnitProfileStats10e.records,
  ...adeptusCustodesUnitProfileStats10e.records,
  ...adeptusMechanicusUnitProfileStats10e.records,
  ...aeldariUnitProfileStats10e.records,
  ...astraMilitarumUnitProfileStats10e.records,
  ...blackTemplarsUnitProfileStats10e.records,
  ...bloodAngelsUnitProfileStats10e.records,
  ...chaosDaemonsUnitProfileStats10e.records,
  ...chaosKnightsUnitProfileStats10e.records,
  ...chaosSpaceMarinesUnitProfileStats10e.records,
  ...darkAngelsUnitProfileStats10e.records,
  ...deathGuardUnitProfileStats10e.records,
  ...deathwatchUnitProfileStats10e.records,
  ...drukhariUnitProfileStats10e.records,
  ...emperorsChildrenUnitProfileStats10e.records,
  ...genestealerCultsUnitProfileStats10e.records,
  ...greyKnightsUnitProfileStats10e.records,
  ...imperialAgentsUnitProfileStats10e.records,
  ...imperialFistsUnitProfileStats10e.records,
  ...imperialKnightsUnitProfileStats10e.records,
  ...ironHandsUnitProfileStats10e.records,
  ...leaguesOfVotannUnitProfileStats10e.records,
  ...necronsUnitProfileStats10e.records,
  ...orksUnitProfileStats10e.records,
  ...ravenGuardUnitProfileStats10e.records,
  ...salamandersUnitProfileStats10e.records,
  ...spaceMarinesUnitProfileStats10e.records,
  ...spaceWolvesUnitProfileStats10e.records,
  ...tauEmpireUnitProfileStats10e.records,
  ...thousandSonsUnitProfileStats10e.records,
  ...tyranidsUnitProfileStats10e.records,
  ...ultramarinesUnitProfileStats10e.records,
  ...whiteScarsUnitProfileStats10e.records,
  ...worldEatersUnitProfileStats10e.records,
] satisfies UnitProfileStatConfig[];
