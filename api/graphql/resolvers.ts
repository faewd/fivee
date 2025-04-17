import { ResolverContext } from "$graphql/context.ts";
import { parseTextFields } from "$exprs/parser.ts";
import { CollectionID, Document } from "$collections/_index.ts";
import { collections } from "$collections/_index.ts";
import merge from "npm:lodash.merge";

export function getResolvers() {
  return merge(
    {},
    ...Object.values(collections).map((col) => col.resolvers),
  );
}

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

interface ManyResolverArgs {
  expressions?: boolean;
}

export function manyResolver<T extends Document>(
  collectionId: CollectionID,
) {
  return async function (
    _: unknown,
    { expressions }: ManyResolverArgs,
    { db }: ResolverContext,
  ): Promise<T[]> {
    const docs = await db.list<T>(collectionId);
    return Promise.all(
      docs.map((doc) =>
        expressions ? doc : parseTextFields(doc, { mode: "text" })
      ),
    );
  };
}
