import { filterObject } from "@hidden-identity/shared";
import { useCallback, useMemo } from "react";
import {
  useNavigate,
  useSearchParams as useRouterSearchParams,
} from "react-router-dom";

const TopLevelSheets = ["message", "none"] as const;
const OpenClosed = ["open", "closed"] as const;
type TopLevelSheetKey = (typeof TopLevelSheets)[number];
type OpenClosedKey = (typeof OpenClosed)[number];
export type SheetView = `${TopLevelSheetKey}/${string}`;
export type ParsedSheetView = {
  type: TopLevelSheetKey;
  id: string;
  isOpen: "open" | "closed";
};
export const SHEET_CLOSED: ParsedSheetView = {
  type: "none",
  id: "",
  isOpen: "closed",
};
function isTopLevelSheetKey(str: string): str is TopLevelSheetKey {
  return (TopLevelSheets as readonly string[]).includes(str);
}
function isOpenClosed(str: string): str is OpenClosedKey {
  return (OpenClosed as readonly string[]).includes(str);
}
function parseSheetView(unparsed: string | undefined): ParsedSheetView | null {
  if (!unparsed) {
    return null;
  }

  const split = unparsed.split("/");
  if (split.length !== 3) {
    return null;
  }
  const [type, id, isOpen] = split;
  if (!isTopLevelSheetKey(type)) return null;
  if (!isOpenClosed(isOpen)) return null;
  return { type, id, isOpen };
}

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
  "sheetView",
] as const;
export type SearchParamKey = (typeof searchParamKeys)[number];
export type SearchParams = Partial<Record<SearchParamKey, string>>;

export const RESET_SEARCH_PARAMS: Record<SearchParamKey, undefined> = {
  firstSeat: undefined,
  gameId: undefined,
  gmSecretHash: undefined,
  hiddenView: undefined,
  sheetView: undefined,
  testPlayerKey: undefined,
};

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

export function useSheetView(): [
  ParsedSheetView,
  (next: ParsedSheetView) => void,
] {
  const [{ sheetView }, setSearchParams] = useSearchParams();
  const setSheetView = useCallback(
    (sheetView: ParsedSheetView) => {
      if (sheetView.type === "none") {
        setSearchParams({
          sheetView: undefined,
        });
      } else {
        setSearchParams({
          sheetView: `${sheetView.type}/${sheetView.id}/${sheetView.isOpen}`,
        });
      }
    },
    [setSearchParams],
  );
  const parsedSheet = useMemo(() => parseSheetView(sheetView), [sheetView]);

  return [parsedSheet ?? SHEET_CLOSED, setSheetView];
}
export function useSheetExpanded() {
  const [sheetView, setSheetView] = useSheetView();
  const setSheetExpanded = useCallback(
    (isOpen: boolean) => {
      setSheetView({
        ...sheetView,
        isOpen: isOpen ? "open" : "closed",
      });
    },
    [sheetView, setSheetView],
  );
  return [sheetView.isOpen === "open", setSheetExpanded] as const;
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
