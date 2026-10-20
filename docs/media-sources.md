# Media sources
The media source for the screensaver slideshow is configured by `image_url`.
This can be any HTTP URL, a Home Assistant media-source URL or a Home Assistant entity that has the `entity_picture` attribute.

The default value of `image_url` is `http://picsum.photos/${width}/${height}?random=${timestamp}`.

## HTTP URL
Media can be retrieved from an HTTP URL.

The following variables can be used in HTTP URLs:
- `${timestamp}` = current unix timestamp
- `${width}` = viewport width
- `${height}` = viewport height

Example of using images from unsplash.com (old api):

`https://source.unsplash.com/random/${width}x${height}?sig=${timestamp}`

You can narrow down the images from unsplash.com using certain search terms, for example "fruit" and "beer".

`https://source.unsplash.com/random/${width}x${height}?fruit,beer&sig=${timestamp}`

Example of using images from api.unsplash.com (new api):

```yaml
media_order: random
media_list_update_interval: 3600
image_url: https://api.unsplash.com/photos/random?client_id=YOUR_ACCESS_KEY&query=dogs
show_image_info: true
image_info_template: '<span style="color:#990000">//</span> ${description|alt_description}'
```

See [Unsplash API documentation (Get a random photo)](https://unsplash.com/documentation#get-a-random-photo) for details.

## Local Media Source

It is also possible to use images from the Home Assistant Local Media Source.
See [Home Assistant Media Source integration documentation](https://www.home-assistant.io/integrations/media_source) for details.

If you are not sure which is the correct media source URL, you can proceed as follows:

1. navigate to the folder you want to use in the HA Media Browser
2. copy the displayed browser URL and decode it with a URL decoder tool. For example, you can use [www.urldecoder.org](https://www.urldecoder.org/).
3. copy the part of the decoded URL after the last comma (`,`) that begins with `media-source://`.

Instead of using `media-source://media_source/` as `image_url` you can just use `/` as a shortcut.

- `/` = Images in all Local Media sources
- `/media1` = Images in the Local Media directory named `media1`
- `/media1/folder1` = Images in `folder1` of the Local Media directory named `media1`

If you are using the [Synology DSM](https://www.home-assistant.io/integrations/synology_dsm/) integration, and want to use an Photo album from there you can use:

`media-source://synology_dsm/<unique_id>/<album_id>`

`<unique_id>` is the Home Assistant ID for the NAS (usually the serial number of the NAS).

For example:

`media-source://synology_dsm/18C0PEN253705/19`

### Random path order

For media sources containing multiple folders, `random_path` randomly selects a folder beneath `image_url` and displays the media directly inside that folder in sorted order. After the last media item in the folder has been displayed, another folder is randomly selected. Every folder is selected once before the folder order is shuffled again.

The folder configured by `image_url` is also eligible when it directly contains media. Empty folders and folders whose media are all excluded are skipped. Nested folders are treated as separate paths rather than being combined with their parent folder.

```yaml
image_url: /media1/photos
media_order: random_path
```

This option is only supported for Home Assistant media sources. `exclude_filenames`, `exclude_media_types`, and `media_list_max_size` continue to apply; `media_list_max_size` limits the number of media items used from the selected folder.

### Exclude files
To exclude files and directories from a local media source, use the `exclude_filenames` configuration option.
This option accepts a list of regular expressions.
It was previously named `image_excludes`.

**Example**
```yaml
exclude_filenames:
  - '\.heic$'
  - '\.[tT][iI][fF][fF]?$'
  - '/@eaDir'
```

You can also exclude specific media types (currently image and video) using the `exclude_media_types` option.
**Example**
```yaml
exclude_media_types:
  - video
```

To exclude specific media orientations from being displayed, use the `exclude_media_orientation` configuration option.
Valid values are:
* `landscape`: excludes media in landscape format
* `portrait`: excludes media in portrait format
* `auto`: excludes media whose orientation does not match the screen orientation

!!! note
    This option is currently only supported for the Immich media source.

**Example**
```yaml
exclude_media_orientation: auto
```

## Media Entity

### Images

You can use an entity's `entity_picture` attribute as the media source for the screensaver.
To do this, set the `image_url` to `media-entity-image://<entity_id>`, replacing `<entity_id>` with the actual entity ID.

When the entity's state changes, a new image will automatically be displayed. A new image also loads after the specified `display_time` has passed.
If you'd like to prevent image updates when the entity state remains the same, set `media_entity_load_unchanged` to `false`.

**Example:**

```yaml
display_time: 15
image_url: media-entity-image://camera.my_camera_entity_id
media_entity_load_unchanged: true
```

### Video Stream

If an entity provides a video stream, you can use it as the screensaver media source.
To enable this, set `image_url` to `media-entity-video://<entity_id>`, replacing `<entity_id>` with the appropriate entity ID.

**Example:**

```yaml
image_url: media-entity-video://camera.my_camera_entity_id
media_entity_load_unchanged: false
```

## Immich API
Images and videos can be loaded from an Immich server,
for which WallPanel accesses the [Immich API](https://immich.app/docs/api/).


### Immich server CORS
Wallpanel sends direct requests to the Immich server via the browser, which enforces CORS (Cross-Origin Resource Sharing) as a security measure. Unfortunately, the Immich server does not support CORS configuration, and [there are currently no plans to implement this](https://github.com/immich-app/immich/discussions/19175).

To work around this limitation, you'll need to set up a reverse proxy. The specific configuration will vary depending on the reverse proxy you choose to use.

Here is a configuration example for nginx:
```
if ($request_method = 'OPTIONS') {
  add_header 'Access-Control-Allow-Origin' '*' always;
  add_header 'Access-Control-Allow-Methods' 'GET, PUT, POST, DELETE, OPTIONS' always;
  add_header 'Access-Control-Allow-Headers' 'X-Api-Key, User-Agent, Content-Type' always;
  add_header 'Access-Control-Max-Age' 1728000;
  add_header 'Content-Type' 'text/plain charset=UTF-8';
  add_header 'Content-Length' 0;
  return 204;
}
if ($request_method ~* '(GET|POST)') {
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'X-Api-Key, User-Agent, Content-Type' always;
    add_header 'Access-Control-Max-Age' 1728000;
}
```

!!! note
    If you are using Nginx Proxy Manager add a custom location at root "/" and insert the configuration there.


For Traefik, you can use:

```
traefik.http.middlewares.immich-cors.headers.accessControlAllowOriginList=*
traefik.http.middlewares.immich-cors.headers.accessControlAllowMethods=GET, PUT, POST, DELETE, OPTIONS
traefik.http.middlewares.immich-cors.headers.accessControlAllowHeaders=X-Api-Key, User-Agent, Content-Type
traefik.http.middlewares.immich-cors.headers.accessControlMaxAge=1728000
traefik.http.routers.immich.middlewares=immich-cors
```

!!! warning
    For security reasons, it's best to specify a list of URLs in `Access-Control-Allow-Origin` rather than using `*`.

!!! note
    If you're coming from an internal IP, make sure your traffic is properly routed
    through the proxy rather than directly reaching the internal IP.  
    To prevent SSL errors, you'll likely need a router that supports NAT reflection.

### Wallpanel configuration
To access the Immich API, first generate an [API key](https://immich.app/docs/features/command-line-interface/#obtain-the-api-key).

Then you can configure WallPanel to use the Immich API.
You need to set the `image_url` to `immich+<your api url>` and add the API key to `immich_api_keys`.
Multiple API keys can be added to use multiple accounts on the same server.
The timeout for immich API requests can be set using the `immich_api_request_timeout` configuration option and defaults to 15 seconds.
With the config option `immich_shared_albums` (`true` / `false`) you can include or exclude shared albums.
To restrict the media items to be retrieved to specific albums, you can configure a list of album names in `immich_album_names`.
Alternatively you can configure a list of tag names in `immich_tag_names`.
You can select media elements that contain certain people with the configuration option `immich_persons`.
Or show immich memories by setting `immich_memories` to `true`.
With the config option `immich_resolution` (`preview` / `original`) you can select the resolution of the images. 

Example using album names:
```yaml
image_url: immich+https://immich.your.domain/api
immich_api_keys:
  - 0vOb7EZ7YSajUQckMt6Cbnri8Ifzo5dlD9Q5hnnXlc
immich_shared_albums: false
immich_album_names:
  - Tokio
  - New York
immich_resolution: preview
```

Example using tag names:
```yaml
image_url: immich+https://immich.your.domain/api
immich_api_keys:
  - 0vOb7EZ7YSajUQckMt6Cbnri8Ifzo5dlD9Q5hnnXlc
immich_tag_names:
  - Family
  - Friends
immich_resolution: original
```

Example of media elements that contain certain persons:
```yaml
image_url: immich+https://immich.your.domain/api
immich_api_keys:
  - 0vOb7EZ7YSajUQckMt6Cbnri8Ifzo5dlD9Q5hnnXlc
immich_persons:
  - Alice
  - Bob
  - [John, Jane]
```
This will show media items containing either Alice, Bob or John and Jane.

Example showing immich memories:
```yaml
image_url: immich+https://immich.your.domain/api
immich_api_keys:
  - 0vOb7EZ7YSajUQckMt6Cbnri8Ifzo5dlD9Q5hnnXlc
immich_memories: true
```

Example showing immich favorites:
```yaml
image_url: immich+https://immich.your.domain/api
immich_api_keys:
  - 0vOb7EZ7YSajUQckMt6Cbnri8Ifzo5dlD9Q5hnnXlc
immich_favorites: true
```

## Website as iframe
You can also display a website in an iframe.
Just add the prefix `iframe+` to the URL of the website you want to show:

For example:
```yaml
image_url: iframe+https://projects.sntosh.in/clock/
```

!!! info
    Not all websites can be used in an iframe.
    A website can set an X-Frame-Options HTTP header to prevent it from being used in an iframe.


## Embed external content
You can also embed external content in a HTML embed element.
Simply prefix `embed+` to the URL of the source you want to embed:

For example:
```yaml
image_url: embed+https://external.source.test/embed.pdf
```

## BirdNET-Go & Natural History Plates

WallPanel includes native screensaver rendering for [BirdNET-Go](https://github.com/tphakala/birdnet-go) bioacoustic bird monitors, inspired by [Backyard Birds / Specimen Sheet](https://github.com/dmellok/tesserae-widget-backyard-birds) by dmellok.

It dynamically searches open public-domain archives (Wikimedia Commons and Biodiversity Heritage Library collections) for historical 18th- and 19th-century natural history plates (by Audubon, Gould, Lear, Broinowski, Keulemans, Wilson, and others) for any species worldwide, with automatic fallback to [iNaturalist](https://www.inaturalist.org/) open taxa photography if no historical plate exists.

### Standalone Configuration

```yaml
wallpanel:
  enabled: true
  birdnet_url: "http://birdnet.local:8080" # BirdNET-Go server address
  birdnet_layout: "folio"                  # folio, cluster, spread, plate, chart, latest, auto
  birdnet_theme: "sage"                    # sage, parchment, dark
  birdnet_label: "BACKYARD"                # Header tag / garden name
  birdnet_order: "recent"                  # recent, count, name, random
  birdnet_min_confidence: 50              # Minimum confidence percentage
  birdnet_update_interval: 300             # Polling interval in seconds (default: 5 min)
```

If the server cannot be reached or reports no species, WallPanel keeps showing the last species it received. Before the first successful fetch it shows an empty cluster sheet.

### Layouts

| Layout | Description |
| --- | --- |
| `folio` | **Victorian Folio Bookplate** (default). Double-bordered antique plate featuring the garden tag, Roman numeral plate numbering (`Pl. XXIII.`), centered bird artwork, small-caps common name, italic Latin binomial, and detection note (`Heard the thirty-second time today, last at 14:02.`). |
| `cluster` | **Specimen Sheet**. Collage of birds heard today perched on branches with species count and date caption. Dynamically adapts between portrait and landscape aspect ratios. |
| `spread` | **Dual-Frame Folio Spread**. Side-by-side spread displaying the specimen sheet on the left and the featured Victorian folio plate on the right (collapses to single plate in portrait mode). |
| `plate` | **Classic Natural History Plate**. Clean, minimalist historical plate with antique titling. |
| `chart` | **Day Activity Ledger**. 24-hour activity grid matrix showing hourly detection frequency per species. |
| `latest` | Focuses specifically on the most recently detected visitor. |
| `auto` | Intelligently cycles across species plates and summaries. When extended vertical card boxes are detected on one flank, it automatically suppresses two-sided spreads and selects card-safe offset templates (`folio`, `plate`, `cluster`). |

### Color Themes & Custom Styling

WallPanel provides built-in color palettes calibrated for natural history prints, while also supporting custom plate colors, bespoke mat coloring, and granular CSS variable overrides:

#### 1. Built-in Theme Presets (`birdnet_theme`)

- `sage` (default): Authentic slate sage grey-blue plate background (`#7f908f`) inside a warm museum mat (`#ebe6da`).
- `parchment`: Warm antique cream book page (`#f9f5ec`) with soft aged matting (`#e8e2d2`) and sepia inking (`#2b2520`).
- `dark`: Deep graphite slate (`#1d2424`) with obsidian matting (`#141718`) and pale sage typography (`#e2e8e7`) for low-light or OLED displays.
- `forest`: Deep botanical moss-green plate (`#596752`) with light lichen matting (`#e2e5db`).
- `slate`: Cool mineral blue-grey plate (`#586d77`) with mist-grey matting (`#dce2e3`).
- `ivory`: Refined bright archival ivory plate (`#faf8f5`) with warm linen matting (`#f0ece3`).

```yaml
wallpanel:
  enabled: true
  birdnet_layout: "auto"
  birdnet_theme: "sage" # "sage", "parchment", "dark", "forest", "slate", "ivory"
```

#### 2. Mat Color Configuration (`birdnet_mat_color`)

The mat is the outer gallery border surrounding the inner plate or folio card. By default, it inherits the palette preset (such as `#ebe6da` in `sage`). You can customize the mat border independently:

- Any CSS color: e.g. `"#1d2424"`, `"#2a3433"`, `rgb(20, 24, 25)`
- `"same"` or `"match"`: Sets the mat to the exact same color as the inner plate, removing the two-tone border for a uniform single-color background across the entire viewport.
- Preset keywords: `"dark"`, `"parchment"`, `"sage"`, `"forest"`, `"slate"`, `"ivory"`

```yaml
wallpanel:
  enabled: true
  birdnet_layout: "plate"
  birdnet_theme: "sage"
  birdnet_mat_color: "same" # Seamless full-screen sage background
  # or:
  # birdnet_mat_color: "#141718" # Dark museum matting around sage plate
```

#### 3. Direct Hex / RGB Colors in YAML

You can pass any CSS hex color (e.g. `"#6b7d7b"`), `rgb()`, or `hsl()` string directly to `birdnet_theme`:

```yaml
wallpanel:
  enabled: true
  birdnet_layout: "cluster"
  birdnet_theme: "#5c6b64" # Custom plate background color
```

#### 4. Granular CSS Variable Overrides (`custom_css`)

For full bespoke styling, override the CSS variables via `custom_css`:

```yaml
wallpanel:
  enabled: true
  birdnet_theme: "sage"
  custom_css: |
    .wallpanel-birdnet-container {
      --wp-birdnet-plate: #758784;     /* Inner plate card background */
      --wp-birdnet-mat: #e6dfd1;       /* Outer museum matting border */
      --wp-birdnet-ink: #1c2626;       /* Primary text & rule borders */
      --wp-birdnet-ink-muted: #384948; /* Secondary scientific notes */
      --wp-birdnet-border: #1c2626;    /* Card framing border */
    }
```

### Screensaver Card Clearance (`birdnet_card_offset`)

When pairing WallPanel screensaver cards (e.g., clocks, weather forecasts, or entity badges) alongside the screensaver, WallPanel can automatically or manually offset `folio`, `plate`, and `cluster` layouts to avoid card occlusion:

| Setting | Behavior |
| :--- | :--- |
| `auto` (default) | Automatically detects screensaver cards and shifts plates or specimen clusters to the opposite flank, leaving an unobstructed column ($620\text{px}\text{--}1,150\text{px}$) for cards. |
| `left` | Forces the artwork plate or specimen sheet to align to the left flank, leaving the right side clear for cards. |
| `right` | Forces the artwork plate or specimen sheet to align to the right flank, leaving the left side clear for cards. |
| `none` | Keeps plates and specimen clusters horizontally centered on the display. |

```yaml
wallpanel:
  enabled: true
  birdnet_layout: "folio" # or "cluster", "plate", "auto"
  birdnet_card_offset: "auto" # Leaves opposite flank open for cards
```

### Spread Layout Card Integration (`birdnet_spread_cards`)

When utilizing the dual-frame `spread` layout alongside screensaver overlay cards (e.g., clocks, weather forecasts, or sensor summaries), WallPanel can reposition and scale the folio bookplate so that cards share that flank without visual collision, preserving the specimen cluster at full scale on the opposite flank:

| Setting | Behavior |
| :--- | :--- |
| `disabled` (default) | Standard dual-frame spread: specimen cluster on the left, full-size folio on the right. |
| `auto` | Automatically detects the card flank, positions the folio on the card flank, and dynamically scales the folio down to clear the cards. |
| `fixed` | Positions the folio on the card flank and scales the folio down to a calibrated ratio (`0.70`). A custom numeric ratio between `0.2` and `1.0` may also be supplied directly (e.g., `0.75`). |

```yaml
wallpanel:
  enabled: true
  birdnet_layout: "spread"
  birdnet_spread_cards: "auto" # "disabled", "auto", or "fixed" (or 0.70)
```

### Configurable Text & Templating

WallPanel supports custom format strings and variable interpolation for primary and secondary text across all BirdNET views:

| Setting | Applies To | Default | Description |
| :--- | :--- | :--- | :--- |
| `birdnet_main_text` | `folio`, `plate`, `spread` | `${name}.` | Primary heading or species title. |
| `birdnet_sub_text` | `folio`, `plate`, `spread` | Victorian detection note | Secondary description, scientific binomial, or custom status. |
| `birdnet_cluster_main` | `cluster` | `${label} · heard today · ${date} · ${species_count} species` | Primary summary caption on specimen cluster sheet. |
| `birdnet_cluster_sub` | `cluster` | `Historical plates watercolour after Audubon...` | Secondary attribution subtitle on specimen cluster sheet. |

#### Available Variables

The following placeholders are dynamically interpolated when enclosed within `${...}`:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `${name}` / `${common}` | Species vernacular/common name | `Australian Magpie` |
| `${sci}` / `${scientific}` | Latin binomial | `Gymnorhina tibicen` |
| `${count}` | Total detections recorded today | `35` |
| `${ordinal}` | Word-form ordinal detection rank | `thirty-fifth` |
| `${time}` / `${last}` | Timestamp of most recent detection | `14:02` |
| `${first}` | Timestamp of initial detection today | `06:14` |
| `${confidence}` | Confidence score of most recent detection | `94%` |
| `${plate}` | Roman numeral plate index | `XXIII` |
| `${label}` | Garden or station designation | `BACKYARD` |
| `${date}` | Formatted calendar date | `Tue 20 Oct` |
| `${species_count}` | Total unique species observed today | `12` |

#### YAML Example

```yaml
wallpanel:
  enabled: true
  birdnet_layout: "spread"
  birdnet_main_text: "${name}"
  birdnet_sub_text: "${sci} · Heard ${count} times today (last at ${time})"
  birdnet_cluster_main: "${label} · ${species_count} species recorded on ${date}"
  birdnet_cluster_sub: "Live acoustic monitoring via BirdNET-Go"
```

### Artwork Resolution Hierarchy

WallPanel resolves artwork through an automated fallback pipeline:

1. **Inline Dashboard Overrides (`birdnet_plates`)**:
   Map species directly in dashboard YAML using local file paths, full HTTP/HTTPS URLs, or Wikimedia Commons file identifiers:
   ```yaml
   wallpanel:
     birdnet_plates:
       # Direct HTTPS URL string
       "Corvus mellori": "https://example.com/birds/little_raven.jpg"
       # Full object with artist attribution, custom crop box, and remote URL
       "Australian Magpie":
         file: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Gymnorhina_tibicen.jpg"
         artist: "John Gould"
         box: [0.1, 0.05, 0.9, 0.95]
       # Local Home Assistant media or www path
       "Galah": "/media/local/birds/Galah.jpeg"
       # Bare filename resolved against active local bird path
       "Willie Wagtail":
         file: "WillieWagtail.jpeg"
   ```

2. **Custom or Auto-discovered Manifest (`plates.json`)**:
   If `birdnet_plates_url` is specified, or if `/local/birds/plates.json` or `/media/local/birds/plates.json` exists, WallPanel loads species mappings and crop boxes automatically.

3. **Zero-Configuration Local Discovery (Convention over Configuration)**:
   Users can simply drop JPEG, PNG, or WebP images into Home Assistant's `/config/www/birds/` (accessible at `/local/birds/`) or `/media/birds/` (accessible at `/media/local/birds/`).
   WallPanel tests standard naming conventions automatically:
   - PascalCase common name: `AustralianMagpie.jpeg`, `LittleRaven.jpeg`, `Magpie-lark.jpeg`
   - Scientific binomial: `Corvus_mellori.jpeg`, `Gymnorhina_tibicen.jpeg`

4. **Dynamic Remote Search (Wikimedia Commons & iNaturalist)**:
   If no local image exists for a detected visitor, WallPanel automatically queries Wikimedia Commons for public-domain natural history plates and watercolors, falling back to iNaturalist open taxa photography if no plate is cataloged.
