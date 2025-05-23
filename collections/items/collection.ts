import { collection } from "$db/collection.ts";
import { BaseDocument, Cost, Damage, Source } from "$collections/_common.ts";
import { entries } from "$data/items/entries.ts";
import { AbilityScore } from "$collections/abilityScores.ts";
import { WeaponMastery } from "$collections/weaponMasteries.ts";
import {
  arrayFilters,
  costFilters,
  filter,
  floatFilters,
  stringFilters,
} from "$graphql/filters.ts";

/*
 * TypeScript Types
 */

export interface BaseItem extends BaseDocument {
  cost: Cost;
  weight: number;
  tags: string[];
  source: Source;
}

export type WeaponCategory = "simple" | "martial";
export type WeaponRange =
  | { kind: "melee"; normal: number }
  | { kind: "ranged"; normal: number; long: number };

export type WeaponProperty =
  | { kind: "light" }
  | { kind: "heavy" }
  | { kind: "finesse" }
  | { kind: "twoHanded"; unlessMounted: boolean }
  | { kind: "thrown"; thrownRange: { normal: number; long: number } }
  | { kind: "reach" }
  | { kind: "versatile"; twoHandedDamage: string }
  | { kind: "ammunition"; ammunition: string }
  | { kind: "loading" }
  | { kind: "special" };

export interface WeaponItem extends BaseItem {
  kind: "weapon";
  category: WeaponCategory;
  range: WeaponRange;
  properties: WeaponProperty[];
  damage: Damage;
  mastery: WeaponMastery;
}

export type ArmorCategory = "light" | "medium" | "heavy" | "shield";

export type ArmorArmorClass =
  | { kind: "set"; base: number }
  | {
    kind: "compute";
    base: number;
    modifier: AbilityScore;
    maxModifier: number | null;
  }
  | { kind: "add"; bonus: number };

export interface ArmorItem extends BaseItem {
  kind: "armor";
  category: ArmorCategory;
  armorClass: ArmorArmorClass;
  strengthRequirement: number | null;
  stealthDisadvantage: boolean;
}

export interface ToolsUse {
  desc: string;
  dc: number;
}

export interface ToolsItem extends BaseItem {
  kind: "tools";
  toolsKind: "artisans" | "other";
  ability: AbilityScore;
  uses: ToolsUse[];
  craftables: Item[];
}

export interface GearItem extends BaseItem {
  kind: "gear";
  desc: string;
}

export interface StackItem extends BaseItem {
  kind: "stack";
  quantity: number;
  item: Item;
}

export interface PackItem extends BaseItem {
  kind: "pack";
  contents: { item: Item; quantity: number }[];
}

export type Item =
  | WeaponItem
  | ArmorItem
  | ToolsItem
  | GearItem
  | PackItem
  | StackItem;

/*
 * Collection Definition
 */

export default collection<Item>({
  id: "items",
  docType: "item",
  entries,
  typeDefs: Deno.readTextFileSync("./collections/items/typeDefs.graphql"),
  filters: [
    ...stringFilters<Item>("name"),
    ...stringFilters<Item>("kind"),
    ...floatFilters<Item>("weight"),
    ...arrayFilters<Item, "tags", "String", "[String]">("tags", "String"),
    ...costFilters(),
  ],
  resolvers: {
    Item: {
      __resolveType(item: Item): string {
        switch (item.kind) {
          case "weapon":
            return "WeaponItem";
          case "armor":
            return "ArmorItem";
          case "tools":
            return "ToolsItem";
          case "gear":
            return "GearItem";
          case "pack":
            return "PackItem";
          case "stack":
            return "StackItem";
        }
      },
    },
    WeaponRange: {
      __resolveType(range: WeaponRange): string {
        switch (range.kind) {
          case "melee":
            return "WeaponRangeMelee";
          case "ranged":
            return "WeaponRangeRanged";
        }
      },
    },
    WeaponProperty: {
      __resolveType(property: WeaponProperty): string {
        switch (property.kind) {
          case "ammunition":
            return "WeaponPropertyAmmunition";
          case "thrown":
            return "WeaponPropertyThrown";
          case "twoHanded":
            return "WeaponPropertyTwoHanded";
          case "versatile":
            return "WeaponPropertyVersatile";
          default:
            return "WeaponPropertyOther";
        }
      },
    },
    ArmorArmorClass: {
      __resolveType(ac: ArmorArmorClass): string {
        switch (ac.kind) {
          case "set":
            return "ArmorArmorClassSet";
          case "compute":
            return "ArmorArmorClassCompute";
          case "add":
            return "ArmorArmorClassAdd";
        }
      },
    },
  },
});
