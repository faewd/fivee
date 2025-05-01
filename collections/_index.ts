import {
  AbilityScore,
  default as abilityScores,
} from "$collections/abilityScores.ts";

import {
  DamageType,
  default as damageTypes,
} from "$collections/damageTypes.ts";

import { default as items, Item } from "$collections/items/collection.ts";

import {
  default as magicSchools,
  MagicSchool,
} from "$collections/magicSchools.ts";

import { default as skills, Skill } from "$collections/skills.ts";

import {
  default as sourceBooks,
  SourceBook,
} from "$collections/sourceBooks.ts";

import { default as spells, Spell } from "$collections/spells/collection.ts";

import {
  default as weaponMasteries,
  WeaponMastery,
} from "$collections/weaponMasteries.ts";

export const collections = {
  abilityScores,
  damageTypes,
  items,
  magicSchools,
  skills,
  sourceBooks,
  spells,
  weaponMasteries,
} as const;

export type CollectionID =
  | "abilityScores"
  | "damageTypes"
  | "items"
  | "magicSchools"
  | "skills"
  | "sourceBooks"
  | "spells"
  | "weaponMasteries";

export type Document =
  | AbilityScore
  | DamageType
  | Item
  | MagicSchool
  | Skill
  | SourceBook
  | Spell
  | WeaponMastery;

export type { AbilityScore, Skill, SourceBook };
