# Shared-Device Multi-Player Registration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow a single device to register multiple players in sequence and switch between them on demand, as a fallback for in-person play when not every attendee has a phone.

**Architecture:** Client-only change. Add a new localStorage key `${gameId}_coregistered` (a JSON array of player names registered on this device) alongside the existing `${gameId}_player` (active player). Convert the player route to nested routing with a dedicated `/game/add` route. Add a `PlayerSwitcher` component for changing the active player on-device. Server APIs remain unchanged.

**Tech Stack:** React 18, react-router-dom, vitest + @testing-library/react, Playwright (E2Es), tRPC client, Radix UI.

---

## File Structure

**Create:**

- `client/src/store/useCoregisteredPlayers.ts` — hook backed by `useLocalStorage` that exposes the per-game co-registered list, with back-compat read and pruning helpers.
- `client/src/PlayerRoute/PlayerSwitcher.tsx` — UI for choosing the active player or jumping to the add route.
- `client/test/useCoregisteredPlayers.spec.tsx` — unit tests for the new hook.
- `client/test/PlayerSwitcher.spec.tsx` — component tests for visibility, selection, and "Add Another Player" navigation.

**Modify:**

- `client/src/store/usePlayer.ts` — `setPlayer(name)` now also appends `name` to the co-registered list when non-null.
- `client/src/PlayerRoute/index.tsx` — turn the route into a nested `<Routes>` block with `/` and `/add`.
- `client/src/PlayerRoute/PlayerLanding.tsx` — drop the embedded `<AddPlayer />` branch (replaced by route guard / redirect), render `<PlayerSwitcher />` at the top, prune kicked players from the co-registered list.
- `client/src/PlayerRoute/PlayerJoining/AddPlayer.tsx` — render `<PlayerSwitcher />`, navigate to `/game/` after a successful submit.
- `client/src/PlayerRoute/PlayerSetup/index.tsx` — make co-registered problem players clickable in the "waiting on" message so the holder can switch directly to them.
- `e2es/tests/helpers/clickthroughHelpers.ts` — add helpers `addCoregisteredPlayer` and `switchActivePlayer`.
- `e2es/tests/playerTests.spec.ts` — add the shared-device multi-player E2E test.

---

## Conventions

- All commits use this footer:
  ```
  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
  ```
- Tests live in `client/test/` (vitest + jsdom). Use the existing `render` helper from `client/test/testUtils.tsx`, which wraps with the `UnifiedGameContext.Provider`.
- For tests that need router context, wrap in `<MemoryRouter>` from `react-router-dom`.
- Run client tests with: `pnpm --filter @hidden-identity/client run vitest <path>`
- Run client typecheck with: `pnpm --filter @hidden-identity/client run type-check`
- E2Es require the dev server running. Run a single E2E with: `pnpm --filter e2es exec playwright test tests/playerTests.spec.ts -g "<test name>"`
- The repo's pre-commit hook runs lint-staged (prettier, eslint) and `pnpm run type-check`. Don't bypass it.

---

## Task 1: Add `useCoregisteredPlayers` hook

**Files:**

- Create: `client/src/store/useCoregisteredPlayers.ts`
- Create: `client/test/useCoregisteredPlayers.spec.tsx`

This hook reads/writes the JSON array stored at `${gameId}_coregistered`. It also provides a back-compat read: when no co-registered list is stored but `${gameId}_player` is set, it returns `[player]`.

- [ ] **Step 1: Write the failing tests**

Create `client/test/useCoregisteredPlayers.spec.tsx`:

```tsx
import { act, renderHook } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { type GameContext, UnifiedGameContext } from "../src/store/GameContext";
import { useCoregisteredPlayers } from "../src/store/useCoregisteredPlayers";

const GAME_ID = "TEST-GAME";

function wrapper({ children }: { children: React.ReactNode }) {
  const ctx: GameContext = { gameId: GAME_ID, game: null };
  return (
    <UnifiedGameContext.Provider value={ctx}>
      {children}
    </UnifiedGameContext.Provider>
  );
}

describe("useCoregisteredPlayers", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  test("returns empty list when nothing is stored", () => {
    const { result } = renderHook(() => useCoregisteredPlayers(), { wrapper });
    expect(result.current[0]).toEqual([]);
  });

  test("back-compat: returns [player] when only legacy _player is set", () => {
    localStorage.setItem(`${GAME_ID}_player`, "alice");
    const { result } = renderHook(() => useCoregisteredPlayers(), { wrapper });
    expect(result.current[0]).toEqual(["alice"]);
  });

  test("addCoregistered appends a name", () => {
    const { result } = renderHook(() => useCoregisteredPlayers(), { wrapper });
    act(() => {
      result.current[1]("alice");
    });
    expect(result.current[0]).toEqual(["alice"]);
    act(() => {
      result.current[1]("bob");
    });
    expect(result.current[0]).toEqual(["alice", "bob"]);
  });

  test("addCoregistered is idempotent", () => {
    const { result } = renderHook(() => useCoregisteredPlayers(), { wrapper });
    act(() => {
      result.current[1]("alice");
      result.current[1]("alice");
    });
    expect(result.current[0]).toEqual(["alice"]);
  });

  test("removeCoregistered strips the name", () => {
    const { result } = renderHook(() => useCoregisteredPlayers(), { wrapper });
    act(() => {
      result.current[1]("alice");
      result.current[1]("bob");
      result.current[2]("alice");
    });
    expect(result.current[0]).toEqual(["bob"]);
  });

  test("falls back to [_player] when stored value is unparseable", () => {
    localStorage.setItem(`${GAME_ID}_coregistered`, "{not-json");
    localStorage.setItem(`${GAME_ID}_player`, "alice");
    const { result } = renderHook(() => useCoregisteredPlayers(), { wrapper });
    expect(result.current[0]).toEqual(["alice"]);
  });

  test("falls back to [] when stored value is unparseable and no _player set", () => {
    localStorage.setItem(`${GAME_ID}_coregistered`, "{not-json");
    const { result } = renderHook(() => useCoregisteredPlayers(), { wrapper });
    expect(result.current[0]).toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `pnpm --filter @hidden-identity/client run vitest test/useCoregisteredPlayers.spec.tsx`
Expected: FAIL — "Cannot find module ../src/store/useCoregisteredPlayers"

- [ ] **Step 3: Implement the hook**

Create `client/src/store/useCoregisteredPlayers.ts`:

```ts
import { useCallback } from "react";

import { useGame } from "./GameContext";
import { useLocalStorage } from "./useLocalStorage";
import { useTestPlayerKey } from "./url";

type SetCoregistered = (name: string) => void;

export function useCoregisteredPlayers(): [
  list: string[],
  add: SetCoregistered,
  remove: SetCoregistered,
] {
  const { gameId } = useGame();
  const testPlayerKey = useTestPlayerKey();
  const scope = gameId ? `${gameId}${testPlayerKey ?? ""}` : null;
  const coregKey = scope ? `${scope}_coregistered` : null;
  const playerKey = scope ? `${scope}_player` : null;

  const [coregRaw, setCoregRaw] = useLocalStorage(coregKey);
  const [playerRaw] = useLocalStorage(playerKey);

  const list = parseList(coregRaw, playerRaw);

  const add = useCallback<SetCoregistered>(
    (name) => {
      const current = parseList(coregRaw, playerRaw);
      if (current.includes(name)) return;
      setCoregRaw(JSON.stringify([...current, name]));
    },
    [coregRaw, playerRaw, setCoregRaw],
  );

  const remove = useCallback<SetCoregistered>(
    (name) => {
      const current = parseList(coregRaw, playerRaw);
      const next = current.filter((n) => n !== name);
      setCoregRaw(next.length === 0 ? null : JSON.stringify(next));
    },
    [coregRaw, playerRaw, setCoregRaw],
  );

  return [list, add, remove];
}

function parseList(
  coregRaw: string | null,
  playerRaw: string | null,
): string[] {
  if (coregRaw) {
    try {
      const parsed = JSON.parse(coregRaw);
      if (Array.isArray(parsed) && parsed.every((v) => typeof v === "string")) {
        return parsed;
      }
    } catch {
      // fall through to back-compat
    }
  }
  return playerRaw ? [playerRaw] : [];
}
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `pnpm --filter @hidden-identity/client run vitest test/useCoregisteredPlayers.spec.tsx`
Expected: PASS, all 7 tests green.

- [ ] **Step 5: Run typecheck**

Run: `pnpm --filter @hidden-identity/client run type-check`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add client/src/store/useCoregisteredPlayers.ts client/test/useCoregisteredPlayers.spec.tsx
git commit -m "$(cat <<'EOF'
Add useCoregisteredPlayers hook for shared-device player registration

Backed by localStorage at ${gameId}_coregistered. Includes back-compat
read for devices that only have the legacy ${gameId}_player key set.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Update `usePlayer.setPlayer` to maintain co-registered list

**Files:**

- Modify: `client/src/store/usePlayer.ts`
- Create: `client/test/usePlayer.spec.tsx`

When `setPlayer` is called with a non-null name, that name should be ensured in the co-registered list. Setting null does not modify the co-registered list.

- [ ] **Step 1: Write the failing test**

Create `client/test/usePlayer.spec.tsx`:

```tsx
import { act, renderHook } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { type GameContext, UnifiedGameContext } from "../src/store/GameContext";
import { useCoregisteredPlayers } from "../src/store/useCoregisteredPlayers";
import { usePlayer } from "../src/store/usePlayer";

const GAME_ID = "TEST-GAME";

function wrapper({ children }: { children: React.ReactNode }) {
  const ctx: GameContext = { gameId: GAME_ID, game: null };
  return (
    <UnifiedGameContext.Provider value={ctx}>
      {children}
    </UnifiedGameContext.Provider>
  );
}

describe("usePlayer.setPlayer", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  test("setting a player adds them to coregistered", () => {
    const { result } = renderHook(
      () => ({ player: usePlayer(), coreg: useCoregisteredPlayers() }),
      { wrapper },
    );

    act(() => {
      result.current.player[1]("alice");
    });

    expect(result.current.player[0]).toBe("alice");
    expect(result.current.coreg[0]).toEqual(["alice"]);
  });

  test("setting a second player appends to coregistered", () => {
    const { result } = renderHook(
      () => ({ player: usePlayer(), coreg: useCoregisteredPlayers() }),
      { wrapper },
    );

    act(() => {
      result.current.player[1]("alice");
    });
    act(() => {
      result.current.player[1]("bob");
    });

    expect(result.current.player[0]).toBe("bob");
    expect(result.current.coreg[0]).toEqual(["alice", "bob"]);
  });

  test("setting null does not modify coregistered", () => {
    const { result } = renderHook(
      () => ({ player: usePlayer(), coreg: useCoregisteredPlayers() }),
      { wrapper },
    );

    act(() => {
      result.current.player[1]("alice");
    });
    act(() => {
      result.current.player[1](null);
    });

    expect(result.current.player[0]).toBe(null);
    expect(result.current.coreg[0]).toEqual(["alice"]);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `pnpm --filter @hidden-identity/client run vitest test/usePlayer.spec.tsx`
Expected: FAIL — `expect(result.current.coreg[0]).toEqual(["alice"])` fails because `setPlayer` does not currently update the coregistered key.

- [ ] **Step 3: Update `usePlayer`**

Edit `client/src/store/usePlayer.ts`. Replace the `usePlayer` function with:

```ts
import { useCallback } from "react";

import { useGame } from "./GameContext";
import { useCoregisteredPlayers } from "./useCoregisteredPlayers";
import { useLocalStorage } from "./useLocalStorage";
import { useTestPlayerKey } from "./url";

export function usePlayer(): [string | null, (key: string | null) => void] {
  const { gameId } = useGame();
  const localhostKeyFromUrl = useTestPlayerKey();
  const localhostKey = gameId
    ? `${gameId}${localhostKeyFromUrl ?? ""}_player`
    : null;
  const [value, setValueRaw] = useLocalStorage(localhostKey);
  const [, addCoregistered] = useCoregisteredPlayers();

  const setValue = useCallback(
    (next: string | null) => {
      setValueRaw(next);
      if (next) {
        addCoregistered(next);
      }
    },
    [setValueRaw, addCoregistered],
  );

  return [value, setValue];
}
```

(Leave `useMe` and `useLastUsedName` unchanged.)

- [ ] **Step 4: Run all client tests, verify pass**

Run: `pnpm --filter @hidden-identity/client run vitest test/usePlayer.spec.tsx test/useCoregisteredPlayers.spec.tsx`
Expected: PASS, all tests green.

- [ ] **Step 5: Run typecheck**

Run: `pnpm --filter @hidden-identity/client run type-check`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add client/src/store/usePlayer.ts client/test/usePlayer.spec.tsx
git commit -m "$(cat <<'EOF'
Update usePlayer.setPlayer to track co-registered players

Setting a non-null player now ensures the name is present in the
device's co-registered list. Setting null leaves the list untouched.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Add the `PlayerSwitcher` component

**Files:**

- Create: `client/src/PlayerRoute/PlayerSwitcher.tsx`
- Create: `client/test/PlayerSwitcher.spec.tsx`

The switcher renders nothing when there is nothing meaningful to switch between:

- On `/game/add`: visible if `coregistered.length >= 1`.
- Anywhere else: visible if `coregistered.length >= 2`.

It shows the active player's name as a Radix dropdown trigger. Picking a name calls `setPlayer(name)`. Picking the "Add Another Player" entry navigates to `/game/add`.

- [ ] **Step 1: Write the failing tests**

Create `client/test/PlayerSwitcher.spec.tsx`:

```tsx
import { act, fireEvent } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { PlayerSwitcher } from "../src/PlayerRoute/PlayerSwitcher";
import { type GameContext, UnifiedGameContext } from "../src/store/GameContext";
import { render, screen } from "./testUtils";

const GAME_ID = "TEST-GAME";

function renderAt(initialPath: string, ui: React.ReactNode) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/game/*" element={ui} />
      </Routes>
    </MemoryRouter>,
    { gameContext: { gameId: GAME_ID, game: null } as GameContext },
  );
}

function seed({ coreg, player }: { coreg?: string[]; player?: string | null }) {
  if (coreg)
    localStorage.setItem(`${GAME_ID}_coregistered`, JSON.stringify(coreg));
  if (player) localStorage.setItem(`${GAME_ID}_player`, player);
}

describe("PlayerSwitcher", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  test("renders nothing on /game/ when only one player is registered", () => {
    seed({ coreg: ["alice"], player: "alice" });
    const { container } = renderAt("/game/", <PlayerSwitcher />);
    expect(container).toBeEmptyDOMElement();
  });

  test("renders on /game/ when multiple players are registered", () => {
    seed({ coreg: ["alice", "bob"], player: "alice" });
    renderAt("/game/", <PlayerSwitcher />);
    expect(screen.getByRole("button", { name: /alice/i })).toBeInTheDocument();
  });

  test("renders on /game/add when one player is registered", () => {
    seed({ coreg: ["alice"], player: "alice" });
    renderAt("/game/add", <PlayerSwitcher />);
    expect(screen.getByRole("button", { name: /alice/i })).toBeInTheDocument();
  });

  test("renders nothing on /game/add when no player is registered", () => {
    const { container } = renderAt("/game/add", <PlayerSwitcher />);
    expect(container).toBeEmptyDOMElement();
  });

  test("clicking a different player updates the active player", () => {
    seed({ coreg: ["alice", "bob"], player: "alice" });
    renderAt("/game/", <PlayerSwitcher />);

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /alice/i }));
    });
    act(() => {
      fireEvent.click(screen.getByRole("menuitem", { name: /bob/i }));
    });

    expect(localStorage.getItem(`${GAME_ID}_player`)).toBe("bob");
  });

  test("clicking 'Add Another Player' shows up as a menu item", () => {
    seed({ coreg: ["alice", "bob"], player: "alice" });
    renderAt("/game/", <PlayerSwitcher />);

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /alice/i }));
    });
    expect(
      screen.getByRole("menuitem", { name: /add another player/i }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `pnpm --filter @hidden-identity/client run vitest test/PlayerSwitcher.spec.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `PlayerSwitcher`**

Create `client/src/PlayerRoute/PlayerSwitcher.tsx`:

```tsx
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { BsPersonFill } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";

import { useCoregisteredPlayers } from "../store/useCoregisteredPlayers";
import { usePlayer } from "../store/usePlayer";

export function PlayerSwitcher() {
  const [activePlayer, setActivePlayer] = usePlayer();
  const [coregistered] = useCoregisteredPlayers();
  const location = useLocation();
  const navigate = useNavigate();

  const onAddRoute = location.pathname.endsWith("/add");
  const minToShow = onAddRoute ? 1 : 2;
  if (coregistered.length < minToShow) {
    return null;
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="soft" aria-label={activePlayer ?? "switch player"}>
          <BsPersonFill />
          <span className="ml-1 capitalize">{activePlayer ?? "—"}</span>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {coregistered.map((name) => (
          <DropdownMenu.Item
            key={name}
            onSelect={() => setActivePlayer(name)}
            disabled={name === activePlayer}
          >
            <span className="capitalize">{name}</span>
          </DropdownMenu.Item>
        ))}
        <DropdownMenu.Separator />
        <DropdownMenu.Item onSelect={() => navigate("/game/add")}>
          Add Another Player
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `pnpm --filter @hidden-identity/client run vitest test/PlayerSwitcher.spec.tsx`
Expected: PASS, all 6 tests green.

If the Radix `DropdownMenu` items are not rendered as `menuitem` role under jsdom (some Radix popovers portal outside of body), adjust the test to query by visible text instead of role: `screen.getByText(/bob/i)` and `screen.getByText(/add another player/i)`. Re-run.

- [ ] **Step 5: Run typecheck**

Run: `pnpm --filter @hidden-identity/client run type-check`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add client/src/PlayerRoute/PlayerSwitcher.tsx client/test/PlayerSwitcher.spec.tsx
git commit -m "$(cat <<'EOF'
Add PlayerSwitcher component for shared-device player swapping

Renders a dropdown of co-registered players plus an Add Another Player
entry. Hidden when there is nothing meaningful to switch between.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Make `useAddPlayer` return the joined name; convert `AddPlayer` to a route

**Files:**

- Modify: `client/src/store/actions/playerActions.ts`
- Modify: `client/src/PlayerRoute/PlayerJoining/AddPlayer.tsx`

`useAddPlayer`'s underlying action is changed to return the joined player name on success (and `undefined` on error, via `useAction`'s catch path). This gives the caller a clear success signal.

`AddPlayer` becomes a routed component: after a successful join (or "Yes, that's me!" rejoin), it navigates to `/game/`. It also renders `PlayerSwitcher` so the holder can switch back to an already-registered player without typing a new name.

- [ ] **Step 1: Update `useAddPlayer` to return the player name**

In `client/src/store/actions/playerActions.ts`, change `useAddPlayer` to:

```ts
export function useAddPlayer() {
  const { gameId } = useGame();
  const [, setPlayer] = usePlayer();

  return useAction(async (player: string) => {
    if (!gameId) {
      throw new Error("GameId not ready");
    }

    await trpc.addPlayer.mutate({ player, gameId });
    setPlayer(player);
    return player;
  });
}
```

- [ ] **Step 2: Update `AddPlayer.tsx`**

Replace the contents of `client/src/PlayerRoute/PlayerJoining/AddPlayer.tsx` with:

```tsx
import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";
import { Callout, Flex, Text, TextField } from "@radix-ui/themes";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAddPlayer } from "../../store/actions/playerActions";
import { useDefiniteGame } from "../../store/GameContext";
import { useLastUsedName, usePlayer } from "../../store/usePlayer";
import { PlayerSwitcher } from "../PlayerSwitcher";

function AddPlayer() {
  const { game } = useDefiniteGame();
  const navigate = useNavigate();

  const [, setPlayer] = usePlayer();
  const [lastUsedName, setLastUsedName] = useLastUsedName();
  const [name, setName] = React.useState(lastUsedName ?? "");
  const [rejoinOpen, setRejoinOpen] = useState(false);
  const [error, isLoading, , addPlayer] = useAddPlayer();
  const parsedName = name.trim().toLowerCase();

  const taken = !!game.playersToRoles[parsedName];

  const handleSubmit = async () => {
    if (isLoading) {
      return;
    }

    if (taken) {
      setRejoinOpen(true);
      return;
    }

    setLastUsedName(parsedName);
    const result = await addPlayer(parsedName);
    if (result) {
      navigate("/game/");
    }
  };

  return (
    <Flex direction="column" gap="2" className="p-2">
      <Flex justify="end">
        <PlayerSwitcher />
      </Flex>
      <Callout.Root color="violet">
        <Callout.Text>
          Welcome to a Hidden-Identity.Game! Your storyteller has invited you to
          play. Please enter the name your storyteller knows you best by, maybe
          with a last initial too.
        </Callout.Text>
      </Callout.Root>
      <Flex direction="column" gap="2" className="p-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit();
          }}
        >
          <label htmlFor="name-input">NAME:</label>
          <TextField.Input
            autoFocus
            id="name-input"
            className="capitalize"
            placeholder="Player name..."
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
          />
        </form>

        <Dialog.Root
          open={rejoinOpen}
          onOpenChange={() => setRejoinOpen(false)}
        >
          <Dialog.Content className="m-2">
            <Text as="div">
              That name already exists, have you already joined and would like
              to rejoin?
            </Text>
            <Dialog.Footer>
              <Dialog.Close asChild>
                <Button variant="secondary">No, I will pick a new name</Button>
              </Dialog.Close>
              <Button
                onClick={() => {
                  setPlayer(parsedName);
                  navigate("/game/");
                }}
              >
                Yes, that's me!
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
        {error && (
          <div>
            {error.match(/taken/)
              ? "Try another name, cause someone took yours."
              : "There was an error, please try again."}
          </div>
        )}

        <Button className="mt-2" onClick={() => void handleSubmit()}>
          Join
        </Button>
      </Flex>
    </Flex>
  );
}

export default AddPlayer;
```

- [ ] **Step 3: Run typecheck**

Run: `pnpm --filter @hidden-identity/client run type-check`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add client/src/store/actions/playerActions.ts client/src/PlayerRoute/PlayerJoining/AddPlayer.tsx
git commit -m "$(cat <<'EOF'
Wire AddPlayer to navigate to /game/ after join and render PlayerSwitcher

useAddPlayer's action now returns the joined player name on success,
giving the caller a clear success signal. AddPlayer uses that signal
to navigate to /game/ after join (or after "Yes, that's me!" rejoin).
PlayerSwitcher is rendered at the top so the holder can switch back to
an existing co-registered player without joining a new one.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Restructure `PlayerRoute` to use nested routes

**Files:**

- Modify: `client/src/PlayerRoute/index.tsx`
- Modify: `client/src/PlayerRoute/PlayerLanding.tsx`

`PlayerRoute` becomes a nested `<Routes>` block with `index` → `PlayerLanding` and `add` → `AddPlayer`. `PlayerLanding` drops the embedded `<AddPlayer />` branch and instead renders `<Navigate to="add" replace />` when the active player is missing or no longer in the game.

- [ ] **Step 1: Update `PlayerRoute/index.tsx`**

Replace the contents of `client/src/PlayerRoute/index.tsx` with:

```tsx
import { Route, Routes } from "react-router-dom";

import AddPlayer from "./PlayerJoining/AddPlayer";
import { PlayerLanding } from "./PlayerLanding";

export function PlayerRoute() {
  return (
    <Routes>
      <Route index Component={PlayerLanding} />
      <Route path="add" Component={AddPlayer} />
    </Routes>
  );
}
```

- [ ] **Step 2: Update `PlayerLanding.tsx`**

Replace the contents of `client/src/PlayerRoute/PlayerLanding.tsx` with:

```tsx
import { Callout, Flex } from "@radix-ui/themes";
import { Navigate } from "react-router-dom";

import { LoadingExperience } from "../shared/LoadingExperience";
import { useGame } from "../store/GameContext";
import { usePlayer } from "../store/usePlayer";
import { PlayerInGame } from "./PlayerInGame/PlayerInGame";
import { PlayerSwitcher } from "./PlayerSwitcher";
import { PlayerWaiting } from "./PlayerSetup";
import { PlayerRole } from "./PlayerSetup/PlayerRole";
import { PlayerRoleSelect } from "./PlayerSetup/PlayerRoleSelect";

export function PlayerLanding() {
  const [player] = usePlayer();
  const { game } = useGame();
  const role = (player && game?.playersToRoles[player]) ?? null;

  if (!game) return <LoadingExperience>Loading...</LoadingExperience>;

  if (!player || !game.playerList.includes(player)) {
    return (
      <>
        {player && !role && (
          <Callout.Root>
            <Callout.Text>
              It looks like you were kicked from the game, consult the
              Storyteller before rejoining.
            </Callout.Text>
          </Callout.Root>
        )}
        <Navigate to="add" replace />
      </>
    );
  }

  return (
    <Flex direction="column" className="h-full">
      <Flex justify="end" className="p-1">
        <PlayerSwitcher />
      </Flex>
      <div className="flex flex-1 flex-col">{renderActiveView()}</div>
    </Flex>
  );

  function renderActiveView() {
    if (
      game!.travelers[player!] &&
      !game!.partialPlayerOrdering[player!]?.rightNeighbor
    ) {
      return <PlayerWaiting />;
    }

    if (game!.gameStatus === "PlayersJoining") {
      return <PlayerWaiting />;
    }

    if (!game!.playersSeenRoles.includes(player!)) {
      if (!role || role === "unassigned") {
        return <PlayerRoleSelect />;
      }
      return <PlayerRole role={role} />;
    }

    return <PlayerInGame />;
  }
}
```

- [ ] **Step 3: Run typecheck**

Run: `pnpm --filter @hidden-identity/client run type-check`
Expected: PASS.

- [ ] **Step 4: Run all client tests, verify pass**

Run: `pnpm --filter @hidden-identity/client run vitest`
Expected: PASS.

- [ ] **Step 5: Manual smoke test (single-player flow unchanged)**

Start the dev server (`pnpm dev` from repo root) and:

1. Create a new game from `/`.
2. From a fresh browser tab, open `/game/?gameId=<gameId>`.
3. Verify it redirects to `/game/add`.
4. Type a name and click Join. Verify the URL becomes `/game/` and the post-join view is shown.
5. Refresh — verify it stays on `/game/` (no redirect loop).

If anything is broken, fix it before continuing.

- [ ] **Step 6: Commit**

```bash
git add client/src/PlayerRoute/index.tsx client/src/PlayerRoute/PlayerLanding.tsx
git commit -m "$(cat <<'EOF'
Move AddPlayer onto its own /game/add route

PlayerRoute now uses a nested <Routes> block. PlayerLanding redirects
to /game/add when no active player is set or when the active player is
not in the game's player list. The PlayerSwitcher is rendered at the top
of the landing view.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Prune kicked players from co-registered list

**Files:**

- Modify: `client/src/PlayerRoute/PlayerLanding.tsx`
- Create: `client/test/PlayerLanding.spec.tsx`

Add a `useEffect` in `PlayerLanding` that prunes from `_coregistered` any name not in `game.playerList`. If pruning removes the active player, fall back to `coregistered[0]`. If `coregistered` becomes empty, set the active player to `null` (the existing redirect handles the rest).

- [ ] **Step 1: Write the failing test**

Create `client/test/PlayerLanding.spec.tsx`:

```tsx
import { type UnifiedGame } from "@hidden-identity/shared";
import { waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { PlayerLanding } from "../src/PlayerRoute/PlayerLanding";
import { type GameContext, UnifiedGameContext } from "../src/store/GameContext";
import { render } from "./testUtils";

const GAME_ID = "TEST-GAME";

function makeGame(playerList: string[]): Partial<UnifiedGame> {
  const playersToRoles = Object.fromEntries(
    playerList.map((p) => [p, "unassigned"]),
  );
  return {
    playerList,
    playersToRoles,
    travelers: {},
    partialPlayerOrdering: {},
    playersSeenRoles: [],
    gameStatus: "PlayersJoining",
    orderedPlayers: { fullList: playerList, problems: false } as never,
    estimatedPlayerCount: playerList.length,
    setupRoleSet: {},
  };
}

function renderLanding(game: Partial<UnifiedGame>) {
  const ctx: GameContext = { gameId: GAME_ID, game: game as UnifiedGame };
  return render(
    <MemoryRouter initialEntries={["/game/"]}>
      <Routes>
        <Route path="/game/*" element={<PlayerLanding />} />
        <Route path="*" element={<div data-testid="redirected" />} />
      </Routes>
    </MemoryRouter>,
    { gameContext: ctx },
  );
}

describe("PlayerLanding pruning", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  test("removes a kicked player from coregistered", async () => {
    localStorage.setItem(
      `${GAME_ID}_coregistered`,
      JSON.stringify(["alice", "bob"]),
    );
    localStorage.setItem(`${GAME_ID}_player`, "alice");

    renderLanding(makeGame(["alice"])); // bob was kicked

    await waitFor(() => {
      const stored = localStorage.getItem(`${GAME_ID}_coregistered`);
      expect(JSON.parse(stored!)).toEqual(["alice"]);
    });
  });

  test("falls back to first coregistered when active player is kicked", async () => {
    localStorage.setItem(
      `${GAME_ID}_coregistered`,
      JSON.stringify(["alice", "bob"]),
    );
    localStorage.setItem(`${GAME_ID}_player`, "alice");

    renderLanding(makeGame(["bob"])); // alice was kicked

    await waitFor(() => {
      expect(localStorage.getItem(`${GAME_ID}_player`)).toBe("bob");
      const stored = localStorage.getItem(`${GAME_ID}_coregistered`);
      expect(JSON.parse(stored!)).toEqual(["bob"]);
    });
  });

  test("clears active player when all coregistered are kicked", async () => {
    localStorage.setItem(`${GAME_ID}_coregistered`, JSON.stringify(["alice"]));
    localStorage.setItem(`${GAME_ID}_player`, "alice");

    renderLanding(makeGame([])); // everyone kicked

    await waitFor(() => {
      expect(localStorage.getItem(`${GAME_ID}_player`)).toBe(null);
    });
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `pnpm --filter @hidden-identity/client run vitest test/PlayerLanding.spec.tsx`
Expected: FAIL — pruning is not yet implemented.

- [ ] **Step 3: Add pruning effect to `PlayerLanding`**

In `client/src/PlayerRoute/PlayerLanding.tsx`, replace the existing imports/setup at the top with:

```tsx
import { Callout, Flex } from "@radix-ui/themes";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { LoadingExperience } from "../shared/LoadingExperience";
import { useGame } from "../store/GameContext";
import { useCoregisteredPlayers } from "../store/useCoregisteredPlayers";
import { usePlayer } from "../store/usePlayer";
import { PlayerInGame } from "./PlayerInGame/PlayerInGame";
import { PlayerSwitcher } from "./PlayerSwitcher";
import { PlayerWaiting } from "./PlayerSetup";
import { PlayerRole } from "./PlayerSetup/PlayerRole";
import { PlayerRoleSelect } from "./PlayerSetup/PlayerRoleSelect";
```

Then, inside `PlayerLanding`, add the pruning effect after the `useGame` / `usePlayer` calls but before the `if (!game)` early return:

```tsx
const [player, setPlayer] = usePlayer();
const [coregistered, , removeCoregistered] = useCoregisteredPlayers();
const { game } = useGame();
const role = (player && game?.playersToRoles[player]) ?? null;

useEffect(() => {
  if (!game) return;
  const stale = coregistered.filter((n) => !game.playerList.includes(n));
  if (stale.length === 0) return;
  stale.forEach((n) => removeCoregistered(n));
  if (player && stale.includes(player)) {
    const fallback = coregistered.find(
      (n) => !stale.includes(n) && game.playerList.includes(n),
    );
    setPlayer(fallback ?? null);
  }
}, [game, coregistered, player, removeCoregistered, setPlayer]);
```

(Update the destructuring of `usePlayer` from `[player]` to `[player, setPlayer]`.)

- [ ] **Step 4: Run test, verify it passes**

Run: `pnpm --filter @hidden-identity/client run vitest test/PlayerLanding.spec.tsx`
Expected: PASS, all 3 tests green.

- [ ] **Step 5: Run all client tests**

Run: `pnpm --filter @hidden-identity/client run vitest`
Expected: PASS.

- [ ] **Step 6: Run typecheck**

Run: `pnpm --filter @hidden-identity/client run type-check`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add client/src/PlayerRoute/PlayerLanding.tsx client/test/PlayerLanding.spec.tsx
git commit -m "$(cat <<'EOF'
Prune kicked players from a device's co-registered list

PlayerLanding watches game.playerList and removes any co-registered
name no longer in the game. If the active player is pruned, fall back
to the first remaining co-registered player; if none remain, clear the
active player so the route guard redirects to /game/add.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Make co-registered seating-problem players clickable in `PlayerWaiting`

**Files:**

- Modify: `client/src/PlayerRoute/PlayerSetup/index.tsx`

When the seating-problems message lists other players holding up the circle, any of them that are co-registered on this device should render as a button that calls `setPlayer(name)` to switch to that player immediately.

- [ ] **Step 1: Update `PlayerWaiting`**

In `client/src/PlayerRoute/PlayerSetup/index.tsx`, add the imports:

```tsx
import { Button } from "@design-system/components/button";

import { useCoregisteredPlayers } from "../../store/useCoregisteredPlayers";
import { usePlayer } from "../../store/usePlayer";
```

Inside the `PlayerWaiting` component (after the existing `const myName = useMe();` line), add:

```tsx
const [, setActivePlayer] = usePlayer();
const [coregistered] = useCoregisteredPlayers();
```

Then replace the JSX block that renders `playersWithSeatingProblems`:

```tsx
{
  playersWithSeatingProblems && (
    <Callout.Root color="purple">
      <Callout.Icon></Callout.Icon>
      <Callout.Text className="text-center">
        Waiting on
        <Text className="block capitalize" color="orange">
          {playersWithSeatingProblems.join(", ")}
        </Text>
      </Callout.Text>
    </Callout.Root>
  );
}
```

with:

```tsx
{
  playersWithSeatingProblems && (
    <Callout.Root color="purple">
      <Callout.Icon></Callout.Icon>
      <Callout.Text className="text-center">
        Waiting on
        <Flex
          direction="row"
          gap="2"
          wrap="wrap"
          justify="center"
          className="mt-1"
        >
          {playersWithSeatingProblems.map((p) =>
            coregistered.includes(p) ? (
              <Button
                key={p}
                variant="secondary"
                className="capitalize"
                onClick={() => setActivePlayer(p)}
              >
                {p}
              </Button>
            ) : (
              <Text key={p} className="capitalize" color="orange">
                {p}
              </Text>
            ),
          )}
        </Flex>
      </Callout.Text>
    </Callout.Root>
  );
}
```

- [ ] **Step 2: Run typecheck**

Run: `pnpm --filter @hidden-identity/client run type-check`
Expected: PASS.

- [ ] **Step 3: Run all client tests**

Run: `pnpm --filter @hidden-identity/client run vitest`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add client/src/PlayerRoute/PlayerSetup/index.tsx
git commit -m "$(cat <<'EOF'
Make co-registered problem players a switch button in PlayerWaiting

Players blocking the seating circle that are co-registered on this
device render as a button that switches the active player to them so
the holder can fix their seating without navigating away.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Add E2E test for the shared-device flow

**Files:**

- Modify: `e2es/tests/helpers/clickthroughHelpers.ts`
- Modify: `e2es/tests/playerTests.spec.ts`

The test creates a game, joins as Alice on a single page, uses the switcher's "Add Another Player" action to join as Bob on the same page, switches between them, has each acknowledge their role, and verifies the game advances to Setup.

- [ ] **Step 1: Add helpers**

In `e2es/tests/helpers/clickthroughHelpers.ts`, add to the `ClickthroughModel` object (alongside the existing helpers):

```ts
addCoregisteredPlayer: async function addCoregisteredPlayer(
  page: Page,
  name: string,
) {
  // Open the player switcher and select "Add Another Player"
  await page.getByRole("button", { name: /switch player|.+/i }).first().click();
  await page.getByRole("menuitem", { name: /add another player/i }).click();
  await page.waitForURL(/\/game\/add/);
  await page.getByRole("textbox", { name: "name" }).fill(name);
  await page.getByRole("button", { name: "Join" }).click();
  await page.waitForURL((url) => url.pathname.endsWith("/game/"));
},

switchActivePlayer: async function switchActivePlayer(page: Page, name: string) {
  await page.getByRole("button").filter({ hasText: /[a-z]/i }).first().click();
  await page.getByRole("menuitem", { name: new RegExp(name, "i") }).click();
},
```

(If the existing switcher trigger button selector turns out to be ambiguous in practice, replace the locator with `page.getByLabel(<active-player-name>)`. Adjust during the run.)

- [ ] **Step 2: Add the E2E test**

In `e2es/tests/playerTests.spec.ts`, add at the end of the file:

```ts
test("single device registers multiple players and switches between them", async ({
  page,
  context,
}) => {
  const script = "Trouble Brewing";
  const { gameId } = await QuickSetupHelpers.createNewGame(getScript(script));

  // Alice joins from the shared device
  await ClickthroughModel.joinGameAs(page, gameId, "alice");
  await page.getByText(/Hello alice/i).waitFor({ timeout: 4000 });

  // Add Bob via the switcher's "Add Another Player"
  await ClickthroughModel.addCoregisteredPlayer(page, "bob");
  await page.getByText(/Hello bob/i).waitFor({ timeout: 4000 });

  // Switch back to Alice
  await ClickthroughModel.switchActivePlayer(page, "alice");
  await page.getByText(/Hello alice/i).waitFor({ timeout: 4000 });

  // Set seating: alice -> bob, bob -> alice
  await page.getByRole("button", { name: "bob", exact: true }).click();
  await ClickthroughModel.switchActivePlayer(page, "bob");
  await page.getByRole("button", { name: "alice", exact: true }).click();

  // GM fills the role bag and progresses to Setup
  await QuickSetupHelpers.fillRoleBag({
    script: getScript(script),
    gameId,
    playerCount: 2,
  });

  // Each player reveals + acknowledges their role on the same page
  for (const [idx, name] of ["alice", "bob"].entries()) {
    await ClickthroughModel.switchActivePlayer(page, name);
    await page
      .getByRole("button", { name: `Role number ${idx + 1}`, exact: true })
      .click();
    await page.getByRole("button", { name: /reveal role/i }).click();
    await page.getByRole("button", { name: /i know my role/i }).click();
  }

  const { gameStatus } = await trpc.getGame.query({ gameId });
  expect(gameStatus).toBe("Setup");
});
```

- [ ] **Step 3: Run the E2E test**

In one terminal: `pnpm dev` (start the dev server).
In another: `pnpm --filter e2es exec playwright test tests/playerTests.spec.ts -g "single device registers multiple players"`

Expected: PASS.

If it fails:

- Use `--headed` and `--ui` to inspect.
- The most likely sources of failure are switcher selector specifics (Radix dropdowns under Playwright); inspect `await page.pause()` and adjust the locator in the helper accordingly.
- Trouble Brewing's role bag distribution may not allow only 2 players. If `fillRoleBag` errors, change the player count to the minimum supported (5) and add the additional players via `QuickSetupHelpers.addPlayerToGame(gameId, "filler1")` etc., so that the setup is valid; the test still proves the shared-device flow with `alice` and `bob` for the registered-on-device portion.

- [ ] **Step 4: Commit**

```bash
git add e2es/tests/helpers/clickthroughHelpers.ts e2es/tests/playerTests.spec.ts
git commit -m "$(cat <<'EOF'
Add E2E for shared-device multi-player registration

Covers: single page joins as Alice, adds Bob via the switcher, switches
between them for seating, and acknowledges both roles before the game
progresses to Setup.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: End-to-end manual smoke test and final verification

**Files:** none.

- [ ] **Step 1: Run full client test suite**

Run: `pnpm --filter @hidden-identity/client run test`
Expected: PASS (typecheck + lint + vitest).

- [ ] **Step 2: Run full E2E suite**

Run: `pnpm --filter e2es exec playwright test tests/playerTests.spec.ts`
Expected: PASS.

- [ ] **Step 3: Manual smoke walkthrough**

Start the dev server, then in a single browser tab:

1. Create a new game from `/`. Note the gameId.
2. Open `/game/?gameId=<id>` in a second tab. Verify redirect to `/game/add`.
3. Join as `alice`. Verify `Hello alice`.
4. Open the player switcher → "Add Another Player". Verify URL is `/game/add` and the switcher shows Alice as a switchable option.
5. Type `bob`, click Join. Verify URL returns to `/game/` and `Hello bob` is shown.
6. Switch to Alice via the switcher. Verify Alice's view, including her seating selector.
7. As Alice, pick Bob as right neighbor. Switch to Bob, pick Alice. Verify "Waiting on the storyteller to start" appears.
8. From the GM tab, fill the role bag and start the game.
9. On the player tab: switch to Alice, draw + reveal + acknowledge role. Switch to Bob, do the same.
10. Verify the player tab transitions to in-game (`PlayerInGame`), and the switcher remains usable to flip between Alice and Bob.

If anything looks off, file follow-ups; do not silently fix without re-running the test suite.

---

## Out of scope

- A separate "kiosk mode" that disables the device-owner concept.
- Bulk add UI (paste a list of names).
- GM-side "add player on behalf of" UI.
- Localization or copy polish for the AddPlayer view when the game is mid-way (Setup or Started).
