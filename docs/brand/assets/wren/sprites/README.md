# Wren transition sprite sheets

Four pose transitions, each supplied for light and dark backgrounds:

| Transition | Light background | Dark background | Playback preview |
| --- | --- | --- | --- |
| Alert → in flight | [PNG](wren-alert-to-in-flight-light.png) | [PNG](wren-alert-to-in-flight-dark.png) | [GIF](alert-to-in-flight-preview.gif) |
| In flight → perched | [PNG](wren-in-flight-to-perched-light.png) | [PNG](wren-in-flight-to-perched-dark.png) | [GIF](in-flight-to-perched-preview.gif) |
| Perched → gathering | [PNG](wren-perched-to-gathering-light.png) | [PNG](wren-perched-to-gathering-dark.png) | [GIF](perched-to-gathering-preview.gif) |
| Gathering → alert | [PNG](wren-gathering-to-alert-light.png) | [PNG](wren-gathering-to-alert-dark.png) | [GIF](gathering-to-alert-preview.gif) |

Each transparent RGBA PNG is 1024 × 512 pixels: four columns, two rows, eight 256 × 256 frames. Read left to right across the first row, then the second. `light` and `dark` describe the intended background, not the bird color. All frames include transparent padding.

[manifest.json](manifest.json) specifies each frame rectangle and a suggested 125 ms frame duration (8 fps; one second per transition). Play each transition once and hold its final frame. To chain transitions, skip frame 0 after the first transition because it repeats the preceding endpoint. Individual sheets do not loop seamlessly back to their own first frames.

Start and end frames use resized copies of the approved static pose artwork. Intermediate frames are generated illustrations; some fold shapes, thread placement, and scale vary during movement. The two color treatments share the transition sequence, but are separately illustrated rather than pixel-identical recolors. Use these as illustrated, stepped character motion; they are not a rigged vector animation.

The GIFs are viewing aids on off-white and navy backgrounds. They repeat with longer endpoint holds, unlike the one-shot timing in the manifest. The [combined preview](wren-transitions-preview.gif) shows all four transitions and both treatments. Use the PNG sheets in products to retain transparency and timing control.

For reduced-motion preferences, show the destination static pose without playback. Keep animations decorative and do not use them as the sole indication of status.

Atlas cleanup removes detached ribbon and paper fragments from neighboring cells. The approved endpoint frames and cell dimensions are preserved.
