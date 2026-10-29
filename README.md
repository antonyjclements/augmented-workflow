# Augmented Workflow website

Static overview, technical model, and usage guide with an ivory paper theme and Wren mascot.

## Preview

Run from this directory:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/`.

## Checks

```sh
node --test test/*.test.cjs
```

No build step or third-party JavaScript libraries are required.

## Wren presentation

`assets/wren-paper.css` supplies rounded ivory paper surfaces, grain, diffuse shadows, and geometric corner folds. Hero illustrations share a 150px desktop and 100px mobile width.

After 10 seconds of inactivity, `assets/wren-idle.js` plays a complete four-transition cycle inside a fully visible mascot's fixed box. For example, the overview Wren follows perched → gathering → alert → in flight → perched. The same cycle rotates to start at each mascot's original pose, visits every phase, and returns to that pose. Only sprite frames change: the element never travels, slides, bobs, or rotates. Each cycle runs at 8 fps for 3.5 seconds, without duplicate frames at shared endpoints. The next idle check is 10 seconds after the preceding check. Navy birds stay on light surfaces and off-white birds on dark surfaces.

Interaction cancels playback and restores the previous resting pose. Offscreen mascots are skipped, all four sheets for the selected mascot’s color treatment load together on demand, hidden tabs suspend playback, and reduced-motion preferences disable it. The footer toggle stores the visitor's preference. If JavaScript or an image fails, the static illustration remains.

Approved Wren illustrations and retained sprite sheets are copied from `docs/brand/assets/wren/` on the workflow source branch. The website's deployed files live on `gh-pages`; this checkout prepares changes without publishing them.

Intent and verification: `docs/features/theory-building-site/`.


## Content sources

The public copy draws on Antony Clements’s four essays: Code Without a Theory; Did you wash your hands?; Teaching the repo what you keep correcting; and Picking up where the last agent stopped. Source links and scope are recorded in `docs/features/theory-building-site/spec.md`. Research experiments and pilot findings are excluded from the website content.

## Share card

`assets/aw-share-card.svg` is the editable source for the 1200 × 630 PNG used by Open Graph and Twitter card metadata on all three pages. It pairs the unmodified AW mark with the approved Wren and the current overview headline.
