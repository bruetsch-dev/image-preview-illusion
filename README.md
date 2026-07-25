# Tap Me Studio

A browser tool that turns a picture into a PNG that changes when someone taps
and holds it on X — plus the site around it, in English and Japanese.

Everything is static. No server, no build dependencies beyond Node itself.

## Running it

```bash
npm run build
```

That regenerates all 16 pages plus `sitemap.xml`, `robots.txt`, `og.png` and
`icon.svg`. Open `index.html` afterwards — every internal link is relative, so
the site works from a folder as well as from a domain.

Edit copy in `build/content.mjs`, never in the generated HTML. Both locales sit
side by side in that file specifically so they cannot drift apart.

```
build/content.mjs   all copy, EN + JA, plus the ad and analytics config
build/layout.mjs    the page shell: head, nav, footer, consent, ad slots
build/build.mjs     page renderers, the embedded editor, asset generation
app.js              the editor engine
site.js             consent gating and the hero demo
site.css            design tokens and site chrome
styles.css          the editor component
```

## The editor

**Hide & reveal** — one picture. Pixels that should stay hidden alternate
opaque/transparent on a 1px checker, so the feed's downscale averages them into
the background and the opened view brings them back. Colours are left alone:
the checker does the hiding, so washing the picture out only costs contrast in
the reveal. Choose what survives:

- *Hide everything* — the timeline shows an almost blank frame
- *Keep dark parts visible* — shadows stay as a teaser, with an adjustable
  brightness cutoff
- *Paint by hand* — brush the areas that stay, or brush them back out

**Two-image swap** — two pictures. Per-pixel alpha is solved so the file reads
as picture A over the timeline's light background and picture B over the black
backdrop of the opened view.

The two composites can only ever differ by one achromatic value per pixel
(`255 × (1 − alpha)`), so two arbitrary colour images are impossible. Instead of
fighting that, both images are compressed into complementary brightness bands —
A into `[split, 255]`, B into `[0, split]` — which makes `A >= B` true
everywhere by construction, and slightly desaturated so the colour that does
bleed between states is less obvious. Picture A should be the lighter of the two.

Options: size (Auto, or the six fixed ratios at 2432 px long side), brightness
cutoff for "keep dark parts", upscale for hi-res load, auto line-art teaser,
brightness boost. Auto sizing only lifts images below 2048 px and caps at 4096.

Two passes clean the result up: near-white background connected to the border
is made fully transparent rather than checkered, and in "keep dark parts" mode
dark regions too small to belong to the subject are dropped, since at thumbnail
size they only read as noise.

Hide & reveal exports PNG-8. A median-cut quantiser builds a 256-colour palette
from the image itself and writes it with a `tRNS` chunk — a fraction of the RGBA
size. Swap needs per-pixel alpha, so it exports PNG-32.

Keep exports under 5 MB. Above that X stops serving the original and the reveal
never fires. The status bar shows the encoded size.

## Going live

1. **Set the domain.** `SITE.domain` in `build/content.mjs` feeds every
   canonical tag, hreflang pair and sitemap entry. Rebuild after changing it.
2. **Deploy.** Point Cloudflare Pages (or Netlify) at the repo with build
   command `npm run build` and the repo root as the output directory.
   `_headers` is already set up for both.
3. **Add analytics and ads.** Fill `SITE.analyticsId` and `SITE.ads` and
   rebuild. Both stay dormant until then: no ad slot renders, no consent banner
   appears, and nothing third-party loads.

### Ads

Slots are AdSense responsive units — one under the editor, one mid-article on
every long-form page. Nothing loads until consent is stored, and declining is
one click, same as accepting.

AdSense will not approve a bare tool page, which is why the how-to, FAQ, blog,
about and legal pages exist. Apply once they are live and indexed.

**For EEA traffic Google requires a certified CMP.** The built-in banner gates
loading correctly and is honest about what it does, but it is not certified.
Add Google's own free CMP or Cookiebot before serving ads in Europe.

## Caveats

The previews model X's pipeline; they do not have access to it. X changes
compression, cropping and upload handling without notice, so post once from a
private account before relying on an exact reveal.

`app.legacy.js` is the previous engine — pattern lab, prompt editor, eight
reveal methods, per-tone dither control. Not loaded; kept for reference.
