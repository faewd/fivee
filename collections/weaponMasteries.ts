import { collection } from "$db/collection.ts";
import { BaseDocument, Source } from "$collections/_common.ts";
import { entries } from "$data/weaponMasteries/entries.ts";

/*
 * TypeScript Types
 */

export interface WeaponMastery extends BaseDocument {
  desc: string;
  source: Source;
}

/**
 * Collection Definition
 */

export default collection<WeaponMastery>({
  id: "weaponMasteries",
  docType: "weaponMastery",
  entries,
  typeDefs: `#graphql
    type WeaponMastery {
      id: String!
      name: String!
      desc: String!
      source: Source!
    }
  `,
});
