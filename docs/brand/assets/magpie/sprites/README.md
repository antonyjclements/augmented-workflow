# Magpie transition sprite sheets

Four pose transitions use the same atlas layout and manifest fields as [Wren](../../wren/sprites/README.md). Each transition has navy artwork for light surfaces and ivory artwork for dark surfaces.

| Transition | Light surface | Dark surface | Playback preview |
| --- | --- | --- | --- |
| Alert → in flight | [PNG](magpie-alert-to-in-flight-light.png) | [PNG](magpie-alert-to-in-flight-dark.png) | [GIF](alert-to-in-flight-preview.gif) |
| In flight → perched | [PNG](magpie-in-flight-to-perched-light.png) | [PNG](magpie-in-flight-to-perched-dark.png) | [GIF](in-flight-to-perched-preview.gif) |
| Perched → gathering | [PNG](magpie-perched-to-gathering-light.png) | [PNG](magpie-perched-to-gathering-dark.png) | [GIF](perched-to-gathering-preview.gif) |
| Gathering → alert | [PNG](magpie-gathering-to-alert-light.png) | [PNG](magpie-gathering-to-alert-dark.png) | [GIF](gathering-to-alert-preview.gif) |

Every PNG is a transparent RGBA image measuring **1024 × 512 pixels**, containing **eight 256 × 256 frames** in four columns and two rows. Read left to right, then top to bottom.

[manifest.json](manifest.json) lists every frame rectangle with a duration of 125 ms, giving 8 fps and one second per transition. Play a sheet once and hold frame 7. To chain transitions, skip frame 0 after the first sheet because it repeats the previous endpoint. The final alert frame matches the initial alert frame exactly.

[magpie-poses.png](magpie-poses.png) contains the four shared endpoint poses. Its first row has the light-surface alert, in-flight, perched, and gathering poses. Its second row repeats those poses in the dark-surface treatment. Every cell is 256 × 256 pixels.

Open the [interactive preview](../preview.html) to play the PNG sheets, view the atlases, switch artwork themes, and download individual sheets. The [combined GIF](magpie-transitions-preview.gif) shows both themes side by side. GIF previews loop with longer endpoint holds for inspection.

For reduced motion, show the destination pose using frame 7 of the requested transition. The interactive preview follows this behavior. Keep playback decorative and provide status through text when it carries meaning.

The frame illustrations were generated with the built-in ImageGen tool. Packing fits each silhouette within its cell, removes faint alpha export residue, and substitutes the shared endpoint drawings at frames 0 and 7. Fold shapes and proportions vary slightly between illustrated intermediate poses.

<details>
<summary>Artwork prompts</summary>

### Endpoint poses

```text
Use case: illustration-story. Asset type: character model sheet for a production sprite animation.
Image 1 is the exact approved magpie character model. Image 2 is an example AW Wren sprite sheet whose inverted ivory/dark coloring is a reference for dark-surface artwork only.
Create a strictly aligned FOUR COLUMN by TWO ROW atlas of EIGHT isolated full-body magpie poses on a truly transparent canvas, landscape 2:1 ratio. No grid lines or labels. Each tile is the same square size. Every bird faces right in side profile, has the SAME extremely long straight tail extending diagonally left, pointed beak, small round eye, sharply folded-paper geometry, narrow violet wing-fold details, and recognizable white shoulder patch. Keep exactly the character design of image 1, same sizes and proportions. Each whole silhouette including tail, wing, beak and feet must fit fully in its cell with 10% clear padding. All birds centered consistently in each cell.
Top row uses the original ink-navy/black head, wing and tail with ivory belly and shoulder, ivory eye.
Bottom row repeats the SAME FOUR POSES and same scale and positions but uses the AW dark-surface treatment: ivory/off-white head, upper back, tail and wings, pale silver folds, dark navy belly and shoulder accent, dark navy eye, ivory beak and ivory feet. Keep violet fold in BOTH themes.
Four columns from left to right:
Column 1 ALERT: exactly the original upright standing bird, two straight slim feet planted, wings folded, alert head.
Column 2 IN FLIGHT: mid-air, body leaning forward to the right, legs tucked, one broad geometrically folded wing raised diagonally back and up-left, the full very long tail trails left.
Column 3 PERCHED: calm low settled stance, body slightly crouched, folded wings, head still upright, feet short and tucked under the breast. Tail left and slightly down. No actual branch or perch, just the bird.
Column 4 GATHERING: bird bows its head until its pointed beak approaches its feet level to the right, knees bent, long tail tilts up-left for balance, folded wings. No objects in beak, no ribbons.
Make these eight clean animation endpoint drawings. No shadows, glow, background texture, setting, frame, writing, random debris or extra creatures. The bottom row is a color treatment of the exact same magpie, preserving its identity and each silhouette.
```

### alert-to-in-flight

```text
Use case: illustration-story. Asset type: production raster sprite animation sheet for an Augmented Workflow magpie.
Reference image 1 is the canonical character sheet. Its four columns are alert, in-flight, perched, gathering. Top row is ink/navy magpie for light surfaces, bottom row is ivory magpie for dark surfaces. Follow those exact character designs and color treatments. This image is a design reference, not an image to paste into the new sheet.
Create ONE perfectly regular FOUR COLUMN by FOUR ROW square animation atlas containing SIXTEEN separate full-body right-facing magpies on a genuinely TRANSPARENT background, without any lettering, grid lines, guides or frame numbers.
The first TWO rows (8 cells read left to right then next row) are consecutive frames of the LIGHT-SURFACE navy magpie moving from alert to in-flight.
The last TWO rows (8 cells, same reading order) repeat exactly the same animation in the DARK-SURFACE ivory treatment. Repeat the same anatomy and silhouettes frame for frame. Ivory head and wings, dark navy belly and shoulder, dark round eye, ivory beak and feet, narrow violet wing folds.
Animation: The bird begins exactly upright standing as column 1, gradually crouches, opens its wings halfway, pushes off with toes, raises a broad near wing diagonally up-left, tucks its feet, and finishes exactly the raised-wing flying pose of column 2. Give eight ordered distinct drawings showing that physical change progressing smoothly. First and last frames must preserve the referenced endpoint poses. No extra flap cycle and no second action.
Critical character identity: long slim graduated tail, ivory shoulder patch and breast in the navy theme, pointed beak, sharply folded angular matte paper construction, modest violet wing/tail fold. Preserve anatomy, relative tail length, body size, eye size and single right-facing side profile. No ribbon, no object in beak, no branch or perch. Feet are fully drawn.
Each bird must be fully contained inside its own equal square cell with at least 10% transparent margin. Maintain a consistent drawing scale, camera and ground line through each 8-frame sequence. Only the body parts needed for the specified movement change. Full tail and wing tips must fit. Gaps between silhouettes must be clearly empty so the sheet can be sliced without neighboring fragments.
No decorative sparkle, shadow, reflection, floor, scenery, glow, motion line, watermark, colored background or checkerboard. Use a true alpha channel with clean transparent edges.
```

### in-flight-to-perched

```text
Use case: illustration-story. Asset type: production raster sprite animation sheet for an Augmented Workflow magpie.
Reference image 1 is the canonical character sheet. Its four columns are alert, in-flight, perched, gathering. Top row is ink/navy magpie for light surfaces, bottom row is ivory magpie for dark surfaces. Follow those exact character designs and color treatments. This image is a design reference, not an image to paste into the new sheet.
Create ONE perfectly regular FOUR COLUMN by FOUR ROW square animation atlas containing SIXTEEN separate full-body right-facing magpies on a genuinely TRANSPARENT background, without any lettering, grid lines, guides or frame numbers.
The first TWO rows (8 cells read left to right then next row) are consecutive frames of the LIGHT-SURFACE navy magpie moving from in-flight to perched.
The last TWO rows (8 cells, same reading order) repeat exactly the same animation in the DARK-SURFACE ivory treatment. Repeat the same anatomy and silhouettes frame for frame. Ivory head and wings, dark navy belly and shoulder, dark round eye, ivory beak and feet, narrow violet wing folds.
Animation: The bird begins exactly in column 2's raised-wing flying pose, lowers and folds the near wing gradually, extends the feet down, touches down softly with bent knees, lowers its body and finishes exactly the quiet low settled folded-wing pose of column 3. Give eight ordered distinct drawings showing that physical change progressing smoothly. First and last frames must preserve the referenced endpoint poses. No extra flap cycle and no second action.
Critical character identity: long slim graduated tail, ivory shoulder patch and breast in the navy theme, pointed beak, sharply folded angular matte paper construction, modest violet wing/tail fold. Preserve anatomy, relative tail length, body size, eye size and single right-facing side profile. No ribbon, no object in beak, no branch or perch. Feet are fully drawn.
Each bird must be fully contained inside its own equal square cell with at least 10% transparent margin. Maintain a consistent drawing scale, camera and ground line through each 8-frame sequence. Only the body parts needed for the specified movement change. Full tail and wing tips must fit. Gaps between silhouettes must be clearly empty so the sheet can be sliced without neighboring fragments.
No decorative sparkle, shadow, reflection, floor, scenery, glow, motion line, watermark, colored background or checkerboard. Use a true alpha channel with clean transparent edges.
```

### perched-to-gathering

```text
Use case: illustration-story. Asset type: production raster sprite animation sheet for an Augmented Workflow magpie.
Reference image 1 is the canonical character sheet. Its four columns are alert, in-flight, perched, gathering. Top row is ink/navy magpie for light surfaces, bottom row is ivory magpie for dark surfaces. Follow those exact character designs and color treatments. This image is a design reference, not an image to paste into the new sheet.
Create ONE perfectly regular FOUR COLUMN by FOUR ROW square animation atlas containing SIXTEEN separate full-body right-facing magpies on a genuinely TRANSPARENT background, without any lettering, grid lines, guides or frame numbers.
The first TWO rows (8 cells read left to right then next row) are consecutive frames of the LIGHT-SURFACE navy magpie moving from perched to gathering.
The last TWO rows (8 cells, same reading order) repeat exactly the same animation in the DARK-SURFACE ivory treatment. Repeat the same anatomy and silhouettes frame for frame. Ivory head and wings, dark navy belly and shoulder, dark round eye, ivory beak and feet, narrow violet wing folds.
Animation: The bird begins exactly in column 3's low settled folded-wing pose, looks down, slightly extends the neck, gradually bows its head down-right, bends the knees, lifts the long tail up-left for balance, and finishes exactly the low bowing/pecking pose of column 4, beak nearly at ground level. Give eight ordered distinct drawings showing that physical change progressing smoothly. First and last frames must preserve the referenced endpoint poses. No extra flap cycle and no second action.
Critical character identity: long slim graduated tail, ivory shoulder patch and breast in the navy theme, pointed beak, sharply folded angular matte paper construction, modest violet wing/tail fold. Preserve anatomy, relative tail length, body size, eye size and single right-facing side profile. No ribbon, no object in beak, no branch or perch. Feet are fully drawn.
Each bird must be fully contained inside its own equal square cell with at least 10% transparent margin. Maintain a consistent drawing scale, camera and ground line through each 8-frame sequence. Only the body parts needed for the specified movement change. Full tail and wing tips must fit. Gaps between silhouettes must be clearly empty so the sheet can be sliced without neighboring fragments.
No decorative sparkle, shadow, reflection, floor, scenery, glow, motion line, watermark, colored background or checkerboard. Use a true alpha channel with clean transparent edges.
```

### gathering-to-alert

```text
Use case: illustration-story. Asset type: production raster sprite animation sheet for an Augmented Workflow magpie.
Reference image 1 is the canonical character sheet. Its four columns are alert, in-flight, perched, gathering. Top row is ink/navy magpie for light surfaces, bottom row is ivory magpie for dark surfaces. Follow those exact character designs and color treatments. This image is a design reference, not an image to paste into the new sheet.
Create ONE perfectly regular FOUR COLUMN by FOUR ROW square animation atlas containing SIXTEEN separate full-body right-facing magpies on a genuinely TRANSPARENT background, without any lettering, grid lines, guides or frame numbers.
The first TWO rows (8 cells read left to right then next row) are consecutive frames of the LIGHT-SURFACE navy magpie moving from gathering to alert.
The last TWO rows (8 cells, same reading order) repeat exactly the same animation in the DARK-SURFACE ivory treatment. Repeat the same anatomy and silhouettes frame for frame. Ivory head and wings, dark navy belly and shoulder, dark round eye, ivory beak and feet, narrow violet wing folds.
Animation: The bird begins exactly in column 4's low bowing/pecking pose, gradually lifts its beak, straightens the neck and knees, settles the long tail back down-left, opens its eye attentively, and finishes exactly the original upright alert standing pose of column 1. Give eight ordered distinct drawings showing that physical change progressing smoothly. First and last frames must preserve the referenced endpoint poses. No extra flap cycle and no second action.
Critical character identity: long slim graduated tail, ivory shoulder patch and breast in the navy theme, pointed beak, sharply folded angular matte paper construction, modest violet wing/tail fold. Preserve anatomy, relative tail length, body size, eye size and single right-facing side profile. No ribbon, no object in beak, no branch or perch. Feet are fully drawn.
Each bird must be fully contained inside its own equal square cell with at least 10% transparent margin. Maintain a consistent drawing scale, camera and ground line through each 8-frame sequence. Only the body parts needed for the specified movement change. Full tail and wing tips must fit. Gaps between silhouettes must be clearly empty so the sheet can be sliced without neighboring fragments.
No decorative sparkle, shadow, reflection, floor, scenery, glow, motion line, watermark, colored background or checkerboard. Use a true alpha channel with clean transparent edges.
```

</details>
