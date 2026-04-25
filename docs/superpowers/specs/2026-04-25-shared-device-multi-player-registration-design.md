# Shared-Device Multi-Player Registration

## Problem

Today, every player must join the game from their own device. The first player to "join" on a device claims that device's localStorage slot for the game (`${gameId}_player`), and there is no UI affordance to register additional players from the same device. This blocks any in-person play scenario where one or more attendees do not have a phone available.

## Goal

Allow a single device to register multiple players in sequence, and let the device act as any of those registered players on demand (for seating, role reveal, voting, etc.). The intended primary use case is each player has their own device; this is a fallback for when one or more players do not.

## Non-goals

- Changing how the GM/storyteller view works.
- Server-side multi-player APIs (the existing `addPlayer` mutation is sufficient).
- Supporting role reveal or in-game actions for proxy-added players via any mechanism _other than_ the device they were registered on (e.g., no GM-side "show role to player X" feature).

## User flow

1. Alice opens the game URL on her phone, taps **Join**, types her name, submits.
2. Alice is now active on the device. She does her seating selection, etc.
3. Bob doesn't have a phone. Alice taps the player switcher → **Add Another Player**.
4. The AddPlayer view opens. Alice hands the phone to Bob, who types his name and submits.
5. Bob is now the active player on the device. Bob does his seating, can later see his role.
6. Bob (or Alice) opens the player switcher and picks Alice to act as her again.
7. The device's switcher always lists all players ever registered on it (Alice and Bob), and either of them can be made active at any time.
8. When the storyteller starts the game and roles are revealed, each registered player can be activated in turn to see their private role view and acknowledge it.

## Design

### Data model (client-only)

LocalStorage is extended from one key to two per game:

- `${gameId}_player` (existing) — the _currently active_ player on this device. Must be one of the names in `_coregistered` (when `_coregistered` is set).
- `${gameId}_coregistered` (new) — a JSON array of all player names ever registered from this device for this game. Always includes the current `_player`.

**Backward compatibility:** When reading `_coregistered` for a game that only has `_player` set (existing devices), treat it as `[_player]`. The list is materialized in storage on the next mutation (e.g., when "Add Another Player" is used).

**Pruning:** On every render of the player route, any name in `_coregistered` that is not present in `game.playerList` (e.g., kicked players) is removed. If pruning removes the active `_player`, the active player falls back to `_coregistered[0]`. If `_coregistered` becomes empty, `_player` is set to null and the route guard redirects to `/game/add`.

### Routing

`PlayerRoute` becomes a nested route block:

- `/game/` → `PlayerLanding` (existing logic, **minus** the unjoined branch). If `_player` is null OR `_player` is not in `game.playerList`, redirect to `/game/add`.
- `/game/add` → `AddPlayer` as a standalone route. After a successful join, navigate to `/game/`.

This means `PlayerLanding` no longer embeds `<AddPlayer />`. The unjoined branch is purely a route-level redirect.

### Components

#### `PlayerSwitcher` (new)

A small dropdown / picker control. Reads `_coregistered` and `_player` for the current game.

- Shows the active player's name as the trigger.
- Opens to a list of all co-registered players + an "Add Another Player" entry.
- Picking a player calls `setPlayer(name)`.
- Picking "Add Another Player" navigates to `/game/add`.
- Renders nothing when `_coregistered.length <= 1` AND we are not on `/game/add`. (On `/game/add`, the switcher is always visible whenever there is at least one already-registered player, so the user can change their mind and switch back to an existing player without adding a new one.)
- Rendered at the top of the player view in `PlayerLanding`'s output, AND at the top of `AddPlayer`. Single component, two render sites.

#### `AddPlayer` (modified)

- Now a routed component at `/game/add`. No longer embedded in `PlayerLanding`.
- Renders the `PlayerSwitcher` at the top (visible when at least one player is already co-registered on the device).
- Submission flow: server `addPlayer` mutation → on success, append the new name to `_coregistered`, set `_player` to the new name (so the just-added player becomes the device's active player), navigate to `/game/`.
- The existing "name already taken / Yes, that's me!" rejoin dialog is preserved unchanged. It works the same whether this is the first joiner or an Nth add.

#### `PlayerLanding` (modified)

- Drop the `if (!player || !game.playerList.includes(player))` branch that renders `<AddPlayer />`. Replace with a `<Navigate to="add" />` (or equivalent route guard).
- Render `PlayerSwitcher` at the top of the returned JSX, above the player-state-specific child (`PlayerWaiting`, `PlayerRoleSelect`, `PlayerRole`, or `PlayerInGame`).

#### `PlayerWaiting` (modified)

The existing `playersWithSeatingProblems` listing is enhanced:

- Each problem player is checked against `_coregistered`.
- Co-registered problem players are rendered as a button that calls `setPlayer(name)` to immediately switch to that player so the device holder can fix the seating.
- Non-co-registered problem players render as plain text (existing behavior).

### Hooks

#### `usePlayer` (modified)

Return signature unchanged. `setPlayer(name)` is updated so that:

- If `name` is non-null, it is also ensured present in `_coregistered` (idempotent append).
- If `name` is null, `_coregistered` is left untouched (clearing the active player does not unregister anyone).

#### `useCoregisteredPlayers` (new)

Returns `[coregisteredList, addCoregistered, removeCoregistered]`, backed by `useLocalStorage` with key `${gameId}_coregistered`.

- Read includes the back-compat branch: if storage value is empty/missing AND `_player` is set, return `[_player]`.
- `addCoregistered(name)` is idempotent (no duplicate names).
- `removeCoregistered(name)` strips the name; callers handle active-player fallback.

#### `useAddPlayer` (modified)

After successful server mutation:

- Calls `setPlayer(newName)` (which itself ensures `newName` is in `_coregistered`).
- The hook's return signature is unchanged.

### Server changes

None. The existing `addPlayer` tRPC mutation handles every case. The existing kick, seating, role-take, and role-acknowledge mutations work for any active player on the device without modification.

## Edge cases

- **Active player is kicked from the game.** Pruning removes them from `_coregistered`; the active player falls back to `_coregistered[0]`. UI re-renders as the new active player.
- **All registered players are kicked from the game.** `_coregistered` becomes empty, `_player` is cleared, route redirects to `/game/add`.
- **Two devices both register the same name.** Server-side `addPlayer` already rejects duplicates (the existing "name taken" path applies). On the second device, the existing rejoin dialog ("Yes, that's me!") still works and adds the name to that device's `_coregistered` as well — so the same name can legitimately appear in two devices' co-registered lists if explicitly rejoined.
- **Game is in Setup or later when "Add Another Player" is invoked.** The server's `addPlayerAction` already handles this: the player is added as a traveler. No extra client guard is required, but the AddPlayer view's copy may want a small note when joining mid-game (out of scope for this spec; handle as a polish follow-up if needed).
- **`_coregistered` deserialization fails (corrupted localStorage).** Fall back to `[_player]` (or `[]` if no `_player`).

## Testing

### Unit / integration tests (client)

- `useCoregisteredPlayers` — back-compat read (only `_player` set), append idempotency, remove behavior, corrupted-storage fallback.
- `usePlayer.setPlayer` — ensures the new name is added to `_coregistered`.
- `PlayerSwitcher` — visibility rules (`<= 1` registered, on/off `/game/add`), selecting a player calls `setPlayer`, "Add Another Player" navigates to `/game/add`.
- `PlayerLanding` route guard — redirects to `/game/add` when no active player, renders normally when active player is in game's player list, prunes kicked players from `_coregistered`.
- `PlayerWaiting` — co-registered problem players render as switch buttons; non-co-registered render as text.

### E2E test (`e2es/tests/playerTests.spec.ts`)

Add a test: **`single device registers multiple players and switches between them`**.

Flow:

1. Create a new game (GM page).
2. Open a single player page, join the game as `alice`. Verify `alice`'s `PlayerWaiting` view is visible.
3. From the player switcher, tap **Add Another Player**. URL is `/game/add`.
4. Type `bob`, submit. Verify the URL returns to `/game/` and that `bob`'s `PlayerWaiting` view is visible (e.g., `Hello bob` text).
5. From the player switcher, pick `alice`. Verify `alice`'s view is shown again (`Hello alice` text).
6. Pick `bob` again. Verify Bob's view.
7. As `bob`, set right neighbor to `alice`. Switch back to `alice`, set right neighbor to `bob`.
8. From GM, fill the role bag and progress to Setup (use `QuickSetupHelpers.fillRoleBag`).
9. On the player page, switch to `alice`, reveal and acknowledge her role. Switch to `bob`, reveal and acknowledge his role.
10. Verify the game advances (gameStatus becomes `Setup`).

This test proves the full shared-device flow: registration → seating → role reveal → both players acknowledged via a single page.

A helper may be added to `clickthroughHelpers.ts`, e.g. `addCoregisteredPlayer(page, name)` and `switchActivePlayer(page, name)`, to keep the test concise.

## Out of scope

- A "kiosk" mode that disables device-owner concepts entirely.
- Bulk-add ("paste a list of names") UI.
- GM-side "add player on behalf of" UI.
- Server APIs for multi-player session management.
