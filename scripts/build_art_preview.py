"""Package generated art without upscaling; compose the requested review proof.

Raster operations here are delivery resizing and assembly of generated layers,
not replacements for image generation. Run from anywhere with Python + Pillow.
"""
import json
import re
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/art-preview'
LANCZOS = Image.Resampling.LANCZOS
SPECS = {
    'cosmos': ('Cosmos distante', (2560, 1440), (1280, 720), False),
    'floor': ('Piso do santuário', (2560, 1440), (1280, 720), True),
    'path_straight': ('Caminho reto', (320, 320), (80, 80), True),
    'path_corner': ('Curva do caminho', (320, 320), (80, 80), True),
    'path_terminal': ('Terminal do caminho', (320, 320), (80, 80), True),
    'mentor': ('Prisma Solar · Nível 1', (512, 512), (80, 80), True),
    'benzedeira': ('Véu de Aurora · Nível 1', (512, 512), (80, 80), True),
    'paje': ('Núcleo de Brasa · Nível 1', (512, 512), (80, 80), True),
}


def route_from_game():
    text = (ROOT / 'frontend/src/systems/GridSystem.ts').read_text(encoding='utf-8')
    block = text.split('const gridPath: GridPoint[] = [', 1)[1].split('];', 1)[0]
    points = [(int(c), int(r)) for c, r in re.findall(r'col:\s*(\d+),\s*row:\s*(\d+)', block)]
    assert len(points) >= 2
    cells = [points[0]]
    for (x, y), (tx, ty) in zip(points, points[1:]):
        assert x == tx or y == ty, 'Only orthogonal route segments are supported'
        dx, dy = (tx > x) - (tx < x), (ty > y) - (ty < y)
        while (x, y) != (tx, ty):
            x, y = x + dx, y + dy
            cells.append((x, y))
    assert len(set(cells)) == len(cells), 'Route must not repeat a cell'
    return points, cells


def pieces_for(cells):
    directions = {(1, 0): 'E', (-1, 0): 'W', (0, 1): 'S', (0, -1): 'N'}
    pieces = []
    for index, (x, y) in enumerate(cells):
        neighbors = [cells[i] for i in (index - 1, index + 1) if 0 <= i < len(cells)]
        sides = frozenset(directions[(nx - x, ny - y)] for nx, ny in neighbors)
        if len(sides) == 1:
            key, angle = 'path_terminal', {'W': 0, 'N': 90, 'E': 180, 'S': 270}[next(iter(sides))]
        elif sides in (frozenset('WE'), frozenset('NS')):
            key, angle = 'path_straight', (0 if 'W' in sides else 90)
        else:
            key = 'path_corner'
            angle = {frozenset('WS'): 0, frozenset('WN'): 90,
                     frozenset('NE'): 180, frozenset('ES'): 270}[sides]
        pieces.append({'col': x, 'row': y, 'asset': key, 'clockwise_degrees': angle})
    return pieces


def stamp(scene, image, center, box, anchor=(0.5, 0.5)):
    layer = ImageOps.contain(image.convert('RGBA'), box, LANCZOS)
    scene.alpha_composite(layer, (round(center[0] - layer.width * anchor[0]),
                                 round(center[1] - layer.height * anchor[1])))


def connector_center(image, edge):
    alpha = image.getchannel('A')
    width, height = image.size
    positions = []
    for index in range(height if edge in ('W', 'E') else width):
        if edge == 'W':
            samples = [alpha.getpixel((x, index)) for x in range(3)]
        elif edge == 'E':
            samples = [alpha.getpixel((width - 1 - x, index)) for x in range(3)]
        else:
            samples = [alpha.getpixel((index, height - 1 - y)) for y in range(3)]
        if max(samples) >= 128:
            positions.append(index)
    return round((min(positions) + max(positions)) / 2, 2) if positions else None


def main():
    inputs = json.loads((OUT / 'generation_inputs.json').read_text(encoding='utf-8'))
    (OUT / 'source').mkdir(parents=True, exist_ok=True)
    (OUT / 'assets').mkdir(exist_ok=True)
    assets, images = [], {}
    for key, (title, target, display, transparent) in SPECS.items():
        original = Path(inputs[key]['path'])
        source = OUT / 'source' / (key + '.png')
        if not original.exists():
            original = source
        if original.resolve() != source.resolve():
            shutil.copy2(original, source)
        image = Image.open(source).convert('RGBA')
        native = image.size
        alpha = image.getchannel('A')
        extrema = alpha.getextrema()
        if transparent:
            assert extrema[0] == 0 and extrema[1] > 0, f'{key}: no usable alpha'
        if key in ('mentor', 'benzedeira', 'paje'):
            # Fit the unchanged generated silhouette to a standard transparent canvas.
            # No repainting, background removal or new visual content.
            body = image.crop(alpha.getbbox())
            body.thumbnail((384, 384), LANCZOS)
            delivery = Image.new('RGBA', target)
            delivery.alpha_composite(body, ((512 - body.width) // 2, (512 - body.height) // 2))
        elif native[0] >= target[0] and native[1] >= target[1]:
            delivery = ImageOps.contain(image, target, LANCZOS)
        else:
            delivery = image.copy()  # Explicitly keep undersized backgrounds native.
        suffix = '.webp' if key == 'cosmos' else '.png'
        filename = key + suffix
        if key == 'cosmos':
            delivery.convert('RGB').save(OUT / 'assets' / filename, quality=95)
        else:
            delivery.save(OUT / 'assets' / filename)
        images[key] = delivery
        anchor = [0.5, 0.5]
        # Generated stone edges are irregular. Place the intersection of the
        # measured connector axes at the game waypoint, instead of assuming
        # every visual intersection lies at the center of its texture canvas.
        if key == 'path_corner':
            anchor = [connector_center(delivery, 'S') / delivery.width,
                      connector_center(delivery, 'W') / delivery.height]
        elif key == 'path_straight':
            anchor[1] = (connector_center(delivery, 'W') + connector_center(delivery, 'E')) / (2 * delivery.height)
        elif key == 'path_terminal':
            anchor[1] = connector_center(delivery, 'W') / delivery.height
        assets.append({'id': key, 'title': title, 'file': 'assets/' + filename,
                       'source': 'source/' + key + '.png', 'native_size': list(native),
                       'target_size': list(target), 'delivered_size': list(delivery.size),
                       'display_size': list(display), 'anchor': anchor,
                       'transparent': transparent, 'source_alpha_extrema': list(extrema),
                       'alpha_extrema': list(delivery.getchannel('A').getextrema()),
                       'native_resolution_met': native[0] >= target[0] and native[1] >= target[1],
                       'status': 'awaiting_visual_review', 'prompt': inputs[key]['prompt'],
                       'generator': 'built-in image_gen'})
    points, cells = route_from_game()
    pieces = pieces_for(cells)
    manifest = {'version': 1, 'phase': 'Primeira prova visual · Marco 2',
                'approval': 'pending', 'planned_assets': 40, 'produced_assets': len(assets),
                'logical_size': [1280, 720], 'waypoints': points, 'path_pieces': pieces,
                'limitations': ['Portal, núcleo, inimigos e HUD funcional ainda não produzidos.',
                                'Fontes de cenário abaixo de 2560×1440 permanecem na resolução nativa; não foram ampliadas.'],
                'assets': assets}
    encoded = json.dumps(manifest, ensure_ascii=False, indent=2)
    (OUT / 'manifest.json').write_text(encoded + '\n', encoding='utf-8')
    (OUT / 'manifest_data.js').write_text('window.__ART_MANIFEST__ = ' + encoded + ';\n', encoding='utf-8')
    scene = Image.new('RGBA', (1280, 720), '#0B0F19')
    scene.alpha_composite(ImageOps.fit(images['cosmos'], scene.size, LANCZOS))
    stamp(scene, images['floor'], (640, 360), (1280, 720))
    anchors = {asset['id']: asset['anchor'] for asset in assets}
    for piece in pieces:
        tile = images[piece['asset']].rotate(-piece['clockwise_degrees'])
        ax, ay = anchors[piece['asset']]
        for _ in range(piece['clockwise_degrees'] // 90):
            ax, ay = 1 - ay, ax
        stamp(scene, tile, (piece['col'] * 80 + 40, piece['row'] * 80 + 40), (80, 80), (ax, ay))
    for key, cell in [('mentor', (4, 3)), ('benzedeira', (8, 4)), ('paje', (11, 2))]:
        assert cell not in cells
        stamp(scene, images[key], (cell[0] * 80 + 40, cell[1] * 80 + 40), (80, 80))
    scene.convert('RGB').save(OUT / 'composition-1280.png')
    # 1920 proof represents display scaling, not a claim of new native detail.
    scene.resize((1920, 1080), LANCZOS).convert('RGB').save(OUT / 'composition-1920.png')
    sheet = Image.new('RGBA', (1200, 520), '#171D2E')
    draw = ImageDraw.Draw(sheet)
    font_path = Path('C:/Windows/Fonts/segoeui.ttf')
    font = ImageFont.truetype(str(font_path), 23) if font_path.exists() else ImageFont.load_default()
    for i, key in enumerate(('mentor', 'benzedeira', 'paje')):
        stamp(sheet, images[key], (200 + 400 * i, 210), (340, 340))
        stamp(sheet, images[key], (200 + 400 * i, 442), (80, 80))
        draw.text((25 + 400 * i, 385), SPECS[key][0], fill='#EDF2F7', font=font)
    sheet.convert('RGB').save(OUT / 'protectors-detail.png')
    connectors = {}
    for key, edges in [('path_straight', 'WE'), ('path_corner', 'WS'), ('path_terminal', 'W')]:
        connectors[key] = {edge: connector_center(images[key], edge) for edge in edges}
    raw_connectors_centered = all(center is not None and abs(center - 159.5) <= 16
                          for measurement in connectors.values() for center in measurement.values())
    connectors_pass = all(center is not None and abs(center - anchors[key][1 if edge in ('W', 'E') else 0] * 320) <= 16
                          for key, measurement in connectors.items() for edge, center in measurement.items())
    report = {'generated': len(assets), 'route_cells': len(cells), 'alpha_passed': True,
              'connector_centers_at_320px': connectors,
              'raw_connectors_centered': raw_connectors_centered,
              'path_anchors': {key: anchors[key] for key in connectors},
              'alignment_method': 'Measured connector axes anchored to actual game waypoints; no repainting of textures',
              'connectors_within_4_logical_pixels': connectors_pass,
              'resolution_pending': [a['id'] for a in assets if not a['native_resolution_met']],
              'visual_approval': 'pending'}
    (OUT / 'quality-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False))


if __name__ == '__main__':
    main()
