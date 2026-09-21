# GS-Visualizer V2.2.1 — Turing Audio Reservoir

The original Gray-Scott Visualizer appearance is treated as the completed visual target. V2.2 changes the **inside**, not the look.

A hidden 96×96 Gray–Scott reservoir receives LOW / MID / HIGH / ONSET audio information and evolves as a fixed recurrent dynamical system. The visible 500×500 Gray–Scott field is then nudged by the reservoir's evolving state. This makes the response depend on recent musical history rather than only the current loudness or FFT bin.

## Run locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## What to look for

- kick / low-frequency attacks should produce a small but visible growth event;
- percussion/transients should momentarily accelerate the visible evolution;
- the response position should move with the hidden reservoir state rather than follow a fixed orbit;
- quieter passages should remain alive without clock-driven random nudges;
- after a strong passage, the visual response should retain a short temporal after-effect.

See `ENGINE.md` for the exact hidden reservoir design.


## V2.2.1 additions

- Visible local audio perturbations are mirrored across both axes, so the 500×500 Gray–Scott field stays vertically and horizontally symmetric.
- Restores and strengthens mobile playback handling from the original app: Wake Lock reacquisition, `visibilitychange`, `focus`, `pageshow`, Media Session, and gesture-assisted recovery after phone/OS interruptions.
- Manual PAUSE is distinguished from an OS/browser interruption. Automatic recovery is attempted only when playback was still intended.
- On browsers that require a fresh gesture after an interruption (notably some iOS paths), the current track and intent are preserved and the LCD asks for PLAY.
