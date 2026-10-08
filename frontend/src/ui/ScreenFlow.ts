import { audioSynth } from '../systems/AudioSynth';

export const screenAssets = {
  logo: 'assets/brand/torre-dos-espiritos-logo-v1.png',
  home: 'assets/screens/home/sonho-guardioes-inicial-v1.png',
  loading: 'assets/screens/loading/carregamento-astral-v1.png',
  victory: 'assets/screens/results/vitoria-sonho-v1.png',
  defeat: 'assets/screens/results/derrota-sonho-v1.png',
} as const;

const tips = [
  'Escolha um guardião e posicione-o em uma célula livre perto do caminho.',
  'Prisma Solar concentra dano. Véu de Aurora desacelera. Núcleo de Brasa atinge grupos.',
  'Combine a lentidão do Véu de Aurora com o dano em área do Núcleo de Brasa.',
  'Selecione um guardião já colocado para evoluí-lo ou mudar a prioridade de alvo.',
  'Vender um guardião devolve 70% da Essência investida nele.',
  'Durante o intervalo, chamar a próxima horda concede 10% de bônus sobre sua Essência.',
  'Use a pausa para estudar o caminho e planejar a posição dos guardiões.',
];

/** Keep keyboard navigation inside the visible dialog, including dialogs with one button. */
export function trapDialogFocus(event: KeyboardEvent, container: HTMLElement) {
  if (event.key !== 'Tab') return;
  const buttons = [...container.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), [tabindex="0"]')]
    .filter(element => element.getClientRects().length > 0 && !element.hidden);
  const first = buttons[0], last = buttons[buttons.length - 1];
  if (!first) { event.preventDefault(); container.focus(); return; }
  if (!container.contains(document.activeElement) || (event.shiftKey && document.activeElement === first)) {
    event.preventDefault(); (event.shiftKey ? last : first).focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first.focus();
  }
}

/** DOM screens live outside Phaser, so the home appears before the engine loads assets. */
class ScreenFlow {
  private tipTimer?: number;
  private tipIndex = 0;
  private enterDream?: () => void;
  private onStart?: () => void;

  bind(onStart: () => void) {
    this.onStart = onStart;
    document.getElementById('btn-start-game')?.addEventListener('click', () => this.start());
    document.getElementById('btn-retry-loading')?.addEventListener('click', () => this.start());
    document.getElementById('btn-enter-dream')?.addEventListener('click', () => {
      const enter = this.enterDream;
      if (!enter) return;
      this.enterDream = undefined;
      audioSynth.playClick();
      this.showGame();
      enter();
    });
    document.getElementById('btn-how-to-play')?.addEventListener('click', () => {
      this.setHidden('how-to-play', false);
      document.getElementById('btn-how-to-play')?.setAttribute('aria-expanded', 'true');
      document.getElementById('btn-close-help')?.focus();
    });
    document.getElementById('btn-close-help')?.addEventListener('click', () => this.closeHelp());
    document.addEventListener('keydown', event => {
      const help = document.getElementById('how-to-play');
      if (!help || help.hidden) return;
      if (event.key === 'Escape') this.closeHelp();
      else trapDialogFocus(event, help);
    });
    document.getElementById('btn-home-audio')?.addEventListener('click', () => {
      audioSynth.setEnabled(!audioSynth.isEnabled());
      this.syncAudio();
    });
    this.syncAudio();
    // Warm the loading background while the player reads the home screen.
    const image = new Image();
    image.src = screenAssets.loading;
  }

  private start() {
    if (!this.onStart) return;
    audioSynth.playClick();
    this.beginLoading();
    this.onStart();
  }

  private closeHelp() {
    this.setHidden('how-to-play', true);
    document.getElementById('btn-how-to-play')?.setAttribute('aria-expanded', 'false');
    document.getElementById('btn-how-to-play')?.focus();
  }

  private syncAudio() {
    const button = document.getElementById('btn-home-audio');
    if (button) {
      button.textContent = audioSynth.isEnabled() ? 'Som ligado' : 'Som desligado';
      button.setAttribute('aria-pressed', String(audioSynth.isEnabled()));
    }
    const hud = document.getElementById('btn-audio');
    if (hud) hud.textContent = audioSynth.isEnabled() ? '🔊' : '🔇';
  }

  private setHidden(id: string, hidden: boolean) {
    const element = document.getElementById(id);
    if (element) element.hidden = hidden;
  }

  private stopTips() {
    window.clearInterval(this.tipTimer);
    this.tipTimer = undefined;
  }

  showHome() {
    this.stopTips();
    this.enterDream = undefined;
    this.setHidden('home-screen', false);
    this.setHidden('loading-screen', true);
    this.setHidden('ui-layer', true);
    this.setHidden('how-to-play', true);
    document.getElementById('btn-how-to-play')?.setAttribute('aria-expanded', 'false');
    this.syncAudio();
    document.getElementById('btn-start-game')?.focus();
  }

  beginLoading() {
    this.stopTips();
    this.enterDream = undefined;
    this.setHidden('home-screen', true);
    this.setHidden('loading-screen', false);
    this.setHidden('ui-layer', true);
    this.setHidden('loading-error', true);
    this.setHidden('btn-retry-loading', true);
    this.setHidden('btn-enter-dream', true);
    this.setHidden('how-to-play', true);
    const title = document.getElementById('loading-title');
    if (title) title.textContent = 'Preparando o seu sonho';
    this.updateProgress(0);
    const showTip = () => {
      const tip = document.getElementById('loading-tip');
      if (tip) tip.textContent = tips[this.tipIndex++ % tips.length];
    };
    showTip();
    this.tipTimer = window.setInterval(showTip, 5500);
    document.getElementById('loading-title')?.focus();
  }

  updateProgress(value: number) {
    const percent = Math.round(Math.max(0, Math.min(1, value)) * 100);
    const bar = document.getElementById('loading-progress');
    bar?.setAttribute('aria-valuenow', String(percent));
    bar?.setAttribute('aria-valuetext', `${percent}% dos arquivos processados`);
    const fill = document.getElementById('loading-progress-fill');
    if (fill) fill.style.width = `${percent}%`;
    const label = document.getElementById('loading-percent');
    if (label) label.textContent = `${percent}%`;
  }

  ready(enter: () => void) {
    this.updateProgress(1);
    this.enterDream = enter;
    const title = document.getElementById('loading-title');
    if (title) title.textContent = 'O santuário está pronto';
    this.setHidden('btn-enter-dream', false);
    document.getElementById('btn-enter-dream')?.focus();
  }

  failLoading() {
    this.stopTips();
    this.enterDream = undefined;
    const title = document.getElementById('loading-title');
    if (title) title.textContent = 'A travessia foi interrompida';
    const error = document.getElementById('loading-error');
    if (error) error.textContent = 'Não foi possível carregar todos os arquivos. Verifique sua conexão e tente novamente.';
    document.getElementById('loading-progress')?.setAttribute('aria-valuetext', 'Falha ao carregar os arquivos');
    const percent = document.getElementById('loading-percent');
    if (percent) percent.textContent = 'Falha';
    this.setHidden('loading-error', false);
    this.setHidden('btn-enter-dream', true);
    this.setHidden('btn-retry-loading', false);
    document.getElementById('btn-retry-loading')?.focus();
  }

  showGame() {
    this.stopTips();
    this.enterDream = undefined;
    this.setHidden('home-screen', true);
    this.setHidden('loading-screen', true);
    this.setHidden('ui-layer', false);
    this.syncAudio();
    document.getElementById('btn-pause')?.focus();
  }
}

export const screenFlow = new ScreenFlow();
