import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/systems/AudioSynth', () => ({
  audioSynth: { playClick: vi.fn(), isEnabled: () => true, setEnabled: vi.fn() },
}));

class Element extends EventTarget {
  hidden = false;
  textContent = '';
  style = { width: '' };
  attributes = new Map<string, string>();
  focus = vi.fn();
  setAttribute(name: string, value: string) { this.attributes.set(name, value); }
  click() { this.dispatchEvent(new Event('click')); }
}

describe('Screen navigation and loading recovery', () => {
  let elements: Map<string, Element>;
  let flow: typeof import('../src/ui/ScreenFlow').screenFlow;
  let start: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.resetModules();
    vi.useFakeTimers();
    elements = new Map([
      'home-screen', 'loading-screen', 'ui-layer', 'how-to-play', 'btn-start-game',
      'btn-how-to-play', 'btn-close-help', 'btn-home-audio', 'btn-retry-loading',
      'btn-enter-dream', 'loading-title', 'loading-progress', 'loading-progress-fill',
      'loading-percent', 'loading-tip', 'loading-error', 'btn-pause', 'btn-audio',
    ].map(id => [id, new Element()]));
    const document = new EventTarget();
    Object.assign(document, { getElementById: (id: string) => elements.get(id) });
    vi.stubGlobal('document', document);
    vi.stubGlobal('window', { setInterval, clearInterval });
    vi.stubGlobal('Image', class { src = ''; });
    flow = (await import('../src/ui/ScreenFlow')).screenFlow;
    start = vi.fn();
    flow.bind(start);
    flow.showHome();
  });

  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

  it('does not start gameplay until assets are ready and the player enters', () => {
    const enter = vi.fn();
    elements.get('btn-start-game')!.click();
    expect(start).toHaveBeenCalledTimes(1);
    expect(elements.get('ui-layer')!.hidden).toBe(true);
    elements.get('btn-enter-dream')!.click();
    expect(enter).not.toHaveBeenCalled();
    flow.updateProgress(0.42);
    expect(elements.get('loading-progress')!.attributes.get('aria-valuenow')).toBe('42');
    flow.ready(enter);
    expect(elements.get('ui-layer')!.hidden).toBe(true);
    elements.get('btn-enter-dream')!.click();
    elements.get('btn-enter-dream')!.click();
    expect(enter).toHaveBeenCalledTimes(1);
    expect(elements.get('loading-screen')!.hidden).toBe(true);
    expect(elements.get('ui-layer')!.hidden).toBe(false);
  });

  it('blocks a failed load and allows a fresh retry without an old continuation', () => {
    const staleEnter = vi.fn();
    elements.get('btn-start-game')!.click();
    flow.ready(staleEnter);
    flow.failLoading();
    elements.get('btn-enter-dream')!.click();
    expect(staleEnter).not.toHaveBeenCalled();
    expect(elements.get('loading-error')!.hidden).toBe(false);
    elements.get('btn-retry-loading')!.click();
    expect(start).toHaveBeenCalledTimes(2);
    expect(elements.get('loading-error')!.hidden).toBe(true);
    expect(elements.get('loading-percent')!.textContent).toBe('0%');
    expect(elements.get('btn-enter-dream')!.hidden).toBe(true);
  });

  it('rotates useful tips but stops its timer when returning home', () => {
    flow.beginLoading();
    const initialTip = elements.get('loading-tip')!.textContent;
    vi.advanceTimersByTime(5500);
    expect(elements.get('loading-tip')!.textContent).not.toBe(initialTip);
    flow.showHome();
    const lastTip = elements.get('loading-tip')!.textContent;
    vi.advanceTimersByTime(11000);
    expect(elements.get('loading-tip')!.textContent).toBe(lastTip);
    expect(vi.getTimerCount()).toBe(0);
    expect(elements.get('home-screen')!.hidden).toBe(false);
    expect(elements.get('ui-layer')!.hidden).toBe(true);
  });
});
