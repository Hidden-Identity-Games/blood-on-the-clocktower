import { useCallback, useMemo } from "react";
import {
  useNavigate,
  useSearchParams as useRouterSearchParams,
} from "react-router-dom";

import { filterObject } from "@hidden-identity/shared";

const routeMap = {
  [""]: [],
  game: [],
  gm: [],
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
  const paramString = searchParamsString(searchParams);
  return `/${url}` + (paramString ? `?${paramString}` : "");
}

export function urlFromOrigin(url: Route, searchParams: SearchParams): string {
  return `${window.location.origin}${urlFromBase(url, searchParams)}`;
}

export function useFirstSeat(): [string | null, (next: string) => void] {
  const [{ firstSeat }, setSearchParams] = useSearchParams();
  const setFirstPlayer = useCallback(
    (player: string) => {
      setSearchParams({ firstSeat: player });
    },
    [setSearchParams],
  );
  return [firstSeat ?? null, setFirstPlayer];
}

export function useTestPlayerKey(): string | null {
  const [{ testPlayerKey }] = useSearchParams();
  return testPlayerKey?.toLowerCase() ?? null;
}

export function useGameId(): string | null {
  const [{ gameId }] = useSearchParams();
  return gameId?.toUpperCase() ?? null;
}

export function useGMSecretHash(): string | null {
  const [{ gmSecretHash }] = useSearchParams();
  return gmSecretHash ?? null;
}

export function useIsHiddenView(): [boolean, (next: boolean) => void] {
  const [{ hiddenView }, setSearchParams] = useSearchParams();
  const setFirstPlayer = useCallback(
    (isHiddenView: boolean) => {
      setSearchParams({ hiddenView: isHiddenView ? "true" : "" });
    },
    [setSearchParams],
  );
  return [!!hiddenView, setFirstPlayer];
}

export function useSearchParams(): [
  SearchParams,
  (nextSearchParams: Partial<SearchParams>) => void,
] {
  const [_search, _setSearch] = useRouterSearchParams();
  const search = useMemo(
    () =>
      Object.fromEntries(searchParamKeys.map((q) => [q, _search.get(q) ?? ""])),
    [_search],
  ) as SearchParams;
  const setSearchParams = useCallback(
    (nextSearchParams: Partial<SearchParams>) => {
      _setSearch(
        (oldSearch) =>
          new URLSearchParams(
            searchParamsString({
              ...(Object.fromEntries(oldSearch.entries()) as SearchParams),
              ...nextSearchParams,
            }),
          ),
      );
    },
    [_setSearch],
  );
  return [search, setSearchParams];
}

export function useSafeNavigate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const safeNavigate = useCallback(
    (url: Route, searchParamChanges?: Partial<SearchParams>) => {
      navigate(urlFromBase(url, { ...searchParams, ...searchParamChanges }));
    },
    [navigate, searchParams],
  );
  return safeNavigate;
}

export function useSearchString() {
  const [searchParams] = useSearchParams();
  const getSearchString = useCallback(
    (changedSearchParams: Partial<SearchParams>) => {
      searchParamsString({ ...searchParams, ...changedSearchParams });
    },
    [searchParams],
  );

  return getSearchString;
}
