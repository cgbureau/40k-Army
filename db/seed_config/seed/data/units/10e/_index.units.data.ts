import type { UnitConfig } from "../../../../types/_index.types";
import { adeptaSororitasUnits10e } from "./adepta_sororitas.data";
import { adeptusCustodesUnits10e } from "./adeptus_custodes.data";
import { adeptusMechanicusUnits10e } from "./adeptus_mechanicus.data";
import { adeptusTitanicusUnits10e } from "./adeptus_titanicus.data";
import { aeldariUnits10e } from "./aeldari.data";
import { astraMilitarumUnits10e } from "./astra_militarum.data";
import { blackTemplarsUnits10e } from "./black_templars.data";
import { bloodAngelsUnits10e } from "./blood_angels.data";
import { chaosDaemonsUnits10e } from "./chaos_daemons.data";
import { chaosKnightsUnits10e } from "./chaos_knights.data";
import { chaosSpaceMarinesUnits10e } from "./chaos_space_marines.data";
import { darkAngelsUnits10e } from "./dark_angels.data";
import { deathGuardUnits10e } from "./death_guard.data";
import { deathwatchUnits10e } from "./deathwatch.data";
import { drukhariUnits10e } from "./drukhari.data";
import { emperorsChildrenUnits10e } from "./emperors_children.data";
import { genestealerCultsUnits10e } from "./genestealer_cults.data";
import { greyKnightsUnits10e } from "./grey_knights.data";
import { imperialAgentsUnits10e } from "./imperial_agents.data";
import { imperialFistsUnits10e } from "./imperial_fists.data";
import { imperialKnightsUnits10e } from "./imperial_knights.data";
import { ironHandsUnits10e } from "./iron_hands.data";
import { leaguesOfVotannUnits10e } from "./leagues_of_votann.data";
import { necronsUnits10e } from "./necrons.data";
import { orksUnits10e } from "./orks.data";
import { ravenGuardUnits10e } from "./raven_guard.data";
import { salamandersUnits10e } from "./salamanders.data";
import { spaceMarinesUnits10e } from "./space_marines.data";
import { spaceWolvesUnits10e } from "./space_wolves.data";
import { tauEmpireUnits10e } from "./tau_empire.data";
import { thousandSonsUnits10e } from "./thousand_sons.data";
import { tyranidsUnits10e } from "./tyranids.data";
import { ultramarinesUnits10e } from "./ultramarines.data";
import { unalignedForcesUnits10e } from "./unaligned_forces.data";
import { whiteScarsUnits10e } from "./white_scars.data";
import { worldEatersUnits10e } from "./world_eaters.data";

export const units10e = [
  ...adeptaSororitasUnits10e.records,
  ...adeptusCustodesUnits10e.records,
  ...adeptusMechanicusUnits10e.records,
  ...adeptusTitanicusUnits10e.records,
  ...aeldariUnits10e.records,
  ...astraMilitarumUnits10e.records,
  ...blackTemplarsUnits10e.records,
  ...bloodAngelsUnits10e.records,
  ...chaosDaemonsUnits10e.records,
  ...chaosKnightsUnits10e.records,
  ...chaosSpaceMarinesUnits10e.records,
  ...darkAngelsUnits10e.records,
  ...deathGuardUnits10e.records,
  ...deathwatchUnits10e.records,
  ...drukhariUnits10e.records,
  ...emperorsChildrenUnits10e.records,
  ...genestealerCultsUnits10e.records,
  ...greyKnightsUnits10e.records,
  ...imperialAgentsUnits10e.records,
  ...imperialFistsUnits10e.records,
  ...imperialKnightsUnits10e.records,
  ...ironHandsUnits10e.records,
  ...leaguesOfVotannUnits10e.records,
  ...necronsUnits10e.records,
  ...orksUnits10e.records,
  ...ravenGuardUnits10e.records,
  ...salamandersUnits10e.records,
  ...spaceMarinesUnits10e.records,
  ...spaceWolvesUnits10e.records,
  ...tauEmpireUnits10e.records,
  ...thousandSonsUnits10e.records,
  ...tyranidsUnits10e.records,
  ...ultramarinesUnits10e.records,
  ...unalignedForcesUnits10e.records,
  ...whiteScarsUnits10e.records,
  ...worldEatersUnits10e.records,
] satisfies UnitConfig[];
