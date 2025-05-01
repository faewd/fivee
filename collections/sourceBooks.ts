import { collection } from "$db/collection.ts";
import { BaseDocument } from "$collections/_common.ts";

/*
 * TypeScript Types
 */

export interface SourceBook extends BaseDocument {}

/*
 * Collection Definition
 */

export default collection<SourceBook>({
  id: "sourceBooks",
  docType: "sourceBook",
  typeDefs: `#graphql
    type SourceBook {
      id: String!
      name: String!
    }

    extend type Query {
      sourceBooks: [SourceBook]
      sourceBook(id: String!): SourceBook
    }
  `,
  entries: [
    {
      id: "PHB",
      name: "Player's Handbook (2014)",
    },
    {
      id: "PHB2024",
      name: "Player's Handbook (2024)",
    },
    {
      id: "SRD",
      name: "System Reference Document 5.1",
    },
  ],
});
