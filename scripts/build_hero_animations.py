"""Build expressive, high-fidelity animation loops for all 3 heroes and 3 levels.

Features REAL generated keyframes and animation flow:
1. Prisma Solar (Mentor):
   - Idle: Stance -> Breath rise & crystal flare -> Settle
   - Attack: Wind-up vortex raise -> Radiant beam thrust -> Follow-through -> Recovery
   - Evolution: Lv1 base, Lv2 orbital crystals, Lv3 radiant crown blades

2. Véu de Aurora (Benzedeira):
   - Idle: Serene rest -> Breath & billowing jade ribbons -> Gentle settle
   - Attack: Spiraling ribbon coil wind-up -> Expansive crescent wave slash -> Sweep -> Graceful recovery
   - Evolution: Lv1 dual ribbons, Lv2 quad ribbons, Lv3 celestial crown & multi-ribbons

3. Núcleo de Brasa (Pajé):
   - Idle: Basalt rest -> Molten furnace flare & fissure sparks -> Settle
   - Attack: Heavy fist wind-up with volcanic flames -> Ground-shattering magma punch -> Dissipation tremor -> Basalt recovery
   - Evolution: Lv1 stocky golem, Lv2 molten collar, Lv3 plasma crest & superheated fissures

Generates:
- 63 high-res individual PNG frames in frontend/public/assets/astral/heroes/
- 9 unified 3584x512 spritesheets for Phaser 3
- animations_manifest.json
"""
import json
import math
import os
import shutil
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SOURCE_FLOWS_DIR = ROOT / 'public/guardian-art/source_flows'
SRC_DIR = ROOT / 'frontend/public/assets/astral'
OUT_HEROES_DIR = SRC_DIR / 'heroes'

TARGET_FRAME_SIZE = 512
BASELINE_Y = 448  # Consistent ground anchor line

HERO_CONFIG = {
    'mentor': {
        'name': 'Prisma Solar',
        'color': (246, 224, 94),     # #F6E05E Gold
        'accent': (255, 252, 215),   # Brilliant White-Gold
        'secondary': (220, 180, 50),
    },
    'benzedeira': {
        'name': 'Véu de Aurora',
        'color': (72, 187, 120),     # #48BB78 Jade
        'accent': (79, 209, 197),    # #4FD1C5 Cyan Mint
        'secondary': (40, 150, 90),
    },
    'paje': {
        'name': 'Núcleo de Brasa',
        'color': (237, 137, 54),     # #ED8936 Basalt Amber
        'accent': (255, 210, 70),    # Fiery Gold
        'secondary': (190, 70, 20),   # Deep Magma Red
    }
}


def extract_alpha_clean(bgr, threshold=10, feather=16):
    """Extract alpha from pure white background with soft defringing."""
    diff = 255.0 - np.min(bgr, axis=2).astype(np.float32)
    alpha = np.clip((diff - threshold) * (255.0 / feather), 0, 255).astype(np.uint8)

    # Defringe: remove white color bleed from foreground edges
    alpha_norm = (alpha.astype(np.float32) / 255.0)[:, :, np.newaxis]
    bgr_f = bgr.astype(np.float32)
    fg = np.clip((bgr_f - (1.0 - alpha_norm) * 255.0) / np.maximum(alpha_norm, 0.001), 0, 255).astype(np.uint8)

    b, g, r = cv2.split(fg)
    rgba = cv2.merge([r, g, b, alpha])
    return Image.fromarray(rgba)


def place_flow_frame(rgba_crop, scale, ground_y_crop, baseline_y=BASELINE_Y, center_x=256, y_offset=0):
    """Place flow frame on standard 512x512 canvas anchored by ground baseline with unified scale."""
    w, h = rgba_crop.size
    new_w = max(1, int(round(w * scale)))
    new_h = max(1, int(round(h * scale)))
    resized = rgba_crop.resize((new_w, new_h), Image.Resampling.LANCZOS)

    arr = np.array(resized)
    ys, xs = np.where(arr[:, :, 3] > 30)
    fg_cx = (xs.min() + xs.max()) / 2.0 if len(xs) > 0 else new_w / 2.0

    pos_x = int(round(center_x - fg_cx))
    pos_y = int(round((baseline_y - y_offset) - ground_y_crop * scale))

    canvas = Image.new('RGBA', (TARGET_FRAME_SIZE, TARGET_FRAME_SIZE), (0, 0, 0, 0))
    canvas.alpha_composite(resized, (pos_x, pos_y))
    return canvas


def add_mentor_evolution_accents(frame, level):
    """Add level 2/3 progression features: orbital crystals, radiant crown."""
    if level == 1:
        return frame

    res = frame.copy()
    draw = ImageDraw.Draw(res)
    cfg = HERO_CONFIG['mentor']
    color, accent = cfg['color'], cfg['accent']

    cx, cy = 256, 210

    if level >= 2:
        # Orbital crystal shards
        count = 3 if level == 2 else 6
        rx, ry = 95, 35
        for i in range(count):
            theta = (2 * math.pi * i) / count
            px = int(cx + rx * math.cos(theta))
            py = int(cy + ry * math.sin(theta))
            depth = math.sin(theta)
            shard_w = 8 if level == 2 else 11
            shard_h = 20 if level == 2 else 26
            col = accent if depth > 0 else color
            pts = [(px, py - shard_h//2), (px + shard_w//2, py), (px, py + shard_h//2), (px - shard_w//2, py)]
            draw.polygon(pts, fill=(*col, 220), outline=(255, 255, 255, 230))

    if level == 3:
        # Radiant crown rays behind head
        head_cy = 150
        for angle in [-40, -20, 0, 20, 40]:
            rad = math.radians(angle - 90)
            x1 = int(cx + 30 * math.cos(rad))
            y1 = int(head_cy + 30 * math.sin(rad))
            x2 = int(cx + 65 * math.cos(rad))
            y2 = int(head_cy + 65 * math.sin(rad))
            draw.line([(x1, y1), (x2, y2)], fill=(*accent, 220), width=3)

    return res


def add_benzedeira_evolution_accents(frame, level):
    """Add level 2/3 progression features: extra aurora waves, stardust crown."""
    if level == 1:
        return frame

    res = frame.copy()
    draw = ImageDraw.Draw(res)
    cfg = HERO_CONFIG['benzedeira']
    color, accent = cfg['color'], cfg['accent']

    cx, cy = 256, 220

    if level >= 2:
        # Extra trailing aurora light arcs
        draw.arc([cx - 110, cy - 60, cx + 110, cy + 60], start=-30, end=70, fill=(*accent, 160), width=5)
        draw.arc([cx - 100, cy - 50, cx + 100, cy + 50], start=110, end=210, fill=(*color, 160), width=5)

    if level == 3:
        # Stardust halo
        head_cy = 160
        for i in range(8):
            ang = (i / 8) * math.pi * 2
            px = int(cx + 50 * math.cos(ang))
            py = int(head_cy + 40 * math.sin(ang))
            draw.ellipse([px - 2, py - 2, px + 2, py + 2], fill=(255, 255, 255, 240))

    return res


def add_paje_evolution_accents(frame, level):
    """Add level 2/3 progression features: molten collar, plasma spikes."""
    if level == 1:
        return frame

    res = frame.copy()
    draw = ImageDraw.Draw(res)
    cfg = HERO_CONFIG['paje']
    color, accent, secondary = cfg['color'], cfg['accent'], cfg['secondary']

    cx, cy = 256, 260

    if level >= 2:
        # Molten collar around core
        draw.ellipse([cx - 30, cy - 30, cx + 30, cy + 30], outline=(*accent, 200), width=3)
        # Embers
        for ox, oy in [(-35, -40), (35, -45), (-15, -70), (20, -75)]:
            draw.ellipse([cx + ox - 2, cy + oy - 2, cx + ox + 2, cy + oy + 2], fill=(255, 235, 120, 240))

    if level == 3:
        # Plasma arcs rising behind shoulders
        draw.arc([cx - 80, cy - 110, cx - 30, cy - 30], start=-80, end=30, fill=(*accent, 220), width=4)
        draw.arc([cx + 30, cy - 110, cx + 80, cy - 30], start=150, end=260, fill=(*accent, 220), width=4)

    return res


def process_all_heroes():
    OUT_HEROES_DIR.mkdir(parents=True, exist_ok=True)
    manifest = {'heroes': {}}

    print('=== Processing High-Fidelity Animation Flows ===')

    # 1. PRISMA SOLAR (MENTOR)
    print('Processing Prisma Solar...')
    m_idle_bgr = cv2.imread(str(SOURCE_FLOWS_DIR / 'mentor_idle_flow_1791594433917.jpg'))
    m_scale_idle = 380.0 / 640.0
    m_ground_idle = 712
    m_idle_1 = place_flow_frame(extract_alpha_clean(m_idle_bgr[:, :460]), m_scale_idle, m_ground_idle)
    m_idle_2 = place_flow_frame(extract_alpha_clean(m_idle_bgr[:, 460:910]), m_scale_idle, m_ground_idle)
    m_idle_3 = place_flow_frame(extract_alpha_clean(m_idle_bgr[:, 910:]), m_scale_idle, m_ground_idle)

    m_sheet_bgr = cv2.imread(str(SOURCE_FLOWS_DIR / 'mentor_spritesheet_flow_1791594328991.jpg'))
    m_scale_atk = 0.77
    m_ground_atk = 642
    m_atk_1 = place_flow_frame(extract_alpha_clean(m_sheet_bgr[:, :340]), m_scale_atk, m_ground_atk)
    m_atk_2 = place_flow_frame(extract_alpha_clean(m_sheet_bgr[:, 340:625]), m_scale_atk, m_ground_atk)
    m_atk_3 = place_flow_frame(extract_alpha_clean(m_sheet_bgr[:, 625:975]), m_scale_atk, m_ground_atk)
    m_atk_4 = place_flow_frame(extract_alpha_clean(m_sheet_bgr[:, 975:]), m_scale_atk, m_ground_atk)

    mentor_base_frames = {
        'idle_1': m_idle_1, 'idle_2': m_idle_2, 'idle_3': m_idle_3,
        'atk_1': m_atk_1, 'atk_2': m_atk_2, 'atk_3': m_atk_3, 'atk_4': m_atk_4,
    }

    # 2. VÉU DE AURORA (BENZEDEIRA)
    print('Processing Véu de Aurora...')
    b_idle_bgr = cv2.imread(str(SOURCE_FLOWS_DIR / 'benzedeira_idle_flow_1791594462240.jpg'))
    b_scale_idle = 380.0 / 618.0
    b_ground_idle = 694
    b_idle_1 = place_flow_frame(extract_alpha_clean(b_idle_bgr[:, :400]), b_scale_idle, b_ground_idle)
    b_idle_2 = place_flow_frame(extract_alpha_clean(b_idle_bgr[:, 400:910]), b_scale_idle, b_ground_idle)
    b_idle_3 = place_flow_frame(extract_alpha_clean(b_idle_bgr[:, 910:]), b_scale_idle, b_ground_idle)

    b_sheet_bgr = cv2.imread(str(SOURCE_FLOWS_DIR / 'benzedeira_spritesheet_flow_1791594383730.jpg'))
    b_scale_atk = 0.748
    b_ground_atk = 638
    b_atk_1 = place_flow_frame(extract_alpha_clean(b_sheet_bgr[:, :340]), b_scale_atk, b_ground_atk)
    b_atk_2 = place_flow_frame(extract_alpha_clean(b_sheet_bgr[:, 340:690]), b_scale_atk, b_ground_atk)
    b_atk_3 = place_flow_frame(extract_alpha_clean(b_sheet_bgr[:, 690:1090]), b_scale_atk, b_ground_atk)
    b_atk_4 = place_flow_frame(extract_alpha_clean(b_sheet_bgr[:, 1090:]), b_scale_atk, b_ground_atk)

    benzedeira_base_frames = {
        'idle_1': b_idle_1, 'idle_2': b_idle_2, 'idle_3': b_idle_3,
        'atk_1': b_atk_1, 'atk_2': b_atk_2, 'atk_3': b_atk_3, 'atk_4': b_atk_4,
    }

    # 3. NÚCLEO DE BRASA (PAJÉ)
    print('Processing Núcleo de Brasa...')
    p_idle_bgr = cv2.imread(str(SOURCE_FLOWS_DIR / 'paje_idle_flow_1791594491617.jpg'))
    p_scale_idle = 365.0 / 452.0
    p_ground_idle = 613
    p_idle_1 = place_flow_frame(extract_alpha_clean(p_idle_bgr[:, :470]), p_scale_idle, p_ground_idle)
    p_idle_2 = place_flow_frame(extract_alpha_clean(p_idle_bgr[:, 470:910]), p_scale_idle, p_ground_idle)
    p_idle_3 = place_flow_frame(extract_alpha_clean(p_idle_bgr[:, 910:]), p_scale_idle, p_ground_idle)

    p_sheet_bgr = cv2.imread(str(SOURCE_FLOWS_DIR / 'paje_spritesheet_flow_1791594407933.jpg'))
    p_scale_atk = 0.96
    p_ground_atk = 572
    p_atk_1 = place_flow_frame(extract_alpha_clean(p_sheet_bgr[:, :350]), p_scale_atk, p_ground_atk)
    p_atk_2 = place_flow_frame(extract_alpha_clean(p_sheet_bgr[:, 350:660]), p_scale_atk, p_ground_atk)
    p_atk_3 = place_flow_frame(extract_alpha_clean(p_sheet_bgr[:, 660:1040]), p_scale_atk, p_ground_atk)
    p_atk_4 = place_flow_frame(extract_alpha_clean(p_sheet_bgr[:, 1040:]), p_scale_atk, p_ground_atk)

    paje_base_frames = {
        'idle_1': p_idle_1, 'idle_2': p_idle_2, 'idle_3': p_idle_3,
        'atk_1': p_atk_1, 'atk_2': p_atk_2, 'atk_3': p_atk_3, 'atk_4': p_atk_4,
    }

    all_heroes = [
        ('mentor', HERO_CONFIG['mentor']['name'], mentor_base_frames, add_mentor_evolution_accents),
        ('benzedeira', HERO_CONFIG['benzedeira']['name'], benzedeira_base_frames, add_benzedeira_evolution_accents),
        ('paje', HERO_CONFIG['paje']['name'], paje_base_frames, add_paje_evolution_accents),
    ]

    for hero_id, hero_name, base_frames, accent_fn in all_heroes:
        manifest['heroes'][hero_id] = {'name': hero_name, 'levels': {}}

        for level in (1, 2, 3):
            # 7 frames list
            frame_keys = ['idle_1', 'idle_2', 'idle_3', 'atk_1', 'atk_2', 'atk_3', 'atk_4']
            processed_frames = []
            files_dict = {}

            # Create 3584x512 spritesheet
            spritesheet = Image.new('RGBA', (TARGET_FRAME_SIZE * 7, TARGET_FRAME_SIZE), (0, 0, 0, 0))

            for idx, fkey in enumerate(frame_keys):
                frame = base_frames[fkey]
                final_frame = accent_fn(frame, level)
                processed_frames.append(final_frame)

                # Save individual frame PNG
                filename = f'{hero_id}_lvl{level}_{fkey}.png'
                out_path = OUT_HEROES_DIR / filename
                final_frame.save(out_path, format='PNG', optimize=True)
                files_dict[fkey] = f'assets/astral/heroes/{filename}'

                # Paste into spritesheet
                spritesheet.alpha_composite(final_frame, (idx * TARGET_FRAME_SIZE, 0))

            # Save spritesheet in both heroes/ and astral/
            sheet_filename = f'{hero_id}_lvl{level}_sheet.png'
            sheet_heroes_path = OUT_HEROES_DIR / sheet_filename
            sheet_astral_path = SRC_DIR / sheet_filename

            spritesheet.save(sheet_heroes_path, format='PNG', optimize=True)
            shutil.copy2(sheet_heroes_path, sheet_astral_path)
            print(f'Saved {sheet_filename} ({sheet_heroes_path.stat().st_size // 1024} KB)')

            manifest['heroes'][hero_id]['levels'][str(level)] = {
                'spritesheet': f'assets/astral/heroes/{sheet_filename}',
                'frames_count': 7,
                'idle_frames': [0, 1, 2],
                'attack_frames': [3, 4, 5, 6],
                'frame_width': 512,
                'frame_height': 512,
                'individual_files': files_dict,
            }

    # Save manifest
    manifest_path = OUT_HEROES_DIR / 'animations_manifest.json'
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding='utf-8')
    print('Updated animations_manifest.json')


if __name__ == '__main__':
    process_all_heroes()
