# Turing Audio Reservoir

V2.2 keeps the original Gray-Scott Visualizer look as the visible layer and adds a **separate hidden 96×96 Gray–Scott reservoir** as an audio temporal processor.

## Signal path

`music → Web Audio features → 96×96 fixed Gray–Scott reservoir → compact state readout → visible 500×500 Gray–Scott`

The hidden reservoir uses the same core parameters as the Turing Reservoir research experiments:

- 96×96 U/V state
- Du = 0.16
- Dv = 0.08
- F = 0.060
- K = 0.062
- dt = 1
- fixed dynamics; no learned weights
- 9-point Laplacian (cardinal 0.20, diagonal 0.05, center −1)

LOW / MID / HIGH / ONSET are injected into balanced spatial point sets. The reservoir evolves four steps at about 20 Hz. Its current state, not the raw EQ values, controls the visible pattern's gentle F/K nudges, beat location, short speed pulse, and quiet-passage movement.

This is intentionally not a trained music classifier. It uses the reservoir's temporal state as a short-history processor so that the visual response depends on the recent audio trajectory, not only on the current FFT frame.


## Visible symmetry rule (V2.2.1)

The hidden reservoir itself remains free to evolve asymmetrically. Its scalar readouts still nudge F/K globally. Whenever the reservoir selects a spatial point for the visible field, that perturbation is copied to all four mirror positions `(x,y)`, `(W-1-x,y)`, `(x,H-1-y)`, `(W-1-x,H-1-y)`. The visible Gray–Scott state therefore preserves both vertical and horizontal mirror symmetry without faking symmetry at draw time.
