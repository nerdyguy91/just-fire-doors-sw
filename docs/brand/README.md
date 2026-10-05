# Brand assets

`logo-supplied.jpg` is the logo artwork supplied by the client on 2026-09-28: a 1280 × 1261 JPEG on a `#333333` background. It's the source for everything below.

| File                                                  | What it is                                                                                                                                          |
| :---------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/assets/brand/logo-on-dark.svg`                   | Vector trace of the supplied logo in its original colours: azure `#22AAFF` door and lettering, white "SW". Used in the footer and the social image. |
| `src/assets/brand/logo-on-light.svg`                  | The same trace with a graphite `#23282C` "SW" for light backgrounds. Used in the header.                                                            |
| `src/assets/brand/mark.svg`                           | The door mark on its own, traced.                                                                                                                   |
| `src/assets/brand/favicon.svg` → `public/favicon.svg` | A simplified, bolder redraw of the door mark, so it stays legible at 16–32 px.                                                                      |
| `public/favicon.ico`                                  | 16, 32 and 48 px versions rendered from `favicon.svg`.                                                                                              |
| `public/apple-touch-icon.png`                         | 180 px: the door mark on graphite.                                                                                                                  |
| `public/brand/logo.png`                               | 1200 × 408: the light-background logo on white. Used as the Organization logo in structured data.                                                   |
| `public/og/default.jpg`                               | 1200 × 630 default social image (logo, approved headline, brand fonts).                                                                             |

## How the vectors were made

Each colour layer of the JPEG was upscaled 4× (Lanczos), lightly blurred, thresholded, and traced with potrace (`potracer`). A difference check against the original showed only sub-pixel edge variation. At very large sizes, small wobbles from the JPEG source show on straight edges.

**Replace these traces with the original vector artwork (SVG, AI or EPS) when the logo designer can supply it.** It is tracked in CONTENT-TODO.md.
