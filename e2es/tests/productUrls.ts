import { filterObject } from "@hidden-identity/shared";
/* =====================================================================================
   COPID FROM url.ts 
===================================================================================== */
const routeMap = {
  [""]: [],
  game: [],
  gm: ["desktop", "mobile"],
  spectator: [],
} as const;
type RouteMap = typeof routeMap;
export type Route = {
  [K in keyof RouteMap]:
    | K
    | {
        [Nested in RouteMap[K][number]]: `${K}/${Nested}`;
      }[RouteMap[K][number]];
}[keyof RouteMap];

export const searchParamKeys = [
  "gameId",
  "gmSecretHash",
  "firstSeat",
  "hiddenView",
  "testPlayerKey",
] as const;
export type SearchParamKey = (typeof searchParamKeys)[number];
export type SearchParams = Partial<Record<SearchParamKey, string>>;

export function searchParamsString(searchParams: SearchParams): string {
  return new URLSearchParams(
    filterObject({ ...searchParams }, ([_, v]) => !!v),
  ).toString();
}

export function urlFromBase(url: Route, searchParams: SearchParams): string {
  return `/${url}?${searchParamsString(searchParams)}`;
}
