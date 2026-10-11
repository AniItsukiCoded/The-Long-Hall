# The Long Halls v4: multiplayer setup

No accounts, no server of your own. Everything runs on your Firebase Realtime Database.

## 1. Publish the database rules (required)
1. Firebase console, project **the-long-halls**, **Build, Realtime Database**.
2. Open the **Rules** tab, paste the contents of `database.rules.json`, press **Publish**.
   (Or with the CLI: `firebase deploy --only database`.)

The rules let anyone with a 5 character party code read and write that one party, validate the shape and size of everything, and give no access to anything else. The only listable data is `/pub`, the public party list (host nickname, player count, difficulty). The 4 player cap is enforced by the game client, since Firebase rules cannot count children.

**Re-publish the rules after updating to v4.1**: they now include the `/pub` list and the `pb` (public) flag.

## 2. Host the folder
Upload the whole `halls/` folder to any static host (GitHub Pages, Netlify, your site). Firebase's SDK is bundled in `js/vendor/`, so no extra CDN is needed besides three.js (already used before).
The database URL is already in `js/net.js` (`FB_CONFIG`).

## How it works
- **Multiplayer** on the main menu: enter a nickname, **Create party** (you get a 5 character code; parties are **public by default**, untick the box for a private one) or **Join** with a code, or pick a party from the public list. The host can switch public/private in the lobby. A public party is listed only while it waits in the lobby. Up to 4 players. The host picks difficulty and starts.
- Everyone gets the same halls (built from a shared seed), the same fuses, doors and items.
- Fuses and the exit are shared by the whole party. Items are first come, first served.
- The host's browser runs the Boiled One; everyone else follows him. If the host leaves or freezes, the next player takes over.
- Other players' held items are never shown or synced. Only inventory counts live on each player's own machine.
- If you are caught, everything you carried **drops** where you died, and you spectate a living player (click or A/D to switch).
- When everyone is dead, the next day starts. After day 5 it is game over. If anyone escapes, the run ends when everyone is dead or out.

## Data usage (kept tiny on purpose)
- Per player: one short string about 8 times a second, only when something changed.
- Host: one short enemy string 10 times a second.
- World events (fuse, door, item) are single small writes. Thrown bottles self delete after 5 seconds.
- Nicknames and all state exist only inside `/p/<CODE>` and are deleted when players leave. A player closing the tab removes their own entry through Firebase `onDisconnect`; when the last player leaves, the whole party is deleted.
- Public list entries (`/pub/<CODE>`) hold only the host nickname, player count and difficulty, and are removed when the game starts, the party goes private, or the host leaves.
- Nothing is stored anywhere else, not even the nickname on your device.

## Notes
- The host should keep their tab open and visible (browsers pause hidden tabs).
- Networks that block `firebaseio.com` (some school filters) cannot play multiplayer; single player is unaffected.
- Character: "Character: Male" by Elbolillo (CC BY 4.0), https://sketchfab.com/3d-models/character--male-67368ece5a8d47e7aeffbe2253f6bdd5

## v4.2 notes
- Loading screen on startup (about 2 seconds, near instant after a death reload).
- The content warning is shown once and remembered in the browser (`lhw`). Death, winning and restarts reload the page without showing it again.

## v4.3: launching from anywhere
`index.html` no longer links the css/js files directly. A small boot script downloads them and injects them in order, trying (1) files next to the page, (2) `raw.githubusercontent.com/AniItsukiCoded/The-Long-Hall/main/`, (3) the jsDelivr GitHub mirror. A source is only used if every file loads from it. So the same `index.html` works on GitHub Pages, the p5.js editor, localhost, or pasted on its own. Keep `css/` and `js/` in the repo root on the `main` branch. Change `USER`, `REPO`, `BR` at the top of the boot script if the repo moves.

## v4.4 notes
- The page is never reloaded any more (death, next day, win, abandon run, leave party all reset in place), so launching from `about:blank` keeps working.
- Camera: bogus mouse deltas after pointer lock are ignored, the field of view no longer pops when a chase starts or ends, and entering/leaving a locker eases the view instead of snapping.
- Performance: adaptive render resolution, ~80 fps cap, 5 dynamic lights instead of 7, smaller film-grain layer, cached HUD writes, and the multiplayer player list no longer re-renders on every movement packet.
- Multiplayer: everyone spawns in the same bed room at spread-out, non-overlapping spots; other players are self-lit so they are never a black silhouette.

## v4.5
- Closing the tab (Ctrl+W, the X) during a run or party now shows the browser's "Leave site?" prompt. Browsers only allow this after you have clicked or pressed a key on the page, which always happens before you can play.
