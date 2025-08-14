import { collection } from "$db/collection.ts";
import { BaseDocument, Source } from "$collections/_common.ts";
import { entries } from "$data/magicSchools/entries.ts";

/*
 * TypeScript Types
 */

export interface MagicSchool extends BaseDocument {
  desc: string;
  source: Source;
}

/*
 * Data
 */

export default collection<MagicSchool>({
  id: "magicSchools",
  docType: "magicSchool",
  entries,
  typeDefs: `#graphql
    type MagicSchool {
      id: String!
      name: String!
      desc: String!
      source: Source!
    }
  `,
});
