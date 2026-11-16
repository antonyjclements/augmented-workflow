# Augmented Workflow website

The Augmented Workflow website opens to the searchable Field Guide.

## Preview

Run from this directory:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/` for the guide or `http://127.0.0.1:4173/?page=workspaces` for the Workspaces article.

## Checks

```sh
node --test test/*.test.cjs
```

The site uses static files and has no runtime dependencies.

## Field Guide

Edit navigation and article metadata in `assets/field-guide-content.mjs`, Start Here and Theory articles in `assets/field-guide-articles.mjs`, and skill walkthroughs in `assets/field-guide-walkthroughs.mjs`. Concept chapters live in `assets/field-guide-concepts.mjs` and `assets/field-guide-practices.mjs`. Append `?page=<article-id>#<section-id>` to the site root to link to an article section. Old `field-guide.html` links forward to the root with their query and section intact. See `docs/features/field-guide/spec.md` for acceptance checks.

### Refresh the bundled skill reference

The guide serves a checked-in snapshot of each bundled `SKILL.md`. The generation script takes a Git ref and pins the source links to that commit. Regenerate the snapshot when the public skill source changes, then verify the catalog and update its groups if a skill was added or removed.

```sh
guide_tools_dir=$(mktemp -d)
npm install --prefix "$guide_tools_dir" markdown-it@14.1.1
NODE_PATH="$guide_tools_dir/node_modules" node scripts/update-field-guide-skills.cjs origin/main
node --test test/*.test.cjs
```

## Wren presentation

`assets/field-guide.css` supplies the paper theme, grain, and fixed mascot boxes.

After 10 seconds of inactivity, `assets/wren-idle.js` plays a complete four-transition cycle inside a fully visible article-header mascot’s fixed box. The cycle starts at the mascot’s original pose and returns to it after visiting each phase. Each cycle runs at 8 fps for 3.5 seconds, with a new idle check 10 seconds after the preceding check.

Light and dark modes select the matching artwork and sprite sheets. Theme changes and interaction restore the resting pose and restart the idle interval. The controller loads all four sheets together on demand, skips offscreen mascots, suspends motion in hidden tabs, and respects reduced motion. The footer toggle remembers the visitor’s preference. The resting illustration remains visible if the sprite sheets fail to load.

The Wren illustrations and sprite sheets come from `docs/brand/assets/wren/` on the workflow source branch. GitHub Pages publishes the `gh-pages` branch.

## Share card

`assets/aw-share-card.svg` is the editable source for the 1200 × 630 image used by the homepage’s social preview metadata.
