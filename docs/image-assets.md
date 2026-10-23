# Image assets

Raster UI assets use lossless WebP generated with Caesium Command Line Tools 1.5.0,
from the same project as Caesium Image Compressor. The tool is only needed when
preparing assets, not during Docker builds or at runtime. No package dependency was added.

Caesium CLT 1.5.0 supports WebP conversion but does not offer AVIF output. Use its
[official releases](https://github.com/Lymphatus/caesium-clt/releases) to obtain the
binary for your operating system. Lossless WebP preserves the logos' sharp edges,
illustration colors, alpha values and dimensions.

Keep these PNG compatibility assets:

- `apple-touch-icon.png` and `icon-{192,512}x{192,512}.png` for installed app icons.
- `brand/topiqu-mark.png` for the existing Open Graph/social preview URL.

These PNGs were optimized losslessly too. `favicon.ico` and SVG vectors retain their
formats. Original PNG input files remain available in Git history or the sibling
brand source checkout; converted UI PNGs are not duplicated in `public`.

## Preparing assets

For a single illustration, then update its application references:

```sh
caesiumclt --lossless --format webp --output public /path/to/topik_404_rm.png
```

For the existing brand synchronization workflow:

```sh
CAESIUM_CLT=/path/to/caesiumclt bun scripts/sync-brand.ts ../app/public
# Optional transparent input filenames:
CAESIUM_CLT=/path/to/caesiumclt bun scripts/sync-brand.ts ../app/public --transparent
```

If `caesiumclt` is on PATH, `CAESIUM_CLT` can be omitted. The script converts brand
UI sources to WebP and optimizes retained PNGs only when the result is smaller.
It stages conversions in a temporary directory and never overwrites source files.
The separately maintained dark wordmark and third-party logos are not part of this
existing source mapping; convert them explicitly when replacing those assets.

Nuxt Image still provides correctly sized 1×/2× WebP variants for displayed logos.
Lossless source conversion does not remove that sizing step. Most displayed logos
were already delivered as optimized WebP through IPX, so source-size savings are
not equivalent to a reduction in homepage transfer or a guaranteed Lighthouse gain.

## Conversion verification — 2026-10-21

All 19 original PNGs were trial-converted and decoded for comparison: dimensions,
alpha and visible RGB pixels matched. RGB under fully transparent pixels is ignored.
The final set contains 16 WebP files and four retained, optimized PNGs; decoded
compatibility PNGs were compared too. Combined raster asset size fell from
582,058 B to 403,398 B (30.7%).

The brand synchronization script was exercised against a fixture made from the
original Git assets. Verify new assets with a production build and
`bun run test:production`, which fetches IPX sources and retina variants in both
locales. Check the 404 illustration separately, since it is not part of homepage
image discovery.

Validation environment note: the Linux/Bun Docker build completed compilation and
prerendering, but was cancelled after prolonged lack of progress while packaging
Nitro. A forced local Bun CLI invocation also failed during module loading with
`Cannot find module '#imports'` from the SEO schema shim, before asset compilation.
The fallback production build uses the Nuxt CLI under Node, with the generated Bun
server tested separately. The Dockerfile and runtime versions were not changed as
part of this image conversion. These checks do not establish a completed Linux
image build for this asset revision.

The Node-run production build passed. Its generated Bun server passed the bilingual
production smoke check, including IPX and retina variants. The 404 illustration
returned a nonempty `image/webp` response, all four compatibility PNG URLs remained
available, and browser checks confirmed loaded logos, no mobile horizontal overflow,
a loaded 404 illustration in dark mode and no browser errors. Lint and typecheck passed.
