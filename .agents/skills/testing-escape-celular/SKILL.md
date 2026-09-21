---
name: testing-escape-celular
description: How to run and end-to-end test the static "ESCAPE CELULAR" biology game (catch / build / roulette / doors / PDF flow).
---

# Testing ESCAPE CELULAR

## Serve & open
- Static site; serve the repo root with `python3 -m http.server 8000` and open `http://localhost:8000/` in Chrome.
- No build step, no backend, no secrets needed.

## Environment gotchas
- The test VM may lack emoji fonts (`fc-list | grep -i emoji` → 0): all emoji render as tofu boxes in screenshots — cosmetic, environmental, not a game bug.
- Multiple Chrome processes may coexist (a `--remote-debugging-port` automation instance vs a manually launched one). `browser_console`/`read_dom` attach to the automation instance, while `computer` clicks go to the visible window. If console state doesn't match the screen, check `wmctrl -l` for extra windows — or just open DevTools in the visible window (Ctrl+Shift+J) and run console commands there.
- jsPDF loads from jsdelivr CDN — PDF generation needs internet access.
- `xdotool hold_key` doesn't accept `ArrowLeft/Right` — use `Left`/`Right`/`a`/`d`.

## Game internals (for console-assisted testing)
- `state` is a top-level `const` — reachable from DevTools console but not `window.state`.
- Useful: `state.inventory` (organelle counts), `state.exitDoor` (null in doors round 1 by design; set among closed doors in round 2+), `state.keys`, `state.buildHadError`, `neededStructures()`.
- After mutating `state.inventory`, call `renderTray()` + `updateCollectMoreBtn()` to refresh the UI.
- Each organelle is needed up to twice (animal + plant cell) — set shared ids to 2.
- Catch timer starts only on first basket move; extra/collect round also requires a move or it never ends.
- Doors: each key opens one door; round 1 has NO exit (by design); "Volver a jugar" replays the full catch→build→roulette chain; opened doors persist in `state.doorsOpened`.
- PDF downloads to ~/Downloads as `resultados_<Nombre>_<Apellido>.pdf`; verify by opening `file:///...` in a new tab.
