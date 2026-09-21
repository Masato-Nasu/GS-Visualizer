# V2.2.1 — Symmetry + Mobile Interruption Recovery

- Renamed the app/package to GS-Visualizer.
- Mirrors every visible local audio perturbation across horizontal and vertical axes.
- Keeps global audio-driven F/K modulation unchanged, so the existing visual character is preserved.
- Restores `focus`-based Wake Lock recovery from the original app and adds `pageshow` recovery.
- Distinguishes manual pause from OS/browser interruption and attempts playback recovery after returning from a phone call/app interruption.
- Keeps Media Session controls and mobile folder/file selection behavior.
- Adds gesture-assisted recovery for browsers that suspend AudioContext or require interaction after interruption.

# V2.2.0 — Turing Audio Reservoir

- Keeps the original Gray-Scott Visualizer appearance and 500×500 visible simulation.
- Replaces V2.1's clock-driven keep-alive behavior with a real audio-driven temporal engine.
- Adds a separate hidden 96×96 fixed Gray–Scott reservoir based on today's Turing Reservoir experiments.
- LOW / MID / HIGH / ONSET are spatially encoded into the reservoir.
- Hidden reservoir evolves continuously and retains short audio history.
- Beat/transient detection uses spectral flux + low-frequency rise + RMS rise with an adaptive threshold.
- Beat events cause a small reservoir-positioned perturbation and a short simulation-speed pulse.
- Quiet/ambient passages can still move the pattern, but only when the reservoir state itself is changing.
- Raw EQ no longer directly drives the main pattern.
- No new visible controls were added; the completed visual/UI design remains intact.
