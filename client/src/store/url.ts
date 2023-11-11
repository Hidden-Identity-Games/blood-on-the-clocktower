import { filterObject } from "@hidden-identity/shared";
import { useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const queryParamKeys = [
  "gameId",
  "gmSecretHash",
  "firstSeat",
  "hiddenView",
] as const;
export type QueryParamKey = (typeof queryParamKeys)[number];
export type QueryParams = Record<QueryParamKey, string>;

export function useFirstSeat(): [string | undefined, (next: string) => void] {
  const [{ firstSeat }, setQueryParams] = useQueryParams();
  const setFirstPlayer = useCallback(
    (player: string) => {
      setQueryParams({ firstSeat: player });
    },
    [setQueryParams],
  );
  return [firstSeat ?? undefined, setFirstPlayer];
}

export function useGameId() {
  const [{ gameId }] = useQueryParams();
  return gameId?.toUpperCase() ?? null;
}

export function useGMSecretHash(): string | null {
  const [{ gmSecretHash }] = useQueryParams();
  return gmSecretHash ?? null;
}

export function useIsHiddenView(): [boolean, (next: boolean) => void] {
  const [{ hiddenView }, setQueryParams] = useQueryParams();
  const setFirstPlayer = useCallback(
    (isHiddenView: boolean) => {
      setQueryParams({ hiddenView: isHiddenView ? "true" : "" });
    },
    [setQueryParams],
  );
  return [!!hiddenView, setFirstPlayer];
}

export function useQueryParams(): [
  QueryParams,
  (nextQueryParams: Partial<QueryParams>) => void,
] {
  const [_query, _setQuery] = useSearchParams();
  const query = useMemo(
    () =>
      Object.fromEntries(queryParamKeys.map((q) => [q, _query.get(q) ?? ""])),
    [_query],
  ) as QueryParams;
  const setQueryParams = useCallback(
    (nextQueryParams: Partial<QueryParams>) => {
      _setQuery(
        (oldQuery) =>
          new URLSearchParams(
            Object.entries({
              ...Object.fromEntries(oldQuery.entries()),
              ...nextQueryParams,
            }).filter(([_, value]) => value),
          ),
      );
    },
    [_setQuery],
  );
  return [query, setQueryParams];
}

export function useSafeNavigate() {
  const navigate = useNavigate();
  const [queryParams] = useQueryParams();
  const safeNavigate = useCallback(
    (url: string, queryParamChanges?: Partial<QueryParams>) => {
      navigate(
        `${url}?${new URLSearchParams(
          filterObject(
            {
              ...queryParams,
              ...queryParamChanges,
            },
            ([_, v]) => !!v,
          ),
        ).toString()}`,
      );
    },
    [navigate, queryParams],
  );
  return safeNavigate;
}

export function useQueryString() {
  const [queryParams] = useQueryParams();
  const getQueryString = useCallback(
    (changedQueryParams: Partial<QueryParams>) => {
      return new URLSearchParams(
        filterObject(
          { ...queryParams, ...changedQueryParams },
          ([_, v]) => !!v,
        ),
      ).toString();
    },
    [queryParams],
  );

  return getQueryString;
}
