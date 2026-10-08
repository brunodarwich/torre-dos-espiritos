"""Package image_gen sources, standardize sprite delivery, and inspect alpha.

Only delivery sizing/cropping and assembly are performed here; every artwork
is generated with image_gen. The original generation is kept alongside prompts.
"""
import hashlib
import json
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / 'public/guardian-art'
DEST = ROOT / 'frontend/public/assets/astral'
KEYS = [f'{guide}_lvl{level}' for guide in ('mentor', 'benzedeira', 'paje') for level in (1, 2, 3)] + [
    'spirit_larva', 'spirit_zombeteiro', 'spirit_obsessor', 'spirit_sombra',
    'spirit_boss', 'spirit_boss_phase2', 'spirit_redeemed', 'portal', 'dream_core',
]
NAMES = {'mentor': 'Prisma Solar', 'benzedeira': 'Véu de Aurora', 'paje': 'Núcleo de Brasa',
         'spirit_larva': 'Larva Astral', 'spirit_zombeteiro': 'Zombeteiro',
         'spirit_obsessor': 'Sentinela do Vazio', 'spirit_sombra': 'Espectro da Névoa',
         'spirit_boss': 'Colosso do Eclipse · Fase 1', 'spirit_boss_phase2': 'Colosso do Eclipse · Fase 2',
         'spirit_redeemed': 'Espírito purificado', 'portal': 'Fenda de entrada', 'dream_core': 'Núcleo do sonho'}


def title(key):
    if '_lvl' in key:
        guide, level = key.split('_lvl')
        return f'{NAMES[guide]} · Nível {level}'
    return NAMES[key]


def alpha_report(image):
    alpha = image.getchannel('A')
    return {'extrema': list(alpha.getextrema()), 'bbox': list(alpha.getbbox()),
            'corners': [alpha.getpixel(pt) for pt in [(0, 0), (image.width-1, 0),
                        (0, image.height-1), (image.width-1, image.height-1)]]}


def contact_sheet(keys, filename, cols, images):
    rows = (len(keys) + cols - 1) // cols
    sheet = Image.new('RGBA', (cols * 300, rows * 300), '#171D2E')
    draw = ImageDraw.Draw(sheet)
    font_path = Path('C:/Windows/Fonts/segoeui.ttf')
    font = ImageFont.truetype(str(font_path), 16) if font_path.exists() else ImageFont.load_default()
    for index, key in enumerate(keys):
        col, row = index % cols, index // cols
        sprite = images[key].copy()
        sprite.thumbnail((230, 230), Image.Resampling.LANCZOS)
        sheet.alpha_composite(sprite, (col*300 + (300-sprite.width)//2, row*300 + 10))
        draw.text((col*300+14, row*300+250), title(key), font=font, fill='#EDF2F7')
    sheet.convert('RGB').save(ARCHIVE / filename)


def main():
    inputs = json.loads((ARCHIVE / 'generation_inputs.json').read_text(encoding='utf-8'))
    assert set(inputs) == set(KEYS), f'Expected 18 images; missing {sorted(set(KEYS)-set(inputs))}'
    (ARCHIVE / 'source').mkdir(parents=True, exist_ok=True)
    DEST.mkdir(parents=True, exist_ok=True)
    native, bodies, source_reports = {}, {}, {}
    for key in KEYS:
        source = ARCHIVE / 'source' / f'{key}.png'
        original = Path(inputs[key]['path'])
        if not original.exists():
            original = source
        if original.resolve() != source.resolve():
            shutil.copy2(original, source)
        image = Image.open(source).convert('RGBA')
        report = alpha_report(image)
        assert report['extrema'][0] == 0 and report['extrema'][1] > 0, f'{key}: no real transparency'
        native[key], bodies[key], source_reports[key] = image, image.crop(report['bbox']), report
    groups = {guide: max(max(bodies[f'{guide}_lvl{level}'].size) for level in (1, 2, 3))
              for guide in ('mentor', 'benzedeira', 'paje')}
    assets, images = [], {}
    for key in KEYS:
        size = 1024 if key.startswith('spirit_boss') else 512
        body = bodies[key]
        if '_lvl' in key:
            scale = min(1, size * .75 / groups[key.split('_lvl')[0]])
        else:
            scale = min(1, size * .75 / max(body.size))
        body = body.resize((max(1, round(body.width*scale)), max(1, round(body.height*scale))), Image.Resampling.LANCZOS)
        delivery = Image.new('RGBA', (size, size))
        bottom = round(size * .875) if '_lvl' in key else (size+body.height)//2
        delivery.alpha_composite(body, ((size-body.width)//2, bottom-body.height))
        filename = f'{key}.png'
        delivery.save(DEST / filename)
        images[key] = delivery
        report = alpha_report(delivery)
        assert report['extrema'][0] == 0 and report['corners'] == [0]*4
        assets.append({'id': key, 'name': title(key), 'file': filename,
                       'source': f'source/{filename}', 'native_size': list(native[key].size),
                       'delivered_size': [size, size], 'alpha': report,
                       'display_canvas': [128, 128] if size == 1024 else [80, 80] if '_lvl' in key else [72, 72] if key in ('portal', 'dream_core') else [64, 64],
                       'anchor': [.5, .5], 'source_sha256': hashlib.sha256((ARCHIVE/'source'/filename).read_bytes()).hexdigest(),
                       'generator': 'built-in image_gen', 'prompt': inputs[key]['prompt']})
    for guide in ('mentor', 'benzedeira', 'paje'):
        # Portrait is a derivative of the same approved/generated character.
        source_body = bodies[f'{guide}_lvl1']
        portrait_body = source_body.crop((0, 0, source_body.width, round(source_body.height * .62)))
        portrait_body.thumbnail((420, 420), Image.Resampling.LANCZOS)
        portrait = Image.new('RGBA', (512, 512))
        portrait.alpha_composite(portrait_body, ((512-portrait_body.width)//2, (512-portrait_body.height)//2))
        portrait.save(DEST / f'portrait_{guide}.png')
    env = ROOT / 'public/art-preview'
    for filename in ['cosmos.webp', 'floor.png', 'path_straight.png', 'path_corner.png', 'path_terminal.png']:
        shutil.copy2(env / 'assets' / filename, DEST / filename)
    shutil.copy2(env / 'manifest.json', DEST / 'environment_manifest.json')
    manifest = {'version': 2, 'direction': 'Guardiões astrais épicos', 'generated_count': 18,
                'reused_environment_count': 5, 'derived_portrait_count': 3,
                'limitations': ['Cosmos e piso nativos1672×941; alvo2560×1440 ainda pendente.'], 'assets': assets}
    encoded = json.dumps(manifest, ensure_ascii=False, indent=2) + '\n'
    (ARCHIVE / 'manifest.json').write_text(encoded, encoding='utf-8')
    (DEST / 'art_manifest.json').write_text(encoded, encoding='utf-8')
    contact_sheet(KEYS[:9], 'guardian-evolutions.png', 3, images)
    contact_sheet(KEYS[9:16], 'enemies-and-boss.png', 4, images)
    report = {'generated_count': 18, 'alpha_passed': True, 'transparent_corners_passed': True,
              'delivered_sizes_passed': True, 'environment_resolution_pending': ['cosmos', 'floor']}
    (ARCHIVE / 'quality-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False))


if __name__ == '__main__':
    main()
