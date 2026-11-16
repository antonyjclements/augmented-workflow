# Augmented Workflow website

Static overview, technical model, usage guide, and searchable Field Guide with an ivory paper theme and Wren mascot.

## Preview

Run from this directory:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/` for the site or `http://127.0.0.1:4173/field-guide.html?page=workspaces` for the Workspaces article.

## Checks

```sh
node --test test/*.test.cjs
```

The site uses static files and has no runtime dependencies.

## Field Guide

Edit navigation and article metadata in `assets/field-guide-content.mjs`, Start Here and Theory articles in `assets/field-guide-articles.mjs`, and skill walkthroughs in `assets/field-guide-walkthroughs.mjs`. Concept chapters live in `assets/field-guide-concepts.mjs` and `assets/field-guide-practices.mjs`. Use `field-guide.html?page=<article-id>#<section-id>` to link to an article section. The guide searches the same content it renders and runs on the same static host as the rest of the site. See `docs/features/field-guide/spec.md` for acceptance checks.

### Refresh the bundled skill reference

The guide serves a checked-in snapshot of each bundled `SKILL.md`. The generation script takes a Git ref and pins the source links to that commit. Regenerate the snapshot when the public skill source changes, then verify the catalog and update its groups if a skill was added or removed.

```sh
guide_tools_dir=$(mktemp -d)
npm install --prefix "$guide_tools_dir" markdown-it@14.1.1
NODE_PATH="$guide_tools_dir/node_modules" node scripts/update-field-guide-skills.cjs origin/main
node --test test/*.test.cjs
```

## Wren presentation

`assets/wren-paper.css` supplies rounded ivory paper surfaces, grain, diffuse shadows, and geometric corner folds. Hero illustrations share a 150px desktop and 100px mobile width.

After 10 seconds of inactivity, `assets/wren-idle.js` plays a complete four-transition cycle inside a fully visible mascot's fixed box. For example, the overview Wren follows perched → gathering → alert → in flight → perched. The same cycle rotates to start at each mascot's original pose, visits every phase, and returns to that pose. Only sprite frames change: the element never travels, slides, bobs, or rotates. Each cycle runs at 8 fps for 3.5 seconds, without duplicate frames at shared endpoints. The next idle check is 10 seconds after the preceding check. Navy birds stay on light surfaces and off-white birds on dark surfaces.

The Field Guide uses the same controller for article-header mascots. Its light and dark modes select the matching artwork and sprite sheets, and switching themes starts a new idle interval. Interaction cancels playback and restores the previous resting pose. Offscreen mascots are skipped, all four sheets for the selected mascot’s color treatment load together on demand, hidden tabs suspend playback, and reduced-motion preferences disable it. The footer toggle stores the visitor's preference across the site. If JavaScript or an image fails, the static illustration remains.

Approved Wren illustrations and retained sprite sheets are copied from `docs/brand/assets/wren/` on the workflow source branch. The website's deployed files live on `gh-pages`; this checkout prepares changes without publishing them.

Intent and verification: `docs/features/theory-building-site/`.


## Content sources

The public copy draws on Antony Clements’s four essays: Code Without a Theory; Did you wash your hands?; Teaching the repo what you keep correcting; and Picking up where the last agent stopped. Source links and scope are recorded in `docs/features/theory-building-site/spec.md`. Research experiments and pilot findings are excluded from the website content.

## Share card

`assets/aw-share-card.svg` is the editable source for the 1200 × 630 PNG used by Open Graph and Twitter card metadata on all three pages. It pairs the unmodified AW mark with the approved Wren and the current overview headline.
