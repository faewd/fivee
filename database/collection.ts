import { Entry } from "$db/resolver.ts";
import { CollectionID, Document } from "$collections/_index.ts";
import { ResolverContext } from "$graphql/context.ts";
import { ApolloServerOptions } from "npm:@apollo/server@^4.9";
import { manyResolver, oneResolver } from "$graphql/resolvers.ts";
import { CollectionFilter, composeFilterFunc } from "$graphql/filters.ts";

export class Collection<Doc extends Document> {
  constructor(
    public readonly id: string,
    public readonly typeDefs: ApolloServerOptions<ResolverContext>["typeDefs"],
    public readonly resolvers: ApolloServerOptions<
      ResolverContext
    >["resolvers"],
    public readonly entries: Entry<Doc>[],
  ) {}
}

function generateTypeDefs<T extends Document>(
  id: string,
  docType: string,
  filters: CollectionFilter<T, any, any>[] | undefined,
  customTypeDefs: ApolloServerOptions<ResolverContext>["typeDefs"],
) {
  const gqlType = docType.charAt(0).toUpperCase() + docType.slice(1);
  const gqlFiltersType = `${gqlType}Filters`;
  const filtersArg = filters === undefined
    ? ""
    : `, filters: ${gqlFiltersType}`;
  const gqlFilters = filters?.map((filter) =>
    `${filter.field}_${filter.operator}: ${filter.gqlType}`
  );
  const filtersTypeDef = filters === undefined ? "" : `
    input ${gqlFiltersType} {
      ${gqlFilters}
    }
  `;

  const queryTypeExtension = `
    extend type Query {
      ${id}(expressions: Boolean${filtersArg}): [${gqlType}!]
      ${docType}(id: String!, expressions: Boolean): ${gqlType}
    }
  `;

  return customTypeDefs + filtersTypeDef + queryTypeExtension;
}

interface CollectionOptions<T extends Document> {
  id: CollectionID;
  docType: string;
  typeDefs: ApolloServerOptions<ResolverContext>["typeDefs"];
  resolvers?: ApolloServerOptions<ResolverContext>["resolvers"];
  filters?: CollectionFilter<T, any, any>[];
  entries: Entry<T>[];
}

export function collection<T extends Document>({
  id,
  docType,
  entries,
  resolvers: customResolvers,
  filters,
  typeDefs: customTypeDefs,
}: CollectionOptions<T>) {
  const ids = new Set<string>();

  for (const { id: entryId } of entries) {
    if (ids.has(entryId)) {
      throw new Error(`Duplicate id '${entryId}' in collection '${id}'.`);
    }
    ids.add(entryId);
  }

  const filterFunc = composeFilterFunc(filters ?? []);
  const typeDefs = generateTypeDefs(id, docType, filters, customTypeDefs);

  const resolvers = {
    ...(customResolvers ?? {}),
    Query: {
      [docType]: oneResolver<T>(id),
      [id]: manyResolver<T>(id, filterFunc),
    },
  };

  return new Collection<T>(id, typeDefs, resolvers, entries);
}
