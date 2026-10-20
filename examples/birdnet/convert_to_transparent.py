#!/usr/bin/env python3
"""
GrabCut AI-Matting & Alpha Defringing Utility for WallPanel BirdNET Artwork.

Converts solid white-background bird plates (JPEG/PNG) into pristine 32-bit RGBA PNGs
with anti-aliased transparency, removing internal white background cavities
(e.g., between legs, tail, and branches) while preserving 100% bright white plumage,
eliminating outer white fringing / halos, and suppressing stray watercolor dust.

Requires:
    opencv-python, numpy, pillow

Usage:
    python3 convert_to_transparent.py [source_dir] [dest_dir]
"""

import sys
import os
import time
import json
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor
import cv2
import numpy as np
from PIL import Image, ImageFilter

def process_single_plate(args):
    img_path, out_path, iterations = args
    try:
        t0 = time.time()
        img = cv2.imread(str(img_path))
        if img is None:
            return img_path.name, False, f"Could not open image: {img_path}", 0
        h, w, _ = img.shape

        # 1. GrabCut segmentation using GMM background/foreground modeling
        mask = np.zeros((h, w), np.uint8)
        bgdModel = np.zeros((1, 65), np.float64)
        fgdModel = np.zeros((1, 65), np.float64)
        rect = (12, 12, w - 24, h - 24)

        cv2.grabCut(img, mask, rect, bgdModel, fgdModel, iterations, cv2.GC_INIT_WITH_RECT)
        fg_mask = np.where((mask == 1) | (mask == 3), 255, 0).astype("uint8")

        # 2. Morphological smoothing to close micro-gaps
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_CLOSE, kernel)

        # 3. Clean stray low-opacity noise flecks (< 50 pixels)
        num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(fg_mask)
        for i in range(1, num_labels):
            if stats[i, cv2.CC_STAT_AREA] < 50:
                fg_mask[labels == i] = 0

        # 4. Soft Gaussian edge antialiasing
        alpha_pil = Image.fromarray(fg_mask).filter(ImageFilter.GaussianBlur(radius=0.75))
        alpha = np.array(alpha_pil, dtype=float) / 255.0

        # Clip residual dust noise
        alpha[alpha < 0.04] = 0.0

        # 5. Color defringing / un-multiplying white paper from transitional boundary
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB).astype(float)
        edge_mask = (alpha > 0.04) & (alpha < 0.98)

        for y, x in np.argwhere(edge_mask):
            a = alpha[y, x]
            c = img_rgb[y, x]
            fg = (c - (1.0 - a) * 255.0) / a
            img_rgb[y, x] = np.clip(fg, 0, 255)

        rgba = np.zeros((h, w, 4), dtype=np.uint8)
        rgba[:, :, :3] = np.clip(img_rgb, 0, 255).astype(np.uint8)
        rgba[:, :, 3] = (alpha * 255.0).astype(np.uint8)

        result = Image.fromarray(rgba)
        result.save(str(out_path), "PNG", optimize=True)
        return img_path.name, True, None, time.time() - t0
    except Exception as e:
        return img_path.name, False, str(e), 0

def main():
    src_dir = Path(sys.argv[1] if len(sys.argv) > 1 else "/home/hamish/Downloads/birds")
    dst_dir = Path(sys.argv[2] if len(sys.argv) > 2 else src_dir)

    if not src_dir.exists():
        print(f"Error: Source directory {src_dir} does not exist.")
        sys.exit(1)

    dst_dir.mkdir(parents=True, exist_ok=True)
    images = sorted(list(src_dir.glob("*.jpeg")) + list(src_dir.glob("*.jpg")))

    print(f"============================================================")
    print(f"WallPanel BirdNET GrabCut Matting & Alpha Defringing Utility")
    print(f"Target: {len(images)} images in {src_dir}")
    print(f"Destination: {dst_dir}")
    print(f"Workers: {os.cpu_count() or 4}")
    print(f"============================================================\n")

    t_start = time.time()
    tasks = [(p, dst_dir / f"{p.stem}.png", 4) for p in images]

    processed = 0
    with ProcessPoolExecutor() as executor:
        for i, (name, success, err, dur) in enumerate(executor.map(process_single_plate, tasks), 1):
            if success:
                processed += 1
                print(f"[{i}/{len(images)}] Converted: {name} ({dur:.2f}s)")
            else:
                print(f"[{i}/{len(images)}] ERROR on {name}: {err}")

    # Update plates.json if present
    plates_json_path = dst_dir / "plates.json"
    if plates_json_path.exists():
        try:
            with open(plates_json_path, "r", encoding="utf-8") as f:
                plates_data = json.load(f)
            updated_count = 0
            if "plates" in plates_data and isinstance(plates_data["plates"], dict):
                for sci, entry in plates_data["plates"].items():
                    if isinstance(entry, dict) and "file" in entry:
                        old_file = entry["file"]
                        stem = Path(old_file).stem
                        png_name = f"{stem}.png"
                        if (dst_dir / png_name).exists():
                            entry["file"] = png_name
                            updated_count += 1
            with open(plates_json_path, "w", encoding="utf-8") as f:
                json.dump(plates_data, f, indent=2)
            print(f"\nUpdated {updated_count} entries in {plates_json_path} to point to .png files.")
        except Exception as e:
            print(f"Notice: Could not auto-update plates.json: {e}")

    elapsed = time.time() - t_start
    print(f"\nCompleted in {elapsed:.1f}s. Generated {processed} transparent PNGs with de-fringed edges and cleared background cavities.")

if __name__ == "__main__":
    main()
