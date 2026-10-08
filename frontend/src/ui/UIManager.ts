import { audioSynth } from '../systems/AudioSynth';
import { apiClient } from '../services/apiClient';
import { Guide } from '../entities/Guide';
import { screenAssets, trapDialogFocus } from './ScreenFlow';

export class UIManager {
  private events = new AbortController();
  private selectedGuideType: string | null = null;
  private inspectedGuide: Guide | null = null;
  private bannerTimer?: ReturnType<typeof setTimeout>;
  private balloonTimer?: ReturnType<typeof setTimeout>;

  // Callbacks para o jogo
  private onSelectGuideTypeCallback?: (type: string | null) => void;
  private onUpgradeGuideCallback?: (guide: Guide) => void;
  private onSellGuideCallback?: (guide: Guide) => void;
  private onToggleSpeedCallback?: () => void;
  private onTogglePauseCallback?: () => void;
  private onCallWaveEarlyCallback?: () => void;
  private onUsePowerUpCallback?: (powerUpId: string) => void;
  private onToggleAutoplayCallback?: () => void;
  private onRestartCallback?: () => void;
  private onReturnHomeCallback?: () => void;

  constructor() {
    this.bindEvents();
    this.checkBackendStatus();
  }

  public dispose() {
    this.events.abort();
    clearTimeout(this.bannerTimer);
    clearTimeout(this.balloonTimer);
    document.getElementById('wave-banner')?.classList.remove('active');
    this.closeInspector();
    this.hideBalloon();
    this.closeAllModals();
    this.deselectGuideCards();
    document.getElementById('btn-autoplay')?.classList.remove('active');
    const speed = document.getElementById('btn-speed');
    if (speed) speed.textContent = '1×';
    const pause = document.getElementById('btn-pause');
    if (pause) pause.textContent = '⏸';
  }

  public setCallbacks(callbacks: {
    onSelectGuideType?: (type: string | null) => void;
    onUpgradeGuide?: (guide: Guide) => void;
    onSellGuide?: (guide: Guide) => void;
    onToggleSpeed?: () => void;
    onTogglePause?: () => void;
    onCallWaveEarly?: () => void;
    onUsePowerUp?: (powerUpId: string) => void;
    onToggleAutoplay?: () => void;
    onRestart?: () => void;
    onReturnHome?: () => void;
  }) {
    this.onSelectGuideTypeCallback = callbacks.onSelectGuideType;
    this.onUpgradeGuideCallback = callbacks.onUpgradeGuide;
    this.onSellGuideCallback = callbacks.onSellGuide;
    this.onToggleSpeedCallback = callbacks.onToggleSpeed;
    this.onTogglePauseCallback = callbacks.onTogglePause;
    this.onCallWaveEarlyCallback = callbacks.onCallWaveEarly;
    this.onUsePowerUpCallback = callbacks.onUsePowerUp;
    this.onToggleAutoplayCallback = callbacks.onToggleAutoplay;
    this.onRestartCallback = callbacks.onRestart;
    this.onReturnHomeCallback = callbacks.onReturnHome;
  }

  private bindEvents() {
    document.addEventListener('keydown', event => {
      const backdrop = document.getElementById('modal-backdrop');
      if (!backdrop || backdrop.style.display !== 'flex') return;
      trapDialogFocus(event, backdrop);
    }, { signal: this.events.signal });
    // Seleção de guias na barra inferior
    const guideCards = document.querySelectorAll<HTMLElement>('.guide-card');
    guideCards.forEach((card) => {
      card.addEventListener('click', () => {
        const guideId = card.getAttribute('data-guide');
        if (this.selectedGuideType === guideId) {
          this.deselectGuideCards();
          if (this.onSelectGuideTypeCallback) this.onSelectGuideTypeCallback(null);
        } else {
          this.deselectGuideCards();
          card.classList.add('selected');
          this.selectedGuideType = guideId;
          audioSynth.playClick();
          if (this.onSelectGuideTypeCallback) this.onSelectGuideTypeCallback(guideId);
        }
      }, { signal: this.events.signal });
    });

    // Power-ups
    const powerUpButtons = document.querySelectorAll<HTMLElement>('.btn-powerup');
    powerUpButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const pwId = btn.id.replace('pw-', '');
        audioSynth.playClick();
        if (this.onUsePowerUpCallback) this.onUsePowerUpCallback(pwId);
      }, { signal: this.events.signal });
    });

    // Chamar Horda
    document.getElementById('btn-call-wave')?.addEventListener('click', () => {
      audioSynth.playClick();
      if (this.onCallWaveEarlyCallback) this.onCallWaveEarlyCallback();
    }, { signal: this.events.signal });

    // Velocidade
    const btnSpeed = document.getElementById('btn-speed');
    btnSpeed?.addEventListener('click', () => {
      audioSynth.playClick();
      if (this.onToggleSpeedCallback) this.onToggleSpeedCallback();
    }, { signal: this.events.signal });

    // Pausa
    const btnPause = document.getElementById('btn-pause');
    btnPause?.addEventListener('click', () => {
      audioSynth.playClick();
      if (this.onTogglePauseCallback) this.onTogglePauseCallback();
    }, { signal: this.events.signal });

    // Som / Mudo
    const btnAudio = document.getElementById('btn-audio');
    btnAudio?.addEventListener('click', () => {
      const isEnabled = audioSynth.isEnabled();
      audioSynth.setEnabled(!isEnabled);
      if (btnAudio) btnAudio.textContent = !isEnabled ? '🔊' : '🔇';
    }, { signal: this.events.signal });

    // Autoplay
    const btnAutoplay = document.getElementById('btn-autoplay');
    btnAutoplay?.addEventListener('click', () => {
      audioSynth.playClick();
      btnAutoplay.classList.toggle('active');
      if (this.onToggleAutoplayCallback) this.onToggleAutoplayCallback();
    }, { signal: this.events.signal });

    // Inspetor de Torre
    document.getElementById('btn-close-inspector')?.addEventListener('click', () => {
      this.closeInspector();
    }, { signal: this.events.signal });

    document.getElementById('btn-upgrade')?.addEventListener('click', () => {
      if (this.inspectedGuide && this.onUpgradeGuideCallback) {
        audioSynth.playClick();
        this.onUpgradeGuideCallback(this.inspectedGuide);
        this.updateInspectorContent();
      }
    }, { signal: this.events.signal });

    document.getElementById('btn-sell')?.addEventListener('click', () => {
      if (this.inspectedGuide && this.onSellGuideCallback) {
        audioSynth.playClick();
        this.onSellGuideCallback(this.inspectedGuide);
        this.closeInspector();
      }
    }, { signal: this.events.signal });

    document.getElementById('btn-target-toggle')?.addEventListener('click', () => {
      if (this.inspectedGuide) {
        audioSynth.playClick();
        this.inspectedGuide.toggleTargetMode();
        this.updateInspectorContent();
      }
    }, { signal: this.events.signal });

    // Balão Narrativo
    document.getElementById('btn-close-balloon')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hideBalloon();
    }, { signal: this.events.signal });

    document.getElementById('comic-balloon')?.addEventListener('click', () => {
      this.hideBalloon();
    }, { signal: this.events.signal });

    // Modais
    document.getElementById('btn-open-store')?.addEventListener('click', () => {
      this.openModal('modal-store');
    }, { signal: this.events.signal });

    document.getElementById('btn-open-ranking')?.addEventListener('click', () => {
      this.openModal('modal-ranking');
      this.loadRanking();
    }, { signal: this.events.signal });

    document.getElementById('btn-settings')?.addEventListener('click', () => {
      this.openModal('modal-settings');
    }, { signal: this.events.signal });

    document.querySelectorAll('[data-close]').forEach((el) => {
      el.addEventListener('click', () => {
        this.closeAllModals();
      }, { signal: this.events.signal });
    });

    // Compras na Loja de Cristais (Simulação Integrada)
    document.querySelectorAll('.btn-buy-pack').forEach((btn) => {
      btn.addEventListener('click', async () => {
        audioSynth.playClick();
        const pack = btn.getAttribute('data-pack');
        const crystals = pack === 'pack_small' ? 120 : pack === 'pack_medium' ? 260 : 600;
        await apiClient.updateWalletBalance(crystals);
        this.updateStats({ crystals: Number(localStorage.getItem('torre_crystals') ?? '100') });
        alert(`Pacote adquirido com sucesso! +${crystals} Cristais creditados.`);
        this.closeAllModals();
      }, { signal: this.events.signal });
    });

    // Anúncio Recompensado
    document.getElementById('btn-watch-ad')?.addEventListener('click', async () => {
      audioSynth.playBell();
      await apiClient.updateWalletBalance(25);
      this.updateStats({ crystals: Number(localStorage.getItem('torre_crystals') ?? '100') });
      alert("Anúncio assistido! Recompensa de +25 Cristais creditada.");
      this.closeAllModals();
    }, { signal: this.events.signal });

    // Reiniciar Jogo
    document.getElementById('btn-restart-game')?.addEventListener('click', () => {
      this.closeAllModals();
      if (this.onRestartCallback) this.onRestartCallback();
    }, { signal: this.events.signal });
    document.getElementById('btn-result-home')?.addEventListener('click', () => {
      this.closeAllModals();
      this.onReturnHomeCallback?.();
    }, { signal: this.events.signal });

    // Prompt de rotação mobile
    const dismissRotateBtn = document.getElementById('btn-dismiss-rotate');
    const rotatePrompt = document.getElementById('rotate-device-prompt');
    let rotateDismissed = false;

    dismissRotateBtn?.addEventListener('click', () => {
      rotateDismissed = true;
      if (rotatePrompt) rotatePrompt.style.display = 'none';
      audioSynth.playClick();
    }, { signal: this.events.signal });

    const checkOrientation = () => {
      if (rotateDismissed || !rotatePrompt) return;
      const isMobile = window.innerWidth <= 820;
      const isPortrait = window.innerHeight > window.innerWidth;
      rotatePrompt.style.display = isMobile && isPortrait ? 'flex' : 'none';
    };

    window.addEventListener('resize', checkOrientation, { signal: this.events.signal });
    window.addEventListener('orientationchange', checkOrientation, { signal: this.events.signal });
    checkOrientation();
  }

  public deselectGuideCards() {
    document.querySelectorAll('.guide-card').forEach((c) => c.classList.remove('selected'));
    this.selectedGuideType = null;
  }

  public updateStats(stats: { essence?: number; crystals?: number; light?: number }) {
    if (stats.light !== undefined) {
      const el = document.getElementById('val-light');
      if (el) el.textContent = String(stats.light);
    }
    if (stats.essence !== undefined) {
      const el = document.getElementById('val-essence');
      if (el) el.textContent = String(stats.essence);
    }
    if (stats.crystals !== undefined) {
      const el = document.getElementById('val-crystals');
      if (el) el.textContent = String(stats.crystals);
    }
  }

  public updateWaveInfo(wave: number, total: number, title?: string) {
    const waveEl = document.getElementById('wave-title');
    if (waveEl) waveEl.textContent = title || `Horda ${wave} de ${total}`;

    const fillEl = document.getElementById('wave-progress-fill');
    if (fillEl) fillEl.style.width = `${(wave / total) * 100}%`;
  }

  public showWaveBanner(text: string) {
    const banner = document.getElementById('wave-banner');
    const txt = document.getElementById('banner-text');
    if (banner && txt) {
      clearTimeout(this.bannerTimer);
      txt.textContent = text;
      banner.classList.add('active');
      this.bannerTimer = setTimeout(() => {
        banner.classList.remove('active');
      }, 2200);
    }
  }

  public showBalloon(speaker: string, text: string, avatar: string = '✨') {
    clearTimeout(this.balloonTimer);
    const balloon = document.getElementById('comic-balloon');
    const spk = document.getElementById('balloon-speaker');
    const txt = document.getElementById('balloon-text');
    const av = document.getElementById('balloon-avatar');
    const timerBar = document.getElementById('balloon-timer-bar');

    if (balloon && spk && txt && av) {
      spk.textContent = speaker;
      txt.textContent = text;
      av.textContent = avatar;
      balloon.classList.remove('dismissing');
      balloon.style.display = 'flex';

      if (timerBar) {
        timerBar.classList.remove('active');
        void timerBar.offsetWidth;
        timerBar.classList.add('active');
      }

      this.balloonTimer = setTimeout(() => {
        this.hideBalloon();
      }, 4000);
    }
  }

  public hideBalloon() {
    clearTimeout(this.balloonTimer);
    const balloon = document.getElementById('comic-balloon');
    if (balloon && balloon.style.display !== 'none') {
      balloon.classList.add('dismissing');
      setTimeout(() => {
        if (balloon.classList.contains('dismissing')) {
          balloon.style.display = 'none';
          balloon.classList.remove('dismissing');
        }
      }, 250);
    }
  }

  public inspectGuide(guide: Guide) {
    this.inspectedGuide = guide;
    const panel = document.getElementById('guide-inspector');
    if (panel) {
      panel.style.display = 'block';
      this.updateInspectorContent();
    }
  }

  public closeInspector() {
    this.inspectedGuide = null;
    const panel = document.getElementById('guide-inspector');
    if (panel) panel.style.display = 'none';
  }

  private updateInspectorContent() {
    if (!this.inspectedGuide) return;

    const guide = this.inspectedGuide;
    const levelData = guide.getLevelData();
    const nextData = guide.getNextLevelData();

    // Arte do herói no fundo com overlay escuro
    const backdrop = document.getElementById('inspector-art-backdrop');
    if (backdrop) {
      const portraits: Record<string, string> = {
        mentor: '/assets/astral/portrait_mentor.png',
        benzedeira: '/assets/astral/portrait_benzedeira.png',
        paje: '/assets/astral/portrait_paje.png',
      };
      const portraitUrl = portraits[guide.guideId] || '/assets/astral/portrait_mentor.png';
      backdrop.style.backgroundImage = `url('${portraitUrl}')`;
    }

    const nameEl = document.getElementById('inspector-name');
    const roleEl = document.getElementById('inspector-role');
    const descEl = document.getElementById('inspector-desc');
    const dmgEl = document.getElementById('inspector-dmg');
    const rateEl = document.getElementById('inspector-rate');
    const rangeEl = document.getElementById('inspector-range');
    const targetModeEl = document.getElementById('target-mode');
    const btnUpgrade = document.getElementById('btn-upgrade') as HTMLButtonElement;
    const upgradeLvlEl = document.getElementById('upgrade-lvl');
    const upgradeCostEl = document.getElementById('upgrade-cost');
    const sellRefundEl = document.getElementById('sell-refund');

    if (nameEl) nameEl.textContent = guide.guideName;
    if (roleEl) roleEl.textContent = `Nv. ${guide.getLevel()} • ${levelData.title}`;
    if (descEl) descEl.textContent = levelData.effect;
    if (dmgEl) dmgEl.textContent = String(levelData.damage);
    if (rateEl) rateEl.textContent = `${levelData.attackRate}/s`;
    if (rangeEl) rangeEl.textContent = `${(levelData.range / 80).toFixed(1)}`;
    if (targetModeEl) targetModeEl.textContent = guide.targetMode === 'first' ? '1º Alvo' : 'Mais Forte';

    // Atualiza preenchimento visual das barras de atributo
    const barDmg = document.getElementById('bar-dmg');
    const barRate = document.getElementById('bar-rate');
    const barRange = document.getElementById('bar-range');
    if (barDmg) barDmg.style.width = `${Math.min(100, (levelData.damage / 32) * 100)}%`;
    if (barRate) barRate.style.width = `${Math.min(100, (levelData.attackRate / 2.2) * 100)}%`;
    if (barRange) barRange.style.width = `${Math.min(100, (levelData.range / 260) * 100)}%`;

    if (sellRefundEl) {
      sellRefundEl.textContent = String(Math.floor(guide.totalInvested * 0.7));
    }

    if (btnUpgrade && upgradeLvlEl && upgradeCostEl) {
      if (nextData) {
        btnUpgrade.disabled = false;
        upgradeLvlEl.textContent = String(guide.getLevel() + 1);
        upgradeCostEl.textContent = String(nextData.cost);
      } else {
        btnUpgrade.disabled = true;
        upgradeLvlEl.textContent = 'Máx';
        upgradeCostEl.textContent = '—';
      }
    }
  }

  public openModal(modalId: string) {
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop) backdrop.style.display = 'flex';

    document.querySelectorAll('.modal-card').forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });

    const target = document.getElementById(modalId);
    if (target) target.style.display = 'block';
  }

  public closeAllModals() {
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop) backdrop.style.display = 'none';

    document.querySelectorAll('.modal-card').forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });
  }

  public showGameOver(won: boolean, score: number, light: number, purified: number) {
    this.openModal('modal-gameover');
    const title = document.getElementById('gameover-title');
    const sub = document.getElementById('gameover-subtitle');
    const sc = document.getElementById('go-score');
    const li = document.getElementById('go-light');
    const pur = document.getElementById('go-purified');

    document.getElementById('modal-gameover')?.setAttribute('data-outcome', won ? 'win' : 'loss');
    const art = document.getElementById('gameover-art') as HTMLImageElement | null;
    if (art) {
      art.src = won ? screenAssets.victory : screenAssets.defeat;
      art.alt = won ? 'Guardiões celebram o sonho protegido ao amanhecer.' : 'Guardiões exaustos junto ao cristal fraturado no santuário.';
    }
    const eyebrow = document.getElementById('gameover-eyebrow');
    if (eyebrow) eyebrow.textContent = won ? 'Vitória · Santuário do Sonho' : 'Derrota · Uma nova chance';
    if (title) title.textContent = won ? 'O sonho está protegido' : 'A noite ainda não acabou';
    if (sub) sub.textContent = won ? 'O Colosso do Eclipse foi purificado. O sonho está em equilíbrio.' : 'O eclipse alcançou o núcleo. Reúna seus protetores e tente novamente.';
    if (sc) sc.textContent = String(score);
    if (li) li.textContent = String(light);
    if (pur) pur.textContent = String(purified);
    // No crystal reward is currently credited by game logic: never invent one in the card.
    const reward = document.getElementById('go-reward');
    if (reward) reward.textContent = 'Sem recompensa de Cristais nesta partida';
    const replay = document.getElementById('btn-restart-game');
    if (replay) replay.textContent = won ? 'Proteger outro sonho' : 'Tentar novamente';
    replay?.focus();

    if (won) {
      audioSynth.playBell();
      if (!(import.meta.env.DEV && (new URLSearchParams(location.search).get('qa') === '1' || new URLSearchParams(location.search).get('artPreview') === '1'))) apiClient.submitScore({
        player_name: "Guardião Astral",
        score,
        remaining_light: light,
        wave_reached: 4,
        mode: "normal",
      });
    }
  }

  private async loadRanking() {
    const tbody = document.getElementById('ranking-list');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="4" class="text-center">Consultando ranking...</td></tr>';
    const list = await apiClient.getWeeklyRanking();

    tbody.innerHTML = '';
    list.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>#${index + 1}</strong></td>
        <td>${item.player_name}</td>
        <td>${item.remaining_light} 🕯️</td>
        <td><strong>${item.score}</strong></td>
      `;
      tbody.appendChild(row);
    });
  }

  private async checkBackendStatus() {
    const badge = document.getElementById('backend-status-badge');
    const isOnline = await apiClient.checkHealth();
    if (badge) {
      badge.textContent = isOnline ? 'Online (FastAPI :8000)' : 'Modo Offline (LocalStorage)';
      badge.style.color = isOnline ? '#48BB78' : '#ED8936';
    }
  }
}
