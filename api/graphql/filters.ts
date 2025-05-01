import { Document } from "$collections/_index.ts";
import { Cost } from "$collections/_common.ts";

type GqlPrimitive = "Int" | "Float" | "String" | "Boolean";

type TSTypeOfGqlType<T extends string> = T extends "String" ? string
  : T extends "Int" ? number
  : T extends "Float" ? number
  : T extends "Boolean" ? boolean
  : T extends `[${infer E}]`
    ? E extends GqlPrimitive ? Array<TSTypeOfGqlType<E>>
    : never
  : never;

export type CollectionFilter<
  T extends Document,
  K extends keyof T,
  G extends string,
> = {
  field: K;
  operator: string;
  gqlType: G;
  predicate: (fieldValue: T[K], filterValue: TSTypeOfGqlType<G>) => boolean;
};

export function filter<
  T extends Document,
  K extends keyof T,
  G extends string,
  M = T[K],
>(
  field: K,
  operator: string,
  gqlType: G,
  predicate: (mappedValue: M, filterValue: TSTypeOfGqlType<G>) => boolean,
  mapper?: (fieldValue: T[K]) => M,
): CollectionFilter<T, K, G> {
  return {
    field,
    operator,
    gqlType,
    predicate: (actual, expected) => {
      const value = mapper !== undefined ? mapper(actual) : actual as M;
      return predicate(value, expected);
    },
  };
}

export function genericFilters<
  T extends Document,
  K extends keyof T,
  G extends GqlPrimitive,
>(
  field: K,
  gqlType: G,
): CollectionFilter<T, K, G | `[${G}]`>[] {
  return [
    filter(field, "eq", gqlType, (actual, expected) => actual == expected),
    filter(field, "ne", gqlType, (actual, expected) => actual != expected),
    filter(field, "lt", gqlType, (actual, expected) => actual < expected),
    filter(field, "gt", gqlType, (actual, expected) => actual > expected),
    filter(field, "lte", gqlType, (actual, expected) => actual <= expected),
    filter(field, "gte", gqlType, (actual, expected) => actual >= expected),
    filter(
      field,
      "in",
      `[${gqlType}]`,
      (actual, expected) => (expected as Array<T[K]>).includes(actual),
    ),
  ];
}

export function intFilters<T extends Document>(
  field: keyof T,
): CollectionFilter<T, keyof T, "Int" | "[Int]">[] {
  return genericFilters<T, keyof T, "Int">(field, "Int");
}

export function floatFilters<T extends Document>(
  field: keyof T,
): CollectionFilter<T, keyof T, "Float" | "[Float]">[] {
  return genericFilters<T, keyof T, "Float">(field, "Float");
}

export function stringFilters<
  T extends Document,
>(
  field: keyof T,
): CollectionFilter<T, keyof T, "String" | "[String]">[] {
  return [
    ...genericFilters<T, keyof T, "String">(field, "String"),
    filter(
      field,
      "like",
      "String",
      (actual, expected) => (actual as string).includes(expected),
    ),
    filter(
      field,
      "ilike",
      "String",
      (actual, expected) =>
        (actual as string).toLowerCase().includes(expected.toLowerCase()),
    ),
  ];
}

const denomValues: Record<Cost["currency"], number> = {
  cp: 0.01,
  sp: 0.1,
  ep: 0.5,
  gp: 1,
  pp: 10,
};
function costToFloat(cost: Cost): number {
  return denomValues[cost.currency] * cost.amount;
}

export function costFilters<
  T extends Document & { cost: Cost },
>(): CollectionFilter<T, "cost", "Float" | "[Float]">[] {
  return [
    filter(
      "cost",
      "eq",
      "Float",
      (actual, expected) => actual == expected,
      costToFloat,
    ),
    filter(
      "cost",
      "ne",
      "Float",
      (actual, expected) => actual != expected,
      costToFloat,
    ),
    filter(
      "cost",
      "lt",
      "Float",
      (actual, expected) => actual < expected,
      costToFloat,
    ),
    filter(
      "cost",
      "gt",
      "Float",
      (actual, expected) => actual > expected,
      costToFloat,
    ),
    filter(
      "cost",
      "lte",
      "Float",
      (actual, expected) => actual <= expected,
      costToFloat,
    ),
    filter(
      "cost",
      "gte",
      "Float",
      (actual, expected) => actual >= expected,
      costToFloat,
    ),
    filter(
      "cost",
      "in",
      "[Float]",
      (actual, expected) => (expected as Array<number>).includes(actual),
      costToFloat,
    ),
  ];
}

export function arrayFilters<
  T extends Document,
  K extends keyof T,
  E extends GqlPrimitive,
  G extends `[${E}]`,
>(
  field: K,
  gqlType: E,
): CollectionFilter<T, K, E | G>[] {
  return [
    filter(
      field,
      "has",
      gqlType,
      (actual, expected) => (actual as Array<T[K]>).includes(expected as T[K]),
    ),
  ];
}

export type FilterFunc<T extends Document> = (
  doc: T,
  filterValues: Record<string, any>,
) => boolean;

export function composeFilterFunc<T extends Document>(
  filters: CollectionFilter<T, any, any>[],
): FilterFunc<T> {
  return function filterFunc(doc: T, filterValues: Record<string, any>) {
    if (filters === undefined) return true;
    if (filters.length === 0) return true;

    return Object.entries(filterValues)
      .every(([key, value]) => {
        const parts = key.split("_");
        // if (parts.length !== 0) throw new Error(`Unexpected filter field '${key}' on collection ${id}.`)
        const [field, op] = parts;
        const filter = filters.find((f) =>
          f.field === field && f.operator === op
        );
        if (filter === undefined) return true; // throw
        return filter.predicate((doc as unknown as any)[filter.field], value);
      });
  };
}
