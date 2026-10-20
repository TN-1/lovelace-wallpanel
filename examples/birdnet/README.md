# Custom BirdNET Plates & Vignette Library for WallPanel

This directory contains resources and instructions for building a personalized library of bird illustrations for your **WallPanel BirdNET screensaver** in Home Assistant.

By providing your own curated illustrations and `plates.json` file, WallPanel will prioritize your local artwork before falling back to bundled historical plates or Wikimedia Commons.

---

## 1. Directory Setup in Home Assistant

Home Assistant serves static files placed in the `/config/www/` folder under the `/local/` URL path.

1. Create a `birds` directory inside your Home Assistant configuration:
   ```bash
   mkdir -p /config/www/birds/
   ```
2. Copy `plates.example.json` to `/config/www/birds/plates.json` (or create your own).
3. Place your bird illustration images (PNG or WebP) directly into `/config/www/birds/`.
4. In your Lovelace dashboard configuration under `wallpanel`, specify:
   ```yaml
   wallpanel:
     enabled: true
     birdnet_url: "https://your-birdnet-server.example.com"
     birdnet_layout: "cluster" # or "folio", "spread", "chart"
     birdnet_theme: "sage"     # or "parchment", "dark"
     birdnet_plates_url: "/local/birds/plates.json"
     show_images: true
   ```

---

## 2. Structure of `plates.json`

The `plates.json` file maps each species' **scientific binomial name** (`sci`) to an illustration file:

```json
{
  "version": 1,
  "plates": {
    "Gymnorhina tibicen": {
      "file": "australian_magpie.png",
      "artist": "John Gould style"
    },
    "Trichoglossus moluccanus": {
      "file": "rainbow_lorikeet.png",
      "artist": "Edward Lear style"
    },
    "Cacatua galerita": {
      "image": "/local/birds/sulphur_crested_cockatoo.png"
    },
    "Passer domesticus": {
      "file": "Keulemans Onze vogels 3 50.jpg",
      "box": [0.0586, 0.0993, 0.9273, 0.8909],
      "artist": "John Gerrard Keulemans"
    }
  }
}
```

### Supported Path Schemes:
- **Relative filename** (e.g. `"file": "australian_magpie.png"`): Resolved relative to the directory where `plates.json` resides (`/local/birds/australian_magpie.png`).
- **Absolute path** (e.g. `"image": "/local/birds/magpie.png"`): Resolved directly from Home Assistant.
- **Full URL** (e.g. `"file": "https://example.com/birds/magpie.png"`): Fetched directly.
- **Bounding Box Crop** (optional `"box": [x0, y0, x1, y1]`): If referencing a high-resolution scan of a full antique plate book with margins, WallPanel mathematically crops to the specified normalized coordinates.

---

## 3. Transparency & Seamless Backgrounds (Zero Extra Tools Needed)

Modern text-to-image generators (such as **Flux**, **Midjourney**, **DALL-E**, **Stable Diffusion**, or **Imagen**) produce standard 24-bit RGB rasters. They do **not** natively output 32-bit RGBA files with an inherent alpha transparency channel; requesting a "transparent PNG" or "alpha channel" frequently generates an artificial checkerboard pattern.

To achieve seamless vignettes **without installing or running background removal tools**, you have two direct options:

### Option A: Pure Flat White `#FFFFFF` Background (Recommended & Universal)
WallPanel applies CSS `mix-blend-mode: multiply` to bird illustrations. Mathematically, pure white `#FFFFFF` has an RGB value of $(255, 255, 255)$, which corresponds to a multiplier of $1.0$:
$$\text{Output Color} = \frac{\text{Background Color} \times \text{Image Color}}{255}$$
- When an illustration on pure `#FFFFFF` white is multiplied over WallPanel's sage or parchment card stock, **the white canvas completely disappears**.
- **Advantage**: The same image file seamlessly adapts to any theme (`sage`, `parchment`, or custom CSS) without needing regeneration.

### Option B: Pre-Matched Canvas Color
If you prefer not to rely on CSS blend modes or want identical background tones regardless of display hardware, you can instruct the image generator directly to paint the bird onto the **exact hex background color** of your chosen WallPanel theme:
- For `sage` theme: **`#7f908f`** (a muted grey-green paper tone).
- For `parchment` theme: **`#f9f5ec`** (an antique warm cream paper tone).

---

## 4. Suggested Image Generation Prompts

### Prompt 1: Pure White Background (Universal / Theme-Independent)
> *"A natural history zoological illustration plate of an Australian [COMMON NAME] ([SCIENTIFIC NAME]), in the style of 19th-century lithographs by John Gould and Edward Lear.*
>
> *Key Requirements:*
> *- The bird is perched naturally on a single weathered native tree branch with a few delicate green leaves.*
> *- Anatomically accurate plumage, authentic colors, and side-profile posture.*
> *- Traditional watercolor and hand-colored copperplate engraving aesthetic: fine stippled ink linework, delicate watercolor washes, and subtle feather textures.*
> *- Background: A completely solid, flat, uniform, 100% pure white #FFFFFF canvas. Zero shadows on the background, zero cast shadows, zero ground plane, zero vignette, zero border, zero framing lines, zero text, zero labels, and zero handwriting.*
> *- Clean, crisp silhouette."*

### Prompt 2: Pre-Matched Sage Canvas (Theme: Sage)
> *"A natural history zoological illustration plate of an Australian [COMMON NAME] ([SCIENTIFIC NAME]), in the style of 19th-century lithographs by John Gould and Edward Lear.*
>
> *Key Requirements:*
> *- The bird is perched naturally on a single weathered native tree branch with delicate botanical leaves.*
> *- Traditional watercolor and fine lithographic linework with authentic plumage coloring.*
> *- Background: A completely flat, solid, uniform sage-green matte canvas with hex color #7F908F (RGB 127, 144, 143). Completely seamless flat background with zero gradients, zero shadows cast onto the background, zero vignette, zero border, and zero text.*
> *- Clean silhouette blending smoothly into the #7F908F surface."*

---

## 5. Suggested Prompt for an AI Assistant to Build `plates.json`

You can supply the following prompt to an AI coding assistant alongside your BirdNET species list:

```text
I need to generate a custom 'plates.json' configuration file for my Home Assistant Lovelace WallPanel BirdNET screensaver.

Here is the list of bird species detected by my BirdNET-Go station (common names and scientific names):
[PASTE YOUR SPECIES LIST OR RAW JSON FROM /api/v2/analytics/species/daily HERE]

Please:
1. Extract each unique scientific binomial name (e.g. "Gymnorhina tibicen") and common name.
2. Formulate a clean, standardized filename slug for each species (e.g. "australian_magpie.png").
3. Output a valid 'plates.json' structured as follows:
{
  "version": 1,
  "description": "Custom plates for Backyard Birds",
  "plates": {
    "<Scientific Name>": {
      "file": "<slug>.png",
      "artist": "John Gould / Natural History Watercolor"
    }
  }
}
4. Provide the exact list of image filenames I need to place into '/config/www/birds/'.
```

---

## 6. Upstream 1:1 Prompt Templates Catalog

For complete fidelity, the exact templates used by the upstream reference project (`dmellok/tesserae-widget-backyard-birds`) are preserved in [`prompt_templates.json`](prompt_templates.json).

### Master Single Bird Template (`GEN_ONE`)
```text
Paint the bird in the reference photo, the {name} ({sci}), as {style}. Keep the plumage, markings, bill and proportions exactly as in the photo, {pose} alone on plain, empty paper with a clear margin all round. No other birds, no scenery, no text, no lettering, no border, no signature.
```

### Poses
- **`perched`**: `"perched on a simple branch, the whole bird and its perch"`
- **`flight`**: `"in flight with its wings spread, seen from the side a little below, the whole bird"`

### Popular Style Presets (`{style}`)
- **Gould (`gould`)**:
  > *"a plate from a nineteenth-century natural history book: a hand-coloured lithograph in the manner of John Gould. Soft watercolour washes over fine engraved linework, plain cream paper background, generous margins"*
- **Audubon (`audubon`)**:
  > *"a life-size watercolour in the manner of John James Audubon's Birds of America: a lively natural pose among a few leaves, watercolour and pastel with fine detail in the feathers, plain cream paper background"*
- **Japanese Woodblock (`woodblock`)**:
  > *"a Japanese kacho-e woodblock print in the manner of Ohara Koson: flat areas of colour with a fine dark keyline, a soft graded background, a single flowering branch, the texture of washi paper"*
- **Black-Ink Engraving (`engraving`)**:
  > *"a black-ink copperplate engraving from a Victorian encyclopaedia of natural history: fine cross-hatching and stippling, no colour at all, plain white paper"*
- **Linocut (`linocut`)**:
  > *"a bold linocut print in black ink with one muted colour: strong carved lines, simple shapes, a little texture from the block, plain off-white paper"*
- **Field Sketch (`sketch`)**:
  > *"a naturalist's field sketch in graphite with a light watercolour wash: loose construction lines, a few annotations of shape only, on cream sketchbook paper"*
- **Charley Harper (`harper`)**:
  > *"a mid-century modern illustration in the manner of Charley Harper: the bird reduced to circles, triangles and clean geometric shapes, flat colour in a handful of tones, no outlines, true to the species' markings, on plain cream paper"*
- **Japanese Sumi-e (`sumie`)**:
  > *"a Japanese sumi-e ink and wash painting: a few confident brushstrokes of black ink with soft grey washes and a touch of colour, on plain rice paper"*
- **Art Nouveau (`artnouveau`)**:
  > *"an Art Nouveau illustration with sinuous flowing lines, a muted palette and decorative leaves curling round the branch, on plain cream paper"*
- **Arthur Rackham Fairy-tale (`fairytale`)**:
  > *"a Golden Age illustration in the manner of Arthur Rackham and Edmund Dulac: fine ink line with soft muted watercolour wash, gnarled branches and twisted roots as a frame, a faintly magical atmosphere, on plain toned paper"*

*(See [`prompt_templates.json`](prompt_templates.json) for all 47 art styles including Origami, Risograph, Stained Glass, Needle Felt, and Delft Tile).*

