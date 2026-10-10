import { beforeEach, describe, expect, it, vi } from 'vitest';

const ui = vi.hoisted(() => ({
  updateProgress: vi.fn(), failLoading: vi.fn(), ready: vi.fn(), showGame: vi.fn(),
}));
vi.mock('../src/ui/ScreenFlow', () => ({ screenFlow: ui, screenAssets: { logo: 'logo.png' } }));
vi.mock('phaser', () => {
  class Events {
    handlers = new Map<string, Function[]>();
    on(name: string, callback: Function) { this.handlers.set(name, [...(this.handlers.get(name) ?? []), callback]); }
    once(name: string, callback: Function) { this.on(name, callback); }
    off(name: string, callback: Function) { this.handlers.set(name, (this.handlers.get(name) ?? []).filter(fn => fn !== callback)); }
    emit(name: string, ...args: unknown[]) { for (const fn of this.handlers.get(name) ?? []) fn(...args); }
    image(key: string) { this.emit('addfile', key, 'image'); }
    json(key: string) { this.emit('addfile', key, 'json'); }
    spritesheet(key: string) { this.emit('addfile', key, 'spritesheet'); }
  }
  return { default: {
    Scene: class { load = new Events(); events = new Events(); scene = { start: vi.fn() }; },
    Scenes: { Events: { SHUTDOWN: 'shutdown' } },
  } };
});

import { BootScene } from '../src/scenes/BootScene';

describe('Boot validates file processing as well as HTTP loading', () => {
  beforeEach(() => { vi.clearAllMocks(); vi.stubGlobal('location', { search: '' }); });

  function finish(scene: BootScene, omit?: string) {
    // Mimic successful decoded files, leaving a corrupt image or JSON unfinished.
    const loader = scene.load as unknown as {
      handlers: Map<string, Function[]>; emit: (name: string, ...args: unknown[]) => void;
    };
    // These are captured from actual queued file events rather than a mirrored asset list.
    const queued: [string, string][] = [];
    loader.handlers.set('addfile', [...(loader.handlers.get('addfile') ?? []), (key: string, type: string) => queued.push([key, type])]);
    scene.preload();
    for (const [key, type] of queued) if (key !== omit) loader.emit('filecomplete', key, type);
    return loader;
  }

  it('blocks an invalid downloaded image even when no HTTP error event fires', () => {
    const scene = new BootScene();
    finish(scene, 'path_terminal');
    scene.create();
    expect(ui.failLoading).toHaveBeenCalledTimes(1);
    expect(ui.ready).not.toHaveBeenCalled();
  });

  it('blocks a JSON file that could not be processed', () => {
    const scene = new BootScene();
    finish(scene, 'environment_manifest');
    scene.create();
    expect(ui.failLoading).toHaveBeenCalledTimes(1);
    expect(ui.ready).not.toHaveBeenCalled();
  });

  it('waits for player confirmation after every queued file is processed', () => {
    const scene = new BootScene();
    finish(scene);
    scene.create();
    expect(ui.failLoading).not.toHaveBeenCalled();
    expect(ui.ready).toHaveBeenCalledTimes(1);
    expect(scene.scene.start).not.toHaveBeenCalled();
    ui.ready.mock.calls[0][0]();
    expect(scene.scene.start).toHaveBeenCalledWith('GameScene');
  });
});
