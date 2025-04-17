import { collections } from "$collections/_index.ts";
import merge from "npm:lodash.merge";

export const resolvers = merge(
  {},
  ...Object.values(collections).map((col) => col.resolvers),
);

import { ResolverContext } from "$graphql/context.ts";
import { parseTextFields } from "$exprs/parser.ts";
import { CollectionID, Document } from "$collections/_index.ts";

interface OneResolverArgs {
  id: string;
  expressions?: boolean;
}

export function oneResolver<T extends Document>(collectionId: CollectionID) {
  return async function (
    _: unknown,
    { id, expressions }: OneResolverArgs,
    { db }: ResolverContext,
  ): Promise<T | null> {
    const doc = await db.get<T>(collectionId, id);
    return doc === null || expressions
      ? doc
      : await parseTextFields(doc, { mode: "text" });
  };
}

export function manyResolver<T extends Document>(collectionId: CollectionID) {
  return async function (
    _: unknown,
    _args: never,
    { db }: ResolverContext,
  ): Promise<T[]> {
    const docs = await db.list<T>(collectionId);
    return Promise.all(
      docs.map((doc) => parseTextFields(doc, { mode: "text" })),
    );
  };
}
