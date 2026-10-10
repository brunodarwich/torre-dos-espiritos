"""Build animation loops (Idle 3-frames and Attack 4-frames) for all 3 heroes and 3 levels.

Produces:
1. Individual high-resolution transparent PNG frames in frontend/public/assets/astral/heroes/
2. Unified 7-frame horizontal spritesheets (512x512 per frame, total 3584x512) for Phaser 3
3. Quality inspection report and manifest
"""
import json
import math
import shutil
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / 'frontend/public/assets/astral'
OUT_HEROES_DIR = SRC_DIR / 'heroes'
PUBLIC_ARCHIVE = ROOT / 'public/guardian-art'

HERO_CONFIG = {
    'mentor': {
        'name': 'Prisma Solar',
        'color': (246, 224, 94),     # #F6E05E Gold
        'accent': (255, 250, 205),    # Lemon Chiffon / White Gold
        'fx_type': 'solar_beam',
        'weapon_hand': 'right',       # Palm attack
    },
    'benzedeira': {
        'name': 'Véu de Aurora',
        'color': (72, 187, 120),     # #48BB78 Jade
        'accent': (79, 209, 197),     # #4FD1C5 Cyan Mint
        'fx_type': 'aurora_wave',
        'weapon_hand': 'both',        # Ribbon sweep
    },
    'paje': {
        'name': 'Núcleo de Brasa',
        'color': (237, 137, 54),     # #ED8936 Basalt Amber
        'accent': (255, 170, 50),     # Molten Gold
        'fx_type': 'plasma_burst',
        'weapon_hand': 'chest_fist',  # Basalt slam & magma core
    }
}


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
    
    rgba = np.dstack((r, g, b, alpha))
    return Image.fromarray(rgba)


def warp_character(img_rgba, shift_x=0.0, shift_y=0.0, scale_y=1.0, scale_x=1.0,
                    lean_angle=0.0, vertical_gradient_shift=True):
    """
    Deforms a character with realistic 2D squash & stretch while keeping feet anchored.
    - Feet (bottom) stay grounded.
    - Upper body receives breathing / anticipation movement.
    """
    arr = np.array(img_rgba)
    h, w, _ = arr.shape
    alpha = arr[:, :, 3]
    coords = cv2.findNonZero(alpha)
    if coords is None:
        return img_rgba
    
    bx, by, bw, bh = cv2.boundingRect(coords)
    foot_y = by + bh
    head_y = by
    center_x = bx + bw // 2
    
    # Create coordinate mapping grid
    grid_y, grid_x = np.indices((h, w), dtype=np.float32)
    
    # Factor from 0 at feet to 1 at head
    factor = np.clip((foot_y - grid_y) / max(1.0, float(bh)), 0.0, 1.0)
    if not vertical_gradient_shift:
        factor = np.ones_like(factor)
        
    # Vertical stretch/shift anchored at feet
    map_y = foot_y - (foot_y - grid_y) / scale_y - (shift_y * factor)
    
    # Horizontal shift & lean
    lean_offset = (foot_y - grid_y) * math.tan(math.radians(lean_angle))
    map_x = center_x + (grid_x - center_x) / scale_x - (shift_x * factor) - lean_offset
    
    # Remap with bicubic interpolation
    warped_arr = cv2.remap(arr, map_x, map_y, interpolation=cv2.INTER_CUBIC,
                           borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))
    return Image.fromarray(warped_arr)


def generate_idle_frames(base_img, hero_key, level):
    """Generate 3 continuous looping Idle frames: Neutral, Inhale/Ascent, Apex/Return."""
    cfg = HERO_CONFIG[hero_key]
    color = cfg['color']
    accent = cfg['accent']
    
    arr = np.array(base_img)
    alpha = arr[:, :, 3]
    coords = cv2.findNonZero(alpha)
    bx, by, bw, bh = cv2.boundingRect(coords)
    cx = bx + bw // 2
    core_y = by + int(bh * 0.42)
    
    # Frame 1: Base Rest (Canonical grounded pose with subtle ambient glow)
    f1 = base_img.copy()
    glow1 = create_radial_glow((512, 512), (cx, core_y), radius=35 + level * 6,
                               color=color, max_alpha=40 + level * 15)
    f1 = Image.alpha_composite(glow1, f1)
    
    # Frame 2: Inhale / Rising (Upper body lifts 4-5px, slight expansion, brighter glow)
    f2_body = warp_character(base_img, shift_x=0.0, shift_y=4.5, scale_y=1.025, scale_x=1.01)
    glow2 = create_radial_glow((512, 512), (cx, core_y - 4), radius=48 + level * 8,
                               color=accent, max_alpha=85 + level * 20)
    f2 = Image.alpha_composite(glow2, f2_body)
    
    # Frame 3: Apex Float / Soft Exhale transition (Gentle apex with slight sway)
    f3_body = warp_character(base_img, shift_x=0.8, shift_y=2.5, scale_y=1.012, scale_x=1.005, lean_angle=0.4)
    glow3 = create_radial_glow((512, 512), (cx + 1, core_y - 2), radius=42 + level * 7,
                               color=color, max_alpha=65 + level * 15)
    f3 = Image.alpha_composite(glow3, f3_body)
    
    return [f1, f2, f3]


def draw_solar_beam(canvas, origin, target, level, color, accent):
    """Draw a concentrated astral solar laser beam with particles."""
    draw = ImageDraw.Draw(canvas)
    ox, oy = origin
    tx, ty = target
    
    beam_w = 4 + level * 3
    # Outer glow line
    draw.line([(ox, oy), (tx, ty)], fill=(*color, 140), width=beam_w + 12)
    draw.line([(ox, oy), (tx, ty)], fill=(*color, 200), width=beam_w + 6)
    # Core bright beam
    draw.line([(ox, oy), (tx, ty)], fill=(*accent, 255), width=beam_w)
    draw.line([(ox, oy), (tx, ty)], fill=(255, 255, 255, 255), width=max(2, beam_w - 2))
    
    # Burst circles along beam
    for step in [0.2, 0.5, 0.8, 1.0]:
        px = ox + (tx - ox) * step
        py = oy + (ty - oy) * step
        r = 6 + level * 2
        draw.ellipse([px - r, py - r, px + r, py + r], fill=(*accent, 180))


def draw_aurora_wave(canvas, origin, target, level, color, accent):
    """Draw sweeping astral jade ribbons slicing through the air."""
    draw = ImageDraw.Draw(canvas)
    ox, oy = origin
    tx, ty = target
    
    # Draw curved bezier-like ribbon arcs
    pts1 = [(ox, oy), (ox + 30, oy - 25), (ox + 70, oy - 15), (tx, ty - 10)]
    pts2 = [(ox, oy), (ox + 40, oy + 20), (ox + 80, oy + 10), (tx, ty + 15)]
    
    for pts, col in [(pts1, color), (pts2, accent)]:
        w = 5 + level * 2
        for i in range(len(pts) - 1):
            draw.line([pts[i], pts[i+1]], fill=(*col, 220), width=w)
            draw.line([pts[i], pts[i+1]], fill=(255, 255, 255, 200), width=max(1, w - 3))


def draw_plasma_burst(canvas, origin, target, level, color, accent):
    """Draw explosive molten magma and plasma shockwave."""
    draw = ImageDraw.Draw(canvas)
    ox, oy = origin
    tx, ty = target
    
    # Fiery plasma orb at origin
    r_core = 14 + level * 5
    draw.ellipse([ox - r_core*1.5, oy - r_core*1.5, ox + r_core*1.5, oy + r_core*1.5], fill=(*color, 120))
    draw.ellipse([ox - r_core, oy - r_core, ox + r_core, oy + r_core], fill=(*color, 220))
    draw.ellipse([ox - r_core*0.6, oy - r_core*0.6, ox + r_core*0.6, oy + r_core*0.6], fill=(*accent, 255))
    
    # Shockwave ring expanding towards target
    mid_x = (ox + tx) / 2
    mid_y = (oy + ty) / 2
    w_ring = 22 + level * 8
    draw.ellipse([mid_x - w_ring, mid_y - w_ring*0.7, mid_x + w_ring, mid_y + w_ring*0.7],
                 outline=(*accent, 220), width=4 + level)
    
    # Flying magma sparks
    sparks = [(ox + 20, oy - 18), (ox + 35, oy + 22), (tx - 10, ty - 15), (tx, ty + 8)]
    for sx, sy in sparks:
        draw.ellipse([sx - 3, sy - 3, sx + 3, sy + 3], fill=(255, 240, 180, 255))


def generate_attack_frames(base_img, hero_key, level):
    """
    Generate 4 fluid Attack frames:
    1. Wind-up / Anticipation (crouch/recoil back, charging flare at weapon)
    2. Strike Climax / Release (powerful forward thrust, massive energy beam/wave)
    3. Follow-through / Recoil dissipation (shockwave reverberation, particle embers)
    4. Recovery / Settle (returning to neutral baseline, ready for idle)
    """
    cfg = HERO_CONFIG[hero_key]
    color = cfg['color']
    accent = cfg['accent']
    fx_type = cfg['fx_type']
    
    arr = np.array(base_img)
    alpha = arr[:, :, 3]
    coords = cv2.findNonZero(alpha)
    bx, by, bw, bh = cv2.boundingRect(coords)
    cx = bx + bw // 2
    core_y = by + int(bh * 0.42)
    
    # Attack focal point (right palm / chest / forward hand)
    if hero_key == 'mentor':
        focus_x = cx + int(bw * 0.28)
        focus_y = by + int(bh * 0.38)
        target_pt = (focus_x + 95 + level * 20, focus_y - 10)
    elif hero_key == 'benzedeira':
        focus_x = cx + int(bw * 0.22)
        focus_y = by + int(bh * 0.40)
        target_pt = (focus_x + 85 + level * 15, focus_y)
    else:  # paje
        focus_x = cx + int(bw * 0.20)
        focus_y = by + int(bh * 0.45)
        target_pt = (focus_x + 80 + level * 15, focus_y + 15)

    # Frame 1: Wind-up (Anticipation)
    # Character leans back slightly (-6px), charges energy flare
    f1_body = warp_character(base_img, shift_x=-6.0, shift_y=-2.0, scale_y=0.98, scale_x=1.02, lean_angle=-1.5)
    f1_fx = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    glow_charge = create_radial_glow((512, 512), (focus_x - 6, focus_y), radius=28 + level * 6,
                                     color=accent, max_alpha=180 + level * 20)
    core_flare = create_radial_glow((512, 512), (focus_x - 6, focus_y), radius=12 + level * 3,
                                    color=(255, 255, 255), max_alpha=240)
    f1 = Image.alpha_composite(f1_body, glow_charge)
    f1 = Image.alpha_composite(f1, core_flare)

    # Frame 2: Strike Climax (Release)
    # Character thrusts forward (+10px), shoots projectile/beam
    f2_body = warp_character(base_img, shift_x=10.0, shift_y=1.0, scale_y=1.02, scale_x=1.01, lean_angle=2.2)
    f2_fx = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    
    # Big flare at hand
    hand_flare = create_radial_glow((512, 512), (focus_x + 10, focus_y), radius=35 + level * 8,
                                    color=accent, max_alpha=220)
    f2_fx = Image.alpha_composite(f2_fx, hand_flare)
    
    # Specific FX per hero
    if fx_type == 'solar_beam':
        draw_solar_beam(f2_fx, (focus_x + 10, focus_y), target_pt, level, color, accent)
    elif fx_type == 'aurora_wave':
        draw_aurora_wave(f2_fx, (focus_x + 10, focus_y), target_pt, level, color, accent)
    else:  # plasma_burst
        draw_plasma_burst(f2_fx, (focus_x + 10, focus_y), target_pt, level, color, accent)
        
    f2 = Image.alpha_composite(f2_body, f2_fx)

    # Frame 3: Follow-through (Recoil dissipation)
    # Character settles slightly back from impact recoil (+2px), dissipation glow
    f3_body = warp_character(base_img, shift_x=3.0, shift_y=0.0, scale_y=1.0, scale_x=1.0, lean_angle=0.5)
    f3_fx = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    dissipate_glow = create_radial_glow((512, 512), (focus_x + 18, focus_y), radius=45 + level * 6,
                                        color=color, max_alpha=110)
    f3 = Image.alpha_composite(f3_body, dissipate_glow)

    # Frame 4: Recovery (Returning to stance)
    # Almost back to base pose (-1px), small residual ambient glow, perfectly blending to idle_1
    f4_body = warp_character(base_img, shift_x=0.5, shift_y=0.5, scale_y=1.005, scale_x=1.002, lean_angle=0.1)
    f4_fx = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    settle_glow = create_radial_glow((512, 512), (cx, core_y), radius=28 + level * 4,
                                     color=color, max_alpha=55)
    f4 = Image.alpha_composite(f4_body, settle_glow)

    return [f1, f2, f3, f4]


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
    
    print('Starting animation frame generation for 3 heroes x 3 levels...')
    
    for hero_key in ('mentor', 'benzedeira', 'paje'):
        manifest['heroes'][hero_key] = {'name': HERO_CONFIG[hero_key]['name'], 'levels': {}}
        
        for level in (1, 2, 3):
            src_file = SRC_DIR / f'{hero_key}_lvl{level}.png'
            assert src_file.exists(), f'Missing base asset: {src_file}'
            
            base_img = Image.open(src_file).convert('RGBA')
            
            # 1. Generate 3 Idle frames
            idle_frames = generate_idle_frames(base_img, hero_key, level)
            
            # 2. Generate 4 Attack frames
            attack_frames = generate_attack_frames(base_img, hero_key, level)
            
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
                
            # 3. Assemble unified 7-frame horizontal spritesheet
            all_frames = idle_frames + attack_frames
            sheet = assemble_spritesheet(all_frames, (512, 512))
            sheet_name = f'{hero_key}_lvl{level}_sheet.png'
            sheet.save(OUT_HEROES_DIR / sheet_name)
            
            # Also copy to root assets/astral/ for direct loading convenience
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
            print(f'[OK] Generated {hero_name} Lv.{level}: 3 Idle + 4 Attack + Spritesheet (3584x512)')
            
    manifest_path = OUT_HEROES_DIR / 'animations_manifest.json'
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding='utf-8')
    print(f'\nManifest saved to {manifest_path}')
    print('All 9 hero variants built successfully!')


if __name__ == '__main__':
    main()
