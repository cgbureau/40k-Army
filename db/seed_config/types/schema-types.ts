import {
  abilitySchema,
  unitAbilitySchema,
  detachmentSchema,
  rulesFactionDetachmentSchema,
  detachmentUnitKeywordSchema,
  gameEditionSchema,
  gameSizeSchema,
  keywordSchema,
  unitKeywordSchema,
  kitTypeSchema,
  kitSchema,
  kitModelSchema,
  kitUnitSchema,
  kitUnitPriceAllocationSchema,
  kitPriceSchema,
  leaderEligibilityKeywordSchema,
  leaderEligibilitySchema,
  modelSchema,
  unitModelSchema,
  playerArmyListSchema,
  playerArmyListUnitSchema,
  playerCollectionModelSchema,
  playerCollectionSchema,
  playerSchema,
  rulesFactionSchema,
  rulesFactionsSourcesSchema,
  rulesFactionUnitSchema,
  rulesSourceSchema,
  superFactionSchema,
  unitPointCostSchema,
  unitProfileSchema,
  unitProfileStatSchema,
  unitSchema,
  unitSelectionLimitSchema,
} from "@db_index/";
import { z } from "zod";
import {
  abilityTypeSchema,
  accessTypeSchema,
  keywordTypeSchema,
  rulesSourceTypeSchema,
  sourceRelationshipSchema,
  sourceScopeSchema,
  unitSelectionLimitKindSchema,
  kitUnitComponentTypeSchema,
  kitUnitPriceAllocationBasisSchema,
} from "@db_index/";

// export inferred types from schemas
export type GameEdition = z.infer<typeof gameEditionSchema>;
export type GameSize = z.infer<typeof gameSizeSchema>;
export type SuperFaction = z.infer<typeof superFactionSchema>;
export type RulesFaction = z.infer<typeof rulesFactionSchema>;
export type RulesSource = z.infer<typeof rulesSourceSchema>;
export type RulesFactionSource = z.infer<typeof rulesFactionsSourcesSchema>;
export type Detachment = z.infer<typeof detachmentSchema>;
export type RulesFactionDetachment = z.infer<
  typeof rulesFactionDetachmentSchema
>;
export type Unit = z.infer<typeof unitSchema>;
export type RulesFactionUnit = z.infer<typeof rulesFactionUnitSchema>;
export type UnitProfile = z.infer<typeof unitProfileSchema>;
export type UnitProfileStat = z.infer<typeof unitProfileStatSchema>;
export type UnitPointCost = z.infer<typeof unitPointCostSchema>;
export type Keyword = z.infer<typeof keywordSchema>;
export type UnitKeyword = z.infer<typeof unitKeywordSchema>;
export type DetachmentUnitKeyword = z.infer<typeof detachmentUnitKeywordSchema>;
export type UnitSelectionLimit = z.infer<typeof unitSelectionLimitSchema>;
export type Model = z.infer<typeof modelSchema>;
export type UnitModel = z.infer<typeof unitModelSchema>;
export type KitType = z.infer<typeof kitTypeSchema>;
export type Kit = z.infer<typeof kitSchema>;
export type KitModel = z.infer<typeof kitModelSchema>;
export type KitUnit = z.infer<typeof kitUnitSchema>;
export type KitUnitPriceAllocation = z.infer<
  typeof kitUnitPriceAllocationSchema
>;
export type KitPrice = z.infer<typeof kitPriceSchema>;
export type Ability = z.infer<typeof abilitySchema>;
export type UnitAbility = z.infer<typeof unitAbilitySchema>;
export type LeaderEligibility = z.infer<typeof leaderEligibilitySchema>;
export type LeaderEligibilityKeyword = z.infer<
  typeof leaderEligibilityKeywordSchema
>;
export type Player = z.infer<typeof playerSchema>;
export type PlayerArmyList = z.infer<typeof playerArmyListSchema>;
export type PlayerArmyListUnit = z.infer<typeof playerArmyListUnitSchema>;
export type PlayerCollection = z.infer<typeof playerCollectionSchema>;
export type PlayerCollectionModel = z.infer<typeof playerCollectionModelSchema>;

// re-export common enums used across schemas
export type AbilityType = z.infer<typeof abilityTypeSchema>;
export type UnitSelectionLimitKind = z.infer<
  typeof unitSelectionLimitKindSchema
>;
export type RulesSourceType = z.infer<typeof rulesSourceTypeSchema>;
export type AccessType = z.infer<typeof accessTypeSchema>;
export type UnitAccessType = AccessType;
export type DetachmentAccessType = AccessType;
export type SourceRelationship = z.infer<typeof sourceRelationshipSchema>;
export type SourceScope = z.infer<typeof sourceScopeSchema>;
export type KeywordType = z.infer<typeof keywordTypeSchema>;
export type KitUnitComponentType = z.infer<typeof kitUnitComponentTypeSchema>;
export type KitUnitPriceAllocationBasis = z.infer<
  typeof kitUnitPriceAllocationBasisSchema
>;
