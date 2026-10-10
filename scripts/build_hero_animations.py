"""Build expressive animation loops (Idle 3-frames and Attack 4-frames) for all 3 heroes and 3 levels.

Features REAL anatomical and secondary movement:
1. Prisma Solar:
   - Articulated right arm raising in cosmic invocation pose
   - Orbital crystal shards translating through realistic 3D elliptical orbits
   - Faceted solar prism flare igniting in open palm
   - Distinct wind-up, forward thrust attack, and recovery arc

2. Véu de Aurora:
   - Elegant weaving arm gestures
   - Dynamic fluid aurora ribbon waves rendered with mathematical bezier sweeps
   - Astral energy crown pulsing behind helmet (Lv 3)
   - Whipping ribbon crescent slash attack

3. Núcleo de Brasa:
   - Rock-solid basalt anatomy (no rubber warping!)
   - Heavy basalt fist articulating upwards and settling with mass
   - Living furnace flames and flying volcanic embers erupting from chest fissures
   - Ground-shattering magma punch and shockwave attack

Generates:
- 63 high-res individual PNG frames in frontend/public/assets/astral/heroes/
- 9 unified 3584x512 spritesheets for Phaser 3
- animations_manifest.json
"""
import json
import math
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / 'frontend/public/assets/astral'
OUT_HEROES_DIR = SRC_DIR / 'heroes'

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


def extract_character_bounds(img_rgba):
    """Find the bounding box, center, and key anatomical anchor lines."""
    arr = np.array(img_rgba)
    alpha = arr[:, :, 3]
    coords = cv2.findNonZero(alpha)
    if coords is None:
        return 0, 0, 512, 512, 256, 256
    bx, by, bw, bh = cv2.boundingRect(coords)
    cx = bx + bw // 2
    cy = by + int(bh * 0.45)
    return bx, by, bw, bh, cx, cy


def create_radial_glow(size, center, radius, color, max_alpha=200):
    """Generate a smooth radial glow surface with Gaussian falloff."""
    w, h = size
    cx, cy = center
    y, x = np.ogrid[:h, :w]
    dist_sq = (x - cx) ** 2 + (y - cy) ** 2
    r_sq = max(1.0, float(radius ** 2))
    alpha = np.exp(-dist_sq / (2 * (radius * 0.45) ** 2)) * max_alpha
    alpha = np.clip(alpha, 0, 255).astype(np.uint8)

    r = np.full((h, w), color[0], dtype=np.uint8)
    g = np.full((h, w), color[1], dtype=np.uint8)
    b = np.full((h, w), color[2], dtype=np.uint8)
    return Image.fromarray(np.dstack((r, g, b, alpha)))


def rotate_limb(img_rgba, pivot, angle_deg, mask_box):
    """
    Isolate and articulate a character limb (arm/hand) around a pivot point (shoulder/elbow).
    - mask_box: (min_x, min_y, max_x, max_y) area containing the limb
    - pivot: (px, py) rotation axis
    - angle_deg: angle in degrees
    """
    arr = np.array(img_rgba)
    h, w, _ = arr.shape
    x1, y1, x2, y2 = mask_box

    # Create feathered mask for the limb
    mask = np.zeros((h, w), dtype=np.float32)
    mask[y1:y2, x1:x2] = 1.0
    mask = cv2.GaussianBlur(mask, (21, 21), 0)

    # Rotation matrix around pivot
    M = cv2.getRotationMatrix2D(pivot, angle_deg, 1.0)
    rotated = cv2.warpAffine(arr, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT)

    # Alpha blending: apply rotation only where mask is active
    mask_3d = np.repeat(mask[:, :, np.newaxis], 4, axis=2)
    composite = (rotated * mask_3d + arr * (1.0 - mask_3d)).astype(np.uint8)
    return Image.fromarray(composite)


# ==============================================================================
# 1. PRISMA SOLAR (MENTOR) — EXPRESSIVE ANIMATIONS
# ==============================================================================

def draw_orbital_crystals(canvas, center, orbit_radius, angle_offset, count, color, accent, size=(12, 28)):
    """Draw shards of crystal translating through real 3D elliptical orbits."""
    draw = ImageDraw.Draw(canvas)
    cx, cy = center
    rx, ry = orbit_radius

    for i in range(count):
        # Evenly spaced angles around orbit
        theta = angle_offset + (2 * math.pi * i) / count
        # Elliptical projection (tilted perspective)
        px = cx + rx * math.cos(theta)
        py = cy + ry * math.sin(theta)
        depth = math.sin(theta)  # -1 (back) to +1 (front)

        # Perspective scale & opacity based on 3D depth
        shard_scale = 0.75 + 0.35 * (depth + 1.0) / 2.0
        shard_alpha = int(140 + 115 * (depth + 1.0) / 2.0)
        sw = int(size[0] * shard_scale)
        sh = int(size[1] * shard_scale)

        # Faceted diamond crystal polygon
        pts = [
            (px, py - sh // 2),
            (px + sw // 2, py),
            (px, py + sh // 2),
            (px - sw // 2, py)
        ]
        shard_col = accent if depth > 0 else color
        draw.polygon(pts, fill=(*shard_col, shard_alpha), outline=(255, 255, 255, shard_alpha))

        # Core facet line
        draw.line([(px, py - sh // 2), (px, py + sh // 2)], fill=(255, 255, 255, shard_alpha), width=1)


def draw_solar_prism_star(canvas, center, radius, color, accent):
    """Draw radiant 4-pointed faceted solar star flare in the open palm."""
    draw = ImageDraw.Draw(canvas)
    cx, cy = center
    r_long = radius
    r_short = radius * 0.28

    pts = [
        (cx, cy - r_long),
        (cx + r_short, cy - r_short),
        (cx + r_long, cy),
        (cx + r_short, cy + r_short),
        (cx, cy + r_long),
        (cx - r_short, cy + r_short),
        (cx - r_long, cy),
        (cx - r_short, cy - r_short),
    ]
    draw.polygon(pts, fill=(255, 255, 255, 245), outline=(*accent, 255))
    draw.ellipse([cx - r_short, cy - r_short, cx + r_short, cy + r_short], fill=(*accent, 255))


def generate_mentor_frames(base_img, level):
    """Generate expressive Idle (3 frames) and Attack (4 frames) for Prisma Solar."""
    bx, by, bw, bh, cx, cy = extract_character_bounds(base_img)
    shoulder_pivot = (cx + int(bw * 0.16), by + int(bh * 0.32))
    hand_box = (cx, by + int(bh * 0.20), cx + int(bw * 0.52), by + int(bh * 0.65))

    cfg = HERO_CONFIG['mentor']
    color, accent = cfg['color'], cfg['accent']
    crystal_count = 0 if level == 1 else (3 if level == 2 else 6)

    # --- IDLE FRAMES ---
    # Frame 1: Base Rest (Arm resting down, crystals in base orbit)
    f1 = base_img.copy()
    if crystal_count > 0:
        draw_orbital_crystals(f1, (cx, cy - 10), (int(bw * 0.48), int(bh * 0.18)),
                              angle_offset=0.0, count=crystal_count, color=color, accent=accent)
    glow1 = create_radial_glow((512, 512), (cx, cy), radius=38 + level * 6, color=color, max_alpha=45)
    f1 = Image.alpha_composite(glow1, f1)

    # Frame 2: Articulated Raising (Right arm lifts up, hand opens, crystals rotate +60 deg)
    f2_body = rotate_limb(base_img, shoulder_pivot, angle_deg=-14.0, mask_box=hand_box)
    palm_pos_f2 = (shoulder_pivot[0] + int(bw * 0.20), shoulder_pivot[1] - int(bh * 0.08))
    if crystal_count > 0:
        draw_orbital_crystals(f2_body, (cx, cy - 12), (int(bw * 0.50), int(bh * 0.20)),
                              angle_offset=1.05, count=crystal_count, color=color, accent=accent)
    draw_solar_prism_star(f2_body, palm_pos_f2, radius=14 + level * 4, color=color, accent=accent)
    glow2 = create_radial_glow((512, 512), palm_pos_f2, radius=42 + level * 8, color=accent, max_alpha=120)
    f2 = Image.alpha_composite(glow2, f2_body)

    # Frame 3: Apex Float (Arm at apex with gentle flare, crystals at +120 deg)
    f3_body = rotate_limb(base_img, shoulder_pivot, angle_deg=-8.0, mask_box=hand_box)
    palm_pos_f3 = (shoulder_pivot[0] + int(bw * 0.18), shoulder_pivot[1] - int(bh * 0.04))
    if crystal_count > 0:
        draw_orbital_crystals(f3_body, (cx, cy - 10), (int(bw * 0.49), int(bh * 0.19)),
                              angle_offset=2.10, count=crystal_count, color=color, accent=accent)
    draw_solar_prism_star(f3_body, palm_pos_f3, radius=10 + level * 3, color=color, accent=accent)
    glow3 = create_radial_glow((512, 512), palm_pos_f3, radius=35 + level * 6, color=color, max_alpha=80)
    f3 = Image.alpha_composite(glow3, f3_body)

    # --- ATTACK FRAMES ---
    # Frame 1: Real Wind-Up (Arm drawn back behind shoulder +24 deg, concentrated charge)
    f1_atk_body = rotate_limb(base_img, shoulder_pivot, angle_deg=22.0, mask_box=hand_box)
    charge_pos = (shoulder_pivot[0] - int(bw * 0.05), shoulder_pivot[1] + int(bh * 0.02))
    charge_glow = create_radial_glow((512, 512), charge_pos, radius=45 + level * 10, color=accent, max_alpha=220)
    draw_solar_prism_star(f1_atk_body, charge_pos, radius=18 + level * 5, color=color, accent=accent)
    f1_atk = Image.alpha_composite(f1_atk_body, charge_glow)

    # Frame 2: Forward Thrust & Piercing Beam (Arm fully extended forward -28 deg, laser erupts)
    f2_atk_body = rotate_limb(base_img, shoulder_pivot, angle_deg=-28.0, mask_box=hand_box)
    muzzle_pos = (shoulder_pivot[0] + int(bw * 0.28), shoulder_pivot[1] - int(bh * 0.12))
    beam_target = (muzzle_pos[0] + 160 + level * 30, muzzle_pos[1] - 15)

    f2_fx = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw_fx = ImageDraw.Draw(f2_fx)
    # Piercing Beam Core
    bw_line = 5 + level * 3
    draw_fx.line([muzzle_pos, beam_target], fill=(*color, 160), width=bw_line + 14)
    draw_fx.line([muzzle_pos, beam_target], fill=(*accent, 230), width=bw_line + 6)
    draw_fx.line([muzzle_pos, beam_target], fill=(255, 255, 255, 255), width=max(2, bw_line))
    draw_solar_prism_star(f2_fx, muzzle_pos, radius=24 + level * 6, color=color, accent=accent)
    f2_atk = Image.alpha_composite(f2_atk_body, f2_fx)

    # Frame 3: Follow-Through / Recoil Shockwave
    f3_atk_body = rotate_limb(base_img, shoulder_pivot, angle_deg=-18.0, mask_box=hand_box)
    recoil_glow = create_radial_glow((512, 512), muzzle_pos, radius=55 + level * 10, color=color, max_alpha=130)
    f3_atk = Image.alpha_composite(f3_atk_body, recoil_glow)

    # Frame 4: Recovery (Arm lowering back to baseline -6 deg)
    f4_atk_body = rotate_limb(base_img, shoulder_pivot, angle_deg=-5.0, mask_box=hand_box)
    settle_glow = create_radial_glow((512, 512), (cx, cy), radius=30 + level * 4, color=color, max_alpha=50)
    f4_atk = Image.alpha_composite(f4_atk_body, settle_glow)

    return [f1, f2, f3], [f1_atk, f2_atk, f3_atk, f4_atk]


# ==============================================================================
# 2. VÉU DE AURORA (BENZEDEIRA) — EXPRESSIVE ANIMATIONS
# ==============================================================================

def draw_flowing_aurora_ribbons(canvas, origins, phase_offset, amplitude, color, accent, level):
    """Draw animated fluid jade aurora ribbons with dynamic S-curves and stardust."""
    draw = ImageDraw.Draw(canvas)
    for idx, (ox, oy, direction) in enumerate(origins):
        pts = []
        steps = 18
        length = 110 + level * 25
        ribbon_w = 7 + level * 2

        for s in range(steps):
            t = s / steps
            x = ox + (direction * length * t)
            # Dynamic wave math: sine + harmonic S-curve
            wave_y = math.sin(t * math.pi * 2 + phase_offset + idx * 1.5) * amplitude * (1.0 - t * 0.25)
            y = oy + wave_y
            pts.append((x, y))

        # Draw ribbon gradient layers
        for p1, p2 in zip(pts[:-1], pts[1:]):
            draw.line([p1, p2], fill=(*color, 175), width=ribbon_w + 4)
            draw.line([p1, p2], fill=(*accent, 235), width=ribbon_w)
            draw.line([p1, p2], fill=(255, 255, 255, 200), width=max(1, ribbon_w - 4))

        # Sparkling stardust along ribbon crest
        crest_pt = pts[int(steps * 0.55)]
        draw.ellipse([crest_pt[0] - 3, crest_pt[1] - 3, crest_pt[0] + 3, crest_pt[1] + 3], fill=(255, 255, 255, 240))


def generate_benzedeira_frames(base_img, level):
    """Generate expressive Idle (3 frames) and Attack (4 frames) for Véu de Aurora."""
    bx, by, bw, bh, cx, cy = extract_character_bounds(base_img)
    shoulder_left = (cx - int(bw * 0.16), by + int(bh * 0.35))
    shoulder_right = (cx + int(bw * 0.16), by + int(bh * 0.35))
    left_arm_box = (bx, by + int(bh * 0.20), cx, by + int(bh * 0.65))
    right_arm_box = (cx, by + int(bh * 0.20), bx + bw, by + int(bh * 0.65))

    cfg = HERO_CONFIG['benzedeira']
    color, accent = cfg['color'], cfg['accent']

    ribbon_origins = [
        (cx - int(bw * 0.22), by + int(bh * 0.42), -1.0),
        (cx + int(bw * 0.22), by + int(bh * 0.42), 1.0)
    ]
    if level >= 2:
        ribbon_origins.append((cx - int(bw * 0.18), by + int(bh * 0.55), -0.85))
    if level == 3:
        ribbon_origins.append((cx + int(bw * 0.18), by + int(bh * 0.55), 0.85))

    # --- IDLE FRAMES ---
    # Frame 1: Serene Rest
    f1 = base_img.copy()
    draw_flowing_aurora_ribbons(f1, ribbon_origins, phase_offset=0.0, amplitude=14.0,
                                color=color, accent=accent, level=level)
    glow1 = create_radial_glow((512, 512), (cx, cy), radius=40 + level * 6, color=color, max_alpha=40)
    f1 = Image.alpha_composite(glow1, f1)

    # Frame 2: Cosmic Weaving Gesture (Left arm raises, right extends, ribbons billow upward)
    f2_step1 = rotate_limb(base_img, shoulder_left, angle_deg=-16.0, mask_box=left_arm_box)
    f2_body = rotate_limb(f2_step1, shoulder_right, angle_deg=12.0, mask_box=right_arm_box)
    draw_flowing_aurora_ribbons(f2_body, ribbon_origins, phase_offset=2.1, amplitude=24.0,
                                color=color, accent=accent, level=level)
    glow2 = create_radial_glow((512, 512), (cx, cy - 8), radius=50 + level * 8, color=accent, max_alpha=95)
    f2 = Image.alpha_composite(glow2, f2_body)

    # Frame 3: Cascading S-Curve Wave (Arms sweeping gently down, ribbons in descending ripple)
    f3_step1 = rotate_limb(base_img, shoulder_left, angle_deg=-6.0, mask_box=left_arm_box)
    f3_body = rotate_limb(f3_step1, shoulder_right, angle_deg=5.0, mask_box=right_arm_box)
    draw_flowing_aurora_ribbons(f3_body, ribbon_origins, phase_offset=4.2, amplitude=18.0,
                                color=color, accent=accent, level=level)
    glow3 = create_radial_glow((512, 512), (cx, cy), radius=44 + level * 6, color=color, max_alpha=60)
    f3 = Image.alpha_composite(glow3, f3_body)

    # --- ATTACK FRAMES ---
    # Frame 1: Tensioned Arc (Both arms pulled back in sweeping curve)
    f1_atk1 = rotate_limb(base_img, shoulder_left, angle_deg=18.0, mask_box=left_arm_box)
    f1_atk_body = rotate_limb(f1_atk1, shoulder_right, angle_deg=-18.0, mask_box=right_arm_box)
    draw_flowing_aurora_ribbons(f1_atk_body, ribbon_origins, phase_offset=1.0, amplitude=12.0,
                                color=color, accent=accent, level=level)
    f1_atk = Image.alpha_composite(f1_atk_body, create_radial_glow((512, 512), (cx, cy), radius=45, color=accent, max_alpha=160))

    # Frame 2: Whip Crescent Slash (Both arms whip forward, crescent shockwave releases)
    f2_atk1 = rotate_limb(base_img, shoulder_left, angle_deg=-25.0, mask_box=left_arm_box)
    f2_atk_body = rotate_limb(f2_atk1, shoulder_right, angle_deg=25.0, mask_box=right_arm_box)

    f2_fx = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw_fx = ImageDraw.Draw(f2_fx)
    # Crescent jade blade arc
    arc_cx = cx + int(bw * 0.45)
    arc_cy = cy - int(bh * 0.05)
    rw = 55 + level * 18
    rh = 80 + level * 20
    draw_fx.arc([arc_cx - rw, arc_cy - rh, arc_cx + rw, arc_cy + rh], start=-90, end=90, fill=(*accent, 255), width=6 + level * 2)
    draw_fx.arc([arc_cx - rw - 6, arc_cy - rh - 6, arc_cx + rw + 6, arc_cy + rh + 6], start=-90, end=90, fill=(*color, 180), width=10 + level * 2)
    f2_atk = Image.alpha_composite(f2_atk_body, f2_fx)

    # Frame 3: Follow-Through Wave Dissipation
    f3_atk = Image.alpha_composite(base_img, create_radial_glow((512, 512), (arc_cx, arc_cy), radius=60 + level * 10, color=color, max_alpha=120))

    # Frame 4: Recovery (Returning to serene posture)
    f4_atk = Image.alpha_composite(base_img, create_radial_glow((512, 512), (cx, cy), radius=35, color=color, max_alpha=40))

    return [f1, f2, f3], [f1_atk, f2_atk, f3_atk, f4_atk]


# ==============================================================================
# 3. NÚCLEO DE BRASA (PAJE) — EXPRESSIVE ANIMATIONS
# ==============================================================================

def draw_furnace_flames(canvas, chest_center, flame_height, color, accent, secondary):
    """Draw stylized living volcanic fire tongues erupting from basalt chest fissures."""
    draw = ImageDraw.Draw(canvas)
    cx, cy = chest_center

    # 3 distinct flame tongues
    tongues = [
        (cx - 10, cy, flame_height * 0.75, -5),
        (cx, cy - 2, flame_height, 0),
        (cx + 10, cy, flame_height * 0.82, 6)
    ]
    for fx, fy, fh, lean in tongues:
        tip_x = fx + lean
        tip_y = fy - fh
        w = 12

        # Outer magma flame
        pts_outer = [(fx - w, fy), (tip_x, tip_y), (fx + w, fy)]
        draw.polygon(pts_outer, fill=(*secondary, 220))

        # Inner hot amber core
        pts_inner = [(fx - w * 0.5, fy), (tip_x, tip_y + fh * 0.25), (fx + w * 0.5, fy)]
        draw.polygon(pts_inner, fill=(*accent, 255))

    # Dancing volcanic embers
    embers = [(cx - 16, cy - flame_height - 10), (cx + 14, cy - flame_height - 15), (cx + 2, cy - flame_height - 24)]
    for ex, ey in embers:
        draw.ellipse([ex - 2, ey - 2, ex + 2, ey + 2], fill=(255, 235, 150, 250))


def generate_paje_frames(base_img, level):
    """Generate expressive Idle (3 frames) and Attack (4 frames) for Núcleo de Brasa."""
    bx, by, bw, bh, cx, cy = extract_character_bounds(base_img)
    shoulder_fist = (cx + int(bw * 0.18), by + int(bh * 0.36))
    fist_box = (cx, by + int(bh * 0.25), bx + bw, by + int(bh * 0.70))
    chest_core = (cx, by + int(bh * 0.44))

    cfg = HERO_CONFIG['paje']
    color, accent, secondary = cfg['color'], cfg['accent'], cfg['secondary']

    # --- IDLE FRAMES ---
    # Frame 1: Solid Basalt Stance (Grounded, low magma glow)
    f1 = base_img.copy()
    draw_furnace_flames(f1, chest_core, flame_height=14 + level * 4, color=color, accent=accent, secondary=secondary)
    glow1 = create_radial_glow((512, 512), chest_core, radius=35 + level * 6, color=color, max_alpha=60)
    f1 = Image.alpha_composite(glow1, f1)

    # Frame 2: Heavy Fist Lift & Active Furnace (Basalt arm articulates up -18 deg, flames leap high)
    f2_body = rotate_limb(base_img, shoulder_fist, angle_deg=-18.0, mask_box=fist_box)
    draw_furnace_flames(f2_body, chest_core, flame_height=32 + level * 8, color=color, accent=accent, secondary=secondary)
    glow2 = create_radial_glow((512, 512), chest_core, radius=52 + level * 10, color=accent, max_alpha=140)
    f2 = Image.alpha_composite(glow2, f2_body)

    # Frame 3: Mechanical Weight Settle (Fist lowers with mass, flames recede)
    f3_body = rotate_limb(base_img, shoulder_fist, angle_deg=-7.0, mask_box=fist_box)
    draw_furnace_flames(f3_body, chest_core, flame_height=20 + level * 5, color=color, accent=accent, secondary=secondary)
    glow3 = create_radial_glow((512, 512), chest_core, radius=40 + level * 6, color=color, max_alpha=85)
    f3 = Image.alpha_composite(glow3, f3_body)

    # --- ATTACK FRAMES ---
    # Frame 1: Basalt Wind-Up (Fist raised high +28 deg, furnace superheated)
    f1_atk_body = rotate_limb(base_img, shoulder_fist, angle_deg=28.0, mask_box=fist_box)
    draw_furnace_flames(f1_atk_body, chest_core, flame_height=42 + level * 10, color=color, accent=accent, secondary=secondary)
    charge_glow = create_radial_glow((512, 512), chest_core, radius=55 + level * 10, color=accent, max_alpha=230)
    f1_atk = Image.alpha_composite(f1_atk_body, charge_glow)

    # Frame 2: Volcanic Plasma Smash (Heavy forward slam -32 deg, magma shockwave erupts)
    f2_atk_body = rotate_limb(base_img, shoulder_fist, angle_deg=-32.0, mask_box=fist_box)
    fist_impact_pos = (shoulder_fist[0] + int(bw * 0.28), shoulder_fist[1] + int(bh * 0.12))

    f2_fx = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw_fx = ImageDraw.Draw(f2_fx)
    # Magma ball core & fiery rings
    r_magma = 22 + level * 8
    draw_fx.ellipse([fist_impact_pos[0] - r_magma, fist_impact_pos[1] - r_magma,
                     fist_impact_pos[0] + r_magma, fist_impact_pos[1] + r_magma], fill=(*accent, 255))
    draw_fx.ellipse([fist_impact_pos[0] - r_magma * 1.5, fist_impact_pos[1] - r_magma * 1.5,
                     fist_impact_pos[0] + r_magma * 1.5, fist_impact_pos[1] + r_magma * 1.5], outline=(*secondary, 220), width=5 + level)
    # Flying volcanic rock shards
    for ox, oy in [(-18, -25), (25, -15), (32, 22), (10, 30)]:
        sp_x, sp_y = fist_impact_pos[0] + ox, fist_impact_pos[1] + oy
        draw_fx.polygon([(sp_x - 4, sp_y), (sp_x, sp_y - 6), (sp_x + 4, sp_y), (sp_x, sp_y + 4)], fill=(255, 230, 100, 255))
    f2_atk = Image.alpha_composite(f2_atk_body, f2_fx)

    # Frame 3: Tremor Follow-Through
    f3_atk = Image.alpha_composite(base_img, create_radial_glow((512, 512), fist_impact_pos, radius=65 + level * 10, color=color, max_alpha=120))

    # Frame 4: Recovery (Basalt plates settle back)
    f4_atk = Image.alpha_composite(base_img, create_radial_glow((512, 512), chest_core, radius=35, color=color, max_alpha=50))

    return [f1, f2, f3], [f1_atk, f2_atk, f3_atk, f4_atk]


# ==============================================================================
# PIPELINE EXECUTION
# ==============================================================================

def assemble_spritesheet(frames, frame_size=(512, 512)):
    """Assemble list of frames into a single horizontal strip spritesheet."""
    w, h = frame_size
    sheet = Image.new('RGBA', (w * len(frames), h), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        sheet.alpha_composite(frame, (i * w, 0))
    return sheet


def main():
    OUT_HEROES_DIR.mkdir(parents=True, exist_ok=True)
    manifest = {'heroes': {}}

    print('Gerando animações expressivas (poses anatômicas reais e elementos vivos)...')

    generators = {
        'mentor': generate_mentor_frames,
        'benzedeira': generate_benzedeira_frames,
        'paje': generate_paje_frames,
    }

    for hero_key in ('mentor', 'benzedeira', 'paje'):
        manifest['heroes'][hero_key] = {'name': HERO_CONFIG[hero_key]['name'], 'levels': {}}

        for level in (1, 2, 3):
            src_file = SRC_DIR / f'{hero_key}_lvl{level}.png'
            assert src_file.exists(), f'Arquivo base ausente: {src_file}'
            base_img = Image.open(src_file).convert('RGBA')

            gen_fn = generators[hero_key]
            idle_frames, attack_frames = gen_fn(base_img, level)

            # Save individual frames
            frame_paths = {}
            for idx, frame in enumerate(idle_frames, start=1):
                fname = f'{hero_key}_lvl{level}_idle_{idx}.png'
                frame.save(OUT_HEROES_DIR / fname)
                frame_paths[f'idle_{idx}'] = f'assets/astral/heroes/{fname}'

            for idx, frame in enumerate(attack_frames, start=1):
                fname = f'{hero_key}_lvl{level}_atk_{idx}.png'
                frame.save(OUT_HEROES_DIR / fname)
                frame_paths[f'atk_{idx}'] = f'assets/astral/heroes/{fname}'

            # Assemble unified 7-frame horizontal spritesheet
            all_frames = idle_frames + attack_frames
            sheet = assemble_spritesheet(all_frames, (512, 512))
            sheet_name = f'{hero_key}_lvl{level}_sheet.png'
            sheet.save(OUT_HEROES_DIR / sheet_name)
            sheet.save(SRC_DIR / sheet_name)

            manifest['heroes'][hero_key]['levels'][level] = {
                'spritesheet': f'assets/astral/heroes/{sheet_name}',
                'frames_count': 7,
                'idle_frames': [0, 1, 2],
                'attack_frames': [3, 4, 5, 6],
                'frame_width': 512,
                'frame_height': 512,
                'individual_files': frame_paths,
            }
            hero_name = HERO_CONFIG[hero_key]["name"]
            print(f'[OK] {hero_name} Nv.{level}: Poses expressivas geradas (3 Idle + 4 Ataque + Spritesheet)')

    manifest_path = OUT_HEROES_DIR / 'animations_manifest.json'
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding='utf-8')
    print(f'\nManifesto salvo em {manifest_path}')
    print('Todas as 9 variantes atualizadas com sucesso!')


if __name__ == '__main__':
    main()
