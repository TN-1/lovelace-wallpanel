/**
 * (C) 2020-2026 by Jan Schneider (oss@janschneider.net)
 * Released under the GNU General Public License v3.0
 */

const version = "4.67.2";
const mediaLoadRetryDelay = 1000;
const mediaListRetryDelay = 3000;
const mediaListRateLimitRetryDelay = 60000;
const maxMediaListRateLimitRetryDelay = 3600000;
const defaultConfig = {
	enabled: false,
	enabled_on_views: [],
	debug: false,
	wait_for_browser_mod_time: 0.25,
	log_level_console: "info",
	log_level_system: "warning",
	system_target_log_level: "",
	alert_errors: true,
	hide_toolbar: false,
	keep_toolbar_space: false,
	hide_toolbar_action_icons: false,
	hide_toolbar_on_subviews: false,
	hide_sidebar: false,
	close_more_info_dialog_time: 0.0,
	fullscreen: false,
	keep_fullscreen: true,
	z_index: 1000,
	idle_time: 15,
	fade_in_time: 3.0,
	fade_out_time_motion_detected: 1.0,
	fade_out_time_screensaver_entity: 3.0,
	fade_out_time_browser_mod_popup: 1.0,
	fade_out_time_interaction: 0.3,
	crossfade_time: 3.0,
	display_time: 15.0,
	keep_screen_on_time: 0,
	black_screen_after_time: 0,
	control_reactivation_time: 1.0,
	disable_context_menu: false,
	screensaver_start_navigation_path: "",
	screensaver_stop_close_browser_mod_popup: false,
	screensaver_entity: "",
	stop_screensaver_on_mouse_move: true,
	stop_screensaver_on_mouse_click: true,
	stop_screensaver_on_key_down: true,
	stop_screensaver_on_location_change: true,
	disable_screensaver_on_browser_mod_popup: false,
	disable_screensaver_on_browser_mod_popup_func: "",
	disable_screensaver_when_assist_active: true,
	show_images: true,
	image_url: "https://picsum.photos/${width}/${height}?random=${timestamp}",
	image_url_entity: "",
	force_load_media_with_fetch: false,
	stream_load_media: false,
	media_entity_load_unchanged: true,
	iframe_load_unchanged: false,
	iframe_interaction: false,
	immich_api_keys: [],
	immich_api_request_timeout: 15,
	immich_album_names: [],
	immich_shared_albums: true,
	immich_tag_names: [],
	immich_exclude_tag_names: [],
	immich_persons: [],
	immich_memories: false,
	immich_favorites: false,
	immich_resolution: "preview",
	image_fit_landscape: "cover", // cover / contain
	image_fit_portrait: "contain", // cover / contain
	calculate_media_size: true,
	media_horizontal_align: "center", // left / center / right
	media_vertical_align: "middle", // top / middle  / bottom
	media_list_update_interval: 3600,
	media_list_max_size: 500,
	media_order: "random", // sorted / random / random_but_synced / random_path
	exclude_filenames: [], // Excluded filenames (regex)
	exclude_media_types: [], // Exclude media types (image / video)
	exclude_media_orientation: "", // Exclude media items with this orientation (landscape / portrait / auto)
	image_background: "color", // color / image
	video_loop: false,
	video_volume: 0.0,
	video_play_to_end: false,
	touch_zone_size_next_image: 15,
	touch_zone_size_previous_image: 15,
	show_progress_bar: false,
	show_image_info: false,
	fetch_address_data: false,
	image_info_template: "${DateTimeOriginal}",
	info_animation_duration_x: 0,
	info_animation_duration_y: 0,
	info_animation_timing_function_x: "ease",
	info_animation_timing_function_y: "ease",
	info_move_pattern: "random",
	info_move_interval: 0,
	info_move_fade_duration: 2.0,
	image_animation_ken_burns: false,
	image_animation_ken_burns_zoom: 1.3,
	image_animation_ken_burns_delay: 0,
	image_animation_ken_burns_duration: 0,
	image_animation_ken_burns_animations: ["simple"], // simple / experimental
	camera_motion_detection_enabled: false,
	camera_motion_detection_stop_screensaver: true,
	camera_motion_detection_set_entity: "",
	camera_motion_detection_facing_mode: "user",
	camera_motion_detection_threshold: 5,
	camera_motion_detection_capture_width: 64,
	camera_motion_detection_capture_height: 48,
	camera_motion_detection_capture_interval: 0.3,
	camera_motion_detection_capture_visible: false,
	camera_motion_detection_motion_start_delay: 0.0,
	camera_motion_detection_motion_stop_delay: 2.0,
	theme: "",
	custom_css: "",
	style: {},
	badges: [],
	cards: [],
	views: [],
	birdnet_url: "",
	birdnet_token: "",
	birdnet_plates_url: "",
	birdnet_layout: "folio",
	birdnet_theme: "sage",
	birdnet_mat_color: "",
	birdnet_blend_mode: "auto",
	birdnet_label: "BACKYARD",
	birdnet_min_confidence: 50,
	birdnet_update_interval: 300,
	birdnet_order: "recent",
	birdnet_card_offset: "auto",
	birdnet_spread_cards: "auto",
	birdnet_main_text: "",
	birdnet_sub_text: "",
	birdnet_cluster_main: "",
	birdnet_cluster_sub: "",
	content_interaction: false,
	profile: "",
	profile_entity: "",
	profiles: {}
};
const renamedConfigOptions = {
	image_excludes: "exclude_filenames",
	image_fit: "image_fit_landscape",
	image_order: "media_order",
	enabled_on_tabs: "enabled_on_views",
	image_list_update_interval: "media_list_update_interval",
	screensaver_stop_navigation_path: "screensaver_start_navigation_path",
	card_interaction: "content_interaction",
	immich_api_key: "immich_api_keys",
	caclulate_media_size: "calculate_media_size"
};

let dashboardConfig = {};
let config = {};
let currentLocation = null;
let activePanel = null;
let activeTab = null;
let wallpanelContainer = null;
let wallpanel = null;
let skipDisableScreensaverOnLocationChanged = false;
const classStyles = {
	"wallpanel-screensaver-image-background": {
		filter: "blur(15px)",
		background: "#00000000",
		"background-position": "center",
		"background-size": "cover"
	},
	"wallpanel-screensaver-image-info-container": {},
	"wallpanel-screensaver-image-info": {
		position: "absolute",
		bottom: "0.5em",
		right: "0.5em",
		"max-width": "calc(100% - 2em)",
		"max-height": "calc(100% - 5em)",
		padding: "0.1em 0.5em 0.1em 0.5em",
		"font-size": "2em",
		background: "#00000055",
		"backdrop-filter": "blur(2px)",
		"border-radius": "0.5rem"
	},
	"wallpanel-progress": {
		position: "absolute",
		bottom: "0",
		height: "2px",
		width: "100%"
	},
	"wallpanel-progress-inner": {
		height: "100%",
		"background-color": "white"
	},
	"wallpanel-message": {
		width: "30em",
		"max-width": "100%",
		"box-sizing": "border-box",
		padding: "1em",
		"border-radius": "0.5rem",
		border: "1px solid black",
		"box-shadow": "0 4px 12px rgba(0, 0, 0, 0.3)",
		"font-size": "1.5em",
		color: "white",
		cursor: "pointer",
		opacity: "0",
		transform: "translateX(100%)",
		transition: "all 0.4s ease"
	},
	"wallpanel-message.show": {
		opacity: 1,
		transform: "translateX(0)"
	},
	"wallpanel-message.error": {
		"background-color": "#f8d7da",
		color: "#721c24",
		"border-color": "#721c24"
	},
	"wallpanel-message.warning": {
		"background-color": "#fff3cd",
		color: "#856404",
		"border-color": "#856404"
	},
	"wallpanel-message.info": {
		"background-color": "#d1ecf1",
		color: "#0c5460",
		"border-color": "#0c5460"
	},
	"wallpanel-message.success": {
		"background-color": "#d4edda",
		color: "#155724",
		"border-color": "#155724"
	},
	"wallpanel-message-title": {
		"font-weight": "bold",
		"margin-bottom": "0.25rem"
	}
};

const mediaInfoCache = new Map();
const birdnetImageCache = new Map();

function escapeHtml(str) {
	return String(str == null ? "" : str).replace(
		/[&<>"']/g,
		(c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
	);
}

function toRoman(num) {
	if (!num || num < 1) return "I";
	const lookup = [
		["M", 1000],
		["CM", 900],
		["D", 500],
		["CD", 400],
		["C", 100],
		["XC", 90],
		["L", 50],
		["XL", 40],
		["X", 10],
		["IX", 9],
		["V", 5],
		["IV", 4],
		["I", 1]
	];
	let roman = "";
	for (const [letter, value] of lookup) {
		while (num >= value) {
			roman += letter;
			num -= value;
		}
	}
	return roman;
}

const ORDINAL_WORDS = [
	"",
	"first",
	"second",
	"third",
	"fourth",
	"fifth",
	"sixth",
	"seventh",
	"eighth",
	"ninth",
	"tenth",
	"eleventh",
	"twelfth",
	"thirteenth",
	"fourteenth",
	"fifteenth",
	"sixteenth",
	"seventeenth",
	"eighteenth",
	"nineteenth"
];
const TENS_WORDS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const TENTH_WORDS = [
	"",
	"",
	"twentieth",
	"thirtieth",
	"fortieth",
	"fiftieth",
	"sixtieth",
	"seventieth",
	"eightieth",
	"ninetieth"
];

function formatOrdinalWords(n) {
	if (!n || n < 1) return "";
	if (n <= 19) return ORDINAL_WORDS[n];
	if (n < 100) {
		const tens = Math.floor(n / 10);
		const units = n % 10;
		if (units === 0) return TENTH_WORDS[tens];
		return `${TENS_WORDS[tens]}-${ORDINAL_WORDS[units]}`;
	}
	return `${n}th`;
}

function getOvalSlots(n, isPortrait = false) {
	// Slots are described by centre and size in fractions of the canvas. `at()` clamps the box
	// into the canvas but keeps the requested centre, so callers must use x/y/w/h for anything
	// that has to line up with the drawn box (for example labels).
	function at(cx, cy, w, h, scale = 1.0) {
		const x = Math.min(Math.max(cx - w / 2, 0.0), 1 - w);
		const y = Math.min(Math.max(cy - h / 2, 0.0), 1 - h);
		return { x, y, w, h, cx, cy, scale };
	}

	// Plate artwork usually has transparent margins, so a little box overlap is acceptable.
	// Report a collision only when the intersection covers a noticeable part of the smaller box.
	function overlaps(a, b, maxFraction = 0.22) {
		const ix = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
		const iy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
		if (ix <= 0 || iy <= 0) {
			return false;
		}
		return (ix * iy) / Math.min(a.w * a.h, b.w * b.h) > maxFraction;
	}

	// Shrink the given specimens around their centres until no pair of slots intersects.
	// Fixed slots (the hero) take part in the test but keep their size.
	function resolveCollisions(fixed, specs) {
		let factor = 1.0;
		let slots = [];
		for (let attempt = 0; attempt < 24 && factor > 0.55; attempt++) {
			slots = specs.map((p) => at(p.cx, p.cy, p.w * factor, p.h * factor, p.scale));
			const all = fixed.concat(slots);
			let collides = false;
			for (let i = 0; i < all.length && !collides; i++) {
				for (let j = i + 1; j < all.length; j++) {
					if (overlaps(all[i], all[j])) {
						collides = true;
						break;
					}
				}
			}
			if (!collides) {
				break;
			}
			factor *= 0.94;
		}
		return slots;
	}

	if (n <= 1) {
		return [at(0.5, 0.44, 0.6, 0.65, 1.0)];
	}
	if (n === 2) {
		const w = isPortrait ? 0.4 : 0.3;
		const h = isPortrait ? 0.34 : 0.3;
		return resolveCollisions(
			[],
			[
				{ cx: 0.5, cy: 0.28, w: w * 1.08, h: h * 1.08, scale: 1.08 },
				{ cx: 0.5, cy: 0.6, w: w * 0.88, h: h * 0.88, scale: 0.88 }
			]
		);
	}
	if (n === 3) {
		const ring = 3;
		const rx = isPortrait ? 0.26 : 0.3;
		const ry = isPortrait ? 0.28 : 0.24;
		const w = isPortrait ? 0.3 : 0.22;
		const h = isPortrait ? 0.3 : 0.26;
		const specs = [];
		for (let i = 0; i < ring; i++) {
			const a = (-90 + (360 * i) / ring) * (Math.PI / 180);
			const scale = Number((1.08 - 0.1 * i).toFixed(3));
			specs.push({
				cx: 0.5 + rx * Math.cos(a),
				cy: 0.44 + ry * Math.sin(a),
				w: w * scale,
				h: h * scale,
				scale
			});
		}
		return resolveCollisions([], specs);
	}

	// n >= 4: centre hero specimen (#1) with a bilaterally balanced ring of specimens (#2 to #N).
	// Ring order alternates right/left of the apex, so apparent size falls off from apex to base.
	const ring = n - 1;
	const rx = isPortrait ? 0.35 : 0.39;
	const ry = isPortrait ? 0.385 : 0.37;
	const cyCenter = isPortrait ? 0.465 : 0.46;
	const heroW = isPortrait ? 0.42 : 0.4;
	const heroH = isPortrait ? 0.44 : 0.42;
	const slotW = isPortrait ? 0.24 : 0.23;
	const slotH = isPortrait ? 0.24 : 0.23;

	const hero = at(0.5, cyCenter, heroW, heroH, 1.0);
	const specs = [];
	for (let k = 0; k < ring; k++) {
		let aDeg;
		if (k === 0) {
			aDeg = -90; // Top apex (#2 overall)
		} else {
			const step = Math.ceil(k / 2);
			const delta = (360 / ring) * step;
			aDeg = k % 2 === 1 ? -90 + delta : -90 - delta;
		}
		const a = aDeg * (Math.PI / 180);
		// Apex 1.15 down to 0.75 for the base specimens
		const scale = ring > 1 ? Number((1.15 - 0.4 * (k / (ring - 1))).toFixed(3)) : 1.0;
		specs.push({
			cx: 0.5 + rx * Math.cos(a),
			cy: cyCenter + ry * Math.sin(a),
			w: slotW * scale,
			h: slotH * scale,
			scale
		});
	}
	return [hero].concat(resolveCollisions([hero], specs));
}

const probedUrlCache = new Map();
const probedUrlCacheMaxSize = 500;

function rememberProbeResult(url, ok) {
	if (probedUrlCache.size >= probedUrlCacheMaxSize) {
		// Maps iterate in insertion order, so the first key is the oldest entry
		probedUrlCache.delete(probedUrlCache.keys().next().value);
	}
	probedUrlCache.set(url, ok);
}

function probeImageUrl(url, timeoutMs = 1500) {
	if (probedUrlCache.has(url)) {
		return Promise.resolve(probedUrlCache.get(url));
	}
	return new Promise((resolve) => {
		if (typeof Image !== "undefined") {
			let finished = false;
			const img = new Image();
			const finish = (ok, cacheResult) => {
				if (finished) {
					return;
				}
				finished = true;
				clearTimeout(timer);
				// Detach handlers and abort any pending load so the element can be collected
				img.onload = null;
				img.onerror = null;
				if (!ok) {
					img.removeAttribute("src");
				}
				if (cacheResult) {
					rememberProbeResult(url, ok);
				}
				resolve(ok);
			};
			// A timeout is not proof that the file is missing, so it is not cached
			const timer = setTimeout(() => finish(false, false), timeoutMs);
			img.onload = () => finish(true, true);
			img.onerror = () => finish(false, true);
			img.src = url;
		} else {
			const controller = new AbortController();
			const timer = setTimeout(() => controller.abort(), timeoutMs);
			fetch(url, { method: "HEAD", signal: controller.signal })
				.then((r) => {
					rememberProbeResult(url, r.ok);
					resolve(r.ok);
				})
				.catch(() => resolve(false))
				.finally(() => clearTimeout(timer));
		}
	});
}

function getMediaListUpdateIntervalSeconds() {
	if (mediaSourceType() === "birdnet" && Number(config.birdnet_update_interval) > 0) {
		return Number(config.birdnet_update_interval);
	}
	return config.media_list_update_interval;
}

function getBirdnetCandidateFilenames(sciName, commonName, vettedFile = "") {
	const names = new Set();
	if (vettedFile) {
		names.add(vettedFile);
	}
	if (commonName) {
		const trimmed = commonName.trim();
		// PascalCase without spaces: "Little Raven" -> "LittleRaven", "Magpie-lark" -> "Magpie-lark"
		const noSpaces = trimmed.replace(/\s+/g, "");
		names.add(noSpaces);
		if (noSpaces.includes("-")) {
			names.add(noSpaces.replace(/-/g, ""));
		}
		const pascal = trimmed.replace(/(?:^|[\s_])+(\w)/g, (_, c) => c.toUpperCase());
		names.add(pascal);
		names.add(trimmed.toLowerCase().replace(/[\s_]+/g, "-"));
		names.add(trimmed.toLowerCase().replace(/[\s-]+/g, "_"));
	}
	if (sciName) {
		const trimmedSci = sciName.trim();
		names.add(trimmedSci.replace(/\s+/g, "_"));
		names.add(trimmedSci.replace(/\s+/g, ""));
		names.add(trimmedSci.toLowerCase().replace(/\s+/g, "_"));
	}

	const extensions = [".png", ".webp", ".jpeg", ".jpg"];
	const results = [];
	for (const name of names) {
		if (!name) continue;
		if (/\.(jpe?g|png|webp|svg)$/i.test(name)) {
			results.push(name);
		} else {
			for (const ext of extensions) {
				results.push(`${name}${ext}`);
			}
		}
	}
	return Array.from(new Set(results));
}

const BIRDNET_VETTED_PLATES = {};

const birdnetFontsLinkId = "wallpanel-birdnet-fonts";

function ensureBirdnetFonts() {
	// @font-face rules are not applied from inside a shadow root, and an @import is ignored unless
	// it is the first rule of its stylesheet. Load the plate fonts from the document instead.
	if (typeof document === "undefined" || document.getElementById(birdnetFontsLinkId)) {
		return;
	}
	const link = document.createElement("link");
	link.id = birdnetFontsLinkId;
	link.rel = "stylesheet";
	link.href =
		"https://fonts.googleapis.com/css2?family=IM+Fell+English+SC&family=IM+Fell+English:ital@0;1&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap";
	document.head.appendChild(link);
}

function getBirdnetCss() {
	return `
		.wallpanel-birdnet-container {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
			overflow: hidden;
			pointer-events: none;
			font-family: var(--wp-birdnet-serif, "IM Fell English", "Playfair Display", Georgia, serif);
			--wp-birdnet-sc: 'IM Fell English SC', 'Playfair Display', Georgia, serif;
			--wp-birdnet-serif: 'IM Fell English', 'Playfair Display', Georgia, serif;
			--wp-birdnet-mat: #ebe6da;
			--wp-birdnet-plate: #82918a;
			--wp-birdnet-ink: #1c2626;
			--wp-birdnet-ink-muted: #384948;
			--wp-birdnet-border: #1c2626;
		}
		.wallpanel-birdnet-container.theme-parchment {
			--wp-birdnet-mat: #e8e2d2;
			--wp-birdnet-plate: #f9f5ec;
			--wp-birdnet-ink: #2b2520;
			--wp-birdnet-ink-muted: #5c5248;
			--wp-birdnet-border: #3b322a;
		}
		.wallpanel-birdnet-container.theme-dark {
			--wp-birdnet-mat: #141718;
			--wp-birdnet-plate: #1d2424;
			--wp-birdnet-ink: #e2e8e7;
			--wp-birdnet-ink-muted: #95a7a5;
			--wp-birdnet-border: #465554;
		}
		.wallpanel-birdnet-container.theme-forest {
			--wp-birdnet-mat: #e2e5db;
			--wp-birdnet-plate: #596752;
			--wp-birdnet-ink: #162014;
			--wp-birdnet-ink-muted: #33402e;
			--wp-birdnet-border: #162014;
		}
		.wallpanel-birdnet-container.theme-slate {
			--wp-birdnet-mat: #dce2e3;
			--wp-birdnet-plate: #586d77;
			--wp-birdnet-ink: #141e24;
			--wp-birdnet-ink-muted: #2f3f47;
			--wp-birdnet-border: #141e24;
		}
		.wallpanel-birdnet-container.theme-ivory {
			--wp-birdnet-mat: #f0ece3;
			--wp-birdnet-plate: #faf8f5;
			--wp-birdnet-ink: #1c1a17;
			--wp-birdnet-ink-muted: #4a453e;
			--wp-birdnet-border: #2b2722;
		}
		.wp-birdnet-mat {
			width: 100%;
			height: 100%;
			background-color: var(--wp-birdnet-mat);
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: clamp(12px, 3.5vmin, 48px);
			overflow: hidden;
		}
		.wp-birdnet-mat.offset-left {
			justify-content: flex-start;
			padding-left: clamp(24px, 5vw, 90px);
		}
		.wp-birdnet-mat.offset-right {
			justify-content: flex-end;
			padding-right: clamp(24px, 5vw, 90px);
		}
		.wp-birdnet-plate-card {
			background-color: var(--wp-birdnet-plate);
			color: var(--wp-birdnet-ink);
			border: 1.5px solid var(--wp-birdnet-border);
			box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12), inset 0 0 40px rgba(0, 0, 0, 0.04);
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			position: relative;
			max-width: 100%;
			max-height: 100%;
		}
		.wp-birdnet-folio-card {
			aspect-ratio: 0.68;
			height: 100%;
			max-width: 90vw;
		}
		.wp-birdnet-folio-card.offset-left {
			margin: 0 auto 0 0;
		}
		.wp-birdnet-folio-card.offset-right {
			margin: 0 0 0 auto;
		}
		.wp-birdnet-inner-border {
			border: 0.75px solid var(--wp-birdnet-border);
			margin: clamp(3px, 0.6vmin, 8px);
			padding: clamp(8px, 1.5vmin, 20px);
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			height: calc(100% - clamp(6px, 1.2vmin, 16px));
			position: relative;
		}
		.wp-birdnet-header {
			display: flex;
			justify-content: space-between;
			align-items: baseline;
			font-size: clamp(9px, 1.3vmin, 15px);
			letter-spacing: 2.5px;
			text-transform: uppercase;
			font-weight: 600;
			color: var(--wp-birdnet-ink);
			padding-bottom: clamp(4px, 0.8vmin, 10px);
			border-bottom: 0.5px solid rgba(28, 38, 38, 0.15);
		}
		.wp-birdnet-artwork-wrapper {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			overflow: hidden;
			padding: clamp(6px, 1.5vmin, 24px);
		}
		.wp-birdnet-artwork {
			max-width: 100%;
			max-height: 100%;
			object-fit: contain;
			mix-blend-mode: var(--wp-birdnet-blend-mode, multiply);
			filter: var(--wp-birdnet-blend-filter, contrast(1.06) brightness(1.04));
		}
		.wp-birdnet-artwork-crop-container {
			position: relative;
			overflow: hidden;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.wp-birdnet-footer {
			text-align: center;
			padding-top: clamp(6px, 1.2vmin, 16px);
			border-top: 0.5px solid rgba(28, 38, 38, 0.15);
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: clamp(2px, 0.4vmin, 6px);
		}
		.wp-birdnet-name {
			font-size: clamp(14px, 2.4vmin, 30px);
			font-weight: 700;
			letter-spacing: 3px;
			text-transform: uppercase;
			font-variant: small-caps;
			color: var(--wp-birdnet-ink);
			line-height: 1.15;
		}
		.wp-birdnet-sci {
			font-size: clamp(11px, 1.5vmin, 18px);
			font-style: italic;
			letter-spacing: 1px;
			color: var(--wp-birdnet-ink-muted);
		}
		.wp-birdnet-note {
			font-size: clamp(9px, 1.2vmin, 14px);
			font-style: italic;
			color: var(--wp-birdnet-ink-muted);
			margin-top: clamp(2px, 0.3vmin, 4px);
		}
		.wp-birdnet-cluster-mat {
			background-color: var(--wp-birdnet-mat);
			padding: clamp(8px, 2vmin, 28px);
		}
		.wp-birdnet-cluster-mat.offset-right {
			padding-left: clamp(470px, 26vw, 530px);
			justify-content: flex-end;
		}
		.wp-birdnet-cluster-mat.offset-left {
			padding-right: clamp(470px, 26vw, 530px);
			justify-content: flex-start;
		}
		.wp-birdnet-cluster-card {
			width: 100%;
			height: 100%;
			max-width: 100%;
			max-height: 100%;
			border: none;
			box-shadow: none;
			background-color: transparent;
		}
		.wp-birdnet-cluster-inner {
			display: flex;
			flex-direction: column;
			height: 100%;
			width: 100%;
			margin: 0;
			border: none;
			padding: 0;
			box-sizing: border-box;
		}
		.wp-birdnet-cluster-vignette {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: clamp(4px, 1.2vmin, 14px);
			width: 100%;
			overflow: hidden;
			padding: clamp(4px, 0.8vmin, 10px);
			box-sizing: border-box;
		}
		.wp-birdnet-cluster-sheet {
			position: relative;
			margin: 0 auto;
			width: 100%;
			height: 100%;
			max-width: min(100%, calc((100vh - 40px) * 1.35));
			aspect-ratio: 1.35;
			display: flex;
			flex-direction: column;
			background-color: var(--wp-birdnet-plate);
			border: 1.5px solid var(--wp-birdnet-border);
			box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25), inset 0 0 40px rgba(0, 0, 0, 0.04);
			padding: clamp(8px, 1.6vmin, 20px);
			box-sizing: border-box;
			transition: margin 0.3s ease;
		}
		.wp-birdnet-cluster-sheet.offset-left {
			margin: 0 auto 0 0;
		}
		.wp-birdnet-cluster-sheet.offset-right {
			margin: 0 0 0 auto;
		}
		@media (max-aspect-ratio: 1) {
			.wp-birdnet-cluster-sheet,
			.wp-birdnet-cluster-sheet.offset-left,
			.wp-birdnet-cluster-sheet.offset-right {
				max-width: 100%;
				aspect-ratio: 0.85;
				margin: 0 auto;
			}
		}
		.wp-birdnet-oval-canvas {
			position: relative;
			flex: 1;
			width: 100%;
			min-height: 0;
			overflow: visible;
			background-color: var(--wp-birdnet-plate);
		}
		.wp-birdnet-oval-slot {
			position: absolute;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-end;
			text-align: center;
			box-sizing: border-box;
			padding: clamp(2px, 0.4vmin, 6px);
		}
		.wp-birdnet-hero-slot {
		}
		.wp-birdnet-cluster-thumb-wrap {
			flex: 1;
			width: 100%;
			min-height: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
		}
		.wp-birdnet-cluster-thumb {
			max-width: 100%;
			max-height: 100%;
			object-fit: contain;
			mix-blend-mode: var(--wp-birdnet-blend-mode, normal);
			filter: var(--wp-birdnet-blend-filter, none);
		}
		.wp-birdnet-cluster-label {
			position: absolute;
			transform: translate(-50%, 0);
			text-align: center;
			white-space: nowrap;
			line-height: 1.1;
			font-family: var(--wp-birdnet-sc, 'IM Fell English SC', 'Playfair Display', Georgia, serif);
			font-size: clamp(8px, 1.1vmin, 13px);
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--wp-birdnet-ink);
			pointer-events: none;
			z-index: 3;
		}
		.wp-birdnet-hero-label {
			/* Uniform typography across all specimen names */
		}
		.wp-birdnet-cluster-caption {
			text-align: center;
			padding-top: clamp(6px, 1vmin, 12px);
			border-top: 0.5px solid rgba(28, 38, 38, 0.15);
		}
		.wp-birdnet-cluster-caption-main {
			font-size: clamp(10px, 1.35vmin, 15px);
			font-style: italic;
			color: var(--wp-birdnet-ink);
			letter-spacing: 1px;
		}
		.wp-birdnet-cluster-caption-sub {
			font-size: clamp(8px, 1.0vmin, 12px);
			font-style: italic;
			color: var(--wp-birdnet-ink-muted);
			margin-top: 2px;
			opacity: 0.85;
		}
		.wp-birdnet-spread-mat {
			background-color: var(--wp-birdnet-mat);
			padding: clamp(8px, 1.8vmin, 24px);
			box-sizing: border-box;
			width: 100%;
			height: 100%;
		}
		.wp-birdnet-spread {
			display: flex;
			flex-direction: row;
			align-items: stretch;
			justify-content: center;
			width: 100%;
			height: 100%;
			border: 1.5px solid var(--wp-birdnet-border);
			box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12), inset 0 0 40px rgba(0, 0, 0, 0.04);
			background-color: var(--wp-birdnet-plate);
			box-sizing: border-box;
			overflow: hidden;
		}
		.wp-birdnet-spread-left {
			flex: 1.1;
			height: 100%;
			display: flex;
			flex-direction: column;
			box-sizing: border-box;
			position: relative;
			overflow: hidden;
		}
		.wp-birdnet-spread-spine {
			width: 1px;
			height: 100%;
			background: var(--wp-birdnet-border);
			position: relative;
			flex-shrink: 0;
			box-shadow: -2px 0 8px rgba(0, 0, 0, 0.18), 2px 0 8px rgba(0, 0, 0, 0.18);
		}
		.wp-birdnet-spread-right {
			flex: 0.9;
			height: 100%;
			display: flex;
			flex-direction: column;
			box-sizing: border-box;
			position: relative;
			overflow: hidden;
		}
		.wp-birdnet-spread-pane-cluster {
			flex: 1.15 !important;
		}
		.wp-birdnet-spread-pane-cluster .wp-birdnet-cluster-sheet {
			aspect-ratio: auto !important;
			max-width: 100% !important;
			height: 100% !important;
			margin: 0 !important;
		}
		.wp-birdnet-spread-pane-cluster .wp-birdnet-cluster-inner {
			border: none;
			padding: clamp(6px, 1.2vmin, 16px);
			height: 100%;
			width: 100%;
			box-sizing: border-box;
		}
		.wp-birdnet-spread-pane-folio {
			flex: 0.85 !important;
		}
		.wp-birdnet-spread-compact .wp-birdnet-spread-pane-folio {
			justify-content: flex-end;
			align-items: center;
			padding: clamp(10px, 1.5vmin, 24px);
		}
		.wp-birdnet-spread-compact.valign-top .wp-birdnet-spread-pane-folio {
			justify-content: flex-start;
		}
		.wp-birdnet-spread-compact .wp-birdnet-spread-pane-folio .wp-birdnet-mat {
			height: calc(100% * var(--wp-spread-folio-scale, 0.70)) !important;
			max-height: calc(100% * var(--wp-spread-folio-scale, 0.70)) !important;
			width: 100% !important;
			max-width: 100% !important;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: clamp(4px, 0.8vmin, 10px) !important;
			box-sizing: border-box;
		}
		.wp-birdnet-spread-compact .wp-birdnet-spread-pane-folio .wp-birdnet-folio-card {
			height: 100% !important;
			max-height: 100% !important;
			width: auto !important;
			aspect-ratio: 0.72 !important;
			border: 1px solid var(--wp-birdnet-border) !important;
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important;
			background-color: var(--wp-birdnet-plate) !important;
			box-sizing: border-box;
		}
		.wp-birdnet-spread .wp-birdnet-mat {
			padding: clamp(6px, 1.2vmin, 16px);
			background: transparent;
			box-shadow: none;
			border: none;
			width: 100%;
			height: 100%;
			box-sizing: border-box;
		}
		.wp-birdnet-spread .wp-birdnet-plate-card {
			box-shadow: none;
			border: none;
			background: transparent;
			width: 100%;
			height: 100%;
			aspect-ratio: auto;
			max-width: 100%;
			max-height: 100%;
		}
		.wp-birdnet-spread .wp-birdnet-folio-card {
			aspect-ratio: auto;
			max-width: 100%;
			height: 100%;
		}
		@media (max-aspect-ratio: 1.15) {
			.wp-birdnet-spread {
				flex-direction: column;
			}
			.wp-birdnet-spread-left {
				display: none;
			}
			.wp-birdnet-spread-spine {
				display: none;
			}
			.wp-birdnet-spread-right {
				flex: 1;
				width: 100%;
			}
		}
		.wp-birdnet-chart-table {
			width: 100%;
			height: 100%;
			border-collapse: collapse;
			font-size: clamp(8px, 1.1vmin, 13px);
		}
		.wp-birdnet-chart-table th, .wp-birdnet-chart-table td {
			border: 0.5px solid rgba(28, 38, 38, 0.2);
			text-align: center;
			padding: clamp(2px, 0.4vmin, 6px);
		}
		.wp-birdnet-chart-table th {
			background-color: rgba(28, 38, 38, 0.06);
			font-weight: 600;
			letter-spacing: 1px;
			text-transform: uppercase;
		}
		.wp-birdnet-chart-species {
			text-align: left !important;
			font-weight: 600;
			font-variant: small-caps;
			letter-spacing: 1.2px;
			padding-left: 8px !important;
			white-space: nowrap;
		}
		.wp-birdnet-chart-species-cell {
			display: flex;
			align-items: center;
			gap: clamp(6px, 1vmin, 12px);
		}
		.wp-birdnet-chart-thumb-wrap {
			width: clamp(26px, 3.8vmin, 44px);
			height: clamp(26px, 3.8vmin, 44px);
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.wp-birdnet-chart-thumb {
			max-width: 100%;
			max-height: 100%;
			object-fit: contain;
			mix-blend-mode: var(--wp-birdnet-blend-mode, multiply);
			filter: var(--wp-birdnet-blend-filter, contrast(1.06) brightness(1.04));
		}
		.wp-birdnet-chart-cell-busy {
			background-color: rgba(28, 38, 38, 0.28);
			color: #fff;
			font-weight: bold;
		}
		.wp-birdnet-chart-cell-active {
			background-color: rgba(28, 38, 38, 0.14);
		}
		.wp-birdnet-chart-mat {
			background-color: var(--wp-birdnet-mat);
			padding: clamp(8px, 2vmin, 28px);
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.wp-birdnet-chart-mat.offset-right {
			padding-left: clamp(470px, 26vw, 530px);
			justify-content: flex-end;
		}
		.wp-birdnet-chart-mat.offset-left {
			padding-right: clamp(470px, 26vw, 530px);
			justify-content: flex-start;
		}
		.wp-birdnet-chart-card {
			background-color: #fcfbf7 !important;
			color: #1c2626 !important;
			border: 1.5px solid var(--wp-birdnet-border, #1c2626);
			box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25), inset 0 0 40px rgba(0, 0, 0, 0.04);
			border-radius: 2px;
			width: 100%;
			height: 100%;
			max-width: min(100%, calc((100vh - 40px) * 1.5));
			aspect-ratio: 1.5;
			display: flex;
			flex-direction: column;
			padding: clamp(8px, 1.8vmin, 22px);
			box-sizing: border-box;
		}
		.wp-birdnet-chart-card.offset-right {
			margin: 0 0 0 auto;
		}
		.wp-birdnet-chart-card.offset-left {
			margin: 0 auto 0 0;
		}
		.wp-birdnet-chart-inner {
			display: flex;
			flex-direction: column;
			height: 100%;
			width: 100%;
			box-sizing: border-box;
		}
	`;
}

function addToMediaInfoCache(mediaUrl, value) {
	const maxSize = Number(config.media_list_max_size);
	if (!Number.isFinite(maxSize) || maxSize <= 0) {
		return;
	}
	while (!mediaInfoCache.has(mediaUrl) && mediaInfoCache.size >= maxSize) {
		// Remove the oldest key (first inserted)
		const oldestKey = mediaInfoCache.keys().next().value;
		mediaInfoCache.delete(oldestKey);
	}
	mediaInfoCache.set(mediaUrl, value);
}

const configEntityStates = {};
let mediaEntityState = null;
let elHass = null;
let elHaMain = null;
let browserId = null;
let userId = null;
let userName = null;
let userDisplayname = null;

function isObject(item) {
	return item && typeof item === "object" && !Array.isArray(item);
}

function stringify(obj) {
	const processedObjects = [];
	const json = JSON.stringify(obj, function (key, value) {
		if (typeof value === "object" && value !== null) {
			if (processedObjects.indexOf(value) !== -1) {
				// Circular reference found, discard key
				return;
			}
			processedObjects.push(value);
		}
		if (value instanceof Error || (typeof DOMException !== "undefined" && value instanceof DOMException)) {
			const serializedError = {
				name: value.name,
				message: value.message,
				stack: value.stack
			};
			if ("cause" in value) {
				serializedError.cause = value.cause;
			}
			Object.keys(value).forEach((property) => {
				serializedError[property] = value[property];
			});
			return serializedError;
		}
		return value;
	});
	return json;
}

function getRetryAfterDelay(response) {
	const retryAfter = response.headers.get("Retry-After");
	if (retryAfter) {
		const seconds = Number(retryAfter);
		if (Number.isFinite(seconds) && seconds >= 0) {
			return Math.round(seconds * 1000);
		}
		const retryAt = Date.parse(retryAfter);
		if (Number.isFinite(retryAt)) {
			return Math.max(0, retryAt - Date.now());
		}
	}

	// Unsplash exposes the rate-limit reset time as a Unix timestamp.
	const rateLimitReset = Number(response.headers.get("X-Ratelimit-Reset"));
	if (Number.isFinite(rateLimitReset) && rateLimitReset > 0) {
		const retryAt = rateLimitReset > 1000000000000 ? rateLimitReset : rateLimitReset * 1000;
		return Math.max(0, retryAt - Date.now());
	}
	return null;
}

// The message container lives in the document, not in the wallpanel element's
// shadow root, so messages can also be shown before that element exists - e.g.
// config errors raised while the configuration is being parsed. Those used to
// fall back to alert(), which blocks rendering until somebody clicks OK; on an
// unattended wall panel nobody is there to.
let messageContainer = null;
let messageStyle = null;
const queuedMessages = [];

function messageCss() {
	let css = "";
	for (const className in classStyles) {
		if (!className.startsWith("wallpanel-message")) {
			continue;
		}
		css += `.${className} {\n`;
		for (const attr in classStyles[className]) {
			css += `${attr}: ${classStyles[className][attr]};\n`;
		}
		css += `}\n`;
	}
	return css;
}

// Keeps message styling in sync with config.style overrides
function updateMessageStyle() {
	if (messageStyle) {
		messageStyle.innerHTML = messageCss();
	}
}

function getMessageContainer() {
	if (messageContainer && messageContainer.isConnected) {
		return messageContainer;
	}
	if (!document.body) {
		return null;
	}
	messageStyle = document.createElement("style");
	messageStyle.innerHTML = messageCss();

	messageContainer = document.createElement("div");
	messageContainer.id = "wallpanel-message-container";
	messageContainer.appendChild(messageStyle);
	// Sits above the screensaver and the Home Assistant UI, but must not swallow
	// clicks meant for the dashboard - only the messages themselves are clickable.
	Object.assign(messageContainer.style, {
		position: "fixed",
		top: "1rem",
		left: "1rem",
		bottom: "1rem",
		right: "1rem",
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-end",
		gap: "0.5rem",
		zIndex: "100000",
		pointerEvents: "none"
	});
	document.body.appendChild(messageContainer);
	return messageContainer;
}

function showMessage(type, title, text, timeout = 5000) {
	// type: info / success / warning / error
	const container = getMessageContainer();
	if (!container) {
		// Document not ready yet - show as soon as it is
		if (!queuedMessages.length) {
			document.addEventListener("DOMContentLoaded", flushQueuedMessages, { once: true });
		}
		queuedMessages.push([type, title, text, timeout]);
		return;
	}

	const message = document.createElement("div");
	message.className = `wallpanel-message ${type}`;
	message.style.pointerEvents = "auto";

	const titleDiv = document.createElement("div");
	titleDiv.className = "wallpanel-message-title";
	titleDiv.textContent = title;
	message.appendChild(titleDiv);

	const textDiv = document.createElement("div");
	textDiv.className = "wallpanel-message-text";
	textDiv.textContent = text;
	message.appendChild(textDiv);
	message.addEventListener("click", () => hideMessage(message));

	container.appendChild(message);
	requestAnimationFrame(() => message.classList.add("show"));

	setTimeout(() => hideMessage(message), timeout);
}

function hideMessage(message) {
	message.classList.remove("show");
	message.addEventListener("transitionend", () => message.remove());
}

function hideAllMessages() {
	if (!messageContainer) {
		return false;
	}
	const messages = messageContainer.querySelectorAll(".wallpanel-message");
	if (!messages.length) {
		return false;
	}
	messages.forEach((message) => hideMessage(message));
	return true;
}

function flushQueuedMessages() {
	const queued = queuedMessages.splice(0, queuedMessages.length);
	queued.forEach((args) => showMessage.apply(null, args));
}

const logger = {
	messages: [],
	logLevelConsole: "warning",
	logLevelSystem: "error",
	systemTargetLogLevel: "",
	addMessage: function (level, args) {
		if (!config.debug) {
			return;
		}
		const msg = {
			level: level,
			date: new Date().toISOString(),
			text: "",
			objs: [],
			stack: ""
		};
		const err = new Error();
		if (err.stack) {
			msg.stack = err.stack.toString().replace(/^Error\r?\n/, "");
		}
		for (let i = 0; i < args.length; i++) {
			if (i == 0 && (typeof args[0] === "string" || args[0] instanceof String)) {
				msg.text = args[i];
			} else {
				msg.objs.push(args[i]);
			}
		}
		logger.messages.push(msg);
		if (logger.messages.length > 1000) {
			// Max 1000 messages
			logger.messages.shift();
		}
	},
	systemLog(level, message) {
		if (!elHass || !elHass.hass) {
			return;
		}
		elHass.hass
			.callService(
				"system_log",
				"write",
				{
					logger: `frontend.wallpanel${browserId ? "." + browserId : ""}`,
					message: message,
					level: logger.systemTargetLogLevel || level
				},
				undefined,
				false
			)
			.catch(() => {
				// Prevent uncaught error
			});
	},
	downloadMessages: function () {
		const data = new Blob([stringify(logger.messages)], { type: "text/plain" });
		const url = URL.createObjectURL(data);
		const el = document.createElement("a");
		el.href = url;
		el.target = "_blank";
		el.download = "wallpanel_log.txt";
		document.body.appendChild(el);
		el.click();
		el.remove();
		setTimeout(() => URL.revokeObjectURL(url), 0);
	},
	purgeMessages: function () {
		logger.messages = [];
	},
	debug: function () {
		if (["debug"].includes(logger.logLevelConsole)) {
			console.debug.apply(this, arguments);
		}
		if (["debug"].includes(logger.logLevelSystem)) {
			logger.systemLog("debug", stringify(arguments));
		}
		logger.addMessage("debug", arguments);
	},
	info: function () {
		if (["debug", "info"].includes(logger.logLevelConsole)) {
			console.info.apply(this, arguments);
		}
		if (["debug", "info"].includes(logger.logLevelSystem)) {
			logger.systemLog("info", stringify(arguments));
		}
		logger.addMessage("info", arguments);
	},
	log: function () {
		logger.info.apply(this, arguments);
	},
	warning: function () {
		if (["debug", "info", "warning"].includes(logger.logLevelConsole)) {
			console.warn.apply(this, arguments);
		}
		if (["debug", "info", "warning"].includes(logger.logLevelSystem)) {
			logger.systemLog("warning", stringify(arguments));
		}
		logger.addMessage("warning", arguments);
	},
	warn: function () {
		logger.warning.apply(this, arguments);
	},
	error: function () {
		if (["debug", "info", "warning", "error"].includes(logger.logLevelConsole)) {
			console.error.apply(this, arguments);
		}
		if (["debug", "info", "warning", "error"].includes(logger.logLevelSystem)) {
			logger.systemLog("error", stringify(arguments));
		}
		logger.addMessage("error", arguments);
		if (config.alert_errors) {
			showMessage("error", "Error", `Wallpanel error: ${stringify(arguments)}`, 10000);
		}
	},
	err: function () {
		logger.error.apply(this, arguments);
	}
};

class ScreenWakeLock {
	constructor() {
		this.enabled = false;
		this.error = null;
		// The Screen Wake Lock API is only available when served over HTTPS
		this.nativeWakeLockSupported = "wakeLock" in navigator;
		this._lock = null;
		this._player = null;
		this._isPlaying = false;
		this._onWakeLockRelease = null;

		const handleVisibilityChange = () => {
			logger.debug("handleVisibilityChange");
			if (this.enabled && !document.hidden) {
				this.enable();
			}
		};
		document.addEventListener("visibilitychange", handleVisibilityChange);
		document.addEventListener("fullscreenchange", handleVisibilityChange);

		if (!this.nativeWakeLockSupported) {
			const videoData =
				"data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAA1NtZGF0AAACrwYF//+r3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE2NCByMzA5NSBiYWVlNDAwIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAyMiAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOi0zOi0zIGFuYWx5c2U9MHgzOjB4MTEzIG1lPWhleCBzdWJtZT03IHBzeT0xIHBzeV9yZD0yLjAwOjAuNzAgbWl4ZWRfcmVmPTEgbWVfcmFuZ2U9MTYgY2hyb21hX21lPTEgdHJlbGxpcz0xIDh4OGRjdD0xIGNxbT0wIGRlYWR6b25lPTIxLDExIGZhc3RfcHNraXA9MSBjaHJvbWFfcXBfb2Zmc2V0PS00IHRocmVhZHM9MSBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfYmlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MiBrZXlpbnQ9MjUwIGtleWludF9taW49MSBzY2VuZWN1dD00MCBpbnRyYV9yZWZyZXNoPTAgcmNfbG9va2FoZWFkPTQwIHJjPWNyZiBtYnRyZWU9MSBjcmY9MjMuMCBxY29tcD0wLjYwIHFwbWluPTAgcXBtYXg9NjkgcXBzdGVwPTQgaXBfcmF0aW89MS40MCBhcT0xOjEuMjAAgAAAABFliIQAF85//vfUt8yy7VNwgQAAAAlBmiRsQXzn/vAAAAAJQZ5CeIL5z4aBAAAACQGeYXRBfOeGgAAAAAkBnmNqQXznhoEAAAAPQZpoSahBaJlMCC+c//7xAAAAC0GehkURLBfOf4aBAAAACQGepXRBfOeGgQAAAAkBnqdqQXznhoAAAAAPQZqpSahBbJlMCC+c//7wAAADs21vb3YAAABsbXZoZAAAAAAAAAAAAAAAAAAAA+gAACcQAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAALddHJhawAAAFx0a2hkAAAAAwAAAAAAAAAAAAAAAQAAAAAAACcQAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAIAAAACAAAAAAAJGVkdHMAAAAcZWxzdAAAAAAAAAABAAAnEAAAgAAAAQAAAAACVW1kaWEAAAAgbWRoZAAAAAAAAAAAAAAAAAAAQAAAAoAAVcQAAAAAAC1oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAgBtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAHAc3RibAAAAMBzdHNkAAAAAAAAAAEAAACwYXZjMQAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAIAAgASAAAAEgAAAAAAAAAARVMYXZjNTkuMzcuMTAwIGxpYngyNjQAAAAAAAAAAAAAABj//wAAADZhdmNDAWQACv/hABlnZAAKrNlfllwEQAAAAwBAAAADAIPEiWWAAQAGaOvjxMhM/fj4AAAAABBwYXNwAAAAAQAAAAEAAAAUYnRydAAAAAAAAAKiAAACogAAABhzdHRzAAAAAAAAAAEAAAAKAABAAAAAABRzdHNzAAAAAAAAAAEAAAABAAAAYGN0dHMAAAAAAAAACgAAAAEAAIAAAAAAAQABQAAAAAABAACAAAAAAAEAAAAAAAAAAQAAQAAAAAABAAFAAAAAAAEAAIAAAAAAAQAAAAAAAAABAABAAAAAAAEAAIAAAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAAKAAAAAQAAADxzdHN6AAAAAAAAAAAAAAAKAAACyAAAAA0AAAANAAAADQAAAA0AAAATAAAADwAAAA0AAAANAAAAEwAAABRzdGNvAAAAAAAAAAEAAAAwAAAAYnVkdGEAAABabWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAAAAAAAtaWxzdAAAACWpdG9vAAAAHWRhdGEAAAABAAAAAExhdmY1OS4yNy4xMDA=";
			this._player = document.createElement("video");
			this._player.setAttribute("id", "ScreenWakeLockVideo");
			this._player.setAttribute("src", videoData);
			this._player.setAttribute("playsinline", "");
			// Do not set muted to true or the following error can occur:
			// Uncaught (in promise) DOMException: The play() request was interrupted because video-only background media was paused to save power. https://goo.gl/LdLk22
			this._player.setAttribute("muted", "");
			this._player.style.display = "none";
			if (!document.getElementById("ScreenWakeLockVideo")) {
				document.body.appendChild(this._player);
			}
			this._player.addEventListener("ended", () => {
				logger.debug("Video ended");
				if (this.enabled) {
					this.enable();
				}
			});
			this._player.addEventListener("playing", () => {
				logger.debug("Video playing");
				this._isPlaying = true;
			});
			this._player.addEventListener("pause", () => {
				logger.debug("Video pause");
				this._isPlaying = false;
			});
		}
	}

	enable() {
		if (this.nativeWakeLockSupported) {
			logger.debug("Requesting native screen wakelock");
			if (this._lock) {
				logger.debug("Screen wakelock already active");
				return;
			}
			navigator.wakeLock
				.request("screen")
				.then((wakeLock) => {
					logger.debug("Request screen wakelock successful");
					this._lock = wakeLock;
					this._onWakeLockRelease = () => {
						logger.debug("Screen wakelock released");
						this.enabled = false;
						this._lock = null;
					};
					wakeLock.addEventListener("release", this._onWakeLockRelease);
					this.enabled = true;
					this.error = null;
				})
				.catch((e) => {
					this.enabled = false;
					this.error = e;
					logger.warning(`Failed to request screen wakeLock: ${e}`);
				});
		} else {
			logger.debug("Starting video player");
			if (!this._player.paused && this._isPlaying) {
				this._player.pause();
			}
			const playPromise = this._player.play();
			if (playPromise) {
				playPromise
					.then(() => {
						this.enabled = true;
						this.error = null;
						logger.debug("Video play successful");
					})
					.catch((error) => {
						this.enabled = false;
						this.error = error;
						logger.warning(`Failed to play video: ${error}`);
					});
			}
		}
	}

	disable() {
		if (this.nativeWakeLockSupported) {
			logger.debug("Releasing native screen wakelock");
			if (this._lock) {
				if (this._onWakeLockRelease) {
					this._lock.removeEventListener("release", this._onWakeLockRelease);
					this._onWakeLockRelease = null;
				}
				this._lock.release();
			}
			this._lock = null;
		} else {
			logger.debug("Stopping video player");
			if (!this._player.paused && this._isPlaying) {
				this._player.pause();
			}
		}
		this.enabled = false;
	}
}

class CameraMotionDetection {
	/*
	The algorithm keeps two comparisons for every captured frame:

	`referenceChangeRatios`:
		Compares the current frame to a stored reference image.
		This is used to detect presence/motion.
		If the scene stays different from the reference for `motionStartDelay` seconds, this is considered motion.
	`previousChangeRatios`:
		Compares the current frame to the previous frame.
		This is used to detect whether the scene has become stable.
		If the scene stays stable for the 60-second history window, the current frame can become the new reference image.

	A quick person passing the camera creates only a short reference difference, so it is ignored when `motionStartDelay` is configured.
	A person standing still is still detected because the image remains different from the reference, even when frame-to-frame movement stops.
	If no movement is detected at all when comparing the current images with the previous images within the 60-second window,
	it is assumed that the camera has been moved or that objects in the room have shifted; this results in the reference image being reset to prevent
	the "motion detected" status from becoming stuck.

	`motionStartDelay` defaults to `0`, so existing behavior remains immediate unless configured otherwise.
	*/

	constructor() {
		this.enabled = false;
		this.error = false;
		this.width = 64;
		this.height = 48;
		this.thresholdRatio = 0.05;
		this.threshold = this.width * this.height * this.thresholdRatio;
		this.captureInterval = 300;

		this.motionActive = false;
		this.motionStartDelay = 0; // ms (default)
		this.motionStopDelay = 2000; // ms (default)
		this.motionDetectionRequiredRatio = 0.8;
		this.roomSettledRequiredRatio = 1.0;
		this.motionStopTimeout = null;
		this.captureTimer = null;
		this.referenceImageData = null;
		this.previousImageData = null;
		this.referenceChangeRatios = [];
		this.previousChangeRatios = [];
		this.maxRatioHistorySize = Math.ceil(60000 / this.captureInterval);

		this.videoElement = document.createElement("video");
		this.videoElement.setAttribute("id", "wallpanelMotionDetectionVideo");
		this.videoElement.style.display = "none";
		document.body.appendChild(this.videoElement);

		this.canvasElement = document.createElement("canvas");
		this.canvasElement.setAttribute("id", "wallpanelMotionDetectionCanvas");
		this.canvasElement.style.display = "none";
		document.body.appendChild(this.canvasElement);

		this.context = this.canvasElement.getContext("2d", { willReadFrequently: true });
		this._elementsAppended = true;
	}

	compareImageData(imageData, compareImageData) {
		if (!imageData || !compareImageData) {
			return 0;
		}

		let diffPixels = 0;
		const rgba = imageData.data;
		const compareRgba = compareImageData.data;

		for (let i = 0; i < rgba.length; i += 4) {
			const pixelDiff =
				Math.abs(rgba[i] - compareRgba[i]) +
				Math.abs(rgba[i + 1] - compareRgba[i + 1]) +
				Math.abs(rgba[i + 2] - compareRgba[i + 2]);
			if (pixelDiff >= 256) {
				diffPixels++;
			}
		}

		return diffPixels / (this.width * this.height);
	}

	storeRatio(ratios, ratio) {
		ratios.push(ratio);
		while (ratios.length > this.maxRatioHistorySize) {
			ratios.shift();
		}
	}

	getRatiosForInterval(ratios, interval) {
		const ratioCount = Math.max(1, Math.ceil(interval / this.captureInterval));
		if (ratios.length < ratioCount) {
			return [];
		}
		return ratios.slice(-ratioCount);
	}

	hasRequiredRatioAboveThreshold(ratios, requiredRatio) {
		return (
			ratios.length > 0 &&
			ratios.filter((ratio) => ratio >= this.thresholdRatio).length / ratios.length >= requiredRatio
		);
	}

	hasRequiredRatioBelowThreshold(ratios, requiredRatio) {
		return (
			ratios.length > 0 && ratios.filter((ratio) => ratio < this.thresholdRatio).length / ratios.length >= requiredRatio
		);
	}

	resetMotionState() {
		this.motionActive = false;
		if (this.motionStopTimeout) {
			clearTimeout(this.motionStopTimeout);
			this.motionStopTimeout = null;
		}
		this.referenceImageData = null;
		this.previousImageData = null;
		this.referenceChangeRatios = [];
		this.previousChangeRatios = [];
	}

	capture() {
		this.context.globalCompositeOperation = "source-over";
		this.context.drawImage(this.videoElement, 0, 0, this.width, this.height);

		const currentImageData = this.context.getImageData(0, 0, this.width, this.height);

		if (!this.referenceImageData) {
			this.referenceImageData = currentImageData;
			this.previousImageData = currentImageData;
			return;
		}

		const referenceChangeRatio = this.compareImageData(currentImageData, this.referenceImageData);
		const previousChangeRatio = this.compareImageData(currentImageData, this.previousImageData);
		this.previousImageData = currentImageData;

		this.storeRatio(this.referenceChangeRatios, referenceChangeRatio);
		this.storeRatio(this.previousChangeRatios, previousChangeRatio);

		const motionDetectionRatios = this.getRatiosForInterval(this.referenceChangeRatios, this.motionStartDelay);
		const motionDetected = this.hasRequiredRatioAboveThreshold(
			motionDetectionRatios,
			this.motionDetectionRequiredRatio
		);
		const roomSettled =
			this.previousChangeRatios.length >= this.maxRatioHistorySize &&
			this.hasRequiredRatioBelowThreshold(this.previousChangeRatios, this.roomSettledRequiredRatio);

		if (motionDetected) {
			if (!this.motionActive) {
				logger.debug("Motion started");
				this.motionActive = true;
				wallpanel.motionDetected();
			}

			if (this.motionStopTimeout) {
				clearTimeout(this.motionStopTimeout);
				this.motionStopTimeout = null;
			}
		} else if (this.motionActive && !this.motionStopTimeout) {
			this.motionStopTimeout = setTimeout(() => {
				logger.debug("Motion stopped");
				this.motionActive = false;
				this.motionStopTimeout = null;
				wallpanel.motionStopped();
			}, this.motionStopDelay);
		}

		if (roomSettled) {
			logger.info("Room settled, new reference image stored");
			this.referenceImageData = currentImageData;
			this.referenceChangeRatios = [];
		}
	}

	start() {
		if (this.enabled || this.error) {
			return;
		}

		if (!navigator.mediaDevices) {
			this.error = true;
			logger.error("No media devices found");
			return;
		}

		if (!this._elementsAppended) {
			document.body.appendChild(this.videoElement);
			document.body.appendChild(this.canvasElement);
			this._elementsAppended = true;
		}

		this.enabled = true;
		this.width = config.camera_motion_detection_capture_width;
		this.height = config.camera_motion_detection_capture_height;
		this.thresholdRatio = config.camera_motion_detection_threshold * 0.01;
		this.threshold = this.width * this.height * this.thresholdRatio;
		this.captureInterval = config.camera_motion_detection_capture_interval * 1000;
		this.motionStartDelay = config.camera_motion_detection_motion_start_delay * 1000;
		this.motionStopDelay = config.camera_motion_detection_motion_stop_delay * 1000;
		this.maxRatioHistorySize = Math.ceil(60000 / this.captureInterval);
		this.resetMotionState();

		this.videoElement.width = this.width;
		this.videoElement.height = this.height;
		this.canvasElement.width = this.width;
		this.canvasElement.height = this.height;
		if (config.camera_motion_detection_capture_visible) {
			this.canvasElement.style.position = "fixed";
			this.canvasElement.style.top = 0;
			this.canvasElement.style.left = 0;
			this.canvasElement.style.zIndex = 10000;
			this.canvasElement.style.border = "1px solid black";
			this.canvasElement.style.display = "block";
		} else {
			this.canvasElement.style.display = "none";
		}

		navigator.mediaDevices
			.getUserMedia({
				audio: false,
				video: {
					facingMode: { ideal: config.camera_motion_detection_facing_mode },
					width: this.width,
					height: this.height
				}
			})
			.then((stream) => {
				this.videoElement.srcObject = stream;
				const playPromise = this.videoElement.play();
				if (playPromise) {
					playPromise.catch((error) => {
						logger.warning(`Camera motion detection video play failed: ${error}`);
					});
				}
				if (this.enabled) {
					this.captureTimer = setInterval(this.capture.bind(this), this.captureInterval);
				}
			})
			.catch((err) => {
				this.enabled = false;
				logger.error("Camera motion detection error:", err);
				if (this._elementsAppended) {
					this.videoElement.remove();
					this.canvasElement.remove();
					this._elementsAppended = false;
				}
			});
	}

	stop() {
		if (!this.enabled) {
			return;
		}
		this.enabled = false;
		this.resetMotionState();
		if (this.captureTimer) {
			clearInterval(this.captureTimer);
			this.captureTimer = null;
		}
		this.videoElement.pause();
		const stream = this.videoElement.srcObject;
		if (stream && typeof stream.getTracks === "function") {
			stream.getTracks().forEach((track) => {
				track.stop();
			});
		}
		this.videoElement.srcObject = null;
		if (this._elementsAppended) {
			this.videoElement.remove();
			this.canvasElement.remove();
			this._elementsAppended = false;
		}
	}
}

// Fixed seed so "random_but_synced" produces the identical shuffle on every device.
const MEDIA_SYNC_SEED = 0x5eed5eed;

// Deterministic PRNG (mulberry32). Seeded with the same value everywhere, it lets
// independent devices compute the same "random" order without any coordination.
function mulberry32(seed) {
	return function () {
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function shuffleArray(array, randomFn = Math.random) {
	const result = array.slice(); // Make a copy to avoid mutating the original
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(randomFn() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

function getHaCameraStreamPlayerAndVideo(haCameraStreamElement) {
	if (!haCameraStreamElement.shadowRoot) {
		return [null, null];
	}
	const player =
		haCameraStreamElement.shadowRoot.querySelector("ha-web-rtc-player") ||
		haCameraStreamElement.shadowRoot.querySelector("ha-hls-player");
	if (!player || !player.shadowRoot) {
		return [player, null];
	}
	const video = player.shadowRoot.querySelector("video");
	return [player, video];
}

function mergeConfig(target, ...sources) {
	// https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
	if (!sources.length) return target;
	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		for (let key in source) {
			let val = source[key];
			if (renamedConfigOptions[key]) {
				logger.warn(
					`The configuration option '${key}' has been renamed to '${renamedConfigOptions[key]}'. Please update your wallpanel configuration accordingly.`
				);
				key = renamedConfigOptions[key];
			}
			if (key == "immich_api_keys" && !Array.isArray(val)) {
				val = [val];
			}

			if (isObject(val)) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				mergeConfig(target[key], val);
			} else {
				function replacer(match, entityId) {
					if (!(entityId in configEntityStates)) {
						configEntityStates[entityId] = "";
						const entity = (elHass.hass || elHass.__hass).states[entityId];
						if (entity) {
							configEntityStates[entityId] = entity.state;
						} else {
							logger.error(`Entity used in placeholder not found: ${entityId} (${match})`);
						}
					}
					const state = configEntityStates[entityId];
					logger.debug(`Replace ${match} with ${state}`);
					return state;
				}
				function processValue(val) {
					if (typeof val === "string" || val instanceof String) {
						val = val.replace(/\$\{browser_id\}/g, browserId ? browserId : "browser-id-unset");
						val = val.replace(/\$\{entity:\s*([^}]+\.[^}]+)\}/g, replacer);
					} else if (Array.isArray(val)) {
						val = val.map((item) => processValue(item));
					} else if (isObject(val)) {
						val = Object.fromEntries(Object.entries(val).map(([key, value]) => [key, processValue(value)]));
					}
					if (typeof target[key] === "boolean") {
						if (val === null || val === undefined) {
							val = false;
						} else {
							val = ["true", "on", "yes", "1"].includes(String(val).toLowerCase());
						}
					}
					return val;
				}
				val = processValue(val);
				if (Array.isArray(target[key]) && typeof val === "string") {
					val = val.split(",").map((item) => item.trim());
				}
				Object.assign(target, { [key]: val });
			}
		}
	}
	return mergeConfig(target, ...sources);
}

function updateConfig() {
	const params = new URLSearchParams(window.location.search);

	const oldConfig = config;
	config = {};
	mergeConfig(config, defaultConfig);

	if (Object.keys(dashboardConfig).length === 0) {
		dashboardConfig = getDashboardWallpanelConfig();
		if (Object.keys(dashboardConfig).length === 0) {
			logger.debug("No wallpanel config found in dashboard config");
		}
	}

	mergeConfig(config, dashboardConfig);

	const paramConfig = {};
	for (let [key, value] of params) {
		if (key.startsWith("wp_")) {
			key = key.substring(3);
			if (renamedConfigOptions[key]) {
				logger.warn(
					`The configuration option '${key}' has been renamed to '${renamedConfigOptions[key]}'. Please update your wallpanel configuration accordingly.`
				);
				key = renamedConfigOptions[key];
			}
			if (key in defaultConfig && value) {
				// Convert to the right type
				try {
					value = JSON.parse(value);
				} catch {
					// Invalid JSON, just take the string
				}
				const defaultValue = defaultConfig[key];
				if (Array.isArray(defaultValue)) {
					if (Array.isArray(value)) {
						paramConfig[key] = value;
					} else if (typeof value === "string") {
						paramConfig[key] = value.split(",").map((item) => item.trim());
					} else {
						paramConfig[key] = [value];
					}
				} else if (typeof defaultValue === "boolean") {
					paramConfig[key] = ["true", "on", "yes", "1"].includes(String(value));
				} else if (typeof defaultValue === "number") {
					const num = Number(value);
					if (Number.isFinite(num)) {
						paramConfig[key] = num;
					} else {
						logger.warn(`Invalid numeric wp_ param '${key}': ${value}`);
					}
				} else {
					paramConfig[key] = value;
				}
			}
		}
	}
	config = mergeConfig(config, paramConfig);
	const profile = config.profile;

	if (config.profiles && profile && config.profiles[profile]) {
		config = mergeConfig(config, config.profiles[profile]);
		logger.debug(`Profile set from config: ${profile}`);
	}
	if (config.profiles && browserId && config.profiles[`device.${browserId}`]) {
		const profile = `device.${browserId}`;
		config = mergeConfig(config, config.profiles[profile]);
		logger.debug(`Profile set from device: ${profile}`);
	}
	if (config.profiles) {
		const userIds = [userId, userName, userDisplayname];
		for (let i = 0; i < userIds.length; i++) {
			let user = userIds[i];
			if (user) {
				user = user.toLowerCase().replace(/\s/g, "_");
				if (config.profiles[`user.${user}`]) {
					const profile = `user.${user}`;
					config = mergeConfig(config, config.profiles[profile]);
					logger.debug(`Profile set from user: ${profile}`);
					break;
				}
			}
		}
	}
	config = mergeConfig(config, paramConfig);
	const profile_entity = config.profile_entity;
	if (
		config.profiles &&
		profile_entity &&
		(elHass.hass || elHass.__hass).states[profile_entity] &&
		config.profiles[(elHass.hass || elHass.__hass).states[profile_entity].state]
	) {
		const profile = (elHass.hass || elHass.__hass).states[profile_entity].state;
		config = mergeConfig(config, config.profiles[profile]);
		logger.debug(`Profile set from entity state: ${profile}`);
	}

	if (config.content_interaction) {
		config.stop_screensaver_on_mouse_move = false;
	}

	if (config.image_url) {
		config.image_url = config.image_url.replace(/^media-entity:\/\//, "media-entity-image://");
		if (config.image_url.startsWith("/")) {
			config.image_url = `media-source://media_source${config.image_url}`;
		}
		if (mediaSourceType() == "media-source") {
			config.image_url = config.image_url.replace(/\/+$/, "");
		}
		if (mediaSourceType() == "unsplash-api" && config.media_list_update_interval < 90) {
			// Unsplash API currently places a limit of 50 requests per hour
			config.media_list_update_interval = 90;
		}
	} else if (config.birdnet_url) {
		config.show_images = true;
	} else {
		config.show_images = false;
	}

	if (!config.enabled) {
		config.debug = false;
		config.hide_toolbar = false;
		config.hide_sidebar = false;
		config.hide_toolbar_action_icons = false;
		config.fullscreen = false;
		config.show_images = false;
	}

	if (config.log_level_console == "err") {
		config.log_level_console = "error";
	} else if (config.log_level_console == "warn") {
		config.log_level_console = "warning";
	}
	if (!oldConfig || !Object.keys(oldConfig).length) {
		// Keep old log level to get log messages when navigating between different dashboards
		logger.logLevelConsole = config.log_level_console;
		logger.logLevelConsole;
	}

	if (config.log_level_system == "err") {
		config.log_level_system = "error";
	} else if (config.log_level_system == "warn") {
		config.log_level_system = "warning";
	}
	logger.logLevelSystem = config.log_level_system;
	logger.systemTargetLogLevel = config.system_target_log_level;

	logger.debug("Wallpanel config is now:", config);

	if (wallpanel) {
		if (isActive()) {
			wallpanel.reconfigure(oldConfig);
		} else if (wallpanel.screensaverRunning && wallpanel.screensaverRunning()) {
			wallpanel.stopScreensaver();
		}
	}
}

function getActiveBrowserModPopups() {
	const popups = [];
	if (!browserId || !elHass || !elHass.shadowRoot) {
		return popups;
	}
	elHass.shadowRoot.querySelectorAll("*").forEach((el) => {
		if (
			el.tagName.toLowerCase().startsWith("browser-mod-popup") &&
			el.shadowRoot &&
			el.shadowRoot.querySelector("ha-dialog")
		) {
			popups.push(el);
		}
	});
	return popups;
}

function getActiveBrowserModPopup() {
	const popups = getActiveBrowserModPopups();
	if (!popups || popups.length == 0) {
		return null;
	}
	return popups[0];
}

function isActive() {
	const params = new URLSearchParams(window.location.search);
	if (params.get("edit") == "1") {
		logger.debug("Edit mode active");
		return false;
	}
	if (!config.enabled) {
		logger.debug("Wallpanel not enabled in config");
		return false;
	}
	if (
		config.enabled_on_views &&
		config.enabled_on_views.length > 0 &&
		activeTab &&
		!config.enabled_on_views.includes(activeTab)
	) {
		logger.debug(`Wallpanel not enabled on current tab ${activeTab}`);
		return false;
	}
	if (config.disable_screensaver_when_assist_active) {
		const voiceCommandDialog = elHass.shadowRoot.querySelector("ha-voice-command-dialog");
		if (
			voiceCommandDialog &&
			voiceCommandDialog.shadowRoot &&
			voiceCommandDialog.shadowRoot.querySelector("ha-dialog")
		) {
			logger.debug("Assist is active, wallpanel disabled");
			return false;
		}
	}
	if (
		wallpanel &&
		wallpanel.disable_screensaver_on_browser_mod_popup_function &&
		getActiveBrowserModPopup() &&
		wallpanel.disable_screensaver_on_browser_mod_popup_function(getActiveBrowserModPopup())
	) {
		logger.debug("Browser mod popup function returned true, wallpanel disabled");
		return false;
	}
	if (config.disable_screensaver_on_browser_mod_popup && getActiveBrowserModPopup()) {
		logger.debug("Browser mod popup active, wallpanel disabled");
		return false;
	}
	return true;
}

function mediaSourceType() {
	if (!config.show_images) {
		return "";
	}
	if (config.image_url && config.image_url.startsWith("birdnet://")) return "birdnet";
	if (
		config.birdnet_url &&
		(!config.image_url || config.image_url === defaultConfig["image_url"] || config.image_url.startsWith("birdnet://"))
	) {
		return "birdnet";
	}
	if (!config.image_url) {
		return "";
	}
	if (config.image_url.startsWith("media-entity-video://")) return "media-entity-video";
	if (config.image_url.startsWith("media-entity-image://")) return "media-entity-image";
	if (config.image_url.startsWith("media-source://")) return "media-source";
	if (config.image_url.startsWith("https://api.unsplash")) return "unsplash-api";
	if (config.image_url.startsWith("immich+")) return "immich-api";
	if (config.image_url.startsWith("iframe+")) return "iframe";
	if (config.image_url.startsWith("embed+")) return "embed";
	return "url";
}

function getHaPanelLovelace() {
	try {
		return elHaMain.shadowRoot.querySelector("ha-panel-lovelace");
	} catch (err) {
		logger.error("Failed to get ha-panel-lovelace:", err);
	}
}

function getDashboardWallpanelConfig(keys = []) {
	const pl = getHaPanelLovelace();
	const conf = {};
	if (pl && pl.lovelace) {
		let wallpanelConfig;
		if (pl.lovelace.config && pl.lovelace.config.wallpanel) {
			wallpanelConfig = pl.lovelace.config.wallpanel;
		} else if (pl.lovelace.rawConfig && pl.lovelace.rawConfig.wallpanel) {
			wallpanelConfig = pl.lovelace.rawConfig.wallpanel;
		}
		if (wallpanelConfig) {
			if (keys.length === 0) {
				keys = Object.keys(wallpanelConfig);
			}
			keys.forEach((key) => {
				if (key in defaultConfig || key in renamedConfigOptions) {
					conf[key] = wallpanelConfig[key];
				}
			});
		}
	}
	return conf;
}

function setSidebarVisibility(hidden) {
	logger.debug(`setSidebarVisibility: hidden=${hidden}`);
	try {
		const panelLovelace = elHaMain.shadowRoot.querySelector("ha-panel-lovelace");
		if (panelLovelace) {
			const huiRoot = panelLovelace.shadowRoot.querySelector("hui-root");
			if (huiRoot) {
				const menuButton = huiRoot.shadowRoot.querySelector("ha-menu-button");
				if (menuButton) {
					if (hidden) {
						menuButton.style.display = "none";
					} else {
						menuButton.style.removeProperty("display");
					}
				}
			}
		}
	} catch (e) {
		logger.warn(e);
	}

	try {
		const drawer = elHaMain.shadowRoot.querySelector("ha-drawer");
		if (drawer) {
			// HA 2026.6+: ha-drawer was rewritten using Webawesome; sidebar is now
			// .sidebar-shell. Fall back to <aside> for HA < 2026.6.
			const sidebar = drawer.shadowRoot.querySelector(".sidebar-shell") || drawer.shadowRoot.querySelector("aside");
			// CSS variable also changed in 2026.6: --mdc-drawer-width → --ha-sidebar-width
			const sidebarWidthVar =
				sidebar && sidebar.classList.contains("sidebar-shell") ? "--ha-sidebar-width" : "--mdc-drawer-width";
			if (sidebar) {
				if (hidden) {
					// Using style.display = hidden will cause the companion app to freeze
					// See https://github.com/j-a-n/lovelace-wallpanel/issues/383
					sidebar.style.opacity = 0;
					sidebar.style.maxWidth = "0px";
					elHaMain.style.setProperty(sidebarWidthVar, "env(safe-area-inset-left)");
				} else {
					sidebar.style.opacity = 1;
					sidebar.style.maxWidth = "";
					elHaMain.style.removeProperty(sidebarWidthVar);
				}
				window.dispatchEvent(new Event("resize"));
			}
		}
	} catch (e) {
		logger.warn(e);
	}
}

function setToolbarVisibility(hideToolbar, hideActionItems) {
	logger.debug(`setToolbarVisibility: hideToolbar=${hideToolbar}, hideActionItems=${hideActionItems}`);
	try {
		const panelLovelace = elHaMain.shadowRoot.querySelector("ha-panel-lovelace");
		if (!panelLovelace) {
			return;
		}
		let huiRoot = panelLovelace.shadowRoot.querySelector("hui-root");
		if (!huiRoot) {
			return;
		}
		huiRoot = huiRoot.shadowRoot;
		let appToolbar = huiRoot.querySelector("app-toolbar");
		if (!appToolbar) {
			// Changed with 2023.04
			appToolbar = huiRoot.querySelector("div.toolbar");
		}
		const toolbarStyleId = "wallpanel-toolbar-visibility";
		let toolbarStyle = huiRoot.querySelector(`#${toolbarStyleId}`);
		if (hideToolbar) {
			if (!toolbarStyle) {
				toolbarStyle = document.createElement("style");
				toolbarStyle.id = toolbarStyleId;
				huiRoot.appendChild(toolbarStyle);
			}
			// HA may recreate the header after WallPanel initializes. A stylesheet
			// continues to apply to replacement elements, unlike inline styles.
			toolbarStyle.textContent = `.header, app-toolbar, div.toolbar { display: none !important; }${
				config.keep_toolbar_space
					? ""
					: "hui-view-container, #view { min-height: 100vh !important; margin-top: 0 !important; padding-top: 0 !important; }"
			}`;
		} else {
			if (toolbarStyle) {
				toolbarStyle.remove();
			}
			const actionItems = appToolbar.querySelector("div.action-items");
			if (hideActionItems) {
				actionItems.style.setProperty("display", "none");
			} else {
				actionItems.style.setProperty("display", "flex");
			}
		}
		window.dispatchEvent(new Event("resize"));
	} catch (e) {
		logger.warn(e);
	}
}

function navigate(path, keepSearch = true) {
	if (keepSearch && !path.includes("?")) {
		path += window.location.search;
	}
	history.pushState(null, "", path);
	elHass.dispatchEvent(
		new Event("location-changed", {
			bubbles: true,
			cancelable: false,
			composed: true
		})
	);
}

function isFullscreen() {
	if (typeof document.fullscreenElement !== "undefined") {
		return Boolean(document.fullscreenElement);
	}
	if (typeof document.webkitCurrentFullScreenElement !== "undefined") {
		return Boolean(document.webkitCurrentFullScreenElement);
	}
	return false;
}

function enterFullscreen() {
	logger.debug("Enter fullscreen");
	// Will need user input event to work
	const el = document.documentElement;

	if (el.requestFullscreen) {
		el.requestFullscreen().then(
			() => {
				logger.debug("Successfully requested fullscreen");
			},
			(error) => {
				logger.debug("Failed to enter fullscreen:", error);
			}
		);
	} else if (el.mozRequestFullScreen) {
		el.mozRequestFullScreen();
	} else if (el.msRequestFullscreen) {
		el.msRequestFullscreen();
	} else if (el.webkitRequestFullscreen) {
		el.webkitRequestFullscreen();
	}
}

function exitFullscreen() {
	logger.debug("Exit fullscreen");
	if (document.exitFullscreen) {
		document.exitFullscreen().then(
			() => {
				logger.debug("Successfully exited fullscreen");
			},
			(error) => {
				logger.debug("Failed to exit fullscreen:", error);
			}
		);
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if (document.msRequestFullscreen) {
		document.msRequestFullscreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	}
}

function initWallpanel() {
	const HuiViewContainer = customElements.get("hui-view-container");
	const HuiView = customElements.get("hui-view");
	if (!HuiViewContainer || !HuiView) {
		const error = "Failed to get hui-view-container / hui-view from customElements";
		throw new Error(error);
	}

	class WallpanelViewContainer extends HuiViewContainer {}

	class WallpanelView extends HuiView {
		constructor() {
			super();

			this.mediaList = [];
			this.mediaIndex = -1;
			this.mediaListDirection = "forwards"; // forwards, backwards
			this.mediaPathLists = [];
			this.mediaPathQueue = [];
			this.currentMediaPath = null;
			this.lastMediaListUpdate;
			this.updatingMediaList = false;
			this.mediaListRetryAt = 0;
			this.mediaListRetryTimer = null;
			this.updatingMedia = false;
			this.mediaLoadRetryAt = 0;
			this.lastMediaUpdate = 0;
			this.isPaused = false;
			this.displayTime = null;
			this.mediaTimeElapsedBeforePause = 0;
			this.lastImageUrlEntityValue = null;
			this.blockEventsUntil = 0;
			this.screensaverStartedAt;
			this.screensaverStoppedAt = new Date();
			this.infoBoxContentCreatedDate;
			this.idleSince = Date.now();
			this.lastProfileSet = config.profile;
			this.lastMove = null;
			this.lastCorner = 0; // 0 - top left, 1 - bottom left, 2 - bottom right, 3 - top right
			this.translateTimeout = null;
			this.afterFadeoutTimer = null;
			this.lastClickTime = 0;
			this.clickCount = 0;
			this.touchStartX = -1;
			this.touchStartY = -1;
			this.currentWidth = 0;
			this.currentHeight = 0;
			this.energyCollectionUpdateEnabled = false;
			this.energyCollectionUpdateInterval = 60;
			this.lastEnergyCollectionUpdate = 0;
			this.screensaverStopNavigationPathTimeout = null;
			this.disable_screensaver_on_browser_mod_popup_function = null;
			this.moreInfoDialogOpenedAt = 0;
			this.timerInterval = null;
			this.windowEventHandlers = [];
			this.infoBoxResizeObserver = null;
			this.vettedPlates = { ...BIRDNET_VETTED_PLATES };
			this.loadedPlatesUrl = "";
			this.birdnetLocalPaths = null;
			this.localBirdProbingFailedCount = 0;
			this.attemptedAutoPlates = false;

			this.screenWakeLock = new ScreenWakeLock();
			this.cameraMotionDetection = new CameraMotionDetection();

			this.lovelace = null;
			this.__hass = elHass.hass || elHass.__hass;
			this.__cards = [];
			this.__badges = [];
			this.__views = [];

			elHass.provideHass(this);
			this.timerInterval = setInterval(this.timer.bind(this), 1000);

			wallpanelContainer.hass = this.__hass;
		}

		// Whenever the state changes, a new `hass` object is set.
		set hass(hass) {
			logger.debug("Update hass");
			this.__hass = hass;
			let changed = false;
			for (const entityId in configEntityStates) {
				const entity = this.__hass.states[entityId];
				if (entity && entity.state != configEntityStates[entityId]) {
					configEntityStates[entityId] = entity.state;
					changed = true;
				}
			}
			const profileUpdated = this.updateProfile();
			if (!profileUpdated && changed) {
				updateConfig();
			}

			if (!isActive()) {
				return;
			}

			const screensaver_entity = config.screensaver_entity;

			if (screensaver_entity && this.__hass.states[screensaver_entity]) {
				const lastChanged = new Date(this.__hass.states[screensaver_entity].last_changed);
				const state = this.__hass.states[screensaver_entity].state;

				if (state == "off" && this.screensaverStartedAt && lastChanged.getTime() - this.screensaverStartedAt > 0) {
					this.stopScreensaver(config.fade_out_time_screensaver_entity);
				} else if (
					state == "on" &&
					this.screensaverStoppedAt &&
					lastChanged.getTime() - this.screensaverStoppedAt > 0
				) {
					this.startScreensaver();
				}
			}

			if (this.screensaverRunning()) {
				this.__cards.forEach((card) => {
					card.hass = this.hass;
				});
				this.__badges.forEach((badge) => {
					badge.hass = this.hass;
				});
				this.__views.forEach((view) => {
					view.hass = this.hass;
				});

				if (mediaSourceType() == "media-entity-image") {
					this.switchActiveMedia("entity_update");
				}
			}
		}

		get hass() {
			return this.__hass;
		}

		setScreensaverEntityState() {
			const screensaver_entity = config.screensaver_entity;
			if (!screensaver_entity || !this.__hass.states[screensaver_entity]) return;
			if (this.screensaverRunning() && this.__hass.states[screensaver_entity].state == "on") return;
			if (!this.screensaverRunning() && this.__hass.states[screensaver_entity].state == "off") return;

			const service = this.screensaverRunning() ? "turn_on" : "turn_off";
			logger.debug("Updating screensaver_entity", screensaver_entity, service);
			this.__hass
				.callService("input_boolean", service, {
					entity_id: screensaver_entity
				})
				.then(
					(result) => {
						logger.debug(result);
					},
					(error) => {
						logger.error("Failed to set screensaver entity state:", error);
					}
				);
		}

		setImageURLEntityState() {
			const image_url_entity = config.image_url_entity;
			if (!image_url_entity || !this.__hass.states[image_url_entity]) return;
			const activeElement = this.getActiveMediaElement();
			if (!activeElement || !activeElement.mediaUrl) return;
			// Maximum length for input_text entity is 255
			const mediaUrl = activeElement.mediaUrl.substring(0, 255);
			if (this.lastImageUrlEntityValue === mediaUrl) {
				return;
			}

			logger.debug("Updating image_url_entity", image_url_entity, mediaUrl);
			this.__hass
				.callService("input_text", "set_value", {
					entity_id: image_url_entity,
					value: mediaUrl
				})
				.then(
					(result) => {
						logger.debug(result);
						this.lastImageUrlEntityValue = mediaUrl;
					},
					(error) => {
						logger.error("Failed to set image url entity state:", error);
					}
				);
		}

		updateProfile() {
			const profile_entity = config.profile_entity;
			if (profile_entity && this.__hass.states[profile_entity]) {
				const profile = this.__hass.states[profile_entity].state;
				if ((profile && profile != this.lastProfileSet) || (!profile && this.lastProfileSet)) {
					logger.debug(`Set profile to ${profile}`);
					this.lastProfileSet = profile;
					updateConfig();
					return true;
				}
			}
			return false;
		}

		timer() {
			if (!config.enabled || !activePanel) {
				return;
			}
			if (this.screensaverRunning()) {
				if (config.disable_screensaver_on_browser_mod_popup && getActiveBrowserModPopup()) {
					this.stopScreensaver(config.fade_out_time_browser_mod_popup);
				} else {
					this.updateScreensaver();
				}
			} else if (isActive()) {
				if (config.idle_time > 0 && Date.now() - this.idleSince >= config.idle_time * 1000) {
					if (
						!config.camera_motion_detection_stop_screensaver ||
						!this.cameraMotionDetection ||
						!this.cameraMotionDetection.motionActive
					) {
						this.startScreensaver();
					}
				}
			}
		}

		setDefaultStyle() {
			this.debugBox.removeAttribute("style");
			this.debugBox.style.position = "fixed";
			this.debugBox.style.pointerEvents = "none";
			this.debugBox.style.top = "0%";
			this.debugBox.style.left = "0%";
			this.debugBox.style.width = "100%";
			this.debugBox.style.height = "100%";
			this.debugBox.style.background = "#00000099";
			this.debugBox.style.color = "#ffffff";
			this.debugBox.style.zIndex = this.style.zIndex + 2;
			this.debugBox.style.fontFamily = "monospace";
			this.debugBox.style.fontSize = "12px";
			this.debugBox.style.overflowWrap = "break-word";
			this.debugBox.style.overflowY = "auto";
			this.debugBox.style.visibility = "hidden";

			this.screensaverContainer.removeAttribute("style");
			this.screensaverContainer.style.position = "fixed";
			this.screensaverContainer.style.pointerEvents = "auto";
			this.screensaverContainer.style.top = 0;
			this.screensaverContainer.style.right = 0;
			this.screensaverContainer.style.bottom = 0;
			this.screensaverContainer.style.left = 0;
			this.screensaverContainer.style.background = "#000000";
			this.screensaverContainer.style.overflow = "hidden";

			this.imageOneContainer.removeAttribute("style");
			this.imageOneContainer.style.opacity = 0;
			this.imageOneContainer.style.position = "absolute";
			this.imageOneContainer.style.pointerEvents = "none";
			this.imageOneContainer.style.top = 0;
			this.imageOneContainer.style.left = 0;
			this.imageOneContainer.style.width = "100%";
			this.imageOneContainer.style.height = "100%";
			this.imageOneContainer.style.border = "none";

			this.imageOneBackground.style.position = "absolute";
			this.imageOneBackground.style.pointerEvents = "none";
			this.imageOneBackground.style.top = 0;
			this.imageOneBackground.style.left = 0;
			this.imageOneBackground.style.width = "100%";
			this.imageOneBackground.style.height = "100%";
			this.imageOneBackground.style.border = "none";

			this.imageOne.removeAttribute("style");
			this.imageOne.style.position = "relative";
			this.imageOne.style.pointerEvents = "none";
			this.imageOne.style.width = "100%";
			this.imageOne.style.height = "100%";
			this.imageOne.style.border = "none";

			this.imageOneInfoContainer.removeAttribute("style");
			this.imageOneInfoContainer.style.position = "absolute";
			this.imageOneInfoContainer.style.pointerEvents = "none";
			this.imageOneInfoContainer.style.top = 0;
			this.imageOneInfoContainer.style.left = 0;
			this.imageOneInfoContainer.style.width = "100%";
			this.imageOneInfoContainer.style.height = "100%";
			this.imageOneInfoContainer.style.border = "none";

			this.imageOneInfo.style.overflowY = "auto";

			this.imageTwoContainer.removeAttribute("style");
			this.imageTwoContainer.style.opacity = 0;
			this.imageTwoContainer.style.position = "absolute";
			this.imageTwoContainer.style.pointerEvents = "none";
			this.imageTwoContainer.style.top = 0;
			this.imageTwoContainer.style.left = 0;
			this.imageTwoContainer.style.width = "100%";
			this.imageTwoContainer.style.height = "100%";
			this.imageTwoContainer.style.border = "none";

			this.imageTwoBackground.style.position = "absolute";
			this.imageTwoBackground.style.pointerEvents = "none";
			this.imageTwoBackground.style.top = 0;
			this.imageTwoBackground.style.left = 0;
			this.imageTwoBackground.style.width = "100%";
			this.imageTwoBackground.style.height = "100%";
			this.imageTwoBackground.style.border = "none";

			this.imageTwo.removeAttribute("style");
			this.imageTwo.style.position = "relative";
			this.imageTwo.style.pointerEvents = "none";
			this.imageTwo.style.width = "100%";
			this.imageTwo.style.height = "100%";
			this.imageTwo.style.border = "none";

			this.imageTwoInfoContainer.removeAttribute("style");
			this.imageTwoInfoContainer.style.position = "absolute";
			this.imageTwoInfoContainer.style.pointerEvents = "none";
			this.imageTwoInfoContainer.style.top = 0;
			this.imageTwoInfoContainer.style.left = 0;
			this.imageTwoInfoContainer.style.width = "100%";
			this.imageTwoInfoContainer.style.height = "100%";
			this.imageTwoInfoContainer.style.border = "none";

			this.imageTwoInfo.style.overflowY = "auto";

			this.screensaverImageOverlay.removeAttribute("style");
			this.screensaverImageOverlay.style.position = "absolute";
			this.screensaverImageOverlay.style.top = 0;
			this.screensaverImageOverlay.style.left = 0;
			this.screensaverImageOverlay.style.width = "100%";
			this.screensaverImageOverlay.style.height = "100%";
			this.screensaverImageOverlay.style.background = "#00000000";

			this.infoContainer.removeAttribute("style");
			this.infoContainer.style.position = "absolute";
			this.infoContainer.style.pointerEvents = "none";
			this.infoContainer.style.top = 0;
			this.infoContainer.style.left = 0;
			this.infoContainer.style.width = "100%";
			this.infoContainer.style.height = "100%";
			this.infoContainer.style.transition = "opacity 2000ms ease-in-out";
			this.infoContainer.style.padding = "25px";
			this.infoContainer.style.boxSizing = "border-box";
			this.infoContainer.style.zIndex = "10";

			this.infoBox.removeAttribute("style");
			this.infoBox.style.pointerEvents = "none";
			this.infoBox.style.width = "fit-content";
			this.infoBox.style.maxHeight = "100%";
			this.infoBox.style.borderRadius = "10px";
			this.infoBox.style.overflowY = "auto";
			this.infoBox.style.scrollbarWidth = "none";
			this.infoBox.style.setProperty("--wp-card-width", "500px");
			this.infoBox.style.setProperty("--wp-card-padding", "0");
			this.infoBox.style.setProperty("--wp-card-margin", "5px");
			this.infoBox.style.setProperty("--wp-card-backdrop-filter", "none");
			this.infoBox.style.setProperty("--wp-badges-minwidth", "200px");

			this.infoBoxPosX.style.pointerEvents = "none";
			this.infoBoxPosX.style.height = "100%";
			this.infoBoxPosX.style.width = "100%";

			this.infoBoxPosY.style.pointerEvents = "none";
			this.infoBoxPosY.style.height = "100%";
			this.infoBoxPosY.style.width = "100%";

			this.infoBoxContent.style.pointerEvents = "none";
			this.infoBoxContent.style.width = "fit-content";
			this.infoBoxContent.style.height = "100%";
			this.infoBoxContent.style.display = "grid";

			this.fixedInfoContainer.removeAttribute("style");
			this.fixedInfoContainer.style.position = "fixed";
			this.fixedInfoContainer.style.pointerEvents = "none";
			this.fixedInfoContainer.style.top = 0;
			this.fixedInfoContainer.style.left = 0;
			this.fixedInfoContainer.style.width = "100%";
			this.fixedInfoContainer.style.height = "100%";

			this.fixedInfoBox.style.pointerEvents = "none";
			this.fixedInfoBox.style.cssText = this.infoBox.style.cssText;

			this.screensaverOverlay.removeAttribute("style");
			this.screensaverOverlay.style.position = "absolute";
			this.screensaverOverlay.style.pointerEvents = "none";
			this.screensaverOverlay.style.top = 0;
			this.screensaverOverlay.style.left = 0;
			this.screensaverOverlay.style.width = "100%";
			this.screensaverOverlay.style.height = "100%";
			this.screensaverOverlay.style.background = "#00000000";
		}

		updateStyle() {
			this.screensaverOverlay.style.background = "#00000000";
			this.debugBox.style.visibility = config.debug ? "visible" : "hidden";
			this.debugBox.style.pointerEvents = config.debug ? "auto" : "none";
			//this.screensaverContainer.style.transition = `opacity ${Math.round(config.fade_in_time*1000)}ms ease-in-out`;
			this.style.transition =
				config.fade_in_time > 0 ? `opacity ${Math.round(config.fade_in_time * 1000)}ms ease-in-out` : "";
			this.imageOneContainer.style.transition =
				config.crossfade_time > 0 ? `opacity ${Math.round(config.crossfade_time * 1000)}ms ease-in-out` : "";
			this.imageTwoContainer.style.transition =
				config.crossfade_time > 0 ? `opacity ${Math.round(config.crossfade_time * 1000)}ms ease-in-out` : "";
			this.screensaverImageOverlay.style.pointerEvents = config.content_interaction ? "none" : "auto";

			const show_info = config.show_image_info && Boolean(config.image_info_template);
			this.imageOneInfoContainer.style.display = show_info ? "block" : "none";
			this.imageTwoInfoContainer.style.display = show_info ? "block" : "none";

			if (config.info_animation_duration_x) {
				this.infoBoxPosX.style.animation = `moveX ${config.info_animation_duration_x}s ${config.info_animation_timing_function_x} infinite alternate`;
			} else {
				this.infoBoxPosX.style.animation = "";
			}

			if (config.info_animation_duration_y) {
				this.infoBoxPosY.style.animation = `moveY ${config.info_animation_duration_y}s ${config.info_animation_timing_function_y} infinite alternate`;
			} else {
				this.infoBoxPosY.style.animation = "";
			}

			if (config.style) {
				for (const elId in config.style) {
					if (
						elId.startsWith("wallpanel-") &&
						elId != "wallpanel-shadow-host" &&
						elId != "wallpanel-screensaver-info-box-badges" &&
						elId != "wallpanel-screensaver-info-box-views" &&
						!classStyles[elId]
					) {
						const el = this.shadowRoot.getElementById(elId);
						if (el) {
							logger.debug(`Setting style attributes for element #${elId}`);
							for (const attr in config.style[elId]) {
								logger.debug(`Setting style attribute ${attr} to ${config.style[elId][attr]}`);
								el.style.setProperty(attr, config.style[elId][attr]);
							}
							if (el == this.infoBox) {
								this.fixedInfoBox.style.cssText = this.infoBox.style.cssText;
							} else if (el == this.infoBoxContent) {
								this.fixedInfoBoxContent.style.cssText = this.infoBoxContent.style.cssText;
							}
						} else {
							logger.error(`Element #${elId} not found`);
						}
					}
				}
			}
		}

		updateShadowStyle() {
			const computed = getComputedStyle(this.infoContainer);
			const maxX =
				this.infoContainer.offsetWidth -
				parseInt(computed.paddingLeft) -
				parseInt(computed.paddingRight) -
				this.infoBox.offsetWidth;
			const maxY =
				this.infoContainer.offsetHeight -
				parseInt(computed.paddingTop) -
				parseInt(computed.paddingBottom) -
				this.infoBox.offsetHeight;
			let host = "";

			if (config.style) {
				if (config.style["wallpanel-shadow-host"]) {
					for (const attr in config.style["wallpanel-shadow-host"]) {
						host += `${attr}: ${config.style["wallpanel-shadow-host"][attr]};\n`;
					}
				}
				for (const className in classStyles) {
					if (config.style[className]) {
						mergeConfig(classStyles[className], config.style[className]);
					}
				}
			}

			updateMessageStyle();

			let classCss = "";
			for (const className in classStyles) {
				classCss += `.${className} {\n`;
				for (const attr in classStyles[className]) {
					classCss += `${attr}: ${classStyles[className][attr]};\n`;
				}
				classCss += `}\n`;
			}

			this.shadowStyle.innerHTML = `
				:host {
					${host}
				}
				@keyframes moveX {
					100% {
						transform: translate3d(${maxX}px, 0, 0);
					}
				}
				@keyframes moveY {
					100% {
						transform: translate3d(0, ${maxY}px, 0);
					}
				}
				@keyframes horizontalProgress {
					0% {
						width: 0%;
					}
					100% {
						width: 100%;
					}
				}
				@keyframes kenBurnsEffect-experimental {
					0% {
						transform: scale(1.0) translateX(calc(var(--hidden-width) / -2 * 1px)) translateY(calc(var(--hidden-height) / -2 * 1px));
					}
					50% {
						transform: scale(var(--ken-burns-zoom));
					}
					90% {
						transform: scale(calc(1.0 + ((var(--ken-burns-zoom) - 1.0)/2))) translateX(calc(var(--hidden-width) / 2 * 1px)) translateY(calc(var(--hidden-height) / 2 * 1px));
					}
					100% {
						transform: scale(1.0);
					}
				}
				@keyframes kenBurnsEffect-experimental2 {
					0% {
						transform: scale(1.0);
					}
					25% {
						transform: scale(calc(1.0 + ((var(--ken-burns-zoom) - 1.0)/2))) translateX(calc(var(--hidden-width) / 2 * 1px)) translateY(calc(var(--hidden-height) / 2 * 1px));
					}
					50% {
						transform: scale(var(--ken-burns-zoom));
					}
					75% {
						transform: scale(calc(1.0 + ((var(--ken-burns-zoom) - 1.0)/2))) translateX(calc(var(--hidden-width) / -2 * 1px)) translateY(calc(var(--hidden-height) / -2 * 1px));
					}
					100% {
						transform: scale(1.0);
					}
				}
				@keyframes kenBurnsEffect-simple {
					0% {
						transform-origin: bottom left;
						transform: scale(1.0);
					}
					100% {
						transform: scale(var(--ken-burns-zoom));
					}
				}
				${classCss}
				${config.custom_css}
				${getBirdnetCss()}
			`;
		}

		randomMove() {
			const computed = getComputedStyle(this.infoContainer);
			const maxX =
				this.infoContainer.offsetWidth -
				parseInt(computed.paddingLeft) -
				parseInt(computed.paddingRight) -
				this.infoBox.offsetWidth;
			const maxY =
				this.infoContainer.offsetHeight -
				parseInt(computed.paddingTop) -
				parseInt(computed.paddingBottom) -
				this.infoBox.offsetHeight;
			const x = Math.floor(Math.random() * maxX);
			const y = Math.floor(Math.random() * maxY);
			this.moveInfoBox(x, y);
		}

		moveAroundCorners(correctPostion = false) {
			let fadeDuration = null;
			if (correctPostion) {
				fadeDuration = 0;
			} else {
				this.lastCorner = (this.lastCorner + 1) % 4;
			}
			const computed = getComputedStyle(this.infoContainer);
			const x = [2, 3].includes(this.lastCorner)
				? this.infoContainer.offsetWidth -
					parseInt(computed.paddingLeft) -
					parseInt(computed.paddingRight) -
					this.infoBox.offsetWidth
				: 0;
			const y = [1, 2].includes(this.lastCorner)
				? this.infoContainer.offsetHeight -
					parseInt(computed.paddingTop) -
					parseInt(computed.paddingBottom) -
					this.infoBox.offsetHeight
				: 0;
			this.moveInfoBox(x, y, fadeDuration);
		}

		moveInfoBox(x, y, fadeDuration = null) {
			this.lastMove = Date.now();
			if (fadeDuration === null) {
				fadeDuration = config.info_move_fade_duration;
			}
			if (fadeDuration > 0) {
				if (this.infoBox.animate) {
					const keyframes = [{ opacity: 1 }, { opacity: 0, offset: 0.5 }, { opacity: 1 }];
					this.infoBox.animate(keyframes, {
						duration: Math.round(fadeDuration * 1000),
						iterations: 1
					});
				} else {
					logger.warn("This browser does not support the animate() method, please set info_move_fade_duration to 0");
				}
			}
			const wp = this;
			let ms = Math.round(fadeDuration * 500);
			if (ms < 0) {
				ms = 0;
			}
			if (wp.translateTimeout) {
				clearTimeout(wp.translateTimeout);
			}
			wp.translateTimeout = setTimeout(function () {
				wp.infoBoxPosX.style.transform = `translate3d(${x}px, 0, 0)`;
				wp.infoBoxPosY.style.transform = `translate3d(0, ${y}px, 0)`;
			}, ms);
		}

		createInfoBoxContent() {
			logger.debug("Creating info box content");
			const haPanelLovelace = getHaPanelLovelace();
			if (!haPanelLovelace) {
				return;
			}
			this.lovelace = haPanelLovelace.lovelace || haPanelLovelace.__lovelace;
			this.infoBoxContentCreatedDate = new Date();
			this.infoBoxContent.innerHTML = "";
			this.__badges = [];
			this.__cards = [];
			this.__views = [];
			this.energyCollectionUpdateEnabled = false;

			this.shadowRoot.querySelectorAll(".wp-card").forEach((card) => {
				card.parentElement.removeChild(card);
			});

			if (config.badges && config.badges.length > 0) {
				const div = document.createElement("div");
				div.id = "wallpanel-screensaver-info-box-badges";
				div.classList.add("wp-badges");
				div.style.padding = "var(--wp-card-padding)";
				div.style.margin = "var(--wp-card-margin)";
				div.style.textAlign = "center";
				div.style.display = "flex";
				div.style.alignItems = "flex-start";
				div.style.flexWrap = "wrap";
				div.style.justifyContent = "center";
				div.style.gap = "8px";
				div.style.margin = "0px";
				div.style.minWidth = "var(--wp-badges-minwidth)";
				if (config.style[div.id]) {
					for (const attr in config.style[div.id]) {
						logger.debug(`Setting style attribute ${attr} to ${config.style[div.id][attr]}`);
						div.style.setProperty(attr, config.style[div.id][attr]);
					}
				}
				config.badges.forEach((badge) => {
					const badgeConfig = JSON.parse(JSON.stringify(badge));
					logger.debug("Creating badge:", badgeConfig);
					let style = {};
					if (badgeConfig.wp_style) {
						style = badgeConfig.wp_style;
						delete badgeConfig.wp_style;
					}
					const createBadgeElement = this._createBadgeElement ? this._createBadgeElement : this.createBadgeElement;
					const badgeElement = createBadgeElement.bind(this)(badgeConfig);
					badgeElement.hass = this.hass;
					for (const attr in style) {
						badgeElement.style.setProperty(attr, style[attr]);
					}
					this.__badges.push(badgeElement);
					div.append(badgeElement);
				});
				this.infoBoxContent.appendChild(div);
			}

			if (config.views && config.views.length > 0) {
				const div = document.createElement("div");
				div.id = "wallpanel-screensaver-info-box-views";
				div.classList.add("wp-views");
				if (config.style[div.id]) {
					for (const attr in config.style[div.id]) {
						logger.debug(`Setting style attribute ${attr} to ${config.style[div.id][attr]}`);
						div.style.setProperty(attr, config.style[div.id][attr]);
					}
				}

				const viewConfigs = this.lovelace.config.views;
				config.views.forEach((view) => {
					let viewIndex = -1;
					const viewConfig = JSON.parse(JSON.stringify(view));
					for (var i = 0; i < viewConfigs.length; i++) {
						if (
							(viewConfigs[i].path && view.path && viewConfigs[i].path.toLowerCase() == view.path.toLowerCase()) ||
							(viewConfigs[i].title && view.title && viewConfigs[i].title.toLowerCase() == view.title.toLowerCase())
						) {
							viewIndex = i;
							viewConfig.title = viewConfigs[i].title;
							viewConfig.path = viewConfigs[i].path;
							break;
						}
					}
					if (viewIndex == -1) {
						logger.error(`View with path '${viewConfig.path}' / tile '${viewConfig.title}' not found`);
						viewIndex = 0;
					}

					const viewElement = document.createElement("hui-view");
					viewElement.route = { prefix: "/" + activePanel, path: "/" + viewConfig.path };
					viewElement.lovelace = this.lovelace;
					viewElement.panel = this.hass.panels[activePanel];
					viewElement.hass = this.hass;
					viewElement.index = viewIndex;
					if (typeof viewConfig.narrow == "boolean") {
						viewElement.narrow = viewConfig.narrow;
					}
					this.__views.push(viewElement);

					const viewContainer = document.createElement("div");
					if (config.content_interaction) {
						viewElement.style.pointerEvents = "auto";
					} else {
						viewElement.style.pointerEvents = "none";
					}
					if (viewConfig.wp_style) {
						for (const attr in viewConfig.wp_style) {
							viewContainer.style.setProperty(attr, viewConfig.wp_style[attr]);
						}
					}

					viewContainer.append(viewElement);
					div.append(viewContainer);
				});
				this.infoBoxContent.appendChild(div);
			}

			if (config.cards && config.cards.length > 0) {
				config.cards.forEach((card) => {
					// Copy object
					const cardConfig = JSON.parse(JSON.stringify(card));
					logger.debug("Creating card:", cardConfig);
					let style = {};
					if (cardConfig.wp_style) {
						style = cardConfig.wp_style;
						delete cardConfig.wp_style;
					}
					if (cardConfig.type && cardConfig.type.includes("energy")) {
						cardConfig.collection_key = "energy_wallpanel";
						this.energyCollectionUpdateEnabled = true;
					}

					const createCardElement = this._createCardElement ? this._createCardElement : this.createCardElement;
					const cardElement = createCardElement.bind(this)(cardConfig);
					cardElement.hass = this.hass;
					this.__cards.push(cardElement);

					let parent = this.infoBoxContent;
					const cardContainer = document.createElement("div");
					cardContainer.classList.add("wp-card");
					cardContainer.style.width = "var(--wp-card-width)";
					cardContainer.style.padding = "var(--wp-card-padding)";
					cardContainer.style.margin = "var(--wp-card-margin)";
					cardContainer.style.backdropFilter = "var(--wp-card-backdrop-filter)";

					if (config.content_interaction) {
						cardContainer.style.pointerEvents = "auto";
					} else {
						cardContainer.style.pointerEvents = "none";
					}
					for (const attr in style) {
						if (attr == "parent") {
							const pel = this.shadowRoot.getElementById(style[attr]);
							if (pel) {
								parent = pel;
							}
						} else {
							cardContainer.style.setProperty(attr, style[attr]);
						}
					}

					cardContainer.append(cardElement);
					parent.appendChild(cardContainer);
				});
			}

			setTimeout(this.updateShadowStyle.bind(this), 500);
		}

		setDisplayTime() {
			const displayTime = config.display_time,
				mediaElement = this.getActiveMediaElement(true);
			/* If config.video_play_to_end is true and the mediaElement is a video with a
			 * duration longer or equal to the config.display_time, use the video duration
			 * as WallpanelView.displayTime. Otherwise just use config.display_time.
			 **/
			if (mediaElement.play_to_end && !mediaElement.loop) {
				this.displayTime = mediaElement.duration;
			} else {
				this.displayTime = displayTime;
			}
		}

		getDisplayTime() {
			return this.displayTime;
		}

		restartProgressBarAnimation() {
			if (!this.progressBarContainer) {
				return;
			}
			this.progressBar.style.animation = "none";
			if (!config.show_progress_bar) {
				return;
			}
			const wp = this;
			setTimeout(function () {
				// Restart CSS animation.
				wp.progressBar.style.animation = `horizontalProgress ${wp.getDisplayTime()}s linear`;
				// Do not advance progress bar if slideshow is paused.
				wp.progressBar.style.animationPlayState = wp.isPaused ? "paused" : "running";
			}, 25);
		}

		restartKenBurnsEffect() {
			if (!config.image_animation_ken_burns || !config.image_animation_ken_burns_animations.length) {
				return;
			}
			const activeElement = this.getActiveMediaElement();
			activeElement.style.animation = "none";
			activeElement.style.setProperty("--ken-burns-zoom", config.image_animation_ken_burns_zoom);

			let delay = Math.floor(config.image_animation_ken_burns_delay * 1000);
			if (delay < 50) {
				delay = 50;
			}
			const duration = Math.ceil(
				config.image_animation_ken_burns_duration || (this.getDisplayTime() + config.crossfade_time * 2) * 1.2
			);
			const animation =
				config.image_animation_ken_burns_animations[
					Math.floor(Math.random() * config.image_animation_ken_burns_animations.length)
				];
			if (this.kenburnsDelayStartTimer) {
				clearTimeout(this.kenburnsDelayStartTimer);
			}
			activeElement.animationIterationCount = 1;
			this.kenburnsDelayStartTimer = setTimeout(function () {
				activeElement.style.animation = `kenBurnsEffect-${animation} ${duration}s linear forwards`;
			}, delay);
		}

		getMediaElement(active = true, mediaElement = false) {
			let elem = this.imageOneContainer.style.opacity == (active ? 1 : 0) ? this.imageOne : this.imageTwo;
			if (mediaElement && elem.tagName.toLowerCase() == "ha-camera-stream") {
				const video = getHaCameraStreamPlayerAndVideo(elem)[1];
				if (video) {
					elem = video;
				}
			}
			return elem;
		}

		getActiveMediaElement(mediaElement = false) {
			return this.getMediaElement(true, mediaElement);
		}

		getInactiveMediaElement(mediaElement = false) {
			return this.getMediaElement(false, mediaElement);
		}

		releaseMediaElement(mediaElement) {
			if (!mediaElement) {
				return;
			}

			// Remove compositor references after a crossfade. In particular, keeping the
			// old image URL on an invisible buffer can keep its decoded bitmap / GPU
			// texture alive in memory-constrained WebViews.
			mediaElement.style.animation = "none";
			const backgroundElement =
				mediaElement === this.imageOne
					? this.imageOneBackground
					: mediaElement === this.imageTwo
						? this.imageTwoBackground
						: null;
			if (backgroundElement) {
				backgroundElement.style.backgroundImage = "";
			}

			const tagName = mediaElement.tagName.toLowerCase();
			if (tagName === "ha-camera-stream") {
				try {
					const [player, video] = getHaCameraStreamPlayerAndVideo(mediaElement);
					if (video) {
						video.pause();
					}
					if (player && typeof player.stop === "function") {
						player.stop();
					}
				} catch (error) {
					logger.debug(error);
				}
			} else {
				if (typeof mediaElement.pause === "function") {
					try {
						mediaElement.pause();
					} catch (error) {
						logger.debug(error);
					}
				}
				const src = mediaElement.getAttribute("src") || "";
				if (src.startsWith("blob:")) {
					URL.revokeObjectURL(src);
				}
				mediaElement.removeAttribute("src");
				if (tagName === "video" && typeof mediaElement.load === "function") {
					mediaElement.load();
				}
			}

			mediaElement.mediaUrl = null;
			mediaElement.infoCacheUrl = null;
		}

		releaseAllMedia() {
			this.releaseMediaElement(this.imageOne);
			this.releaseMediaElement(this.imageTwo);
		}

		replaceMediaElement(mediaElement, mediaType) {
			if (typeof mediaElement.src === "string" && mediaElement.src.startsWith("blob:")) {
				URL.revokeObjectURL(mediaElement.src);
			}
			if (typeof mediaElement.pause == "function") {
				mediaElement.pause();
			}
			if (mediaElement.tagName.toLowerCase() == "ha-camera-stream") {
				const [player, video] = getHaCameraStreamPlayerAndVideo(mediaElement);
				if (video) {
					video.pause();
				}
				if (player && typeof player.stop === "function") {
					player.stop();
				}
			}
			mediaType = mediaType.toLowerCase();
			const newMediaElement = document.createElement(mediaType);
			[...mediaElement.attributes]
				.filter((attr) => attr.name != "src")
				.forEach((attr) => newMediaElement.setAttribute(attr.name, attr.value));

			newMediaElement.mediaUrl = mediaElement.mediaUrl;
			newMediaElement.infoCacheUrl = mediaElement.infoCacheUrl;

			if (mediaType === "video") {
				// Do not set muted to true or the following error can occur:
				// Uncaught (in promise) DOMException: The play() request was interrupted because video-only background media was paused to save power. https://goo.gl/LdLk22
				Object.assign(newMediaElement, { preload: "auto", muted: false, volume: config.video_volume });
			}

			mediaElement.replaceWith(newMediaElement);
			if (mediaElement === this.imageOne) {
				this.imageOne = newMediaElement;
			} else {
				this.imageTwo = newMediaElement;
			}
			mediaElement.remove();
			return newMediaElement;
		}

		loadBackgroundImage(element) {
			let srcMediaUrl = element.src;
			const tagName = element.tagName.toLowerCase();
			if (tagName === "ha-camera-stream") {
				const mediaElement = getHaCameraStreamPlayerAndVideo(element)[1];
				if (!mediaElement || !mediaElement.poster) {
					return;
				}
				srcMediaUrl = mediaElement.poster;
			} else if (tagName === "video") {
				// Capture the current frame of the video as a background image
				const canvas = document.createElement("canvas");
				canvas.width = element.videoWidth;
				canvas.height = element.videoHeight;

				const ctx = canvas.getContext("2d");
				ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
				try {
					srcMediaUrl = canvas.toDataURL("image/png");
				} catch (err) {
					srcMediaUrl = null;
					logger.error("Error extracting canvas image:", err);
				}
			}
			let cont = this.imageOneBackground;
			if (element == this.imageTwo) {
				cont = this.imageTwoBackground;
			}
			cont.style.backgroundImage = srcMediaUrl ? `url('${srcMediaUrl.replace(/'/g, "%27")}')` : "";
		}

		connectedCallback() {
			this.style.zIndex = config.z_index;
			this.style.visibility = "hidden";
			this.style.opacity = 0;
			this.style.position = "fixed";

			if (!this.timerInterval) {
				this.timerInterval = setInterval(this.timer.bind(this), 1000);
			}

			this.debugBox = document.createElement("div");
			this.debugBox.id = "wallpanel-debug-box";

			this.screensaverContainer = document.createElement("div");
			this.screensaverContainer.id = "wallpanel-screensaver-container";

			this.imageOneContainer = document.createElement("div");
			this.imageOneContainer.id = "wallpanel-screensaver-image-one-container";

			this.imageOneBackground = document.createElement("div");
			this.imageOneBackground.className = "wallpanel-screensaver-image-background";
			this.imageOneBackground.id = "wallpanel-screensaver-image-one-background";

			this.imageOne = document.createElement("img");
			this.imageOne.id = "wallpanel-screensaver-image-one";

			this.imageOneInfoContainer = document.createElement("div");
			this.imageOneInfoContainer.className = "wallpanel-screensaver-image-info-container";
			this.imageOneInfoContainer.id = "wallpanel-screensaver-image-one-info-container";

			this.imageOneInfo = document.createElement("div");
			this.imageOneInfo.className = "wallpanel-screensaver-image-info";
			this.imageOneInfo.id = "wallpanel-screensaver-image-one-info";

			this.imageOneInfoContainer.appendChild(this.imageOneInfo);
			this.imageOneContainer.appendChild(this.imageOneBackground);
			this.imageOneContainer.appendChild(this.imageOne);
			this.imageOneContainer.appendChild(this.imageOneInfoContainer);
			this.screensaverContainer.appendChild(this.imageOneContainer);

			this.imageTwoContainer = document.createElement("div");
			this.imageTwoContainer.id = "wallpanel-screensaver-image-two-container";

			this.imageTwoBackground = document.createElement("div");
			this.imageTwoBackground.className = "wallpanel-screensaver-image-background";
			this.imageTwoBackground.id = "wallpanel-screensaver-image-two-background";

			this.imageTwo = document.createElement("img");
			this.imageTwo.id = "wallpanel-screensaver-image-two";

			this.imageTwoInfoContainer = document.createElement("div");
			this.imageTwoInfoContainer.className = "wallpanel-screensaver-image-info-container";
			this.imageTwoInfoContainer.id = "wallpanel-screensaver-image-two-info-container";

			this.imageTwoInfo = document.createElement("div");
			this.imageTwoInfo.className = "wallpanel-screensaver-image-info";
			this.imageTwoInfo.id = "wallpanel-screensaver-image-two-info";

			this.imageTwoInfoContainer.appendChild(this.imageTwoInfo);
			this.imageTwoContainer.appendChild(this.imageTwoBackground);
			this.imageTwoContainer.appendChild(this.imageTwo);
			this.imageTwoContainer.appendChild(this.imageTwoInfoContainer);
			this.screensaverContainer.appendChild(this.imageTwoContainer);

			this.screensaverImageOverlay = document.createElement("div");
			this.screensaverImageOverlay.id = "wallpanel-screensaver-image-overlay";
			this.screensaverContainer.appendChild(this.screensaverImageOverlay);

			this.progressBarContainer = document.createElement("div");
			this.progressBarContainer.className = "wallpanel-progress";
			this.progressBar = document.createElement("div");
			this.progressBar.className = "wallpanel-progress-inner";
			this.progressBar.id = "wallpanel-progress-inner";
			this.progressBarContainer.appendChild(this.progressBar);

			if (config.show_progress_bar) {
				this.screensaverContainer.appendChild(this.progressBarContainer);
			}

			this.pauseIndicator = document.createElement("div");
			this.pauseIndicator.id = "wp-pause-indicator";
			this.pauseIndicator.innerHTML = "⏸️";
			this.pauseIndicator.style.position = "absolute";
			this.pauseIndicator.style.top = "1rem";
			this.pauseIndicator.style.left = "1rem";
			this.pauseIndicator.style.fontSize = "4rem";
			this.pauseIndicator.style.lineHeight = "1";
			this.pauseIndicator.style.color = "white";
			this.pauseIndicator.style.filter = "drop-shadow(0 0 8px rgba(0,0,0,0.8))";
			this.pauseIndicator.style.zIndex = "9999";
			this.pauseIndicator.style.pointerEvents = "none";
			this.pauseIndicator.style.display = "none";
			this.screensaverContainer.appendChild(this.pauseIndicator);

			this.infoContainer = document.createElement("div");
			this.infoContainer.id = "wallpanel-screensaver-info-container";

			this.fixedInfoContainer = document.createElement("div");
			this.fixedInfoContainer.id = "wallpanel-screensaver-fixed-info-container";

			this.fixedInfoBox = document.createElement("div");
			this.fixedInfoBox.id = "wallpanel-screensaver-fixed-info-box";

			this.fixedInfoBoxContent = document.createElement("div");
			this.fixedInfoBoxContent.id = "wallpanel-screensaver-fixed-info-box-content";

			this.screensaverContainer.appendChild(this.infoContainer);

			this.infoBoxPosX = document.createElement("div");
			this.infoBoxPosX.id = "wallpanel-screensaver-info-box-pos-x";
			this.infoBoxPosX.x = "0";

			this.infoBoxPosY = document.createElement("div");
			this.infoBoxPosY.id = "wallpanel-screensaver-info-box-pos-y";
			this.infoBoxPosY.y = "0";

			this.infoBox = document.createElement("div");
			this.infoBox.id = "wallpanel-screensaver-info-box";

			this.infoBoxContent = document.createElement("div");
			this.infoBoxContent.id = "wallpanel-screensaver-info-box-content";
			this.infoBoxContent.style.display = "grid";

			this.infoBox.appendChild(this.infoBoxContent);
			this.infoBoxPosX.appendChild(this.infoBox);
			this.infoBoxPosY.appendChild(this.infoBoxPosX);
			this.infoContainer.appendChild(this.infoBoxPosY);

			this.fixedInfoBox.appendChild(this.fixedInfoBoxContent);
			this.fixedInfoContainer.appendChild(this.fixedInfoBox);
			this.infoContainer.appendChild(this.fixedInfoContainer);

			this.screensaverOverlay = document.createElement("div");
			this.screensaverOverlay.id = "wallpanel-screensaver-overlay";
			this.screensaverContainer.appendChild(this.screensaverOverlay);

			this.shadowStyle = document.createElement("style");

			const shadow = this.attachShadow({ mode: "open" });
			shadow.appendChild(this.shadowStyle);
			shadow.appendChild(this.screensaverContainer);
			shadow.appendChild(this.debugBox);

			const wp = this;
			const eventNames = ["click", "touchstart", "touchend", "wheel"];
			if (config.stop_screensaver_on_key_down) {
				eventNames.push("keydown");
			}
			if (config.stop_screensaver_on_mouse_move) {
				eventNames.push("mousemove");
			}
			const interactionHandler = (event) => {
				try {
					wp.handleInteractionEvent(event);
				} catch (error) {
					logger.error(error.stack);
				}
			};
			eventNames.forEach(function (eventName) {
				window.addEventListener(eventName, interactionHandler, true);
				wp.windowEventHandlers.push({ eventName, handler: interactionHandler, options: true });
			});

			const contextMenuHandler = (event) => {
				if (config.disable_context_menu && wp.screensaverRunning()) {
					event.preventDefault();
				}
			};
			window.addEventListener("contextmenu", contextMenuHandler);
			this.windowEventHandlers.push({ eventName: "contextmenu", handler: contextMenuHandler });

			const resizeHandler = () => {
				try {
					const width = this.screensaverContainer.clientWidth;
					const height = this.screensaverContainer.clientHeight;
					if (wp.screensaverRunning() && (wp.currentWidth != width || wp.currentHeight != height)) {
						logger.debug(`Size changed from ${wp.currentWidth}x${wp.currentHeight} to ${width}x${height}`);
						wp.currentWidth = width;
						wp.currentHeight = height;
						wp.updateShadowStyle();
						wp.setMediaDimensions();
					}
				} catch (error) {
					logger.error(error.stack);
				}
			};
			window.addEventListener("resize", resizeHandler);
			this.windowEventHandlers.push({ eventName: "resize", handler: resizeHandler });

			const hassMoreInfoHandler = () => {
				try {
					if (wp.screensaverRunning()) {
						wp.moreInfoDialogToForeground();
					}
				} catch (error) {
					logger.error(error.stack);
				}
			};
			window.addEventListener("hass-more-info", hassMoreInfoHandler);
			this.windowEventHandlers.push({ eventName: "hass-more-info", handler: hassMoreInfoHandler });

			this.infoBoxResizeObserver = new ResizeObserver(() => {
				if (config.info_move_pattern === "corners") {
					// Correct position
					this.moveAroundCorners(true);
				}
			});
			this.infoBoxResizeObserver.observe(this.infoBoxContent);

			// Correct possibly incorrect entity state
			this.setScreensaverEntityState();
		}

		disconnectedCallback() {
			if (this.afterFadeoutTimer) {
				clearTimeout(this.afterFadeoutTimer);
				this.afterFadeoutTimer = null;
			}
			this.releaseAllMedia();
			this.clearMediaListRetry();
			if (this.timerInterval) {
				clearInterval(this.timerInterval);
				this.timerInterval = null;
			}
			if (this.translateTimeout) {
				clearTimeout(this.translateTimeout);
				this.translateTimeout = null;
			}
			if (this.windowEventHandlers.length) {
				this.windowEventHandlers.forEach(({ eventName, handler, options }) => {
					window.removeEventListener(eventName, handler, options);
				});
				this.windowEventHandlers = [];
			}
			if (this.infoBoxResizeObserver) {
				this.infoBoxResizeObserver.disconnect();
				this.infoBoxResizeObserver = null;
			}
		}

		reconfigure(oldConfig) {
			const oldConfigAvailable = oldConfig && Object.keys(oldConfig).length > 0;

			if (
				oldConfigAvailable &&
				(oldConfig.hide_toolbar != config.hide_toolbar ||
					oldConfig.hide_toolbar_action_icons != config.hide_toolbar_action_icons ||
					oldConfig.hide_toolbar_on_subviews != config.hide_toolbar_on_subviews ||
					oldConfig.hide_sidebar != config.hide_sidebar ||
					oldConfig.fullscreen != config.fullscreen)
			) {
				activateWallpanel();
			}

			if (config.theme) {
				logger.info("Apply theme", config.theme);
				wallpanelContainer.theme = config.theme;
				wallpanelContainer._applyTheme();
			}

			this.updateStyle();
			if (this.screensaverRunning()) {
				this.createInfoBoxContent();
			}

			if (!config.info_move_interval && oldConfigAvailable && oldConfig.info_move_interval) {
				wallpanel.moveInfoBox(0, 0);
			}

			const sourceChange =
				oldConfig.image_url != config.image_url ||
				oldConfig.birdnet_url != config.birdnet_url ||
				oldConfig.birdnet_layout != config.birdnet_layout ||
				oldConfig.birdnet_theme != config.birdnet_theme ||
				oldConfig.birdnet_order != config.birdnet_order ||
				oldConfig.birdnet_plates_url != config.birdnet_plates_url ||
				oldConfig.birdnet_local_path != config.birdnet_local_path ||
				JSON.stringify(oldConfig.birdnet_plates) != JSON.stringify(config.birdnet_plates) ||
				oldConfig.media_order != config.media_order ||
				oldConfig.media_list_max_size != config.media_list_max_size ||
				JSON.stringify(oldConfig.exclude_filenames) != JSON.stringify(config.exclude_filenames) ||
				JSON.stringify(oldConfig.exclude_media_types) != JSON.stringify(config.exclude_media_types) ||
				(mediaSourceType() == "immich-api" &&
					(config.immich_shared_albums != oldConfig.immich_shared_albums ||
						config.immich_memories != oldConfig.immich_memories ||
						config.immich_favorites != oldConfig.immich_favorites ||
						JSON.stringify(config.immich_album_names) != JSON.stringify(oldConfig.immich_album_names) ||
						JSON.stringify(config.immich_tag_names) != JSON.stringify(oldConfig.immich_tag_names) ||
						JSON.stringify(config.immich_persons) != JSON.stringify(oldConfig.immich_persons)));
			if (
				config.show_images &&
				(!this.mediaList || !this.mediaList.length || !oldConfigAvailable || !oldConfig.show_images || sourceChange)
			) {
				const wp = this;
				const switchMedia = this.screensaverRunning() && oldConfigAvailable;

				if (sourceChange) {
					this.clearMediaListRetry();
					this.resetMediaPathLists();
					this.mediaList = [];
					this.mediaIndex = -1;
					this.birdnetLocalPaths = null;
					this.localBirdProbingFailedCount = 0;
					this.attemptedAutoPlates = false;
					this.loadedPlatesUrl = "";
					this.vettedPlates = { ...BIRDNET_VETTED_PLATES };
					birdnetImageCache.clear();
					probedUrlCache.clear();
				}

				this.updateMediaList(function () {
					if (switchMedia) {
						wp.switchActiveMedia("reconfigure");
					}
				}, sourceChange);
			}

			if (config.disable_screensaver_on_browser_mod_popup_func) {
				try {
					this.disable_screensaver_on_browser_mod_popup_function = new Function(
						"bmp",
						config.disable_screensaver_on_browser_mod_popup_func
					);
				} catch (error) {
					this.disable_screensaver_on_browser_mod_popup_function = null;
					logger.error("Invalid disable_screensaver_on_browser_mod_popup_func:", error);
				}
			}
			if (isActive() && config.camera_motion_detection_enabled) {
				this.cameraMotionDetection.start();
			} else {
				this.cameraMotionDetection.stop();
			}
		}

		getMoreInfoDialog() {
			const moreInfoDialog = elHass.shadowRoot.querySelector("ha-more-info-dialog");
			if (!moreInfoDialog) {
				return;
			}
			const dialog = moreInfoDialog.shadowRoot.querySelector("ha-dialog");
			if (dialog) {
				return dialog;
			}
		}

		moreInfoDialogToForeground() {
			const wp = this;
			function showDialog(attempt = 1) {
				const dialog = wp.getMoreInfoDialog();
				if (dialog) {
					dialog.style.position = "absolute";
					dialog.style.zIndex = wp.style.zIndex + 1;
					return;
				}
				if (attempt < 10) {
					setTimeout(showDialog, 50, attempt + 1);
				}
			}
			showDialog();
		}

		fetchEXIFInfo(img) {
			const wp = this;

			if (mediaInfoCache.get(img.infoCacheUrl)) {
				return;
			}
			const tmpImg = document.createElement("img");
			tmpImg.src = img.src;
			tmpImg.mediaUrl = img.mediaUrl;
			tmpImg.infoCacheUrl = img.infoCacheUrl;
			getImageData(tmpImg, function () {
				logger.debug("EXIF data:", tmpImg.exifdata);
				addToMediaInfoCache(tmpImg.infoCacheUrl, tmpImg.exifdata);
				wp.setMediaDataInfo(tmpImg);

				const exifLong = tmpImg.exifdata["GPSLongitude"];
				const exifLat = tmpImg.exifdata["GPSLatitude"];
				if (config.fetch_address_data && exifLong && !isNaN(exifLong[0]) && exifLat && !isNaN(exifLat[0])) {
					let m = tmpImg.exifdata["GPSLatitudeRef"] == "S" ? -1 : 1;
					const latitude = exifLat[0] * m + (exifLat[1] * m * 60 + exifLat[2] * m) / 3600;
					m = tmpImg.exifdata["GPSLongitudeRef"] == "W" ? -1 : 1;
					const longitude = exifLong[0] * m + (exifLong[1] * m * 60 + exifLong[2] * m) / 3600;
					logger.debug(`Fetching nominatim data for lat=${latitude} lon=${longitude}`);

					const xhr = new XMLHttpRequest();
					xhr.onload = function () {
						if (this.status == 200 || this.status === 0) {
							const info = JSON.parse(xhr.responseText);
							logger.debug("nominatim data:", info);
							if (info && info.address) {
								const mediaInfo = mediaInfoCache.get(tmpImg.infoCacheUrl);
								if (mediaInfo) {
									mediaInfo.address = info.address;
									wp.setMediaDataInfo(tmpImg);
								} else {
									logger.warn("URL not in cache:", tmpImg.infoCacheUrl);
								}
							}
						} else {
							logger.error("nominatim error:", this.status, xhr.status, xhr.responseText);
						}
					};
					xhr.onerror = function (event) {
						logger.error("nominatim error:", event);
					};
					xhr.ontimeout = function (event) {
						logger.error("nominatim timeout:", event);
					};
					xhr.open("GET", `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
					xhr.timeout = 15000;
					xhr.send();
				}
			});
		}

		setMediaDataInfo(mediaElement = null) {
			const show_info = config.show_image_info && Boolean(config.image_info_template);
			this.imageOneInfoContainer.style.display = show_info ? "block" : "none";
			this.imageTwoInfoContainer.style.display = show_info ? "block" : "none";
			if (!show_info) {
				this.imageOneInfo.innerHTML = "";
				this.imageTwoInfo.innerHTML = "";
				return;
			}

			if (!mediaElement) {
				mediaElement = this.getActiveMediaElement();
			}
			const infoCacheUrl = mediaElement.infoCacheUrl;
			let mediaUrl = mediaElement.mediaUrl;
			if (!infoCacheUrl) {
				logger.debug("infoCacheUrl missing:", mediaElement);
				return;
			}
			if (!mediaUrl) {
				logger.debug("mediaUrl missing:", mediaElement);
				return;
			}
			mediaUrl = decodeURI(mediaUrl);

			const infoElements = [];
			if (this.imageOne.infoCacheUrl == infoCacheUrl) {
				infoElements.push(this.imageOneInfo);
			}
			if (this.imageTwo.infoCacheUrl == infoCacheUrl) {
				infoElements.push(this.imageTwoInfo);
			}

			if (infoElements.length == 0) {
				return;
			}

			// Check if attributes are undefined to avoid overwriting existing ones (e.g., from the Immich API),
			// even if the new value is an empty string
			let mediaInfo = mediaInfoCache.get(infoCacheUrl);
			if (!mediaInfo) {
				mediaInfo = {};
			}
			if (!mediaInfo.image) {
				mediaInfo.image = {};
			}
			if (mediaInfo.image.url === undefined) {
				mediaInfo.image.url = mediaUrl;
			}
			const mediaUrlWithoutQuery = mediaUrl.replace(/\?[^?]*$/, "").replace(/\/+$/, "");
			if (mediaInfo.image.path === undefined) {
				mediaInfo.image.path = mediaUrlWithoutQuery.replace(/^[^:]+:\/\/[^/]+/, "");
			}
			if (mediaInfo.image.relativePath === undefined) {
				// When image_url is configured as a media-source:// URI (e.g. media-source://media_source/local/),
				// mediaUrl gets resolved to a full HTTP URL that won't match config.image_url.
				// Use infoCacheUrl (which retains the original media-source:// URI) for that case.
				const baseUrl =
					mediaSourceType() === "media-source"
						? infoCacheUrl.replace(/\?[^?]*$/, "").replace(/\/+$/, "")
						: mediaUrlWithoutQuery;
				mediaInfo.image.relativePath = baseUrl.replace(config.image_url, "").replace(/^\/+/, "");
			}
			if (mediaInfo.image.filename === undefined) {
				mediaInfo.image.filename = mediaUrlWithoutQuery.replace(/^.*[\\/]/, "");
			}
			if (mediaInfo.image.folderName === undefined) {
				mediaInfo.image.folderName = "";
				const parts = mediaUrlWithoutQuery.split("/");
				if (parts.length >= 2) {
					mediaInfo.image.folderName = parts[parts.length - 2];
				}
			}
			mediaInfo.mediaPosition = this.mediaIndex + 1;
			mediaInfo.mediaCount = this.mediaList.length;

			logger.debug("Media info:", mediaInfo);

			let html = config.image_info_template || "";
			if (html == "analyze") {
				html = "";
				function iterateOverKeys(obj, prefix = "") {
					const keys = Object.keys(obj);
					keys.sort();
					keys.forEach((key) => {
						const value = obj[key];
						if (typeof value === "object" && value !== null) {
							iterateOverKeys(value, key + ".");
						} else {
							html += `${prefix}${key}: ${stringify(value)}<br>`;
						}
					});
				}
				iterateOverKeys(mediaInfo);
				this.imageOneInfo.style.pointerEvents = "none";
				this.imageTwoInfo.style.pointerEvents = "none";
				infoElements.forEach((infoElement) => {
					infoElement.style.pointerEvents = "auto";
				});
			} else {
				html = html.replace(/\${([^}]+)}/g, (match, alternativeTags) => {
					const altTags = alternativeTags.split("||");
					for (let t = 0; t < altTags.length; t++) {
						let tags = altTags[t];
						logger.debug(`Processing tags: ${tags}`);
						let prefix = "";
						let suffix = "";
						let options = null;
						if (tags.includes("!")) {
							const tmp = tags.split("!");
							tags = tmp[0];
							for (let i = 1; i < tmp.length; i++) {
								const argType = tmp[i].substring(0, tmp[i].indexOf("="));
								const argValue = tmp[i].substring(tmp[i].indexOf("=") + 1);
								if (argType == "prefix") {
									prefix = argValue;
								} else if (argType == "suffix") {
									suffix = argValue;
								} else if (argType == "options") {
									options = {};
									argValue.split(",").forEach((optVal) => {
										const tmp2 = optVal.split(":", 2);
										if (tmp2[0] && tmp2[1]) {
											options[tmp2[0].replace(/\s/g, "")] = tmp2[1].replace(/\s/g, "");
										}
									});
								}
							}
						}

						let val = "";
						const tagList = tags.split("|");
						let tag = "";
						for (let i = 0; i < tagList.length; i++) {
							tag = tagList[i];
							const keys = tag.replace(/\s/g, "").split(".");
							val = mediaInfo;
							keys.forEach((key) => {
								if (val) {
									val = val[key];
								}
							});
							if (val) {
								break;
							}
						}
						if (!val) {
							// No value, try next alternative tag
							continue;
						}
						if (/DateTime/i.test(tag)) {
							const date = new Date(val.replace(/(\d\d\d\d):(\d\d):(\d\d) (\d\d):(\d\d):(\d\d)/, "$1-$2-$3T$4:$5:$6"));
							if (isNaN(date)) {
								// Invalid date, try next alternative tag
								continue;
							}
							if (!options) {
								options = { year: "numeric", month: "2-digit", day: "2-digit" };
							}
							val = date.toLocaleDateString((elHass.hass || elHass.__hass).locale.language, options);
						}
						if (typeof val === "object") {
							val = JSON.stringify(val);
						}
						return prefix + val + suffix;
					}
					return "";
				});
			}

			infoElements.forEach((infoElement) => {
				infoElement.innerHTML = html;
				infoElement.style.display = "block";
			});
		}

		clearMediaListRetry() {
			if (this.mediaListRetryTimer) {
				clearTimeout(this.mediaListRetryTimer);
				this.mediaListRetryTimer = null;
			}
			this.mediaListRetryAt = 0;
		}

		async updateMediaList(callback = null, force = false, retryCount = 0) {
			if (!config.image_url && !config.birdnet_url) return;
			if (this.updatingMediaList) return;
			if (this.mediaListRetryAt > Date.now()) return;
			if (!force) {
				if (new Date().getTime() - this.lastMediaListUpdate < getMediaListUpdateIntervalSeconds() * 1000) {
					return;
				}
			}
			this.clearMediaListRetry();

			const wp = this;
			let updateFunction = null;
			const sourceType = mediaSourceType();

			if (sourceType == "unsplash-api") {
				updateFunction = wp.updateMediaListFromUnsplashAPI;
			} else if (sourceType == "immich-api") {
				updateFunction = wp.updateMediaListFromImmichAPI;
			} else if (sourceType == "media-source") {
				updateFunction = wp.updateMediaListFromMediaSource;
			} else if (sourceType == "birdnet") {
				updateFunction = wp.updateMediaListFromBirdnet;
			} else {
				let url = config.image_url;
				if (sourceType == "iframe") {
					url = url.replace(/^iframe\+/, "");
				} else if (sourceType == "embed") {
					url = url.replace(/^embed\+/, "");
				}
				this.mediaList = [url];
				if (callback) {
					callback();
				}
				return;
			}

			this.updatingMediaList = true;
			this.lastMediaListUpdate = Date.now();
			try {
				await updateFunction.bind(wp)();
				this.clearMediaListRetry();
				logger.debug(`Media list from ${sourceType} is now:`, wp.mediaList);
				if (callback) {
					callback();
				}
			} catch (error) {
				const maxRetries = 3;
				let retryDelay = mediaListRetryDelay;
				if (error.httpStatus === 429) {
					if (Number.isFinite(error.retryAfterDelay)) {
						retryDelay = Math.max(error.retryAfterDelay, mediaListRetryDelay);
					} else {
						retryDelay = Math.min(mediaListRateLimitRetryDelay * 2 ** retryCount, maxMediaListRateLimitRetryDelay);
					}
				}
				logger.warn(`Failed to update media list from ${sourceType}:`, error);
				if (retryCount < maxRetries) {
					logger.warn(
						`Retrying media list update in ${retryDelay / 1000} seconds (attempt ${retryCount + 1}/${maxRetries})...`
					);
					this.mediaListRetryAt = Date.now() + retryDelay;
					this.mediaListRetryTimer = setTimeout(() => {
						wp.mediaListRetryTimer = null;
						wp.mediaListRetryAt = 0;
						wp.updateMediaList(callback, true, retryCount + 1);
					}, retryDelay);
				} else {
					const errorMsg = `Failed to update media list from ${config.image_url} after ${maxRetries} retries: ${error.message || stringify(error)}`;
					logger.error(errorMsg);
				}
			}
			this.updatingMediaList = false;
		}

		resetMediaPathLists() {
			this.mediaPathLists = [];
			this.mediaPathQueue = [];
			this.currentMediaPath = null;
		}

		limitMediaList(urls) {
			if (urls.length > config.media_list_max_size) {
				logger.info(`Using only ${config.media_list_max_size} of ${urls.length} media items`);
				return urls.slice(0, config.media_list_max_size);
			}
			return urls;
		}

		async findMediaPathLists(mediaContentId, excludeRegExp = null) {
			const wp = this;
			logger.debug(`findMediaPathLists: ${mediaContentId}`);
			if (!excludeRegExp) {
				excludeRegExp = [];
				if (config.exclude_filenames) {
					for (const imageExclude of config.exclude_filenames) {
						excludeRegExp.push(new RegExp(imageExclude));
					}
				}
			}

			try {
				const mediaEntry = await wp.hass.callWS({
					type: "media_source/browse_media",
					media_content_id: mediaContentId
				});

				logger.debug("Found media entry", mediaEntry);
				const medias = [];
				const directoryPromises = [];
				for (const child of mediaEntry.children) {
					const filename = child.media_content_id.replace(/^media-source:\/\/[^/]+/, "");
					let excluded = false;
					for (const exclude of excludeRegExp) {
						exclude.lastIndex = 0;
						if (exclude.test(filename)) {
							excluded = true;
							break;
						}
					}
					if (excluded) {
						continue;
					}
					if (["image", "video"].includes(child.media_class)) {
						if (config.exclude_media_types && config.exclude_media_types.includes(child.media_class)) {
							continue;
						}
						medias.push(child.media_content_id);
					} else if (child.media_class == "directory") {
						directoryPromises.push(wp.findMediaPathLists(child.media_content_id, excludeRegExp));
					}
				}

				const childPathLists = (await Promise.all(directoryPromises)).flat();
				const pathLists = medias.length ? [{ path: mediaContentId, medias: medias }] : [];
				return pathLists.concat(childPathLists);
			} catch (error) {
				logger.warn(`Error browsing media ${mediaContentId}:`, error);
				throw error; // Re-throw the error to be caught by the caller
			}
		}

		updateMediaPathQueue() {
			const availablePaths = this.mediaPathLists.map((pathList) => pathList.path);
			this.mediaPathQueue = this.mediaPathQueue.filter(
				(path, index, paths) =>
					path != this.currentMediaPath && availablePaths.includes(path) && paths.indexOf(path) == index
			);
		}

		selectNextMediaPath() {
			if (!this.mediaPathLists.length) {
				this.mediaList = [];
				this.mediaIndex = -1;
				this.currentMediaPath = null;
				return false;
			}

			if (!this.mediaPathQueue.length) {
				this.mediaPathQueue = shuffleArray(this.mediaPathLists.map((pathList) => pathList.path));
				if (this.mediaPathQueue.length > 1 && this.mediaPathQueue[0] == this.currentMediaPath) {
					[this.mediaPathQueue[0], this.mediaPathQueue[1]] = [this.mediaPathQueue[1], this.mediaPathQueue[0]];
				}
			}

			const nextPath = this.mediaPathQueue.shift();
			const pathList = this.mediaPathLists.find((entry) => entry.path == nextPath);
			if (!pathList) {
				this.updateMediaPathQueue();
				return this.selectNextMediaPath();
			}

			this.currentMediaPath = nextPath;
			this.mediaList = this.limitMediaList(pathList.medias.slice().sort());
			this.mediaIndex = -1;
			logger.debug(`Selected media path ${nextPath}:`, this.mediaList);
			return this.mediaList.length > 0;
		}

		updateRandomPathMediaLists(pathLists) {
			const currentMediaUrl = this.mediaList[this.mediaIndex];
			const previousMediaIndex = this.mediaIndex;
			this.mediaPathLists = pathLists;
			this.updateMediaPathQueue();

			const currentPathList = this.mediaPathLists.find((entry) => entry.path == this.currentMediaPath);
			if (!currentPathList) {
				this.currentMediaPath = null;
				this.mediaPathQueue = [];
				this.selectNextMediaPath();
				return;
			}

			this.mediaList = this.limitMediaList(currentPathList.medias.slice().sort());
			if (currentMediaUrl && this.mediaList.includes(currentMediaUrl)) {
				this.mediaIndex = this.mediaList.indexOf(currentMediaUrl);
			} else if (previousMediaIndex >= 0) {
				this.mediaIndex = Math.min(previousMediaIndex - 1, this.mediaList.length - 1);
			} else {
				this.mediaIndex = -1;
			}
		}

		async updateMediaListFromMediaSource() {
			const mediaContentId = config.image_url;
			const wp = this;

			try {
				const pathLists = await wp.findMediaPathLists(mediaContentId);
				if (config.media_order == "random_path") {
					wp.updateRandomPathMediaLists(pathLists);
					return;
				}

				wp.resetMediaPathLists();
				let urls = pathLists.flatMap((pathList) => pathList.medias);
				if (config.media_order == "random") {
					urls = shuffleArray(urls);
				} else if (config.media_order == "random_but_synced") {
					// Sort for a stable base, then shuffle with a fixed seed so every
					// device derives the identical "random" order.
					urls = shuffleArray(urls.slice().sort(), mulberry32(MEDIA_SYNC_SEED));
				} else {
					urls = urls.sort(); // Sort consistently if not random
				}
				wp.mediaList = wp.limitMediaList(urls);
			} catch (error) {
				// Error is logged in findMediaPathLists, re-throw for updateMediaList handler
				throw new Error(`Failed to update image list from ${config.image_url}: ${error.message || stringify(error)}`);
			}
		}

		async updateMediaListFromUnsplashAPI() {
			const urls = [];
			const requestUrl = `${config.image_url}&count=30`;

			logger.debug(`Unsplash API request: ${requestUrl}`);
			try {
				const options = {
					method: "GET",
					headers: { Accept: "application/json" }
				};
				if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout !== "undefined") {
					logger.debug("Using AbortSignal");
					options.signal = AbortSignal.timeout(config.immich_api_request_timeout * 1000);
				}

				const response = await fetch(requestUrl, options);

				if (!response.ok) {
					const errorText = await response.text();
					const error = new Error(
						`Unsplash API request failed: ${response.status} ${response.statusText} - ${errorText}`
					);
					error.httpStatus = response.status;
					if (response.status === 429) {
						error.retryAfterDelay = getRetryAfterDelay(response);
					}
					throw error;
				}

				const json = await response.json();
				logger.debug("Got Unsplash API response");

				json.forEach((entry) => {
					logger.debug(entry);
					const url = `${entry.urls.raw}&w=\${width}&h=\${height}&auto=format`;
					urls.push(url);
					addToMediaInfoCache(url, entry);
				});
				this.mediaList = urls;
			} catch (error) {
				if (error.name === "AbortError") {
					throw new Error(`Unsplash API request timed out: ${requestUrl}`);
				}
				throw error; // Re-throw other errors
			}
		}

		async _immichFetch(url, apiKey, options = {}) {
			const defaultOptions = {
				headers: {
					"x-api-key": apiKey,
					"Content-Type": "application/json",
					Accept: "application/json"
				}
			};
			const mergedOptions = { ...defaultOptions, ...options };
			mergedOptions.headers = { ...defaultOptions.headers, ...options.headers };
			if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout !== "undefined") {
				logger.debug("Using AbortSignal");
				mergedOptions.signal = AbortSignal.timeout(10000); // 10 seconds timeout
			}

			logger.debug(`Immich API request: ${url}`);
			try {
				const response = await fetch(url, mergedOptions);

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(`Immich API request failed: ${response.status} ${response.statusText} - ${errorText}`);
				}
				return await response.json();
			} catch (error) {
				if (error.name === "AbortError") {
					throw new Error(`Immich API request timed out: ${url}`);
				}
				throw error; // Re-throw other errors
			}
		}

		async updateMediaListFromImmichAPI() {
			if (!config.immich_api_keys || !config.immich_api_keys.length) {
				throw new Error("No immich_api_key configured");
			}
			const wp = this;
			const screenOrientation =
				this.screensaverContainer.clientWidth >= this.screensaverContainer.clientHeight ? "landscape" : "portrait";
			let exclude_media_orientation = config.exclude_media_orientation;
			if (exclude_media_orientation == "auto") {
				exclude_media_orientation = screenOrientation == "landscape" ? "portrait" : "landscape";
			}
			logger.debug(
				`config.exclude_media_orientation=${config.exclude_media_orientation}, screenOrientation=${screenOrientation}, exclude_media_orientation=${exclude_media_orientation}`
			);
			let urls = [];
			const mediaInfo = {};
			const apiUrl = config.image_url.replace(/^immich\+/, "");
			const excludeRegExp = [];
			if (config.exclude_filenames) {
				for (const imageExclude of config.exclude_filenames) {
					excludeRegExp.push(new RegExp(imageExclude));
				}
			}

			function getImmichExifDimensions(exif) {
				if (!exif?.exifImageWidth || !exif?.exifImageHeight) {
					return null;
				}
				let width = exif.exifImageWidth;
				let height = exif.exifImageHeight;
				if (exif.orientation) {
					const orientation = Number(exif.orientation);
					if ([5, 6, 7, 8, 90, -90].includes(orientation)) {
						[width, height] = [height, width];
					}
				}
				return { width, height };
			}

			function getImmichDisplayDimensions(asset) {
				if (asset.width != null && asset.height != null) {
					return { width: asset.width, height: asset.height };
				}
				return getImmichExifDimensions(asset.exifInfo);
			}

			function getImmichMediaOrientation(asset) {
				const dimensions = getImmichDisplayDimensions(asset);
				if (!dimensions) {
					return null;
				}
				return dimensions.width >= dimensions.height ? "landscape" : "portrait";
			}

			async function fetchAssetInfo(assets, apiKey) {
				const fetchTags = config.immich_exclude_tag_names && config.immich_exclude_tag_names.length;
				const needDimensions = !!exclude_media_orientation;
				const assetInfoConcurrency = 10;
				for (let offset = 0; offset < assets.length; offset += assetInfoConcurrency) {
					const assetBatch = assets.slice(offset, offset + assetInfoConcurrency);
					await Promise.all(
						assetBatch.map(async (asset) => {
							const isImage = asset.type?.toLowerCase() === "image";
							const needsDetailForEdit =
								isImage &&
								asset.isEdited !== true &&
								(asset.width == null || asset.height == null || asset.isEdited === undefined);
							const needsDetailForOrientation =
								isImage && needDimensions && (asset.width == null || asset.height == null);
							if (!asset.exifInfo || (fetchTags && !asset.tags) || needsDetailForOrientation || needsDetailForEdit) {
								logger.debug(`Fetching asset info for ${asset.id}`);
								const assetInfo = await wp._immichFetch(`${apiUrl}/assets/${asset.id}`, apiKey);
								asset.exifInfo = assetInfo.exifInfo;
								asset.tags = (assetInfo.tags || []).map((v) => v.value);
								asset.width = assetInfo.width;
								asset.height = assetInfo.height;
								asset.isEdited = assetInfo.isEdited;
							}
						})
					);
				}
			}

			async function processAssets(assets, apiKey, folderName = null) {
				await fetchAssetInfo(assets, apiKey);

				for (const asset of assets) {
					logger.debug("Processing immich asset", asset);

					const assetType = asset.type.toLowerCase();
					if (!["image", "video"].includes(assetType)) {
						logger.debug("Neither image nor video, skipping");
						continue;
					}

					if (config.exclude_media_types && config.exclude_media_types.includes(assetType)) {
						logger.debug(`Media type "${assetType}" excluded`);
						continue;
					}

					let excludedByRegExp = false;
					for (const exclude of excludeRegExp) {
						if (exclude.test(asset.originalFileName)) {
							logger.debug(`Media item excluded by regex "${exclude}"`);
							excludedByRegExp = true;
						}
					}
					if (excludedByRegExp) {
						continue;
					}

					if (config.immich_exclude_tag_names && config.immich_exclude_tag_names.length) {
						const matchingTags = asset.tags.filter((tag) => config.immich_exclude_tag_names.includes(tag));
						if (matchingTags.length > 0) {
							logger.debug(`Media item excluded due to tag(s): ${matchingTags.join(", ")}`);
							continue;
						}
					}

					if (exclude_media_orientation) {
						const orientation = getImmichMediaOrientation(asset);
						if (orientation === exclude_media_orientation) {
							logger.debug(`Media item with orientation "${orientation}" excluded`);
							continue;
						}
					}

					let resolution = "original";
					if (config.immich_resolution == "preview") {
						if (assetType == "video") {
							resolution = "video/playback";
						} else {
							resolution = "thumbnail?size=preview";
						}
					}

					let url = `${apiUrl}/assets/${asset.id}/${resolution}`;
					if (assetType == "image") {
						url += url.includes("?") ? "&edited=true" : "?edited=true";
					}
					if (urls.indexOf(url) >= 0) {
						continue;
					}
					urls.push(url);

					const info = asset.exifInfo || {};
					info["immichApiKey"] = apiKey;
					info["mediaType"] = assetType;
					info["image"] = {
						filename: asset.originalFileName,
						folderName: folderName
					};
					mediaInfo[url] = info;
				}
			}

			function finalizeImageList() {
				if (urls.length == 0) {
					const msg = "No matching media assets found";
					logger.error(msg);
				}
				if (config.media_order == "random") {
					urls = shuffleArray(urls);
				} else if (config.media_order == "random_but_synced") {
					// Sort for a stable base, then shuffle with a fixed seed so every
					// device derives the identical "random" order.
					urls = shuffleArray(urls.slice().sort(), mulberry32(MEDIA_SYNC_SEED));
				} else {
					urls = urls.sort(); // Sort consistently if not random
				}
				if (urls.length > config.media_list_max_size) {
					logger.info(`Using only ${config.media_list_max_size} of ${urls.length} media items`);
					urls = urls.slice(0, config.media_list_max_size);
				}
				urls.forEach((url) => {
					addToMediaInfoCache(url, mediaInfo[url]);
				});
				wp.mediaList = urls;
			}

			try {
				for (const apiKey of config.immich_api_keys) {
					logger.debug(`Using immich API key ${apiKey}`);
					if (config.immich_persons && config.immich_persons.length) {
						logger.debug("Searching for assets based on persons");
						const orPersonNames = config.immich_persons.map((entry) =>
							(Array.isArray(entry) ? entry : [entry]).map((v) => v.toLowerCase())
						);
						const personNameToId = {};
						let allPeople = [];
						let page = 1;
						let hasNextPage = true;

						// Fetch all people first
						while (hasNextPage) {
							const peopleData = await wp._immichFetch(`${apiUrl}/people?size=1000&page=${page}`, apiKey);
							allPeople = allPeople.concat(peopleData.people);
							hasNextPage = peopleData.hasNextPage;
							page++;
						}
						allPeople.forEach((person) => {
							if (person.name && person.id) {
								personNameToId[person.name.toLowerCase()] = person.id;
							}
						});

						// Fetch assets for each person/group criteria
						for (const personNames of orPersonNames) {
							const personIds = [];
							personNames.forEach((personName) => {
								const personId = personNameToId[personName.toLowerCase()];
								if (personId) {
									personIds.push(personId);
								} else {
									logger.error(`Person not found in immich: ${personName}`);
								}
							});

							if (personIds.length > 0) {
								logger.debug("Searching asset metadata for persons: ", personIds);
								let page = 1;
								while (true) {
									logger.debug(`Fetching asset metadata page ${page}`);
									const searchResults = await wp._immichFetch(`${apiUrl}/search/metadata`, apiKey, {
										method: "POST",
										body: JSON.stringify({ personIds: personIds, withExif: true, page: page, size: 1000 })
									});
									logger.debug(`Got immich API response`, searchResults);
									if (!searchResults.assets.count) {
										if (page == 1) {
											const msg = `No media items found in immich that contain all these people: ${personNames}`;
											logger.error(msg);
										}
										break;
									}
									await processAssets(searchResults.assets.items, apiKey);
									if (!searchResults.assets.nextPage) {
										break;
									}
									page = parseInt(searchResults.assets.nextPage, 10);
								}
							}
						}
					} else if (config.immich_memories) {
						logger.debug("Fetching immich memories (on_this_day)");
						const allMemories = await wp._immichFetch(`${apiUrl}/memories?type=on_this_day`, apiKey);
						logger.debug(`Got immich API response`, allMemories);
						const now = new Date();
						const visibleMemories = allMemories.filter((memory) => {
							const showAt = new Date(memory.showAt);
							const hideAt = new Date(memory.hideAt);
							return now >= showAt && now <= hideAt;
						});
						logger.debug(`Found ${visibleMemories.length} visible memories`);

						await Promise.all(
							visibleMemories.map(async (memory) => {
								logger.debug("Processing memory:", memory);
								await processAssets(memory.assets, apiKey);
							})
						);
					} else if (config.immich_favorites) {
						logger.debug("Search for favorites in asset metadata");
						let page = 1;
						while (true) {
							logger.debug(`Fetching asset metadata page ${page}`);
							const searchResults = await wp._immichFetch(`${apiUrl}/search/metadata`, apiKey, {
								method: "POST",
								body: JSON.stringify({ isFavorite: true, withExif: true, page: page, size: 1000 })
							});
							logger.debug("Got immich API response", searchResults);
							if (!searchResults.assets.count) {
								if (page == 1) {
									const msg = "No favorite media items found in immich";
									logger.error(msg);
								}
								break;
							}
							await processAssets(searchResults.assets.items, apiKey);
							if (!searchResults.assets.nextPage) {
								break;
							}
							page = parseInt(searchResults.assets.nextPage, 10);
						}
					} else if (config.immich_tag_names && config.immich_tag_names.length) {
						logger.debug("Searching for assets based on tag names");
						const tagNamesLower = config.immich_tag_names.map((v) => v.toLowerCase());
						logger.debug("Fetching immich tags");
						const allTags = await wp._immichFetch(`${apiUrl}/tags`, apiKey);
						logger.debug(`Got immich API response`, allTags);
						const tagIds = allTags
							.filter((tag) => {
								const include = tagNamesLower.includes(tag.name.toLowerCase());
								logger.debug(`${include ? "Adding" : "Skipping"} tag: ${tag.name}`);
								return include;
							})
							.map((tag) => tag.id);

						if (tagIds.length > 0) {
							logger.debug("Searching asset metadata for tags: ", tagIds);
							let page = 1;
							while (true) {
								logger.debug(`Fetching asset metadata page ${page}`);
								const searchResults = await wp._immichFetch(`${apiUrl}/search/metadata`, apiKey, {
									method: "POST",
									body: JSON.stringify({ tagIds: tagIds, withExif: true, page: page, size: 1000 })
								});
								logger.debug("Got immich API response", searchResults);
								if (!searchResults.assets.count) {
									if (page == 1) {
										const msg = `No media items found in immich that contain these tags: ${tagNamesLower}`;
										logger.error(msg);
									}
									break;
								}
								await processAssets(searchResults.assets.items, apiKey);
								if (!searchResults.assets.nextPage) {
									break;
								}
								page = parseInt(searchResults.assets.nextPage, 10);
							}
						} else {
							const msg = "No matching immich tags found or selected.";
							logger.error(msg);
						}
					} else {
						logger.debug("Searching for assets based on albums");
						// Default: Fetch albums
						const albumNamesLower = (config.immich_album_names || []).map((v) => v.toLowerCase());
						logger.debug(`Fetching immich albums (shared=${config.immich_shared_albums})`);
						const serverVersion = await wp._immichFetch(`${apiUrl}/server/version`, apiKey);
						logger.debug("Immich server version:", serverVersion);
						const parameterShared = serverVersion.major < 3 ? "shared" : "isShared";
						const allAlbums = await wp._immichFetch(
							`${apiUrl}/albums?${parameterShared}=${config.immich_shared_albums}`,
							apiKey
						);
						logger.debug("Got immich API response", allAlbums);

						const albumsToFetch = allAlbums.filter((album) => {
							const include = !albumNamesLower.length || albumNamesLower.includes(album.albumName.toLowerCase());
							logger.debug(`${include ? "Adding" : "Skipping"} album: ${album.albumName}`);
							return include;
						});

						if (albumsToFetch.length > 0) {
							for (const album of albumsToFetch) {
								logger.debug("Fetching assets for album: ", album.albumName);
								let page = 1;
								while (true) {
									const searchResults = await wp._immichFetch(`${apiUrl}/search/metadata`, apiKey, {
										method: "POST",
										body: JSON.stringify({ albumIds: [album.id], withExif: true, page })
									});
									logger.debug(`Got immich album assets (page ${page})`, searchResults);
									await processAssets(searchResults.assets.items, apiKey, album.albumName);
									if (!searchResults.assets.nextPage) {
										break;
									}
									page = parseInt(searchResults.assets.nextPage, 10);
								}
							}
						} else {
							logger.debug("No matching immich albums found or selected.");
						}
					}
				}

				finalizeImageList();
			} catch (error) {
				logger.error("Immich API processing failed:", error);
				throw error; // Re-throw for the main updateMediaList handler
			}
		}

		async updateMediaListFromBirdnet() {
			if (config.birdnet_plates_url && config.birdnet_plates_url !== this.loadedPlatesUrl) {
				await this.loadPlatesJson(config.birdnet_plates_url);
			}

			let speciesList = [];
			const birdnetUrl = (config.birdnet_url || "").trim().replace(/\/+$/, "");

			if (birdnetUrl) {
				try {
					const headers = {};
					if (config.birdnet_token) {
						headers["Authorization"] = `Bearer ${config.birdnet_token}`;
					}
					const controller = new AbortController();
					const timeoutId = setTimeout(() => controller.abort(), 8000);
					const [dailyResp, recentResp] = await Promise.all([
						fetch(`${birdnetUrl}/api/v2/analytics/species/daily`, {
							headers,
							credentials: "omit",
							signal: controller.signal
						})
							.then((r) => (r.ok ? r.json() : null))
							.catch(() => null),
						fetch(`${birdnetUrl}/api/v2/detections/recent`, {
							headers,
							credentials: "omit",
							signal: controller.signal
						})
							.then((r) => (r.ok ? r.json() : null))
							.catch(() => null)
					]);
					clearTimeout(timeoutId);

					if (dailyResp || recentResp) {
						speciesList = this.processBirdnetApiResponse(dailyResp, recentResp);
					}
				} catch (e) {
					logger.warn("BirdNET-Go API request failed:", e);
				}
			}

			if (!speciesList || speciesList.length === 0) {
				// Keep the last real data if we have it; otherwise the layouts render an empty sheet
				logger.warn("BirdNET-Go returned no usable species");
				speciesList = this.birdnetSpecies ? [...this.birdnetSpecies] : [];
			}

			// Apply sorting
			const order = config.birdnet_order || "recent";
			if (order === "count") {
				speciesList.sort((a, b) => b.count - a.count);
			} else if (order === "name") {
				speciesList.sort((a, b) => a.name.localeCompare(b.name));
			} else if (order === "random") {
				speciesList = shuffleArray(speciesList);
			}

			this.birdnetSpecies = speciesList;
			this.lastBirdnetUpdate = Date.now();

			const layout = config.birdnet_layout || "folio";
			let mediaUrls = [];

			if (layout === "cluster") {
				mediaUrls = ["birdnet://cluster"];
			} else if (layout === "chart") {
				mediaUrls = ["birdnet://chart"];
			} else if (layout === "spread") {
				mediaUrls = speciesList.map((sp, idx) => `birdnet://spread/${encodeURIComponent(sp.sci)}?idx=${idx}`);
			} else if (layout === "latest") {
				const topSp = speciesList[0] || { sci: "Trichoglossus moluccanus" };
				mediaUrls = [`birdnet://folio/${encodeURIComponent(topSp.sci)}?idx=0`];
			} else if (layout === "auto") {
				const isLong = this.isLongCardBox();
				// When cards occupy an extended column, two-sided spread is omitted in favor of single-side offset templates
				const candidateLayouts = isLong
					? ["folio", "plate", "cluster"]
					: ["folio", "spread", "cluster", "chart", "plate"];

				mediaUrls = [];
				speciesList.forEach((sp, idx) => {
					const chosen = candidateLayouts[idx % candidateLayouts.length];
					if (chosen === "cluster") {
						mediaUrls.push("birdnet://cluster");
					} else if (chosen === "chart") {
						mediaUrls.push("birdnet://chart");
					} else {
						mediaUrls.push(`birdnet://${chosen}/${encodeURIComponent(sp.sci)}?idx=${idx}`);
					}
				});
				if (!mediaUrls.some((u) => u.includes("cluster"))) {
					mediaUrls.push("birdnet://cluster");
				}
				if (order === "random") {
					mediaUrls = shuffleArray(mediaUrls);
				}
			} else {
				// "folio" or "plate"
				mediaUrls = speciesList.map((sp, idx) => `birdnet://${layout}/${encodeURIComponent(sp.sci)}?idx=${idx}`);
			}

			if (!mediaUrls.length) {
				mediaUrls = ["birdnet://cluster"];
			}

			this.mediaList = mediaUrls;
			this.mediaIndex = 0;
			this.lastMediaListUpdate = Date.now();

			// Preload images in background
			// Limited concurrency avoids a burst of probe requests (404s) when many species are listed
			const preloadQueue = [...speciesList];
			const preloadWorker = async () => {
				while (preloadQueue.length) {
					const sp = preloadQueue.shift();

					await this.resolveBirdImage(sp.sci, sp.name);
				}
			};
			preloadWorker();
			preloadWorker();

			return this.mediaList;
		}

		processBirdnetApiResponse(dailyData, recentData) {
			const speciesMap = new Map();
			const minConfidence = (Number(config.birdnet_min_confidence) || 50) / 100;

			// Extract species from daily analytics
			let dailyItems = [];
			if (Array.isArray(dailyData)) {
				dailyItems = dailyData;
			} else if (dailyData && Array.isArray(dailyData.species)) {
				dailyItems = dailyData.species;
			} else if (dailyData && Array.isArray(dailyData.data)) {
				dailyItems = dailyData.data;
			}

			for (const item of dailyItems) {
				const sci = item.scientific_name || item.sci || item.scientificName || "";
				if (!sci) continue;
				const name = item.common_name || item.name || item.commonName || sci;
				const conf = Number(item.confidence || item.max_confidence || item.avg_confidence || 1);
				if (conf < minConfidence && (item.count || 1) <= 1) continue;

				let lastTime = item.latest_heard || item.last_time || item.last_heard || item.last || "";
				if (lastTime.includes(":") && lastTime.length > 5) {
					lastTime = lastTime.substring(0, 5);
				}
				speciesMap.set(sci, {
					name,
					sci,
					count: Number(item.count || item.total_count || item.detections || 1),
					conf,
					last: lastTime,
					first: item.first_time || item.first_heard || item.first || "",
					hourly: Array.isArray(item.hourly) ? item.hourly : item.hourly_counts || []
				});
			}

			// Ingest recent detections to augment last time and confidence
			let recentItems = [];
			if (Array.isArray(recentData)) {
				recentItems = recentData;
			} else if (recentData && Array.isArray(recentData.detections)) {
				recentItems = recentData.detections;
			}

			for (const det of recentItems) {
				const sci = det.scientific_name || det.sci || det.scientificName || "";
				if (!sci) continue;
				const name = det.common_name || det.name || det.commonName || sci;
				const conf = Number(det.confidence || 0.9);
				if (conf < minConfidence) continue;

				let timeStr = "";
				if (det.time) {
					timeStr = det.time.includes("T") ? det.time.split("T")[1].substring(0, 5) : det.time;
				} else if (det.timestamp) {
					const d = new Date(det.timestamp);
					timeStr = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
				}

				if (speciesMap.has(sci)) {
					const existing = speciesMap.get(sci);
					if (!existing.last && timeStr) existing.last = timeStr;
				} else {
					speciesMap.set(sci, {
						name,
						sci,
						count: 1,
						conf,
						last: timeStr,
						first: timeStr,
						hourly: []
					});
				}
			}

			return Array.from(speciesMap.values());
		}

		async loadPlatesJson(url) {
			if (!url) return;
			try {
				const resp = await fetch(url);
				if (resp.ok) {
					const data = await resp.json();
					const plates = data.plates || data;
					this.vettedPlates = Object.assign({}, BIRDNET_VETTED_PLATES, plates);
					this.loadedPlatesUrl = url;
					logger.debug(`Loaded ${Object.keys(plates).length} custom plates from ${url}`);
				}
			} catch (err) {
				logger.warn(`Failed to load plates.json from ${url}:`, err);
			}
		}

		async resolveBirdImage(sciName, commonName = "") {
			if (!sciName) return null;
			const cached = birdnetImageCache.get(sciName);
			// Failed lookups carry retryAt so a transient outage does not blank a plate permanently
			if (cached && !(cached.retryAt && Date.now() >= cached.retryAt)) {
				return cached;
			}
			// Share one lookup between concurrent callers instead of repeating every probe
			if (!this.birdnetResolvePending) {
				this.birdnetResolvePending = new Map();
			}
			let pending = this.birdnetResolvePending.get(sciName);
			if (!pending) {
				pending = this.resolveBirdImageUncached(sciName, commonName).finally(() => {
					this.birdnetResolvePending.delete(sciName);
				});
				this.birdnetResolvePending.set(sciName, pending);
			}
			return pending;
		}

		async resolveBirdImageUncached(sciName, commonName = "") {
			// Deduce commonName from birdnetSpecies if not provided
			if (!commonName && this.birdnetSpecies) {
				const sp = this.birdnetSpecies.find((s) => s.sci === sciName);
				if (sp && sp.name) commonName = sp.name;
			}

			// 1. Option 4: Inline dashboard configuration (config.birdnet_plates)
			if (config.birdnet_plates && typeof config.birdnet_plates === "object") {
				const inline = config.birdnet_plates[sciName] || (commonName && config.birdnet_plates[commonName]);
				if (inline) {
					let plateUrl = "";
					let box = null;
					let artist = "";
					let source = "Inline Configuration";

					if (typeof inline === "string") {
						plateUrl = inline.trim();
					} else if (typeof inline === "object") {
						plateUrl = (inline.url || inline.file || "").trim();
						box = inline.box || null;
						artist = inline.artist || "";
						source = inline.source || source;
					}

					if (plateUrl) {
						if (plateUrl.startsWith("File:")) {
							plateUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(plateUrl.replace(/^File:/i, ""))}`;
						} else if (
							!plateUrl.includes("://") &&
							!plateUrl.startsWith("/") &&
							!plateUrl.startsWith("./") &&
							!plateUrl.startsWith("data:")
						) {
							const basePath = (this.birdnetLocalPaths && this.birdnetLocalPaths[0]) || "/local/birds/";
							plateUrl = `${basePath}${plateUrl}`;
						}

						const entry = { url: plateUrl, box, artist, source };
						birdnetImageCache.set(sciName, entry);
						return entry;
					}
				}
			}

			// 2. Check explicitly loaded plates manifest or auto-discovered plates.json
			if (!this.loadedPlatesUrl && !this.attemptedAutoPlates) {
				this.attemptedAutoPlates = true;
				for (const autoUrl of ["/local/birds/plates.json", "/media/local/birds/plates.json"]) {
					await this.loadPlatesJson(autoUrl);
					if (this.loadedPlatesUrl) break;
				}
			}

			const vetted = this.vettedPlates && this.vettedPlates[sciName];

			// If explicitly loaded from custom plates.json URL, honor vetted.image/file directly
			if (this.loadedPlatesUrl && vetted) {
				let plateUrl = vetted.image || vetted.url || "";
				if (!plateUrl && vetted.file) {
					if (
						vetted.file.startsWith("http://") ||
						vetted.file.startsWith("https://") ||
						vetted.file.startsWith("/") ||
						vetted.file.startsWith("./") ||
						vetted.file.startsWith("data:")
					) {
						plateUrl = vetted.file;
					} else {
						const lastSlash = this.loadedPlatesUrl.lastIndexOf("/");
						const baseDir = lastSlash >= 0 ? this.loadedPlatesUrl.substring(0, lastSlash + 1) : "";
						plateUrl = `${baseDir}${vetted.file}`;
					}
				}
				if (plateUrl) {
					const entry = {
						url: plateUrl,
						box: vetted.box || null,
						artist: vetted.artist || "",
						source: vetted.source || "Plates Manifest"
					};
					birdnetImageCache.set(sciName, entry);
					return entry;
				}
			}

			// 3. Option 2: Local Filename Heuristic Probing (Convention over configuration)
			// Probe local directories before falling back to remote search.
			if (!this.birdnetLocalPaths) {
				if (config.birdnet_local_path) {
					this.birdnetLocalPaths = Array.isArray(config.birdnet_local_path)
						? [...config.birdnet_local_path]
						: [config.birdnet_local_path];
				} else {
					this.birdnetLocalPaths = ["/media/local/birds/", "/local/birds/"];
				}
				this.birdnetLocalPaths = this.birdnetLocalPaths.map((p) => (p.endsWith("/") ? p : `${p}/`));
			}

			if (this.localBirdProbingFailedCount < 4) {
				const candidateFilenames = getBirdnetCandidateFilenames(sciName, commonName, vetted?.file);

				for (const basePath of this.birdnetLocalPaths) {
					for (const fname of candidateFilenames) {
						const candidateUrl = `${basePath}${fname.split("/").map(encodeURIComponent).join("/")}`;

						const exists = await probeImageUrl(candidateUrl);
						if (exists) {
							const pIdx = this.birdnetLocalPaths.indexOf(basePath);
							if (pIdx > 0) {
								this.birdnetLocalPaths.splice(pIdx, 1);
								this.birdnetLocalPaths.unshift(basePath);
							}
							const entry = {
								url: candidateUrl,
								box: vetted?.box || null,
								artist: vetted?.artist || "Local Collection",
								source: "Local"
							};
							birdnetImageCache.set(sciName, entry);
							return entry;
						}
					}
				}
				this.localBirdProbingFailedCount++;
			}

			// 4. Remote Fallback: Search Wikimedia Commons ONLY if no local image was found
			try {
				const query = encodeURIComponent(`"${sciName}" illustration OR plate`);
				const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${query}&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url|mime&format=json&origin=*`;
				// eslint-disable-next-line compat/compat
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 6000);
				const resp = await fetch(searchUrl, { signal: controller.signal });
				clearTimeout(timeoutId);
				if (resp.ok) {
					const data = await resp.json();
					const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
					if (pages.length > 0 && pages[0].title) {
						const fileName = pages[0].title.replace(/^File:/i, "");
						const plateUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=1200`;
						const entry = { url: plateUrl, box: null, artist: "", source: "Wikimedia Commons" };
						birdnetImageCache.set(sciName, entry);
						return entry;
					}
				}
			} catch (e) {
				logger.debug(`Historical plate search failed for ${sciName}:`, e);
			}

			// 5. Secondary Remote Fallback: iNaturalist public taxa photography
			try {
				// eslint-disable-next-line compat/compat
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 4000);
				const resp = await fetch(
					`https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(sciName)}&rank=species&per_page=1`,
					{ signal: controller.signal }
				);
				clearTimeout(timeoutId);
				if (resp.ok) {
					const json = await resp.json();
					const photo = json?.results?.[0]?.default_photo;
					const photoUrl = photo?.medium_url || photo?.square_url;
					if (photoUrl) {
						const entry = { url: photoUrl, box: null, artist: photo?.attribution || "", source: "iNaturalist" };
						birdnetImageCache.set(sciName, entry);
						return entry;
					}
				}
			} catch (e) {
				logger.debug(`iNaturalist photo lookup failed for ${sciName}:`, e);
			}

			const emptyEntry = { url: "", box: null, artist: "", source: "", retryAt: Date.now() + 10 * 60 * 1000 };
			birdnetImageCache.set(sciName, emptyEntry);
			return emptyEntry;
		}

		renderPlateArtwork(species, className = "wp-birdnet-artwork", style = "") {
			const entry = (species && species.sci && birdnetImageCache.get(species.sci)) || {};
			const imgUrl = species.image || entry.url || "";
			const safeImgUrl = escapeHtml(imgUrl);
			const box = species.box || entry.box;
			const altName = escapeHtml(species.name || "");

			const blendSetting = (config.birdnet_blend_mode || "auto").toString().toLowerCase().trim();
			let blendMode = "multiply";
			let blendFilter = "contrast(1.06) brightness(1.04)";

			const isTransparent =
				imgUrl.toLowerCase().includes(".png") ||
				imgUrl.toLowerCase().includes(".webp") ||
				imgUrl.toLowerCase().includes("transparent");

			if (blendSetting === "normal") {
				blendMode = "normal";
				blendFilter = "none";
			} else if (blendSetting === "auto" && isTransparent) {
				blendMode = "normal";
				blendFilter = "none";
			}

			if (box && Array.isArray(box) && box.length === 4) {
				const [x0, y0, x1, y1] = box.map((v) => (Number.isFinite(Number(v)) ? Number(v) : 0));
				const boxW = Math.max(0.01, x1 - x0);
				const boxH = Math.max(0.01, y1 - y0);
				const imgWidthPercent = (1 / boxW) * 100;
				const imgHeightPercent = (1 / boxH) * 100;
				const imgLeftPercent = (-x0 / boxW) * 100;
				const imgTopPercent = (-y0 / boxH) * 100;

				return `
					<div class="${className}-crop-container" style="position: relative; overflow: hidden; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; ${style}">
						<img src="${safeImgUrl}" alt="${altName}" class="${className}" style="position: absolute; width: ${imgWidthPercent}%; height: ${imgHeightPercent}%; left: ${imgLeftPercent}%; top: ${imgTopPercent}%; object-fit: fill; mix-blend-mode: ${blendMode}; filter: ${blendFilter}; pointer-events: none;">
					</div>
				`;
			}
			return `
				<img src="${safeImgUrl}" alt="${altName}" class="${className}" style="max-width: 100%; max-height: 100%; object-fit: contain; mix-blend-mode: ${blendMode}; filter: ${blendFilter}; pointer-events: none; ${style}">
			`;
		}

		renderBirdnetLayout(layout, species, allSpecies, idx = 0) {
			const theme = (config.birdnet_theme || "sage").trim();
			const isCustomColor = theme.startsWith("#") || theme.startsWith("rgb") || theme.startsWith("hsl");
			const themeClass = isCustomColor ? "" : `theme-${theme}`;
			const matSetting = (config.birdnet_mat_color || config.birdnet_mat || "").toString().trim();

			const styles = [];
			if (isCustomColor) {
				styles.push(`--wp-birdnet-plate: ${theme};`);
			}
			if (matSetting) {
				if (matSetting.toLowerCase() === "same" || matSetting.toLowerCase() === "match") {
					styles.push(`--wp-birdnet-mat: var(--wp-birdnet-plate);`);
				} else if (matSetting.toLowerCase() === "dark") {
					styles.push(`--wp-birdnet-mat: #141718;`);
				} else if (matSetting.toLowerCase() === "parchment") {
					styles.push(`--wp-birdnet-mat: #e8e2d2;`);
				} else if (matSetting.toLowerCase() === "sage") {
					styles.push(`--wp-birdnet-mat: #ebe6da;`);
				} else if (matSetting.toLowerCase() === "forest") {
					styles.push(`--wp-birdnet-mat: #e2e5db;`);
				} else if (matSetting.toLowerCase() === "slate") {
					styles.push(`--wp-birdnet-mat: #dce2e3;`);
				} else if (matSetting.toLowerCase() === "ivory") {
					styles.push(`--wp-birdnet-mat: #f0ece3;`);
				} else {
					styles.push(`--wp-birdnet-mat: ${matSetting};`);
				}
			}
			const blendSetting = (config.birdnet_blend_mode || "auto").toString().toLowerCase().trim();
			if (blendSetting === "normal") {
				styles.push(`--wp-birdnet-blend-mode: normal;`);
				styles.push(`--wp-birdnet-blend-filter: none;`);
			}
			const themeStyle = styles.length > 0 ? `style="${styles.join(" ")}"` : "";

			if (layout === "cluster") {
				return `<div class="wallpanel-birdnet-container ${themeClass}" ${themeStyle}>${this.renderBirdnetCluster(allSpecies)}</div>`;
			}
			if (layout === "chart") {
				return `<div class="wallpanel-birdnet-container ${themeClass}" ${themeStyle}>${this.renderBirdnetChart(allSpecies)}</div>`;
			}
			if (layout === "spread") {
				return `<div class="wallpanel-birdnet-container ${themeClass}" ${themeStyle}>${this.renderBirdnetSpread(species, allSpecies, idx)}</div>`;
			}
			if (layout === "plate") {
				return `<div class="wallpanel-birdnet-container ${themeClass}" ${themeStyle}>${this.renderBirdnetPlate(species, idx)}</div>`;
			}
			// Default: "folio" or "latest"
			return `<div class="wallpanel-birdnet-container ${themeClass}" ${themeStyle}>${this.renderBirdnetFolio(species, idx)}</div>`;
		}

		formatBirdnetTemplate(template, context, defaultText = "") {
			if (template === undefined || template === null) {
				return defaultText;
			}
			if (typeof template !== "string") {
				return defaultText;
			}
			const trimmed = template.trim();
			if (trimmed === "" || trimmed.toLowerCase() === "none" || trimmed.toLowerCase() === "false") {
				return "";
			}
			return template.replace(/\$\{([^}]+)\}|\$([a-zA-Z0-9_]+)/g, (match, p1, p2) => {
				const key = (p1 || p2 || "").trim().toLowerCase();
				if (Object.prototype.hasOwnProperty.call(context, key) && context[key] !== undefined && context[key] !== null) {
					return escapeHtml(String(context[key]));
				}
				return match;
			});
		}

		renderBirdnetFolio(species, idx = 0, totalSpecies = 1, forceCardOffset = null) {
			const plateNum = toRoman((idx % 50) + 1);
			const label = escapeHtml(config.birdnet_label || "BACKYARD");
			const rawName = species.name || "Unknown Bird";
			const rawSci = species.sci || "";

			let defaultNote = "";
			if (species.count === 1) {
				defaultNote = `Heard for the first time today at ${species.last || species.first || "06:00"}.`;
			} else {
				const ordinalStr = formatOrdinalWords(species.count) || `${species.count}th`;
				defaultNote = `Heard the ${ordinalStr} time today, last at ${species.last || "12:00"}.`;
			}

			const isPortrait = window.innerHeight > window.innerWidth;
			const cardOffset = forceCardOffset !== null ? forceCardOffset : isPortrait ? "none" : this.getBirdnetCardOffset();
			const offsetClass = cardOffset === "left" ? " offset-left" : cardOffset === "right" ? " offset-right" : "";

			const now = new Date();
			const dateStr = now.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });

			const context = {
				name: rawName,
				common: rawName,
				common_name: rawName,
				sci: rawSci,
				scientific: rawSci,
				scientific_name: rawSci,
				count: species.count || 1,
				ordinal: formatOrdinalWords(species.count) || `${species.count || 1}th`,
				time: species.last || species.first || "12:00",
				last: species.last || species.first || "12:00",
				last_time: species.last || species.first || "12:00",
				first: species.first || "06:00",
				first_time: species.first || "06:00",
				confidence: species.confidence ? `${Math.round(species.confidence * 100)}%` : "",
				label: config.birdnet_label || "BACKYARD",
				date: dateStr,
				species_count: totalSpecies,
				x: totalSpecies,
				total: totalSpecies,
				plate: plateNum
			};

			const name = this.formatBirdnetTemplate(config.birdnet_main_text, context, escapeHtml(rawName) + ".");
			const note = this.formatBirdnetTemplate(config.birdnet_sub_text, context, defaultNote);
			const sciHtml =
				rawSci && config.birdnet_sub_text !== "none" ? `<div class="wp-birdnet-sci">${escapeHtml(rawSci)}</div>` : "";
			const noteHtml = note ? `<div class="wp-birdnet-note">${note}</div>` : "";

			return `
				<div class="wp-birdnet-mat${offsetClass}">
					<div class="wp-birdnet-plate-card wp-birdnet-folio-card${offsetClass}">
						<div class="wp-birdnet-inner-border">
							<div class="wp-birdnet-header">
								<span class="wp-birdnet-label">${label}</span>
								<span class="wp-birdnet-plate-num">Pl. ${plateNum}.</span>
							</div>
							<div class="wp-birdnet-artwork-wrapper">
								${this.renderPlateArtwork(species, "wp-birdnet-artwork")}
							</div>
							<div class="wp-birdnet-footer">
								<div class="wp-birdnet-name">${name}</div>
								${sciHtml}
								${noteHtml}
							</div>
						</div>
					</div>
				</div>
			`;
		}

		getBirdnetCardSide() {
			const setting = (config.birdnet_card_offset || "auto").toLowerCase();
			if (setting === "left") {
				return "right";
			}
			if (setting === "right") {
				return "left";
			}
			if (this.infoBox) {
				const rect = this.infoBox.getBoundingClientRect();
				const winW = window.innerWidth || 1920;
				if (rect.width > 20) {
					const midX = rect.left + rect.width / 2;
					return midX < winW / 2 ? "left" : "right";
				}
			}
			if (config.style) {
				const boxStyle =
					config.style["wallpanel-screensaver-info-box"] || config.style["wallpanel-screensaver-fixed-info-box"];
				if (boxStyle) {
					if (boxStyle.left && !boxStyle.right) return "left";
					if (boxStyle.right && !boxStyle.left) return "right";
				}
			}
			const hasCards = (config.cards && config.cards.length > 0) || (config.badges && config.badges.length > 0);
			if (hasCards) {
				return "left";
			}
			return "none";
		}

		getBirdnetCardVAlign() {
			if (this.infoBox) {
				const rect = this.infoBox.getBoundingClientRect();
				const winH = window.innerHeight || 1080;
				if (rect.height > 20) {
					const midY = rect.top + rect.height / 2;
					return midY > winH / 2 ? "top" : "bottom";
				}
			}
			if (config.style) {
				const boxStyle =
					config.style["wallpanel-screensaver-info-box"] || config.style["wallpanel-screensaver-fixed-info-box"];
				if (boxStyle) {
					if (boxStyle.bottom && !boxStyle.top) return "top";
				}
			}
			return "bottom";
		}

		isLongCardBox() {
			if (this.infoBox) {
				const rect = this.infoBox.getBoundingClientRect();
				const winH = window.innerHeight || 1080;
				if (rect.height > 20) {
					return rect.height / winH >= 0.6;
				}
			}
			const cardCount = (config.cards ? config.cards.length : 0) + (config.badges ? config.badges.length : 0);
			return cardCount >= 5;
		}

		calculateSpreadFolioAutoRatio() {
			if (this.infoBox) {
				const rect = this.infoBox.getBoundingClientRect();
				const winH = window.innerHeight || 1080;
				if (rect.height > 40) {
					const available = (winH - rect.height - 30) / winH;
					return Math.min(0.8, Math.max(0.4, available));
				}
			}
			return 0.7;
		}

		getBirdnetCardOffset() {
			const setting = (config.birdnet_card_offset || "auto").toLowerCase();
			if (setting === "left" || setting === "right" || setting === "none") {
				return setting;
			}
			// "auto" detection
			const hasCards = (config.cards && config.cards.length > 0) || (config.badges && config.badges.length > 0);
			if (!hasCards) {
				return "none";
			}

			const cardSide = this.getBirdnetCardSide();
			// When cards are positioned on the left flank, shift artwork sheet to the right flank
			// When cards are on the right flank, shift artwork sheet to the left flank
			return cardSide === "left" ? "right" : "left";
		}

		renderBirdnetCluster(allSpecies = [], forcePortrait = null, forceCardOffset = null) {
			const sorted = allSpecies.slice().sort((a, b) => (b.count || 0) - (a.count || 0));
			const speciesToShow = sorted.slice(0, Math.min(sorted.length, 12));
			const total = speciesToShow.length;

			const isPortrait = forcePortrait !== null ? forcePortrait : window.innerHeight > window.innerWidth;
			const cardOffset = forceCardOffset !== null ? forceCardOffset : isPortrait ? "none" : this.getBirdnetCardOffset();
			const offsetClass = cardOffset === "left" ? " offset-left" : cardOffset === "right" ? " offset-right" : "";
			const slots = getOvalSlots(total, isPortrait);

			const indices =
				total >= 4 ? [...Array(total - 1).keys()].map((i) => i + 1).concat([0]) : [...Array(total).keys()];

			const slotsHtml = indices
				.map((idx) => {
					const sp = speciesToShow[idx];
					if (!sp) return "";
					const slot = slots[idx] || slots[0];
					const isHero = idx === 0 && total >= 4;
					const heroClass = isHero ? " wp-birdnet-hero-slot" : "";
					return `
						<div class="wp-birdnet-oval-slot${heroClass}" style="position: absolute; left: ${(slot.x * 100).toFixed(2)}%; top: ${(slot.y * 100).toFixed(2)}%; width: ${(slot.w * 100).toFixed(2)}%; height: ${(slot.h * 100).toFixed(2)}%;">
							<div class="wp-birdnet-cluster-thumb-wrap">
								${this.renderPlateArtwork(sp, "wp-birdnet-cluster-thumb")}
							</div>
						</div>
					`;
				})
				.join("");

			const labelsHtml = indices
				.map((idx) => {
					const sp = speciesToShow[idx];
					if (!sp) return "";
					const slot = slots[idx] || slots[0];
					const spName = escapeHtml(sp.name || "");
					const isHero = idx === 0 && total >= 4;
					const heroClass = isHero ? " wp-birdnet-hero-label" : "";
					// Anchor to the drawn (clamped) box, not the requested centre
					const labelY = slot.y + slot.h - slot.h * (isHero ? 0.04 : 0.06);
					const labelX = slot.x + slot.w / 2;
					return `
						<div class="wp-birdnet-cluster-label${heroClass}" style="left: ${(labelX * 100).toFixed(2)}%; top: ${(labelY * 100).toFixed(2)}%;">
							${spName}
						</div>
					`;
				})
				.join("");

			const label = escapeHtml(config.birdnet_label || "Backyard");
			const now = new Date();
			const dateStr = now.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
			const speciesCount = allSpecies.length;

			const clusterContext = {
				label: config.birdnet_label || "Backyard",
				date: dateStr,
				species_count: speciesCount,
				x: speciesCount,
				total: speciesCount,
				count: speciesCount
			};
			const defaultMainCaption = `${label} · heard today · ${dateStr} · ${speciesCount} species`;
			const defaultSubCaption = "Historical plates watercolour after Audubon, Gould, Lear &amp; Broinowski.";
			const mainCaption = this.formatBirdnetTemplate(
				config.birdnet_cluster_main || config.birdnet_main_text,
				clusterContext,
				defaultMainCaption
			);
			const subCaption = this.formatBirdnetTemplate(
				config.birdnet_cluster_sub !== undefined && config.birdnet_cluster_sub !== ""
					? config.birdnet_cluster_sub
					: config.birdnet_sub_text,
				clusterContext,
				defaultSubCaption
			);
			const subCaptionHtml = subCaption ? `<div class="wp-birdnet-cluster-caption-sub">${subCaption}</div>` : "";

			return `
				<div class="wp-birdnet-mat wp-birdnet-cluster-mat${offsetClass}">
					<div class="wp-birdnet-plate-card wp-birdnet-cluster-card${offsetClass}">
						<div class="wp-birdnet-cluster-inner">
							<div class="wp-birdnet-cluster-sheet${offsetClass}">
								<div class="wp-birdnet-oval-canvas">
									${slotsHtml}
									${labelsHtml}
								</div>
								<div class="wp-birdnet-cluster-caption">
									<div class="wp-birdnet-cluster-caption-main">
										${mainCaption}
									</div>
									${subCaptionHtml}
								</div>
							</div>
						</div>
					</div>
				</div>
			`;
		}

		renderBirdnetSpread(species, allSpecies = [], idx = 0) {
			const cardSetting = (config.birdnet_spread_cards || "auto").toString().toLowerCase().trim();
			const isEnabled = cardSetting !== "disabled" && cardSetting !== "false" && cardSetting !== "none";
			const cardSide = isEnabled ? this.getBirdnetCardSide() : "none";
			const hasCardOverlap = isEnabled && cardSide !== "none";

			const folioOnLeft = hasCardOverlap && cardSide === "left";
			let scaleRatio = 0.7;
			let vAlign = "bottom";

			if (hasCardOverlap) {
				vAlign = this.getBirdnetCardVAlign();
				if (cardSetting === "auto" || cardSetting === "true") {
					scaleRatio = this.calculateSpreadFolioAutoRatio();
				} else if (cardSetting === "fixed") {
					scaleRatio = 0.7;
				} else {
					const parsed = parseFloat(cardSetting);
					scaleRatio = !isNaN(parsed) && parsed > 0.2 && parsed <= 1.0 ? parsed : 0.7;
				}
			}

			const clusterHtml = this.renderBirdnetCluster(allSpecies, true, "none");
			const folioHtml = this.renderBirdnetFolio(species, idx, allSpecies.length, "none");

			const leftContent = folioOnLeft ? folioHtml : clusterHtml;
			const rightContent = folioOnLeft ? clusterHtml : folioHtml;
			const leftClass = folioOnLeft ? "wp-birdnet-spread-pane-folio" : "wp-birdnet-spread-pane-cluster";
			const rightClass = folioOnLeft ? "wp-birdnet-spread-pane-cluster" : "wp-birdnet-spread-pane-folio";

			const compactClass = hasCardOverlap ? ` wp-birdnet-spread-compact valign-${vAlign}` : "";
			const styleAttr = hasCardOverlap ? `style="--wp-spread-folio-scale: ${scaleRatio.toFixed(3)};"` : "";

			return `
				<div class="wp-birdnet-mat wp-birdnet-spread-mat">
					<div class="wp-birdnet-spread${compactClass}" ${styleAttr}>
						<div class="wp-birdnet-spread-left ${leftClass}">${leftContent}</div>
						<div class="wp-birdnet-spread-spine"></div>
						<div class="wp-birdnet-spread-right ${rightClass}">${rightContent}</div>
					</div>
				</div>
			`;
		}

		renderBirdnetChart(allSpecies = [], forceCardOffset = null) {
			const label = escapeHtml(config.birdnet_label || "Backyard");
			const now = new Date();
			const dateStr = now.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
			const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

			const isPortrait = window.innerHeight > window.innerWidth;
			const cardOffset = forceCardOffset !== null ? forceCardOffset : isPortrait ? "none" : this.getBirdnetCardOffset();
			const offsetClass = cardOffset === "left" ? " offset-left" : cardOffset === "right" ? " offset-right" : "";

			const headerHours = hours.map((h) => `<th>${h}</th>`).join("");
			const rowsHtml = allSpecies
				.slice(0, 10)
				.map((sp) => {
					const hourly = Array.isArray(sp.hourly) && sp.hourly.length === 24 ? sp.hourly : new Array(24).fill(0);
					const cells = hourly
						.map((c) => {
							let cls = "";
							if (c > 3) cls = "wp-birdnet-chart-cell-busy";
							else if (c > 0) cls = "wp-birdnet-chart-cell-active";
							return `<td class="${cls}">${c > 0 ? c : ""}</td>`;
						})
						.join("");

					return `
						<tr>
							<td class="wp-birdnet-chart-species">
								<div class="wp-birdnet-chart-species-cell">
									<div class="wp-birdnet-chart-thumb-wrap">
										${this.renderPlateArtwork(sp, "wp-birdnet-chart-thumb")}
									</div>
									<span class="wp-birdnet-chart-species-name">${escapeHtml(sp.name)}</span>
								</div>
							</td>
							${cells}
							<td><strong>${sp.count}</strong></td>
						</tr>
					`;
				})
				.join("");

			return `
				<div class="wp-birdnet-mat wp-birdnet-chart-mat${offsetClass}">
					<div class="wp-birdnet-plate-card wp-birdnet-chart-card${offsetClass}">
						<div class="wp-birdnet-chart-inner">
							<div class="wp-birdnet-header">
								<span class="wp-birdnet-label">${label} — ACTIVITY LEDGER</span>
								<span class="wp-birdnet-plate-num">${dateStr}</span>
							</div>
							<div style="flex: 1; overflow: auto; padding: 1.5vmin 0;">
								<table class="wp-birdnet-chart-table">
									<thead>
										<tr>
											<th style="text-align: left; padding-left: 8px;">Species</th>
											${headerHours}
											<th>Total</th>
										</tr>
									</thead>
									<tbody>
										${rowsHtml}
									</tbody>
								</table>
							</div>
							<div class="wp-birdnet-cluster-caption">
								<div class="wp-birdnet-cluster-caption-main">
									Hourly call frequency ledger · BirdNET-Go Bioacoustic Monitoring
								</div>
							</div>
						</div>
					</div>
				</div>
			`;
		}

		renderBirdnetPlate(species, idx = 0, forceCardOffset = null) {
			const plateNum = toRoman((idx % 50) + 1);
			const label = escapeHtml(config.birdnet_label || "BACKYARD");
			const rawName = species.name || "Unknown Bird";
			const rawSci = species.sci || "";

			const isPortrait = window.innerHeight > window.innerWidth;
			const cardOffset = forceCardOffset !== null ? forceCardOffset : isPortrait ? "none" : this.getBirdnetCardOffset();
			const offsetClass = cardOffset === "left" ? " offset-left" : cardOffset === "right" ? " offset-right" : "";

			const now = new Date();
			const dateStr = now.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });

			const context = {
				name: rawName,
				common: rawName,
				common_name: rawName,
				sci: rawSci,
				scientific: rawSci,
				scientific_name: rawSci,
				count: species.count || 1,
				ordinal: formatOrdinalWords(species.count) || `${species.count || 1}th`,
				time: species.last || species.first || "12:00",
				last: species.last || species.first || "12:00",
				last_time: species.last || species.first || "12:00",
				first: species.first || "06:00",
				first_time: species.first || "06:00",
				confidence: species.confidence ? `${Math.round(species.confidence * 100)}%` : "",
				label: config.birdnet_label || "BACKYARD",
				date: dateStr,
				species_count: 1,
				plate: plateNum
			};

			const name = this.formatBirdnetTemplate(config.birdnet_main_text, context, escapeHtml(rawName) + ".");
			const note = this.formatBirdnetTemplate(config.birdnet_sub_text, context, "");
			const noteHtml = note ? `<div class="wp-birdnet-note">${note}</div>` : "";
			const sciHtml = rawSci ? `<div class="wp-birdnet-sci">${escapeHtml(rawSci)}</div>` : "";

			return `
				<div class="wp-birdnet-mat${offsetClass}">
					<div class="wp-birdnet-plate-card${offsetClass}" style="width: 90%; height: 90%; aspect-ratio: 0.72;">
						<div class="wp-birdnet-inner-border">
							<div class="wp-birdnet-header">
								<span class="wp-birdnet-label">${label}</span>
								<span class="wp-birdnet-plate-num">Pl. ${plateNum}.</span>
							</div>
							<div class="wp-birdnet-artwork-wrapper">
								${this.renderPlateArtwork(species, "wp-birdnet-artwork")}
							</div>
							<div class="wp-birdnet-footer" style="border: none;">
								<div class="wp-birdnet-name">${name}</div>
								${sciHtml}
								${noteHtml}
							</div>
						</div>
					</div>
				</div>
			`;
		}

		fillPlaceholders(url) {
			const width = this.screensaverContainer.clientWidth;
			const height = this.screensaverContainer.clientHeight;
			const timestamp_ms = Date.now();
			const timestamp = Math.floor(timestamp_ms / 1000);
			url = url.replace(/\${width}/g, width);
			url = url.replace(/\${height}/g, height);
			url = url.replace(/\${timestamp_ms}/g, timestamp_ms);
			url = url.replace(/\${timestamp}/g, timestamp);
			return url;
		}

		async updateMediaFromUrl(element, url, mediaType = null, headers = null, useFetch = false) {
			if (config.force_load_media_with_fetch) {
				useFetch = true;
			}
			const responseError = (elem, response) => {
				const error = new Error(
					`Failed to load ${elem.tagName} "${url}": HTTP ${response.status} ${response.statusText}`.trim()
				);
				error.response = {
					url: response.url,
					status: response.status,
					statusText: response.statusText,
					type: response.type
				};
				return error;
			};
			// Setting the src attribute works better than fetch because cross-origin requests aren't blocked
			const loadMediaWithElement = async (elem) => {
				const tagName = elem.tagName.toLowerCase();
				const loadEventName = { img: "load", video: "loadeddata", iframe: "load", embed: "load" }[tagName];
				if (!loadEventName) {
					throw new Error(`Unsupported element tag "${elem.tagName}"`);
				}

				const promise = new Promise((resolve, reject) => {
					const cleanup = () => {
						elem.onerror = null;
						elem.removeEventListener(loadEventName, onLoad);
					};

					const onLoad = async () => {
						cleanup();
						// Firefox can fire load before the new image is ready to be composited.
						// Wait for decoding so a reused slideshow buffer cannot flash its old frame.
						if (tagName === "img" && typeof elem.decode === "function") {
							try {
								await elem.decode();
							} catch (error) {
								// Some browsers reject decode() for images they have already loaded and can
								// display. The load event is authoritative here; a decode() rejection must
								// not turn an otherwise valid slideshow item into a black error slide.
								logger.debug(`Failed to pre-decode loaded image "${url}":`, error);
							}
						}
						resolve();
					};

					const onError = () => {
						cleanup();
						const error = new Error(`Failed to load ${elem.tagName} "${url}"`);
						error.mediaElement = {
							tagName: elem.tagName,
							currentSrc: elem.currentSrc || elem.src || "",
							complete: elem.complete,
							naturalWidth: elem.naturalWidth,
							naturalHeight: elem.naturalHeight,
							readyState: elem.readyState,
							networkState: elem.networkState
						};
						if (elem.error) {
							error.mediaElement.error = {
								code: elem.error.code,
								message: elem.error.message
							};
						}
						reject(error);
					};

					elem.addEventListener(loadEventName, onLoad);
					elem.onerror = onError;
				});
				if (useFetch) {
					headers = headers || {};
					if (config.stream_load_media) {
						const response = await fetch(url, { headers: headers });
						if (!response.ok) {
							throw responseError(elem, response);
						}
						if (!response.body) {
							throw new Error(`Failed to load ${elem.tagName} "${url}": empty body`);
						}
						const reader = response.body.getReader();
						const stream = new ReadableStream({
							start(controller) {
								return pump();
								function pump() {
									return reader.read().then(({ done, value }) => {
										// When no more data needs to be consumed, close the stream
										if (done) {
											controller.close();
											return;
										}
										// Enqueue the next data chunk into our target stream
										controller.enqueue(value);
										return pump();
									});
								}
							}
						});
						const blob = await new Response(stream).blob();
						if (typeof elem.src === "string" && elem.src.startsWith("blob:")) {
							URL.revokeObjectURL(elem.src);
						}
						elem.src = URL.createObjectURL(blob);
					} else {
						const response = await fetch(url, { headers: headers });
						logger.debug("Got respone", response);
						if (!response.ok) {
							throw responseError(elem, response);
						}
						// The object URL created by URL.createObjectURL() must be released
						// using URL.revokeObjectURL() to free the associated memory again.
						if (typeof elem.src === "string" && elem.src.startsWith("blob:")) {
							URL.revokeObjectURL(elem.src);
						}
						const blob = await response.blob();
						elem.src = URL.createObjectURL(blob);
					}
				} else {
					elem.src = url;
				}
				return promise;
			};

			const handleFallback = async (currentElem, mediaType = null, originalError = null) => {
				if (!mediaType) {
					mediaType = currentElem.tagName.toLowerCase() === "img" ? "video" : "img";
				}
				const fallbackElem = this.replaceMediaElement(currentElem, mediaType);
				try {
					await loadMediaWithElement(fallbackElem);
					return fallbackElem;
				} catch (e) {
					throw originalError || e;
				}
			};

			const loadOrFallback = async (currentElem, withFallback) => {
				try {
					await loadMediaWithElement(currentElem);
					return currentElem;
				} catch (e) {
					if (withFallback) {
						return await handleFallback(currentElem, null, e);
					} else {
						throw e;
					}
				}
			};

			if (!mediaType) {
				return await loadOrFallback(element, true);
			} else if (mediaType === element.tagName.toLowerCase()) {
				return await loadOrFallback(element, false);
			} else {
				return await handleFallback(element, mediaType);
			}
		}

		getNextMediaURL(updateIndex = true) {
			if (!this.mediaList.length) {
				return null;
			}
			let mediaIndex;
			if (config.media_order == "random_but_synced") {
				// Wall-clock derived index: every device shows the same item, and a
				// device that reloads or joins late lands in sync immediately.
				mediaIndex = Math.floor(Date.now() / (config.display_time * 1000)) % this.mediaList.length;
			} else {
				mediaIndex = this.mediaIndex;
				if (this.mediaListDirection == "forwards") {
					mediaIndex++;
				} else {
					mediaIndex--;
				}
				if (mediaIndex >= this.mediaList.length) {
					if (config.media_order == "random_path" && updateIndex) {
						this.selectNextMediaPath();
					}
					mediaIndex = 0;
				} else if (mediaIndex < 0) {
					mediaIndex = this.mediaList.length - 1;
				}
			}
			if (updateIndex) {
				this.mediaIndex = mediaIndex;
			}
			return this.mediaList[mediaIndex];
		}

		async updateMediaFromMediaSource(element) {
			const result = await this.hass.callWS({
				type: "media_source/resolve_media",
				media_content_id: element.mediaUrl
			});
			const matchedType = result.mime_type?.match(/^(image|video)\//);
			const mediaType = { image: "img", video: "video" }[matchedType?.[1]] || null;

			let src = result.url;
			if (!src.startsWith("http://") && !src.startsWith("https://")) {
				src = `${document.location.origin}${src}`;
			}
			logger.debug(`Setting image src: ${src}`);
			element.mediaUrl = src;
			return await this.updateMediaFromUrl(element, element.mediaUrl, mediaType);
		}

		async updateMediaFromImmichAPI(element) {
			const mediaInfo = mediaInfoCache.get(element.mediaUrl) || {};
			const mediaType = mediaInfo["mediaType"] == "video" ? "video" : "img";
			return await this.updateMediaFromUrl(
				element,
				element.mediaUrl,
				mediaType,
				{ "x-api-key": mediaInfo["immichApiKey"] },
				true
			);
		}

		async updateMediaFromMediaEntity(element) {
			const match = element.mediaUrl.match(/^media-entity-(image|video):\/\/(.*)/);
			if (!match) {
				throw new Error(`Invalid URL "${element.mediaUrl}"`);
			}
			const mediaType = match[1];
			const mediaEntity = match[2];
			const entity = this.hass.states[mediaEntity];
			if (!entity) {
				throw new Error(`Entity "${mediaEntity}" not available`);
			}
			mediaEntityState = entity.state;

			function attributesToMediaInfoCache() {
				if ("media_exif" in entity.attributes) {
					// immich-home-assistant provides media_exif
					addToMediaInfoCache(element.infoCacheUrl, entity.attributes["media_exif"]);
				} else {
					addToMediaInfoCache(element.infoCacheUrl, entity.attributes);
				}
			}

			if (mediaType == "video") {
				element.infoCacheUrl = element.mediaUrl;
				attributesToMediaInfoCache();
				element = this.replaceMediaElement(element, "ha-camera-stream");
				element.style.visibility = "hidden";
				Object.assign(element, {
					hass: this.__hass,
					stateObj: this.__hass.states[mediaEntity],
					"allow-exoplayer": false,
					controls: false
				});

				return new Promise((resolve, reject) => {
					let attempts = 0;
					const maxAttempts = 20;
					async function onLoad(evt) {
						const el = evt.currentTarget;
						el.removeEventListener("load", onLoad);
						await el.updateComplete;
						const [player, video] = getHaCameraStreamPlayerAndVideo(el);
						if (!player || !video) {
							attempts++;
							if (attempts <= maxAttempts) {
								setTimeout(() => onLoad(evt), 100);
								return;
							}
							reject(new Error("Failed to initialize camera stream player"));
							return;
						}
						player.style.height = "100%";
						video.autoplay = false;
						video.muted = false;
						video.volume = config.video_volume;
						video.style.maxHeight = "100%";
						video.style.height = "100%";
						if (video.readyState >= video.HAVE_ENOUGH_DATA) {
							resolve(el);
						} else {
							const onCanPlay = () => {
								video.removeEventListener("canplay", onCanPlay);
								resolve(el);
							};
							video.addEventListener("canplay", onCanPlay);
						}
					}
					element.addEventListener("load", onLoad);
				});
			} else {
				if (!entity.attributes || !entity.attributes.entity_picture) {
					throw new Error(`Entity "${mediaEntity}" has no entity_picture attribute`);
				}
				const entityPicture = entity.attributes.entity_picture;
				let querySuffix = entityPicture.indexOf("?") > 0 ? "&" : "?";
				// Adding a timestamp ensures that the cache is bypassed
				// and each image gets a unique infoCacheUrl for handling media information correctly
				querySuffix += this.fillPlaceholders("width=${width}&height=${height}&ts=${timestamp_ms}");
				element.mediaUrl = entityPicture + querySuffix;
				element.infoCacheUrl = element.mediaUrl;
				attributesToMediaInfoCache();
				return await this.updateMediaFromUrl(element, element.mediaUrl, "img", null, true);
			}
		}

		async updateMediaFromUnsplashAPI(element) {
			const mediaInfo = mediaInfoCache.get(element.mediaUrl);
			element.mediaUrl = this.fillPlaceholders(element.mediaUrl);
			if (mediaInfo) {
				addToMediaInfoCache(element.mediaUrl, mediaInfo);
			}
			return await this.updateMediaFromUrl(element, element.mediaUrl, "img");
		}

		async updateMediaFromMediaIframe(element) {
			return await this.updateMediaFromUrl(element, element.mediaUrl, "iframe");
		}

		async updateMediaFromMediaEmbed(element) {
			return await this.updateMediaFromUrl(element, element.mediaUrl, "embed");
		}

		async updateMediaFromOtherSrc(element) {
			element.mediaUrl = this.fillPlaceholders(element.mediaUrl);
			element.infoCacheUrl = element.mediaUrl;
			return await this.updateMediaFromUrl(element, element.mediaUrl);
		}

		async updateMediaFromBirdnet(element) {
			ensureBirdnetFonts();
			const mediaUrl = element.mediaUrl || "";
			const match = mediaUrl.match(/^birdnet:\/\/([^/?]+)(?:\/([^?]+))?(?:\?idx=(\d+))?/);
			let layout = match ? match[1] : config.birdnet_layout || "folio";
			const sci = match && match[2] ? decodeURIComponent(match[2]) : "";
			const idx = match && match[3] ? parseInt(match[3], 10) : 0;

			const allSpecies = this.birdnetSpecies || [];
			if (!allSpecies.length) {
				// Nothing to show: only the cluster layout renders an empty sheet safely
				layout = "cluster";
			}
			let species = allSpecies.find((s) => s.sci === sci);
			if (!species && allSpecies.length) {
				species = allSpecies[idx % allSpecies.length] || allSpecies[0];
			}

			if (species && species.sci) {
				const res = await this.resolveBirdImage(species.sci, species.name);
				if (res) {
					species.image = res.url;
					species.box = res.box;
					species.artist = res.artist;
				}
			}

			if (layout === "cluster" || layout === "spread" || layout === "chart" || layout === "auto") {
				await Promise.all(
					allSpecies.slice(0, 16).map(async (s) => {
						const res = await this.resolveBirdImage(s.sci, s.name);
						if (res) {
							s.image = res.url;
							s.box = res.box;
							s.artist = res.artist;
						}
					})
				);
			}

			if (element.tagName.toLowerCase() !== "div") {
				element = this.replaceMediaElement(element, "div");
			}

			element.className = "wallpanel-birdnet-container";
			element.style.position = "absolute";
			element.style.top = "0px";
			element.style.left = "0px";
			element.style.width = "100%";
			element.style.height = "100%";
			element.style.display = "flex";
			element.style.justifyContent = "center";
			element.style.alignItems = "center";
			element.style.boxSizing = "border-box";
			element.style.overflow = "hidden";
			element.style.pointerEvents = "none";

			element.innerHTML = this.renderBirdnetLayout(layout, species, allSpecies, idx);
			element.mediaUrl = mediaUrl;
			element.infoCacheUrl = mediaUrl;

			return element;
		}

		async updateMedia(element) {
			if (!config.show_images) {
				return;
			}
			this.updatingMedia = true;
			// The inactive buffer still contains the image shown two slides ago. Hide it
			// explicitly while its source is replaced to avoid stale-frame compositor flashes.
			element.style.visibility = "hidden";
			try {
				if (element == this.getActiveMediaElement()) {
					const inactiveElement = this.getInactiveMediaElement();
					if (inactiveElement.tagName.toLowerCase() === "video") {
						try {
							inactiveElement.pause();
						} catch (e) {
							logger.debug(e);
						}
					} else if (inactiveElement.tagName.toLowerCase() === "ha-camera-stream") {
						try {
							const [player, video] = getHaCameraStreamPlayerAndVideo(inactiveElement);
							if (video) {
								video.pause();
							}
							if (player && typeof player.stop === "function") {
								player.stop();
							}
						} catch (e) {
							logger.debug(e);
						}
					}
				}
				element.mediaUrl = this.getNextMediaURL();
				if (!element.mediaUrl) {
					return;
				}
				element.infoCacheUrl = element.mediaUrl;

				if (mediaSourceType() == "birdnet") {
					element = await this.updateMediaFromBirdnet(element);
				} else if (mediaSourceType() == "media-source") {
					element = await this.updateMediaFromMediaSource(element);
				} else if (mediaSourceType() == "unsplash-api") {
					element = await this.updateMediaFromUnsplashAPI(element);
				} else if (mediaSourceType() == "immich-api") {
					element = await this.updateMediaFromImmichAPI(element);
				} else if (mediaSourceType().startsWith("media-entity")) {
					element = await this.updateMediaFromMediaEntity(element);
				} else if (mediaSourceType() == "iframe") {
					element = await this.updateMediaFromMediaIframe(element);
				} else if (mediaSourceType() == "embed") {
					element = await this.updateMediaFromMediaEmbed(element);
				} else {
					element = await this.updateMediaFromOtherSrc(element);
				}

				if (element) {
					element.style.visibility = "visible";

					const isVideo = element.tagName.toLowerCase() === "video";

					if (isVideo) {
						await new Promise((resolve, reject) => {
							if (element.readyState >= element.HAVE_ENOUGH_DATA) {
								resolve();
							} else {
								const onCanPlay = () => {
									element.removeEventListener("canplay", onCanPlay);
									element.removeEventListener("error", onError);
									resolve();
								};
								const onError = () => {
									element.removeEventListener("canplay", onCanPlay);
									element.removeEventListener("error", onError);
									reject(new Error("Video failed to load"));
								};
								element.addEventListener("canplay", onCanPlay);
								element.addEventListener("error", onError);
							}
						});
					}
					if (config.image_background === "image") {
						this.loadBackgroundImage(element);
					}

					if (
						!isVideo &&
						config.show_image_info &&
						/.*\.jpe?g$/i.test(element.mediaUrl.split("?")[0].replace(/\/*$/, ""))
					) {
						this.fetchEXIFInfo(element);
					}
				}
			} catch (error) {
				// Keep the active media visible when the inactive buffer cannot be loaded.
				// The timer will retry with the next media item after a short delay.
				logger.error(`Failed to update media from ${element.mediaUrl}:`, error);
				return null;
			} finally {
				this.updatingMedia = false;
			}
			return element;
		}

		setMediaDimensions() {
			if (!config.calculate_media_size) {
				return;
			}
			const activeElem = this.getActiveMediaElement();
			const mediaElem = this.getActiveMediaElement(true);
			logger.debug("Setting dimensions for media element", activeElem);
			if (!activeElem.mediaUrl) {
				return;
			}
			// Determine if the new media is landscape or portrait, and set the appropriate sizes
			const tagName = mediaElem.tagName.toLowerCase();
			let width = 0;
			let height = 0;
			if (tagName === "video") {
				width = mediaElem.videoWidth;
				height = mediaElem.videoHeight;
			} else if (tagName === "img") {
				width = mediaElem.naturalWidth;
				height = mediaElem.naturalHeight;
			}
			const mediaFit = !width || !height || width >= height ? config.image_fit_landscape : config.image_fit_portrait; // cover / contain

			activeElem.style.position = "absolute";
			activeElem.style.left = "0px";
			activeElem.style.top = "0px";
			activeElem.style.objectFit = mediaFit;
			const availWidth = this.screensaverContainer.clientWidth;
			const availHeight = this.screensaverContainer.clientHeight;
			let setHeight = availHeight;
			let setWidth = availWidth;
			let hiddenHeight = 0;
			let hiddenWidth = 0;
			let setTop = 0;
			let setLeft = 0;

			logger.debug(`Available size is ${availWidth}x${availHeight}, media size is ${width}x${height}`);
			if (width && height) {
				const ratioWidth = availWidth / width;
				const ratioHeight = availHeight / height;
				const diffWidth = availWidth - width * ratioHeight;
				const diffHeight = availHeight - height * ratioWidth;
				logger.debug(`Diff is ${diffWidth}x${diffHeight}`);
				if ((mediaFit == "contain" && diffWidth < diffHeight) || (mediaFit == "cover" && diffWidth >= diffHeight)) {
					logger.debug("Using available width");
					setWidth = availWidth;
					setHeight = Math.floor(height * ratioWidth);
					if (config.media_vertical_align == "top") {
						setTop = 0;
					} else if (config.media_vertical_align == "bottom") {
						setTop = availHeight - setHeight;
					} else {
						setTop = Math.floor((setHeight - availHeight) / -2);
					}
					hiddenHeight = Math.max(setHeight - availHeight, 0);
				} else {
					logger.debug("Using available height");
					setHeight = availHeight;
					setWidth = Math.floor(width * ratioHeight);
					if (config.media_horizontal_align == "left") {
						setLeft = 0;
					} else if (config.media_horizontal_align == "right") {
						setLeft = availWidth - setWidth;
					} else {
						setLeft = Math.floor((setWidth - availWidth) / -2);
					}
					hiddenWidth = Math.max(setWidth - availWidth, 0);
				}
			} else if (tagName !== "iframe" && tagName !== "embed" && tagName !== "div") {
				logger.warn("Size not available for media element", mediaElem);
			}
			logger.debug(
				`Setting dimensions: size=${setWidth}x${setHeight} - position=${setLeft}x${setTop} - hidden=${hiddenWidth}x${hiddenHeight}`
			);
			activeElem.style.width = `${setWidth}px`;
			activeElem.style.height = `${setHeight}px`;
			activeElem.style.top = `${setTop}px`;
			activeElem.style.left = `${setLeft}px`;
			activeElem.style.setProperty("--hidden-width", hiddenWidth);
			activeElem.style.setProperty("--hidden-height", hiddenHeight);
		}

		startPlayingActiveMedia() {
			const activeElem = this.getActiveMediaElement();
			const videoElement = this.getActiveMediaElement(true);

			if (typeof videoElement.play !== "function") {
				this.setDisplayTime();
				return; // Not playable element.
			}

			const cleanupListeners = () => {
				if (videoElement._wp_video_playback_listeners) {
					Object.entries(videoElement._wp_video_playback_listeners).forEach(([event, handler]) => {
						videoElement.removeEventListener(event, handler);
					});
					videoElement._wp_video_playback_listeners = null;
				}
			};

			videoElement.loop = config.video_loop && videoElement.duration < config.display_time;
			videoElement.play_to_end = config.video_play_to_end;
			this.setDisplayTime();
			if (!videoElement.loop && !videoElement._wp_video_playback_listeners) {
				// Immediately switch to next image at the end of the playback.
				const onTimeUpdate = () => {
					if (this.getActiveMediaElement() !== videoElement) {
						cleanupListeners();
						return;
					}
					// If the media has played enough and is near the end.
					if (videoElement.currentTime > config.crossfade_time) {
						const remainingTime = videoElement.duration - videoElement.currentTime;
						if (remainingTime <= config.crossfade_time) {
							this.switchActiveMedia("display_time_elapsed");
							cleanupListeners();
						}
					}
				};
				const onMediaEnded = () => {
					if (this.getActiveMediaElement() === videoElement) {
						this.switchActiveMedia("media_end");
					}
					cleanupListeners();
				};
				const onMediaPause = () => {
					cleanupListeners();
				};

				videoElement._wp_video_playback_listeners = {
					timeupdate: onTimeUpdate,
					ended: onMediaEnded,
					pause: onMediaPause
				};
				Object.entries(videoElement._wp_video_playback_listeners).forEach(([event, handler]) => {
					videoElement.addEventListener(event, handler);
				});
			}

			// Start playing the media.
			videoElement.play().catch((e) => {
				cleanupListeners();
				if (activeElem === this.getActiveMediaElement()) {
					logger.error(`Failed to play media "${activeElem.mediaUrl}" (src=${videoElement.src}):`, e);
				}
			});
		}

		async switchActiveMedia(eventType) {
			if (this.updatingMedia) {
				logger.debug("Already switching media");
				return;
			}
			if (this.afterFadeoutTimer) {
				clearTimeout(this.afterFadeoutTimer);
				this.afterFadeoutTimer = null;
			}

			const sourceType = mediaSourceType();
			if (sourceType.startsWith("media-entity")) {
				const mediaEntity = config.image_url.replace(/^media-entity-(image|video):\/\//, "");
				const entity = this.hass.states[mediaEntity];
				if (!entity) {
					logger.error(`Media entity "${mediaEntity}" not available`);
					return;
				}

				if (mediaEntityState != entity.state) {
					logger.debug(`Media entity ${mediaEntity} state has changed`);
				} else if (eventType == "entity_update") {
					return;
				} else if (eventType == "start" || eventType == "user_action") {
					logger.debug(`Media entity ${mediaEntity} state unchanged, but eventType = ${eventType}`);
				} else if (config.media_entity_load_unchanged) {
					logger.debug(`Media entity ${mediaEntity} state unchanged, but media_entity_load_unchanged = true`);
				} else {
					this.lastMediaUpdate = Date.now();
					if (this.isPaused) {
						this.mediaTimeElapsedBeforePause = 0;
					}
					this.restartProgressBarAnimation();
					return;
				}
				mediaEntityState = entity.state;
			}

			this.lastMediaUpdate = Date.now();
			if (this.isPaused) {
				this.mediaTimeElapsedBeforePause = 0;
			}
			const activeElement = this.getActiveMediaElement();
			if (
				(sourceType === "iframe" || sourceType === "embed") &&
				!config.iframe_load_unchanged &&
				this.getNextMediaURL(false) == activeElement.mediaUrl
			) {
				return;
			}

			let crossfadeMillis = 0;
			if (eventType != "start") {
				if (config.crossfade_time > 0) {
					crossfadeMillis = Math.round(config.crossfade_time * 1000);
				}
				if (eventType == "user_action" && crossfadeMillis > 250) {
					crossfadeMillis = 250;
				}
			}

			const updateElement = this.getInactiveMediaElement();
			const element = await this.updateMedia(updateElement);
			if (!element) {
				this.mediaLoadRetryAt = Date.now() + mediaLoadRetryDelay;
				return;
			}
			this.mediaLoadRetryAt = 0;
			this._switchActiveMedia(element, crossfadeMillis);
		}

		_switchActiveMedia(newElement, crossfadeMillis = null) {
			this.lastMediaUpdate = Date.now();
			if (this.isPaused) {
				// Case of calls to nextImage()/previousImage() when slideshow is paused.
				// Preserve paused state.
				this.mediaTimeElapsedBeforePause = 0;
			}
			this.imageOneContainer.style.transition = `opacity ${crossfadeMillis}ms ease-in-out`;
			this.imageTwoContainer.style.transition = `opacity ${crossfadeMillis}ms ease-in-out`;

			let curActiveContainer = this.imageOneContainer;
			let newActiveContainer = this.imageTwoContainer;
			let curMedia = this.imageOne;
			let newMedia = this.imageTwo;
			if (newElement == this.imageOne) {
				curActiveContainer = this.imageTwoContainer;
				newActiveContainer = this.imageOneContainer;
				curMedia = this.imageTwo;
				newMedia = this.imageOne;
			}
			logger.debug(`Switching active media to '${newActiveContainer.id}'`);

			if (newActiveContainer.style.opacity != 1) {
				newActiveContainer.style.opacity = 1;
			}
			if (curActiveContainer.style.opacity != 0) {
				curActiveContainer.style.opacity = 0;
			}

			if (newMedia.tagName.toLowerCase() == "iframe" && config.iframe_interaction) {
				newMedia.style.pointerEvents = "auto";
			} else {
				newMedia.style.pointerEvents = "none";
			}

			this.setMediaDataInfo();
			this.setMediaDimensions();
			this.setImageURLEntityState();
			this.startPlayingActiveMedia();
			this.restartProgressBarAnimation();
			this.restartKenBurnsEffect();

			const wp = this;
			this.afterFadeoutTimer = setTimeout(function () {
				wp.afterFadeoutTimer = null;
				// A rapid manual switch may reuse this buffer before the old fade timer
				// fires. Only release it while it is still the inactive buffer.
				if (curMedia === wp.getInactiveMediaElement()) {
					wp.releaseMediaElement(curMedia);
				}
			}, crossfadeMillis);
		}

		setupScreensaver() {
			logger.debug("Setup screensaver");
			if (config.keep_screen_on_time > 0 && !this.screenWakeLock.enabled) {
				this.screenWakeLock.enable();
			}
			if (config.fullscreen && !isFullscreen()) {
				enterFullscreen();
			}
		}

		async startScreensaver() {
			logger.debug("Start screensaver");

			if (this.afterFadeoutTimer) {
				clearTimeout(this.afterFadeoutTimer);
				this.afterFadeoutTimer = null;
			}
			this.mediaLoadRetryAt = 0;
			this.screensaverStartedAt = Date.now();
			this.screensaverStoppedAt = null;
			this.currentWidth = this.screensaverContainer.clientWidth;
			this.currentHeight = this.screensaverContainer.clientHeight;

			this.setDefaultStyle();
			updateConfig();

			if (!isActive()) {
				logger.debug("Wallpanel not active, not starting screensaver");
				this.screensaverStartedAt = null;
				this.screensaverStoppedAt = Date.now();
				return;
			}

			const activeElement = this.getActiveMediaElement();
			if (activeElement == this.imageOne) {
				this.imageOneContainer.style.opacity = 1;
				this.imageTwoContainer.style.opacity = 0;
			} else {
				this.imageOneContainer.style.opacity = 0;
				this.imageTwoContainer.style.opacity = 1;
			}

			this.setDisplayTime();
			await this.switchActiveMedia("start");
			this.setupScreensaver();

			if (config.keep_screen_on_time > 0) {
				const wp = this;
				setTimeout(function () {
					if (wp.screensaverRunning() && !wp.screenWakeLock.enabled) {
						logger.warning(
							"Keep screen on will not work because the user didn't interact with the document first. https://goo.gl/xX8pDD"
						);
						showMessage(
							"info",
							"Keep screen on",
							"Please tap the screen for a moment to keep it awake and prevent it from turning off.",
							15000
						);
					}
				}, 2000);
			}

			this.lastMove = Date.now();
			this.lastMediaUpdate = Date.now();
			document.documentElement.style.overflow = "hidden";

			// Reset state relevant to slideshow pause.
			this.isPaused = false;
			this.mediaTimeElapsedBeforePause = 0;
			this.pauseIndicator.style.display = "none";

			this.createInfoBoxContent();

			this.style.visibility = "visible";
			this.style.opacity = 1;
			this.style.pointerEvents = "auto";

			this.setScreensaverEntityState();

			if (config.screensaver_start_navigation_path || config.screensaver_stop_close_browser_mod_popup) {
				this.screensaverStopNavigationPathTimeout = setTimeout(
					() => {
						if (config.screensaver_start_navigation_path) {
							skipDisableScreensaverOnLocationChanged = true;
							navigate(config.screensaver_start_navigation_path);
							setTimeout(() => {
								skipDisableScreensaverOnLocationChanged = false;
							}, 5000);
						}
						if (config.screensaver_stop_close_browser_mod_popup) {
							getActiveBrowserModPopups().forEach((popup) => {
								popup.closeDialog();
							});
						}
					},
					(config.fade_in_time + 1) * 1000
				);
			}
		}

		screensaverRunning() {
			return Boolean(this.screensaverStartedAt) && this.screensaverStartedAt > 0;
		}

		// API for use with Browser Mod.
		stopScreensaver(fadeOutTime = 0.0) {
			logger.debug("Stop screensaver");

			if (this.afterFadeoutTimer) {
				clearTimeout(this.afterFadeoutTimer);
				this.afterFadeoutTimer = null;
			}
			this.mediaLoadRetryAt = 0;
			this.screensaverStartedAt = null;
			this.screensaverStoppedAt = Date.now();

			document.documentElement.style.removeProperty("overflow");

			if (this.screensaverStopNavigationPathTimeout) {
				clearTimeout(this.screensaverStopNavigationPathTimeout);
			}
			hideAllMessages();

			this.debugBox.style.pointerEvents = "none";
			if (fadeOutTime > 0) {
				this.style.transition = `opacity ${Math.round(fadeOutTime * 1000)}ms ease-in-out`;
			} else {
				this.style.transition = "";
			}
			this.style.opacity = 0;
			this.style.visibility = "hidden";
			this.style.pointerEvents = "none";
			this.imageOneInfo.style.pointerEvents = "none";
			this.imageTwoInfo.style.pointerEvents = "none";
			this.infoBoxPosX.style.animation = "";
			this.infoBoxPosY.style.animation = "";

			this.idleSince = Date.now();
			if (this.screenWakeLock.enabled) {
				this.screenWakeLock.disable();
			}

			const wp = this;
			this.afterFadeoutTimer = setTimeout(
				function () {
					wp.afterFadeoutTimer = null;
					if (!wp.screensaverRunning()) {
						wp.releaseAllMedia();
					}
				},
				Math.round(fadeOutTime * 1000)
			);

			setTimeout(this.setScreensaverEntityState.bind(this), 25);
		}

		updateScreensaver() {
			const currentDate = new Date();
			const now = currentDate.getTime();

			if (
				this.energyCollectionUpdateEnabled &&
				now - this.lastEnergyCollectionUpdate >= this.energyCollectionUpdateInterval * 1000
			) {
				if (this.hass.connection._energy_wallpanel) {
					this.hass.connection._energy_wallpanel.refresh();
				}
				this.lastEnergyCollectionUpdate = now;
			}
			if (this.infoBoxContentCreatedDate && this.infoBoxContentCreatedDate.getDate() != currentDate.getDate()) {
				// Day changed since creation of info box content.
				// Recreate to update energy cards / energy collection start / end date.
				this.createInfoBoxContent();
			}

			if (config.info_move_interval > 0 && now - this.lastMove >= config.info_move_interval * 1000) {
				if (config.info_move_pattern === "random") {
					this.randomMove();
				} else if (config.info_move_pattern === "corners") {
					this.moveAroundCorners();
				} else {
					logger.error(`Unknown info move type ${config.info_move_pattern}`);
				}
			}

			if (
				config.black_screen_after_time > 0 &&
				now - this.screensaverStartedAt >= config.black_screen_after_time * 1000
			) {
				logger.debug("Setting screen to black");
				this.screensaverOverlay.style.background = "#000000";
			} else if (config.show_images) {
				let displayTimeElapsed;
				if (config.media_order == "random_but_synced") {
					// Advance on the wall-clock boundary so every device switches together.
					displayTimeElapsed =
						Math.floor(now / (config.display_time * 1000)) !=
						Math.floor(this.lastMediaUpdate / (config.display_time * 1000));
				} else {
					displayTimeElapsed = now - this.lastMediaUpdate >= this.getDisplayTime() * 1000;
				}
				const switchMedia = this.mediaLoadRetryAt > 0 ? now >= this.mediaLoadRetryAt : displayTimeElapsed;
				if (!this.isPaused && !this.updatingMedia && switchMedia) {
					this.switchActiveMedia("display_time_elapsed");
				}
				if (now - this.lastMediaListUpdate >= getMediaListUpdateIntervalSeconds() * 1000) {
					this.updateMediaList(null, true);
				}
				if (this.imageOneContainer.style.visibility != "visible") {
					this.imageOneContainer.style.visibility = "visible";
				}
				if (this.imageOne.style.visibility != "visible") {
					this.imageOne.style.visibility = "visible";
				}
				if (this.imageTwoContainer.style.visibility != "visible") {
					this.imageTwoContainer.style.visibility = "visible";
				}
				if (this.imageTwo.style.visibility != "visible") {
					this.imageTwo.style.visibility = "visible";
				}
			} else {
				if (this.imageOneContainer.style.visibility != "hidden") {
					this.imageOneContainer.style.visibility = "hidden";
				}
				if (this.imageOne.style.visibility != "hidden") {
					this.imageOne.style.visibility = "hidden";
				}
				if (this.imageTwoContainer.style.visibility != "hidden") {
					this.imageTwoContainer.style.visibility = "hidden";
				}
				if (this.imageTwo.style.visibility != "hidden") {
					this.imageTwo.style.visibility = "hidden";
				}
			}

			if (config.close_more_info_dialog_time > 0) {
				const dialog = this.getMoreInfoDialog();
				if (dialog) {
					const now = new Date();
					if (!this.moreInfoDialogOpenedAt) {
						this.moreInfoDialogOpenedAt = now;
					} else if (now - this.moreInfoDialogOpenedAt >= config.close_more_info_dialog_time * 1000) {
						dialog.close();
					}
				} else {
					this.moreInfoDialogOpenedAt = 0;
				}
			}

			if (config.debug) {
				let html = "";
				const conf = {};
				for (const key in config) {
					if (["profiles"].includes(key)) {
						conf[key] = "...";
					} else {
						conf[key] = config[key];
					}
				}

				html += '<a id="download_log" href="">Download log</a><br />';
				html += `<b>Version:</b> ${version}<br/>`;
				html += `<b>User-Agent:</b> ${navigator.userAgent}<br/>`;
				html += `<b>Config:</b> ${JSON.stringify(conf)}<br/>`;
				html += `<b>Fullscreen:</b> ${isFullscreen()}<br/>`;
				html += `<b>Screensaver started at:</b> ${wallpanel.screensaverStartedAt}<br/>`;
				html += `<b>Screen wake lock:</b> enabled=${this.screenWakeLock.enabled} native=${this.screenWakeLock.nativeWakeLockSupported} lock=${this.screenWakeLock._lock} player=${this.screenWakeLock._player} error=${this.screenWakeLock.error}<br/>`;
				if (this.screenWakeLock._player) {
					const p = this.screenWakeLock._player;
					html += `<b>Screen wake lock video</b>: readyState=${p.readyState} currentTime=${p.currentTime} paused=${p.paused} ended=${p.ended}<br/>`;
				}
				html += `<b>Media list size:</b> ${this.mediaList.length}<br/>`;
				const activeElement = this.getActiveMediaElement();
				if (activeElement) {
					html += `<b>Current media:</b> ${activeElement.mediaUrl}<br/>`;
					const mediaInfo = mediaInfoCache.get(activeElement.infoCacheUrl);
					if (mediaInfo) {
						html += `<b>Media info:</b> ${JSON.stringify(mediaInfo)}<br/>`;
					}
				}
				if (this.debugBox.innerHTML !== html) {
					this.debugBox.innerHTML = html;
					this.debugBox.querySelector("#download_log").addEventListener("click", function (event) {
						logger.downloadMessages();
						event.preventDefault();
					});
				}
				this.debugBox.scrollTop = this.debugBox.scrollHeight;
			}
			if (
				this.screenWakeLock.enabled &&
				config.keep_screen_on_time > 0 &&
				now - this.screensaverStartedAt >= config.keep_screen_on_time * 1000
			) {
				logger.info(`Disable wake lock after ${config.keep_screen_on_time} seconds`);
				this.screenWakeLock.disable();
			}
		}

		switchMediaDirection(direction) {
			this.mediaListDirection = direction;
			this.switchActiveMedia("user_action");
		}

		// API for use with Browser Mod.
		async nextImage() {
			if (this.updatingMedia) {
				logger.debug("Already switching media");
				return;
			}
			logger.debug("Next image");
			const prevDirection = this.mediaListDirection;
			this.mediaListDirection = "forwards";
			try {
				await this.switchActiveMedia("user_action");
			} finally {
				this.mediaListDirection = prevDirection;
			}
		}

		// API for use with Browser Mod.
		async previousImage() {
			if (this.updatingMedia) {
				logger.debug("Already switching media");
				return;
			}
			logger.debug("Previous image");
			const prevDirection = this.mediaListDirection;
			this.mediaListDirection = "backwards";
			try {
				await this.switchActiveMedia("user_action");
			} finally {
				this.mediaListDirection = prevDirection;
			}
		}

		// API for use with Browser Mod.
		togglePlayPause() {
			logger.debug("Toggle play/pause");

			if (!this.screensaverRunning()) return;

			if (this.isPaused) {
				// Play.
				this.isPaused = false;
				this.lastMediaUpdate = Date.now() - (this.mediaTimeElapsedBeforePause || 0);
				this.pauseIndicator.style.display = "none";
				this.progressBar.style.animationPlayState = "running";

				this.startPlayingActiveMedia();
			} else {
				// Pause.
				this.isPaused = true;
				this.mediaTimeElapsedBeforePause = Date.now() - this.lastMediaUpdate;
				this.lastMediaUpdate = Date.now();
				this.pauseIndicator.style.display = "block";
				this.progressBar.style.animationPlayState = "paused";

				const videoElement = this.getActiveMediaElement(true);
				if (videoElement && typeof videoElement.pause === "function") {
					videoElement.pause();
				}
			}
		}

		setCameraMotionDetectionEntityState(state) {
			const entity = config.camera_motion_detection_set_entity;
			if (!entity || !this.__hass.states[entity]) return;
			logger.debug("Updating camera motion detection entity", entity, state);
			this.__hass
				.callService("input_boolean", state ? "turn_on" : "turn_off", {
					entity_id: entity
				})
				.then(
					(result) => {
						logger.debug(result);
					},
					(error) => {
						logger.error("Failed to set camera motion detection entity state:", error);
					}
				);
		}

		motionDetected() {
			if (config.camera_motion_detection_stop_screensaver && this.screensaverRunning()) {
				this.stopScreensaver(config.fade_out_time_motion_detected);
			}
			this.setCameraMotionDetectionEntityState(true);
		}

		motionStopped() {
			this.setCameraMotionDetectionEntityState(false);
		}

		handleInteractionEvent(evt) {
			const isClick = ["click", "touchend"].includes(evt.type);
			const now = Date.now();
			this.idleSince = now;

			let swipe = "";
			if (evt.type == "touchstart") {
				if (evt.touches && evt.touches[0]) {
					this.touchStartX = evt.touches[0].clientX;
					this.touchStartY = evt.touches[0].clientY;
				}
				return;
			} else if (evt.type == "touchend" && this.touchStartX >= 0 && evt.changedTouches && evt.changedTouches[0]) {
				const diffX = evt.changedTouches[0].clientX - this.touchStartX;
				const diffY = evt.changedTouches[0].clientY - this.touchStartY;
				const swipeThreshold = Math.max(20, window.innerWidth * 0.03);
				if (diffX >= swipeThreshold && Math.abs(diffX) > Math.abs(diffY)) {
					swipe = "right";
				} else if (diffX <= -swipeThreshold && Math.abs(diffX) > Math.abs(diffY)) {
					swipe = "left";
				}
				this.touchStartX = -1;
				this.touchStartY = -1;
			}

			if (!this.screensaverRunning()) {
				if (this.blockEventsUntil > now) {
					if (isClick) {
						evt.preventDefault();
					}
					evt.stopImmediatePropagation();
				}
				if (isClick) {
					this.setupScreensaver();
				}
				return;
			}

			// Screensaver is active
			if (isClick && hideAllMessages()) {
				// One or messages where hidden
				this.blockEventsUntil = now + 1000;
				return;
			}

			let x = evt.clientX;
			let y = evt.clientY;
			if (!x && evt.changedTouches && evt.changedTouches[0]) {
				x = evt.changedTouches[0].clientX;
			}
			if (!y && evt.changedTouches && evt.changedTouches[0]) {
				y = evt.changedTouches[0].clientY;
			}

			if (config.debug && x && x < 100 && y && y < 100) {
				// Download link
				return;
			}

			const bmp = getActiveBrowserModPopup();
			if (bmp) {
				const bm_elements = [
					bmp.shadowRoot.querySelector(".content"),
					bmp.shadowRoot.querySelector("ha-dialog-header")
				];
				for (let i = 0; i < bm_elements.length; i++) {
					if (bm_elements[i]) {
						const pos = bm_elements[i].getBoundingClientRect();
						logger.debug("Event position:", bm_elements[i], x, y, pos.left, pos.right, pos.top, pos.bottom);
						if (x >= pos.left && x <= pos.right && y >= pos.top && y <= pos.bottom) {
							logger.debug("Event on browser mod popup:", bm_elements[i]);
							return;
						}
					}
				}
			}

			if (config.iframe_interaction && mediaSourceType() == "iframe") {
				return;
			}

			if (config.content_interaction) {
				if (this.getMoreInfoDialog()) {
					return;
				}
				let elements = [];
				elements = elements.concat(this.__cards || []);
				elements = elements.concat(this.__badges || []);
				elements = elements.concat(this.__views || []);
				elements.push(this.shadowRoot.getElementById("wallpanel-screensaver-info-box-content"));
				elements.push(this.shadowRoot.getElementById("wallpanel-screensaver-fixed-info-box-content"));
				if (config.image_info_template == "analyze") {
					elements.push(this.imageOneInfo);
					elements.push(this.imageTwoInfo);
				}
				for (let i = 0; i < elements.length; i++) {
					const pos = elements[i].getBoundingClientRect();
					logger.debug("Event position:", elements[i], x, y, pos.left, pos.right, pos.top, pos.bottom);
					if (x >= pos.left && x <= pos.right && y >= pos.top && y <= pos.bottom) {
						logger.debug("Event on:", elements[i]);
						return;
					}
				}
			}

			let switchMedia = "";
			if (swipe) {
				switchMedia = swipe == "left" ? "forwards" : "backwards";
				evt.stopImmediatePropagation();
			} else if (evt instanceof MouseEvent || ("TouchEvent" in window && evt instanceof TouchEvent)) {
				let right = 0.0;
				let bottom = 0.0;
				const pos = this.screensaverContainer.getBoundingClientRect();
				if (x) {
					right = (pos.right - x) / this.screensaverContainer.clientWidth;
				}
				if (y) {
					bottom = (pos.bottom - y) / this.screensaverContainer.clientHeight;
				}
				logger.debug("Event position screensaver:", x, y, pos.left, pos.right, pos.top, pos.bottom);
				if (bottom > 1.0 || bottom < 0.0 || right > 1.0 || right < 0.0) {
					// Outside the screensaver
					return;
				}

				if (isClick) {
					evt.preventDefault();
				}
				evt.stopImmediatePropagation();

				if (config.touch_zone_size_next_image > 0 && right <= config.touch_zone_size_next_image / 100) {
					if (isClick) {
						switchMedia = "forwards";
					} else {
						return;
					}
				} else if (
					config.touch_zone_size_previous_image > 0 &&
					right >= (100 - config.touch_zone_size_previous_image) / 100
				) {
					if (isClick) {
						switchMedia = "backwards";
					} else {
						return;
					}
				} else if (right >= 0.4 && right <= 0.6 && bottom <= 0.1) {
					const now = new Date();
					if (isClick && now - this.lastClickTime < 500) {
						this.clickCount += 1;
						if (this.clickCount == 3) {
							logger.purgeMessages();
							config.debug = !config.debug;
							this.debugBox.style.visibility = config.debug ? "visible" : "hidden";
							this.debugBox.style.pointerEvents = config.debug ? "auto" : "none";
						}
					} else {
						this.clickCount = 1;
					}
					this.lastClickTime = now;
					return;
				}
			}

			if (switchMedia) {
				if (this.updatingMedia) {
					logger.debug("Already switching media");
				} else {
					logger.debug(`Switching media, direction ${switchMedia}`);
					if (this.mediaListDirection != switchMedia) {
						this.switchMediaDirection(switchMedia);
					} else {
						this.switchActiveMedia("user_action");
					}
				}
				return;
			}

			if (!isClick || config.stop_screensaver_on_mouse_click) {
				// Prevent interaction with the dashboards after screensaver was stopped
				this.blockEventsUntil = now + config.control_reactivation_time * 1000;
				this.stopScreensaver(config.fade_out_time_interaction);
			}
		}
	}

	if (!customElements.get("wallpanel-view-container")) {
		customElements.define("wallpanel-view-container", WallpanelViewContainer);
	}
	if (!customElements.get("wallpanel-view")) {
		customElements.define("wallpanel-view", WallpanelView);
	}
	wallpanelContainer = document.createElement("wallpanel-view-container");
	wallpanel = document.createElement("wallpanel-view");
	wallpanelContainer.appendChild(wallpanel);
	elHaMain.shadowRoot.appendChild(wallpanelContainer);
}

function activateWallpanel() {
	logger.debug("activateWallpanel");
	let hideToolbar = config.hide_toolbar;
	let hideActionItems = config.hide_toolbar_action_icons;
	if (hideToolbar && !config.hide_toolbar_on_subviews && activeTab) {
		const pl = getHaPanelLovelace();
		if (pl && pl.lovelace && pl.lovelace.rawConfig && pl.lovelace.rawConfig.views) {
			for (let i = 0; i < pl.lovelace.rawConfig.views.length; i++) {
				if (pl.lovelace.rawConfig.views[i].path == activeTab) {
					if (pl.lovelace.rawConfig.views[i].subview) {
						logger.debug(`Current tab '${activeTab}' is a subview, not hiding toolbar`);
						hideToolbar = false;
						hideActionItems = false;
					}
					break;
				}
			}
		}
	}
	setToolbarVisibility(hideToolbar, hideActionItems);
	setSidebarVisibility(config.hide_sidebar);
	if (config.fullscreen && !isFullscreen()) {
		enterFullscreen();
	}
}

function deactivateWallpanel() {
	logger.debug("deactivateWallpanel");
	if (wallpanel.screensaverRunning()) {
		wallpanel.stopScreensaver();
	}
	setToolbarVisibility(false, false);
	setSidebarVisibility(false);
	if (!config.keep_fullscreen && isFullscreen()) {
		exitFullscreen();
	}
}

function reconfigure() {
	if (!activePanel || !activeTab) {
		deactivateWallpanel();
		return;
	}

	updateConfig();

	if (isActive()) {
		activateWallpanel();
	} else {
		deactivateWallpanel();
	}
}

function locationChanged() {
	logger.debug(`Location changed from '${currentLocation}' to '${window.location.href}'`);

	if (window.location.href == currentLocation) {
		return;
	}

	currentLocation = window.location.href;

	if (
		wallpanel &&
		wallpanel.screensaverRunning &&
		wallpanel.screensaverRunning() &&
		config.stop_screensaver_on_location_change
	) {
		if (skipDisableScreensaverOnLocationChanged) {
			skipDisableScreensaverOnLocationChanged = false;
			if (wallpanel.screensaverStopNavigationPathTimeout) {
				clearTimeout(wallpanel.screensaverStopNavigationPathTimeout);
			}
		} else {
			wallpanel.stopScreensaver();
		}
	}

	let panel = null;
	let tab = null;
	const path = window.location.pathname.split("/");
	if (path.length > 1) {
		panel = path[1];
		if (path.length > 2) {
			tab = path[2];
		}
	}
	const panelChanged = activePanel && panel != activePanel;
	activePanel = panel;
	activeTab = tab;

	if (panelChanged) {
		logger.debug("Reset dashboard config");
		dashboardConfig = {};
		waitForEnv(reconfigure);
	} else {
		reconfigure();
	}
}

function waitForEnv(callback, startTime = null) {
	const now = Date.now();
	if (startTime === null) {
		startTime = now;
	}
	const startupSeconds = (now - startTime) / 1000;

	elHass = document.querySelector("body > home-assistant");
	if (elHass && elHass.shadowRoot) {
		elHaMain = elHass.shadowRoot.querySelector("home-assistant-main");
	}
	if (!elHass || !elHass.shadowRoot || !elHaMain) {
		if (startupSeconds >= 5.0) {
			logger.error(
				`Wallpanel startup failed after ${startupSeconds} seconds, element home-assistant / home-assistant-main not found.`
			);
			return;
		}
		setTimeout(waitForEnv, 100, callback, startTime);
		return;
	}

	const pl = getHaPanelLovelace();
	if (!pl || !pl.lovelace || !pl.lovelace.config || !pl.lovelace.config) {
		if (startupSeconds >= 5.0) {
			logger.info(`No lovelace config found after ${startupSeconds} seconds`);
			return;
		}
		setTimeout(waitForEnv, 100, callback, startTime);
		return;
	}

	if (!customElements.get("hui-view")) {
		if (startupSeconds >= 5.0) {
			logger.error(`Wallpanel startup failed after ${startupSeconds} seconds, hui-view not found.`);
			return;
		}
		setTimeout(waitForEnv, 100, callback, startTime);
		return;
	}

	if (!window.browser_mod) {
		let waitTime = getDashboardWallpanelConfig(["wait_for_browser_mod_time"])["wait_for_browser_mod_time"];
		if (waitTime === undefined) {
			waitTime = defaultConfig["wait_for_browser_mod_time"];
		}
		if (startupSeconds < waitTime) {
			setTimeout(waitForEnv, 100, callback, startTime);
			return;
		}
	}

	if (window.browser_mod) {
		if (window.browser_mod.entity_id) {
			// V1
			browserId = window.browser_mod.entity_id;
		} else if (window.browser_mod.browserID) {
			// V2
			browserId = window.browser_mod.browserID.replace("-", "_");
		}
	}
	callback();
}

function startup() {
	const hassUser = (elHass.hass || elHass.__hass).user;
	userId = hassUser.id;
	userName = hassUser.username || null;
	userDisplayname = hassUser.name;
	logger.debug(`userId: ${userId}, userName: ${userName}, userDisplayname: ${userDisplayname}`);

	updateConfig();
	initWallpanel();

	window.addEventListener("location-changed", (event) => {
		let url = null;
		try {
			url = event.target.location.href;
		} catch (e) {
			logger.debug(e);
		}
		logger.debug("location-changed", url, event);
		setTimeout(locationChanged, 20);
	});
	if (window.navigation) {
		// Using navigate event because a back button on a sub-view will not produce a location-changed event
		window.navigation.addEventListener("navigate", (event) => {
			let url = null;
			try {
				url = event.destination.url;
			} catch (e) {
				logger.debug(e);
			}
			logger.debug("navigate", url, event);
			setTimeout(locationChanged, 30);
		});
	}
	(elHass.hass || elHass.__hass).connection.subscribeEvents(function (event) {
		logger.debug("lovelace_updated", event);
		const dashboard = event.data.url_path ? event.data.url_path : "lovelace";
		if (dashboard == activePanel) {
			(elHass.hass || elHass.__hass).connection
				.sendMessagePromise({
					type: "lovelace/config",
					url_path: event.data.url_path
				})
				.then((data) => {
					dashboardConfig = {};
					if (data.wallpanel) {
						for (const key in data.wallpanel) {
							if (key in defaultConfig || key in renamedConfigOptions) {
								dashboardConfig[key] = data.wallpanel[key];
							}
						}
					}
					reconfigure();
				});
		}
	}, "lovelace_updated");

	setTimeout(locationChanged, 0);
}

console.info(`%c🖼️ Wallpanel version ${version}`, "color: #34b6f9; font-weight: bold;");
try {
	waitForEnv(startup);
} catch (error) {
	logger.error(error.stack);
}

/**
 * https://github.com/exif-js/exif-js
 *
 * Copyright (c) 2008 Jacob Seidelin
 * Released under the MIT License
 */

var debug = false;

var EXIF = function (obj) {
	if (obj instanceof EXIF) return obj;
	if (!(this instanceof EXIF)) return new EXIF(obj);
	this.EXIFwrapped = obj;
};

var ExifTags = (EXIF.Tags = {
	// version tags
	0x9000: "ExifVersion", // EXIF version
	0xa000: "FlashpixVersion", // Flashpix format version

	// colorspace tags
	0xa001: "ColorSpace", // Color space information tag

	// image configuration
	0xa002: "PixelXDimension", // Valid width of meaningful image
	0xa003: "PixelYDimension", // Valid height of meaningful image
	0x9101: "ComponentsConfiguration", // Information about channels
	0x9102: "CompressedBitsPerPixel", // Compressed bits per pixel

	// user information
	0x927c: "MakerNote", // Any desired information written by the manufacturer
	0x9286: "UserComment", // Comments by user

	// related file
	0xa004: "RelatedSoundFile", // Name of related sound file

	// date and time
	0x9003: "DateTimeOriginal", // Date and time when the original image was generated
	0x9004: "DateTimeDigitized", // Date and time when the image was stored digitally
	0x9290: "SubsecTime", // Fractions of seconds for DateTime
	0x9291: "SubsecTimeOriginal", // Fractions of seconds for DateTimeOriginal
	0x9292: "SubsecTimeDigitized", // Fractions of seconds for DateTimeDigitized

	// picture-taking conditions
	0x829a: "ExposureTime", // Exposure time (in seconds)
	0x829d: "FNumber", // F number
	0x8822: "ExposureProgram", // Exposure program
	0x8824: "SpectralSensitivity", // Spectral sensitivity
	0x8827: "ISOSpeedRatings", // ISO speed rating
	0x8828: "OECF", // Optoelectric conversion factor
	0x9201: "ShutterSpeedValue", // Shutter speed
	0x9202: "ApertureValue", // Lens aperture
	0x9203: "BrightnessValue", // Value of brightness
	0x9204: "ExposureBias", // Exposure bias
	0x9205: "MaxApertureValue", // Smallest F number of lens
	0x9206: "SubjectDistance", // Distance to subject in meters
	0x9207: "MeteringMode", // Metering mode
	0x9208: "LightSource", // Kind of light source
	0x9209: "Flash", // Flash status
	0x9214: "SubjectArea", // Location and area of main subject
	0x920a: "FocalLength", // Focal length of the lens in mm
	0xa20b: "FlashEnergy", // Strobe energy in BCPS
	0xa20c: "SpatialFrequencyResponse", //
	0xa20e: "FocalPlaneXResolution", // Number of pixels in width direction per FocalPlaneResolutionUnit
	0xa20f: "FocalPlaneYResolution", // Number of pixels in height direction per FocalPlaneResolutionUnit
	0xa210: "FocalPlaneResolutionUnit", // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
	0xa214: "SubjectLocation", // Location of subject in image
	0xa215: "ExposureIndex", // Exposure index selected on camera
	0xa217: "SensingMethod", // Image sensor type
	0xa300: "FileSource", // Image source (3 == DSC)
	0xa301: "SceneType", // Scene type (1 == directly photographed)
	0xa302: "CFAPattern", // Color filter array geometric pattern
	0xa401: "CustomRendered", // Special processing
	0xa402: "ExposureMode", // Exposure mode
	0xa403: "WhiteBalance", // 1 = auto white balance, 2 = manual
	0xa404: "DigitalZoomRation", // Digital zoom ratio
	0xa405: "FocalLengthIn35mmFilm", // Equivalent foacl length assuming 35mm film camera (in mm)
	0xa406: "SceneCaptureType", // Type of scene
	0xa407: "GainControl", // Degree of overall image gain adjustment
	0xa408: "Contrast", // Direction of contrast processing applied by camera
	0xa409: "Saturation", // Direction of saturation processing applied by camera
	0xa40a: "Sharpness", // Direction of sharpness processing applied by camera
	0xa40b: "DeviceSettingDescription", //
	0xa40c: "SubjectDistanceRange", // Distance to subject

	// other tags
	0xa005: "InteroperabilityIFDPointer",
	0xa420: "ImageUniqueID" // Identifier assigned uniquely to each image
});

var TiffTags = (EXIF.TiffTags = {
	0x0100: "ImageWidth",
	0x0101: "ImageHeight",
	0x8769: "ExifIFDPointer",
	0x8825: "GPSInfoIFDPointer",
	0xa005: "InteroperabilityIFDPointer",
	0x0102: "BitsPerSample",
	0x0103: "Compression",
	0x0106: "PhotometricInterpretation",
	0x0112: "Orientation",
	0x0115: "SamplesPerPixel",
	0x011c: "PlanarConfiguration",
	0x0212: "YCbCrSubSampling",
	0x0213: "YCbCrPositioning",
	0x011a: "XResolution",
	0x011b: "YResolution",
	0x0128: "ResolutionUnit",
	0x0111: "StripOffsets",
	0x0116: "RowsPerStrip",
	0x0117: "StripByteCounts",
	0x0201: "JPEGInterchangeFormat",
	0x0202: "JPEGInterchangeFormatLength",
	0x012d: "TransferFunction",
	0x013e: "WhitePoint",
	0x013f: "PrimaryChromaticities",
	0x0211: "YCbCrCoefficients",
	0x0214: "ReferenceBlackWhite",
	0x0132: "DateTime",
	0x010e: "ImageDescription",
	0x010f: "Make",
	0x0110: "Model",
	0x0131: "Software",
	0x013b: "Artist",
	0x8298: "Copyright"
});

var GPSTags = (EXIF.GPSTags = {
	0x0000: "GPSVersionID",
	0x0001: "GPSLatitudeRef",
	0x0002: "GPSLatitude",
	0x0003: "GPSLongitudeRef",
	0x0004: "GPSLongitude",
	0x0005: "GPSAltitudeRef",
	0x0006: "GPSAltitude",
	0x0007: "GPSTimeStamp",
	0x0008: "GPSSatellites",
	0x0009: "GPSStatus",
	0x000a: "GPSMeasureMode",
	0x000b: "GPSDOP",
	0x000c: "GPSSpeedRef",
	0x000d: "GPSSpeed",
	0x000e: "GPSTrackRef",
	0x000f: "GPSTrack",
	0x0010: "GPSImgDirectionRef",
	0x0011: "GPSImgDirection",
	0x0012: "GPSMapDatum",
	0x0013: "GPSDestLatitudeRef",
	0x0014: "GPSDestLatitude",
	0x0015: "GPSDestLongitudeRef",
	0x0016: "GPSDestLongitude",
	0x0017: "GPSDestBearingRef",
	0x0018: "GPSDestBearing",
	0x0019: "GPSDestDistanceRef",
	0x001a: "GPSDestDistance",
	0x001b: "GPSProcessingMethod",
	0x001c: "GPSAreaInformation",
	0x001d: "GPSDateStamp",
	0x001e: "GPSDifferential"
});

// EXIF 2.3 Spec
var IFD1Tags = (EXIF.IFD1Tags = {
	0x0100: "ImageWidth",
	0x0101: "ImageHeight",
	0x0102: "BitsPerSample",
	0x0103: "Compression",
	0x0106: "PhotometricInterpretation",
	0x0111: "StripOffsets",
	0x0112: "Orientation",
	0x0115: "SamplesPerPixel",
	0x0116: "RowsPerStrip",
	0x0117: "StripByteCounts",
	0x011a: "XResolution",
	0x011b: "YResolution",
	0x011c: "PlanarConfiguration",
	0x0128: "ResolutionUnit",
	0x0201: "JpegIFOffset", // When image format is JPEG, this value show offset to JPEG data stored.(aka "ThumbnailOffset" or "JPEGInterchangeFormat")
	0x0202: "JpegIFByteCount", // When image format is JPEG, this value shows data size of JPEG image (aka "ThumbnailLength" or "JPEGInterchangeFormatLength")
	0x0211: "YCbCrCoefficients",
	0x0212: "YCbCrSubSampling",
	0x0213: "YCbCrPositioning",
	0x0214: "ReferenceBlackWhite"
});

var StringValues = (EXIF.StringValues = {
	ExposureProgram: {
		0: "Not defined",
		1: "Manual",
		2: "Normal program",
		3: "Aperture priority",
		4: "Shutter priority",
		5: "Creative program",
		6: "Action program",
		7: "Portrait mode",
		8: "Landscape mode"
	},
	MeteringMode: {
		0: "Unknown",
		1: "Average",
		2: "CenterWeightedAverage",
		3: "Spot",
		4: "MultiSpot",
		5: "Pattern",
		6: "Partial",
		255: "Other"
	},
	LightSource: {
		0: "Unknown",
		1: "Daylight",
		2: "Fluorescent",
		3: "Tungsten (incandescent light)",
		4: "Flash",
		9: "Fine weather",
		10: "Cloudy weather",
		11: "Shade",
		12: "Daylight fluorescent (D 5700 - 7100K)",
		13: "Day white fluorescent (N 4600 - 5400K)",
		14: "Cool white fluorescent (W 3900 - 4500K)",
		15: "White fluorescent (WW 3200 - 3700K)",
		17: "Standard light A",
		18: "Standard light B",
		19: "Standard light C",
		20: "D55",
		21: "D65",
		22: "D75",
		23: "D50",
		24: "ISO studio tungsten",
		255: "Other"
	},
	Flash: {
		0x0000: "Flash did not fire",
		0x0001: "Flash fired",
		0x0005: "Strobe return light not detected",
		0x0007: "Strobe return light detected",
		0x0009: "Flash fired, compulsory flash mode",
		0x000d: "Flash fired, compulsory flash mode, return light not detected",
		0x000f: "Flash fired, compulsory flash mode, return light detected",
		0x0010: "Flash did not fire, compulsory flash mode",
		0x0018: "Flash did not fire, auto mode",
		0x0019: "Flash fired, auto mode",
		0x001d: "Flash fired, auto mode, return light not detected",
		0x001f: "Flash fired, auto mode, return light detected",
		0x0020: "No flash function",
		0x0041: "Flash fired, red-eye reduction mode",
		0x0045: "Flash fired, red-eye reduction mode, return light not detected",
		0x0047: "Flash fired, red-eye reduction mode, return light detected",
		0x0049: "Flash fired, compulsory flash mode, red-eye reduction mode",
		0x004d: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
		0x004f: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
		0x0059: "Flash fired, auto mode, red-eye reduction mode",
		0x005d: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
		0x005f: "Flash fired, auto mode, return light detected, red-eye reduction mode"
	},
	SensingMethod: {
		1: "Not defined",
		2: "One-chip color area sensor",
		3: "Two-chip color area sensor",
		4: "Three-chip color area sensor",
		5: "Color sequential area sensor",
		7: "Trilinear sensor",
		8: "Color sequential linear sensor"
	},
	SceneCaptureType: {
		0: "Standard",
		1: "Landscape",
		2: "Portrait",
		3: "Night scene"
	},
	SceneType: {
		1: "Directly photographed"
	},
	CustomRendered: {
		0: "Normal process",
		1: "Custom process"
	},
	WhiteBalance: {
		0: "Auto white balance",
		1: "Manual white balance"
	},
	GainControl: {
		0: "None",
		1: "Low gain up",
		2: "High gain up",
		3: "Low gain down",
		4: "High gain down"
	},
	Contrast: {
		0: "Normal",
		1: "Soft",
		2: "Hard"
	},
	Saturation: {
		0: "Normal",
		1: "Low saturation",
		2: "High saturation"
	},
	Sharpness: {
		0: "Normal",
		1: "Soft",
		2: "Hard"
	},
	SubjectDistanceRange: {
		0: "Unknown",
		1: "Macro",
		2: "Close view",
		3: "Distant view"
	},
	FileSource: {
		3: "DSC"
	},

	Components: {
		0: "",
		1: "Y",
		2: "Cb",
		3: "Cr",
		4: "R",
		5: "G",
		6: "B"
	}
});

function imageHasData(img) {
	return !!img.exifdata;
}

function base64ToArrayBuffer(base64) {
	base64 = base64.replace(/^data:([^;]+);base64,/gim, "");
	var binary = atob(base64);
	var len = binary.length;
	var buffer = new ArrayBuffer(len);
	var view = new Uint8Array(buffer);
	for (var i = 0; i < len; i++) {
		view[i] = binary.charCodeAt(i);
	}
	return buffer;
}

function objectURLToBlob(url, callback) {
	var http = new XMLHttpRequest();
	http.open("GET", url, true);
	http.responseType = "blob";
	http.onload = function () {
		if (this.status == 200 || this.status === 0) {
			callback(this.response);
		}
	};
	http.send();
}

function getImageData(img, callback) {
	function handleBinaryFile(binFile) {
		var data = findEXIFinJPEG(binFile);
		img.exifdata = data || {};
		var iptcdata = findIPTCinJPEG(binFile);
		img.iptcdata = iptcdata || {};
		if (EXIF.isXmpEnabled) {
			var xmpdata = findXMPinJPEG(binFile);
			img.xmpdata = xmpdata || {};
		}
		if (callback) {
			callback.call(img);
		}
	}

	if (img.src) {
		if (/^data:/i.test(img.src)) {
			// Data URI
			var arrayBuffer = base64ToArrayBuffer(img.src);
			handleBinaryFile(arrayBuffer);
		} else if (/^blob:/i.test(img.src)) {
			// Object URL
			var blobFileReader = new FileReader();
			blobFileReader.onload = function (e) {
				handleBinaryFile(e.target.result);
			};
			objectURLToBlob(img.src, function (blob) {
				blobFileReader.readAsArrayBuffer(blob);
			});
		} else {
			var http = new XMLHttpRequest();
			http.onload = function () {
				if (this.status == 200 || this.status === 0) {
					handleBinaryFile(http.response);
				} else {
					logger.error("Could not load image");
					return;
				}
				http = null;
			};
			http.open("GET", img.src, true);
			http.responseType = "arraybuffer";
			http.send(null);
		}
	} else if (self.FileReader && (img instanceof self.Blob || img instanceof self.File)) {
		var fileReader = new FileReader();
		fileReader.onload = function (e) {
			if (debug) logger.log("Got file of length " + e.target.result.byteLength);
			handleBinaryFile(e.target.result);
		};

		fileReader.readAsArrayBuffer(img);
	}
}

function findEXIFinJPEG(file) {
	var dataView = new DataView(file);

	if (debug) logger.log("Got file of length " + file.byteLength);
	if (dataView.getUint8(0) != 0xff || dataView.getUint8(1) != 0xd8) {
		if (debug) logger.log("Not a valid JPEG");
		return false; // not a valid jpeg
	}

	var offset = 2,
		length = file.byteLength,
		marker;

	while (offset < length) {
		if (dataView.getUint8(offset) != 0xff) {
			if (debug) logger.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
			return false; // not a valid marker, something is wrong
		}

		marker = dataView.getUint8(offset + 1);
		if (debug) logger.log(marker);

		// we could implement handling for other markers here,
		// but we're only looking for 0xFFE1 for EXIF data

		if (marker == 225) {
			if (debug) logger.log("Found 0xFFE1 marker");

			return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

			// offset += 2 + file.getShortAt(offset+2, true);
		} else {
			offset += 2 + dataView.getUint16(offset + 2);
		}
	}
}

function findIPTCinJPEG(file) {
	var dataView = new DataView(file);

	if (debug) logger.log("Got file of length " + file.byteLength);
	if (dataView.getUint8(0) != 0xff || dataView.getUint8(1) != 0xd8) {
		if (debug) logger.log("Not a valid JPEG");
		return false; // not a valid jpeg
	}

	var offset = 2,
		length = file.byteLength;

	var isFieldSegmentStart = function (dataView, offset) {
		return (
			dataView.getUint8(offset) === 0x38 &&
			dataView.getUint8(offset + 1) === 0x42 &&
			dataView.getUint8(offset + 2) === 0x49 &&
			dataView.getUint8(offset + 3) === 0x4d &&
			dataView.getUint8(offset + 4) === 0x04 &&
			dataView.getUint8(offset + 5) === 0x04
		);
	};

	while (offset < length) {
		if (isFieldSegmentStart(dataView, offset)) {
			// Get the length of the name header (which is padded to an even number of bytes)
			var nameHeaderLength = dataView.getUint8(offset + 7);
			if (nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
			// Check for pre photoshop 6 format
			if (nameHeaderLength === 0) {
				// Always 4
				nameHeaderLength = 4;
			}

			var startOffset = offset + 8 + nameHeaderLength;
			var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

			return readIPTCData(file, startOffset, sectionLength);
		}

		// Not the marker, continue searching
		offset++;
	}
}
var IptcFieldMap = {
	0x19: "keywords",
	0x37: "dateCreated",
	0x50: "byline",
	0x55: "bylineTitle",
	0x5a: "city",
	0x5c: "sublocation",
	0x5e: "state",
	0x64: "countryCode",
	0x65: "countryName",
	0x67: "OriginalTransmissionReference",
	0x69: "headline",
	0x6d: "credit",
	0x6e: "credit",
	0x74: "copyright",
	0x76: "contact",
	0x78: "caption",
	0x7a: "captionWriter",
	0x7d: "rasterizedCaption",
	0x82: "imageType",
	0x83: "imageOrientation",
	0x87: "languageID",
	0x96: "audioType",
	0x97: "audioSamplingRate",
	0x98: "audioSamplingRes",
	0x99: "audioDuration",
	0x9a: "audioOutcue",
	0xc8: "previewFileFormat",
	0xc9: "previewFileFormatVer",
	0xca: "previewData",
	0x0f: "category"
};

function readIPTCData(file, startOffset, sectionLength) {
	var dataView = new DataView(file);
	var data = {};
	var fieldValue, fieldName, dataSize, segmentType;
	var segmentStartPos = startOffset;
	while (segmentStartPos < startOffset + sectionLength) {
		if (dataView.getUint8(segmentStartPos) === 0x1c && dataView.getUint8(segmentStartPos + 1) === 0x02) {
			segmentType = dataView.getUint8(segmentStartPos + 2);
			if (segmentType in IptcFieldMap) {
				dataSize = dataView.getInt16(segmentStartPos + 3);
				fieldName = IptcFieldMap[segmentType];
				fieldValue = getStringFromDB(dataView, segmentStartPos + 5, dataSize);
				// Check if we already stored a value with this name
				if (Object.prototype.hasOwnProperty.call(data, fieldName)) {
					// Value already stored with this name, create multivalue field
					if (data[fieldName] instanceof Array) {
						data[fieldName].push(fieldValue);
					} else {
						data[fieldName] = [data[fieldName], fieldValue];
					}
				} else {
					data[fieldName] = fieldValue;
				}
			}
		}
		segmentStartPos++;
	}
	return data;
}

function readTags(file, tiffStart, dirStart, strings, bigEnd) {
	var entries = file.getUint16(dirStart, !bigEnd),
		tags = {},
		entryOffset,
		tag,
		i;

	for (i = 0; i < entries; i++) {
		entryOffset = dirStart + i * 12 + 2;
		tag = strings[file.getUint16(entryOffset, !bigEnd)];
		if (!tag && debug) logger.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
		tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
	}
	return tags;
}

function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
	var type = file.getUint16(entryOffset + 2, !bigEnd),
		numValues = file.getUint32(entryOffset + 4, !bigEnd),
		valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart,
		offset,
		vals,
		val,
		n,
		numerator,
		denominator;

	switch (type) {
		case 1: // byte, 8-bit unsigned int
		case 7: // undefined, 8-bit byte, value depending on field
			if (numValues == 1) {
				return file.getUint8(entryOffset + 8, !bigEnd);
			} else {
				offset = numValues > 4 ? valueOffset : entryOffset + 8;
				vals = [];
				for (n = 0; n < numValues; n++) {
					vals[n] = file.getUint8(offset + n);
				}
				return vals;
			}

		case 2: // ascii, 8-bit byte
			offset = numValues > 4 ? valueOffset : entryOffset + 8;
			return getStringFromDB(file, offset, numValues - 1);

		case 3: // short, 16 bit int
			if (numValues == 1) {
				return file.getUint16(entryOffset + 8, !bigEnd);
			} else {
				offset = numValues > 2 ? valueOffset : entryOffset + 8;
				vals = [];
				for (n = 0; n < numValues; n++) {
					vals[n] = file.getUint16(offset + 2 * n, !bigEnd);
				}
				return vals;
			}

		case 4: // long, 32 bit int
			if (numValues == 1) {
				return file.getUint32(entryOffset + 8, !bigEnd);
			} else {
				vals = [];
				for (n = 0; n < numValues; n++) {
					vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd);
				}
				return vals;
			}

		case 5: // rational = two long values, first is numerator, second is denominator
			if (numValues == 1) {
				numerator = file.getUint32(valueOffset, !bigEnd);
				denominator = file.getUint32(valueOffset + 4, !bigEnd);
				val = new Number(numerator / denominator);
				val.numerator = numerator;
				val.denominator = denominator;
				return val;
			} else {
				vals = [];
				for (n = 0; n < numValues; n++) {
					numerator = file.getUint32(valueOffset + 8 * n, !bigEnd);
					denominator = file.getUint32(valueOffset + 4 + 8 * n, !bigEnd);
					vals[n] = new Number(numerator / denominator);
					vals[n].numerator = numerator;
					vals[n].denominator = denominator;
				}
				return vals;
			}

		case 9: // slong, 32 bit signed int
			if (numValues == 1) {
				return file.getInt32(entryOffset + 8, !bigEnd);
			} else {
				vals = [];
				for (n = 0; n < numValues; n++) {
					vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd);
				}
				return vals;
			}

		case 10: // signed rational, two slongs, first is numerator, second is denominator
			if (numValues == 1) {
				return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset + 4, !bigEnd);
			} else {
				vals = [];
				for (n = 0; n < numValues; n++) {
					vals[n] = file.getInt32(valueOffset + 8 * n, !bigEnd) / file.getInt32(valueOffset + 4 + 8 * n, !bigEnd);
				}
				return vals;
			}
	}
}

/**
 * Given an IFD (Image File Directory) start offset
 * returns an offset to next IFD or 0 if it's the last IFD.
 */
function getNextIFDOffset(dataView, dirStart, bigEnd) {
	//the first 2bytes means the number of directory entries contains in this IFD
	var entries = dataView.getUint16(dirStart, !bigEnd);

	// After last directory entry, there is a 4bytes of data,
	// it means an offset to next IFD.
	// If its value is '0x00000000', it means this is the last IFD and there is no linked IFD.

	return dataView.getUint32(dirStart + 2 + entries * 12, !bigEnd); // each entry is 12 bytes long
}

function readThumbnailImage(dataView, tiffStart, firstIFDOffset, bigEnd) {
	// get the IFD1 offset
	var IFD1OffsetPointer = getNextIFDOffset(dataView, tiffStart + firstIFDOffset, bigEnd);

	if (!IFD1OffsetPointer) {
		// logger.log('******** IFD1Offset is empty, image thumb not found ********');
		return {};
	} else if (IFD1OffsetPointer > dataView.byteLength) {
		// this should not happen
		// logger.log('******** IFD1Offset is outside the bounds of the DataView ********');
		return {};
	}
	// logger.log('*******	thumbnail IFD offset (IFD1) is: %s', IFD1OffsetPointer);

	var thumbTags = readTags(dataView, tiffStart, tiffStart + IFD1OffsetPointer, IFD1Tags, bigEnd);

	// EXIF 2.3 specification for JPEG format thumbnail

	// If the value of Compression(0x0103) Tag in IFD1 is '6', thumbnail image format is JPEG.
	// Most of Exif image uses JPEG format for thumbnail. In that case, you can get offset of thumbnail
	// by JpegIFOffset(0x0201) Tag in IFD1, size of thumbnail by JpegIFByteCount(0x0202) Tag.
	// Data format is ordinary JPEG format, starts from 0xFFD8 and ends by 0xFFD9. It seems that
	// JPEG format and 160x120pixels of size are recommended thumbnail format for Exif2.1 or later.

	if (thumbTags["Compression"]) {
		// logger.log('Thumbnail image found!');

		switch (thumbTags["Compression"]) {
			case 6:
				// logger.log('Thumbnail image format is JPEG');
				if (thumbTags.JpegIFOffset && thumbTags.JpegIFByteCount) {
					// extract the thumbnail
					var tOffset = tiffStart + thumbTags.JpegIFOffset;
					var tLength = thumbTags.JpegIFByteCount;
					thumbTags["blob"] = new Blob([new Uint8Array(dataView.buffer, tOffset, tLength)], {
						type: "image/jpeg"
					});
				}
				break;

			case 1:
				logger.log("Thumbnail image format is TIFF, which is not implemented.");
				break;
			default:
				logger.log("Unknown thumbnail image format '%s'", thumbTags["Compression"]);
		}
	} else if (thumbTags["PhotometricInterpretation"] == 2) {
		logger.log("Thumbnail image format is RGB, which is not implemented.");
	}
	return thumbTags;
}

function getStringFromDB(buffer, start, length) {
	// Manage UTF-8 string
	//use of an Array of bytes convert in hexa (arOut[])
	var outstr = "";
	var arOut = [];
	var j = 0;
	for (var n = start; n < start + length; n++) {
		//outstr += String.fromCharCode(buffer.getUint8(n));
		arOut[j] = "0x" + buffer.getUint8(n).toString(16);
		j++;
	}
	//transform array to UTF-8 String with Utf8ArrayToStr function
	outstr = Utf8ArrayToStr(arOut);
	return outstr;
}

// adopted from:
//	 http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt

/* utf.js - UTF-8 <=> UTF-16 convertion
 *
 * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free.  You can redistribute it and/or modify it.
 */

function Utf8ArrayToStr(array) {
	var out, i, len, c;
	var char2, char3;

	out = "";
	len = array.length;
	i = 0;
	while (i < len) {
		c = array[i++];
		switch (c >> 4) {
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
				// 0xxxxxxx
				out += String.fromCharCode(c);
				break;
			case 12:
			case 13:
				// 110x xxxx   10xx xxxx
				char2 = array[i++];
				out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
				break;
			case 14:
				// 1110 xxxx  10xx xxxx  10xx xxxx
				char2 = array[i++];
				char3 = array[i++];
				out += String.fromCharCode(((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0));
				break;
		}
	}

	return out;
}

function readEXIFData(file, start) {
	if (getStringFromDB(file, start, 4) != "Exif") {
		if (debug) logger.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
		return false;
	}

	var bigEnd,
		tags,
		tag,
		exifData,
		gpsData,
		tiffOffset = start + 6;

	// test for TIFF validity and endianness
	if (file.getUint16(tiffOffset) == 0x4949) {
		bigEnd = false;
	} else if (file.getUint16(tiffOffset) == 0x4d4d) {
		bigEnd = true;
	} else {
		if (debug) logger.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
		return false;
	}

	if (file.getUint16(tiffOffset + 2, !bigEnd) != 0x002a) {
		if (debug) logger.log("Not valid TIFF data! (no 0x002A)");
		return false;
	}

	var firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);

	if (firstIFDOffset < 0x00000008) {
		if (debug) logger.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset + 4, !bigEnd));
		return false;
	}

	tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

	if (tags.ExifIFDPointer) {
		exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
		for (tag in exifData) {
			switch (tag) {
				case "LightSource":
				case "Flash":
				case "MeteringMode":
				case "ExposureProgram":
				case "SensingMethod":
				case "SceneCaptureType":
				case "SceneType":
				case "CustomRendered":
				case "WhiteBalance":
				case "GainControl":
				case "Contrast":
				case "Saturation":
				case "Sharpness":
				case "SubjectDistanceRange":
				case "FileSource":
					exifData[tag] = StringValues[tag][exifData[tag]];
					break;

				case "ExifVersion":
				case "FlashpixVersion":
					exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
					break;

				case "ComponentsConfiguration":
					exifData[tag] =
						StringValues.Components[exifData[tag][0]] +
						StringValues.Components[exifData[tag][1]] +
						StringValues.Components[exifData[tag][2]] +
						StringValues.Components[exifData[tag][3]];
					break;
			}
			tags[tag] = exifData[tag];
		}
	}

	if (tags.GPSInfoIFDPointer) {
		gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
		for (tag in gpsData) {
			if (tag == "GPSVersionID") {
				try {
					gpsData[tag] = gpsData[tag][0] + "." + gpsData[tag][1] + "." + gpsData[tag][2] + "." + gpsData[tag][3];
				} catch {
					// Prevent uncaught error
				}
			}
			tags[tag] = gpsData[tag];
		}
	}

	// extract thumbnail
	tags["thumbnail"] = readThumbnailImage(file, tiffOffset, firstIFDOffset, bigEnd);

	return tags;
}

function findXMPinJPEG(file) {
	if (!("DOMParser" in self)) {
		// logger.warn('XML parsing not supported without DOMParser');
		return;
	}
	var dataView = new DataView(file);

	if (debug) logger.log("Got file of length " + file.byteLength);
	if (dataView.getUint8(0) != 0xff || dataView.getUint8(1) != 0xd8) {
		if (debug) logger.log("Not a valid JPEG");
		return false; // not a valid jpeg
	}

	var offset = 2,
		length = file.byteLength,
		dom = new DOMParser();

	while (offset < length - 4) {
		if (getStringFromDB(dataView, offset, 4) == "http") {
			var startOffset = offset - 1;
			var sectionLength = dataView.getUint16(offset - 2) - 1;
			var xmpString = getStringFromDB(dataView, startOffset, sectionLength);
			var xmpEndIndex = xmpString.indexOf("xmpmeta>") + 8;
			xmpString = xmpString.substring(xmpString.indexOf("<x:xmpmeta"), xmpEndIndex);

			var indexOfXmp = xmpString.indexOf("x:xmpmeta") + 10;
			//Many custom written programs embed xmp/xml without any namespace. Following are some of them.
			//Without these namespaces, XML is thought to be invalid by parsers
			xmpString =
				xmpString.slice(0, indexOfXmp) +
				'xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/" ' +
				'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
				'xmlns:tiff="http://ns.adobe.com/tiff/1.0/" ' +
				'xmlns:plus="http://schemas.android.com/apk/lib/com.google.android.gms.plus" ' +
				'xmlns:ext="http://www.gettyimages.com/xsltExtension/1.0" ' +
				'xmlns:exif="http://ns.adobe.com/exif/1.0/" ' +
				'xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" ' +
				'xmlns:stRef="http://ns.adobe.com/xap/1.0/sType/ResourceRef#" ' +
				'xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/" ' +
				'xmlns:xapGImg="http://ns.adobe.com/xap/1.0/g/img/" ' +
				'xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" ' +
				xmpString.slice(indexOfXmp);

			var domDocument = dom.parseFromString(xmpString, "text/xml");
			return xml2Object(domDocument);
		} else {
			offset++;
		}
	}
}

function xml2json(xml) {
	var json = {};

	if (xml.nodeType == 1) {
		// element node
		if (xml.attributes.length > 0) {
			json["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				json["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) {
		// text node
		return xml.nodeValue;
	}

	// deal with children
	if (xml.hasChildNodes()) {
		for (var i = 0; i < xml.childNodes.length; i++) {
			var child = xml.childNodes.item(i);
			var nodeName = child.nodeName;
			if (json[nodeName] == null) {
				json[nodeName] = xml2json(child);
			} else {
				if (json[nodeName].push == null) {
					var old = json[nodeName];
					json[nodeName] = [];
					json[nodeName].push(old);
				}
				json[nodeName].push(xml2json(child));
			}
		}
	}

	return json;
}

function xml2Object(xml) {
	try {
		var obj = {};
		if (xml.children.length > 0) {
			for (var i = 0; i < xml.children.length; i++) {
				var item = xml.children.item(i);
				var attributes = item.attributes;
				for (var idx in attributes) {
					var itemAtt = attributes[idx];
					var dataKey = itemAtt.nodeName;
					var dataValue = itemAtt.nodeValue;

					if (dataKey !== undefined) {
						obj[dataKey] = dataValue;
					}
				}
				var nodeName = item.nodeName;

				if (typeof obj[nodeName] == "undefined") {
					obj[nodeName] = xml2json(item);
				} else {
					if (typeof obj[nodeName].push == "undefined") {
						var old = obj[nodeName];

						obj[nodeName] = [];
						obj[nodeName].push(old);
					}
					obj[nodeName].push(xml2json(item));
				}
			}
		} else {
			obj = xml.textContent;
		}
		return obj;
	} catch (e) {
		logger.log(e.message);
	}
}

EXIF.enableXmp = function () {
	EXIF.isXmpEnabled = true;
};

EXIF.disableXmp = function () {
	EXIF.isXmpEnabled = false;
};

EXIF.getData = function (img, callback) {
	if (
		((self.Image && img instanceof self.Image) || (self.HTMLImageElement && img instanceof self.HTMLImageElement)) &&
		!img.complete
	)
		return false;

	if (!imageHasData(img)) {
		getImageData(img, callback);
	} else {
		if (callback) {
			callback.call(img);
		}
	}
	return true;
};

EXIF.getTag = function (img, tag) {
	if (!imageHasData(img)) return;
	return img.exifdata[tag];
};

EXIF.getIptcTag = function (img, tag) {
	if (!imageHasData(img)) return;
	return img.iptcdata[tag];
};

EXIF.getAllTags = function (img) {
	if (!imageHasData(img)) return {};
	var a,
		data = img.exifdata,
		tags = {};
	for (a in data) {
		if (Object.prototype.hasOwnProperty.call(data, a)) {
			tags[a] = data[a];
		}
	}
	return tags;
};

EXIF.getAllIptcTags = function (img) {
	if (!imageHasData(img)) return {};
	var a,
		data = img.iptcdata,
		tags = {};
	for (a in data) {
		if (Object.prototype.hasOwnProperty.call(data, a)) {
			tags[a] = data[a];
		}
	}
	return tags;
};

//***************************************************************************
// Written by Stanko Milosev
// Published: 30 January 2015
// http://www.milosev.com/425-reading-exif-meta-data-from-jpeg-image-files.html
// gps conversion for google map use
EXIF.ConvertDMSToDD = function (degrees, minutes, seconds, direction) {
	var dd = degrees + minutes / 60 + seconds / (60 * 60);
	if (direction == "S" || direction == "W") {
		dd = dd * -1;
	} // Don't do anything for N or E
	return dd;
};
//*******************************************************************************

EXIF.pretty = function (img) {
	if (!imageHasData(img)) return "";
	var a,
		data = img.exifdata,
		strPretty = "";
	for (a in data) {
		if (Object.prototype.hasOwnProperty.call(data, a)) {
			if (typeof data[a] == "object") {
				if (data[a] instanceof Number) {
					strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
				} else {
					strPretty += a + " : [" + data[a].length + " values]\r\n";
				}
			} else {
				strPretty += a + " : " + data[a] + "\r\n";
			}
		}
	}
	return strPretty;
};

EXIF.readFromBinaryFile = function (file) {
	return findEXIFinJPEG(file);
};
