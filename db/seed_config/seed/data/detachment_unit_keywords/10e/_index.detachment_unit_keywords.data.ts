import { aeldariDetachmentUnitKeywords10e } from "./aeldari.data";
import { chaosKnightsDetachmentUnitKeywords10e } from "./chaos_knights.data";
import { chaosSpaceMarinesDetachmentUnitKeywords10e } from "./chaos_space_marines.data";
import { imperialKnightsDetachmentUnitKeywords10e } from "./imperial_knights.data";
import { orksDetachmentUnitKeywords10e } from "./orks.data";
import { spaceMarinesDetachmentUnitKeywords10e } from "./space_marines.data";
import { thousandSonsDetachmentUnitKeywords10e } from "./thousand_sons.data";
import { tyranidsDetachmentUnitKeywords10e } from "./tyranids.data";

export const detachmentUnitKeywords10e = [
  ...aeldariDetachmentUnitKeywords10e.records,
  ...chaosKnightsDetachmentUnitKeywords10e.records,
  ...chaosSpaceMarinesDetachmentUnitKeywords10e.records,
  ...imperialKnightsDetachmentUnitKeywords10e.records,
  ...orksDetachmentUnitKeywords10e.records,
  ...spaceMarinesDetachmentUnitKeywords10e.records,
  ...thousandSonsDetachmentUnitKeywords10e.records,
  ...tyranidsDetachmentUnitKeywords10e.records,
];
