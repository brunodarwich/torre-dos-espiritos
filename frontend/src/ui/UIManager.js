import { audioSynth } from '../systems/AudioSynth';
import { apiClient } from '../services/apiClient';
export class UIManager {
    selectedGuideType = null;
    inspectedGuide = null;
    // Callbacks para o jogo
    onSelectGuideTypeCallback;
    onUpgradeGuideCallback;
    onSellGuideCallback;
    onToggleSpeedCallback;
    onTogglePauseCallback;
    onCallWaveEarlyCallback;
    onUsePowerUpCallback;
    onToggleAutoplayCallback;
    onRestartCallback;
    constructor() {
        this.bindEvents();
        this.checkBackendStatus();
    }
    setCallbacks(callbacks) {
        this.onSelectGuideTypeCallback = callbacks.onSelectGuideType;
        this.onUpgradeGuideCallback = callbacks.onUpgradeGuide;
        this.onSellGuideCallback = callbacks.onSellGuide;
        this.onToggleSpeedCallback = callbacks.onToggleSpeed;
        this.onTogglePauseCallback = callbacks.onTogglePause;
        this.onCallWaveEarlyCallback = callbacks.onCallWaveEarly;
        this.onUsePowerUpCallback = callbacks.onUsePowerUp;
        this.onToggleAutoplayCallback = callbacks.onToggleAutoplay;
        this.onRestartCallback = callbacks.onRestart;
    }
    bindEvents() {
        // Seleção de guias na barra inferior
        const guideCards = document.querySelectorAll('.guide-card');
        guideCards.forEach((card) => {
            card.addEventListener('click', () => {
                const guideId = card.getAttribute('data-guide');
                if (this.selectedGuideType === guideId) {
                    this.deselectGuideCards();
                    if (this.onSelectGuideTypeCallback)
                        this.onSelectGuideTypeCallback(null);
                }
                else {
                    this.deselectGuideCards();
                    card.classList.add('selected');
                    this.selectedGuideType = guideId;
                    audioSynth.playClick();
                    if (this.onSelectGuideTypeCallback)
                        this.onSelectGuideTypeCallback(guideId);
                }
            });
        });
        // Power-ups
        const powerUpButtons = document.querySelectorAll('.btn-powerup');
        powerUpButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const pwId = btn.id.replace('pw-', '');
                audioSynth.playClick();
                if (this.onUsePowerUpCallback)
                    this.onUsePowerUpCallback(pwId);
            });
        });
        // Chamar Horda
        document.getElementById('btn-call-wave')?.addEventListener('click', () => {
            audioSynth.playClick();
            if (this.onCallWaveEarlyCallback)
                this.onCallWaveEarlyCallback();
        });
        // Velocidade
        const btnSpeed = document.getElementById('btn-speed');
        btnSpeed?.addEventListener('click', () => {
            audioSynth.playClick();
            if (this.onToggleSpeedCallback)
                this.onToggleSpeedCallback();
        });
        // Pausa
        const btnPause = document.getElementById('btn-pause');
        btnPause?.addEventListener('click', () => {
            audioSynth.playClick();
            if (this.onTogglePauseCallback)
                this.onTogglePauseCallback();
        });
        // Som / Mudo
        const btnAudio = document.getElementById('btn-audio');
        btnAudio?.addEventListener('click', () => {
            const isEnabled = audioSynth.isEnabled();
            audioSynth.setEnabled(!isEnabled);
            if (btnAudio)
                btnAudio.textContent = !isEnabled ? '🔊' : '🔇';
        });
        // Autoplay
        const btnAutoplay = document.getElementById('btn-autoplay');
        btnAutoplay?.addEventListener('click', () => {
            audioSynth.playClick();
            btnAutoplay.classList.toggle('active');
            if (this.onToggleAutoplayCallback)
                this.onToggleAutoplayCallback();
        });
        // Inspetor de Torre
        document.getElementById('btn-close-inspector')?.addEventListener('click', () => {
            this.closeInspector();
        });
        document.getElementById('btn-upgrade')?.addEventListener('click', () => {
            if (this.inspectedGuide && this.onUpgradeGuideCallback) {
                audioSynth.playClick();
                this.onUpgradeGuideCallback(this.inspectedGuide);
                this.updateInspectorContent();
            }
        });
        document.getElementById('btn-sell')?.addEventListener('click', () => {
            if (this.inspectedGuide && this.onSellGuideCallback) {
                audioSynth.playClick();
                this.onSellGuideCallback(this.inspectedGuide);
                this.closeInspector();
            }
        });
        document.getElementById('btn-target-toggle')?.addEventListener('click', () => {
            if (this.inspectedGuide) {
                audioSynth.playClick();
                this.inspectedGuide.toggleTargetMode();
                this.updateInspectorContent();
            }
        });
        // Balão Narrativo
        document.getElementById('btn-close-balloon')?.addEventListener('click', () => {
            this.hideBalloon();
        });
        // Modais
        document.getElementById('btn-open-store')?.addEventListener('click', () => {
            this.openModal('modal-store');
        });
        document.getElementById('btn-open-ranking')?.addEventListener('click', () => {
            this.openModal('modal-ranking');
            this.loadRanking();
        });
        document.getElementById('btn-settings')?.addEventListener('click', () => {
            this.openModal('modal-settings');
        });
        document.querySelectorAll('[data-close]').forEach((el) => {
            el.addEventListener('click', () => {
                this.closeAllModals();
            });
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
            });
        });
        // Anúncio Recompensado
        document.getElementById('btn-watch-ad')?.addEventListener('click', async () => {
            audioSynth.playBell();
            await apiClient.updateWalletBalance(25);
            this.updateStats({ crystals: Number(localStorage.getItem('torre_crystals') ?? '100') });
            alert("Anúncio assistido! Recompensa de +25 Cristais creditada.");
            this.closeAllModals();
        });
        // Reiniciar Jogo
        document.getElementById('btn-restart-game')?.addEventListener('click', () => {
            this.closeAllModals();
            if (this.onRestartCallback)
                this.onRestartCallback();
        });
    }
    deselectGuideCards() {
        document.querySelectorAll('.guide-card').forEach((c) => c.classList.remove('selected'));
        this.selectedGuideType = null;
    }
    updateStats(stats) {
        if (stats.light !== undefined) {
            const el = document.getElementById('val-light');
            if (el)
                el.textContent = String(stats.light);
        }
        if (stats.essence !== undefined) {
            const el = document.getElementById('val-essence');
            if (el)
                el.textContent = String(stats.essence);
        }
        if (stats.crystals !== undefined) {
            const el = document.getElementById('val-crystals');
            if (el)
                el.textContent = String(stats.crystals);
        }
    }
    updateWaveInfo(wave, total, title) {
        const waveEl = document.getElementById('wave-title');
        if (waveEl)
            waveEl.textContent = title || `Horda ${wave} de ${total}`;
        const fillEl = document.getElementById('wave-progress-fill');
        if (fillEl)
            fillEl.style.width = `${(wave / total) * 100}%`;
    }
    showWaveBanner(text) {
        const banner = document.getElementById('wave-banner');
        const txt = document.getElementById('banner-text');
        if (banner && txt) {
            txt.textContent = text;
            banner.classList.add('active');
            setTimeout(() => {
                banner.classList.remove('active');
            }, 2200);
        }
    }
    showBalloon(speaker, text, avatar = '✨') {
        const balloon = document.getElementById('comic-balloon');
        const spk = document.getElementById('balloon-speaker');
        const txt = document.getElementById('balloon-text');
        const av = document.getElementById('balloon-avatar');
        if (balloon && spk && txt && av) {
            spk.textContent = speaker;
            txt.textContent = text;
            av.textContent = avatar;
            balloon.style.display = 'flex';
        }
    }
    hideBalloon() {
        const balloon = document.getElementById('comic-balloon');
        if (balloon)
            balloon.style.display = 'none';
    }
    inspectGuide(guide) {
        this.inspectedGuide = guide;
        const panel = document.getElementById('guide-inspector');
        if (panel) {
            panel.style.display = 'block';
            this.updateInspectorContent();
        }
    }
    closeInspector() {
        this.inspectedGuide = null;
        const panel = document.getElementById('guide-inspector');
        if (panel)
            panel.style.display = 'none';
    }
    updateInspectorContent() {
        if (!this.inspectedGuide)
            return;
        const guide = this.inspectedGuide;
        const levelData = guide.getLevelData();
        const nextData = guide.getNextLevelData();
        const nameEl = document.getElementById('inspector-name');
        const roleEl = document.getElementById('inspector-role');
        const descEl = document.getElementById('inspector-desc');
        const dmgEl = document.getElementById('inspector-dmg');
        const rateEl = document.getElementById('inspector-rate');
        const rangeEl = document.getElementById('inspector-range');
        const targetModeEl = document.getElementById('target-mode');
        const btnUpgrade = document.getElementById('btn-upgrade');
        const upgradeLvlEl = document.getElementById('upgrade-lvl');
        const upgradeCostEl = document.getElementById('upgrade-cost');
        const sellRefundEl = document.getElementById('sell-refund');
        if (nameEl)
            nameEl.textContent = guide.guideName;
        if (roleEl)
            roleEl.textContent = `Nível ${guide.getLevel()} • ${levelData.title}`;
        if (descEl)
            descEl.textContent = levelData.effect;
        if (dmgEl)
            dmgEl.textContent = String(levelData.damage);
        if (rateEl)
            rateEl.textContent = `${levelData.attackRate}/s`;
        if (rangeEl)
            rangeEl.textContent = `${(levelData.range / 80).toFixed(1)} cél.`;
        if (targetModeEl)
            targetModeEl.textContent = guide.targetMode === 'first' ? 'Primeiro' : 'Mais Forte';
        if (sellRefundEl) {
            sellRefundEl.textContent = String(Math.floor(guide.totalInvested * 0.7));
        }
        if (btnUpgrade && upgradeLvlEl && upgradeCostEl) {
            if (nextData) {
                btnUpgrade.disabled = false;
                upgradeLvlEl.textContent = String(guide.getLevel() + 1);
                upgradeCostEl.textContent = String(nextData.cost);
            }
            else {
                btnUpgrade.disabled = true;
                btnUpgrade.innerHTML = '<span>Nível Máximo</span>';
            }
        }
    }
    openModal(modalId) {
        const backdrop = document.getElementById('modal-backdrop');
        if (backdrop)
            backdrop.style.display = 'flex';
        document.querySelectorAll('.modal-card').forEach((el) => {
            el.style.display = 'none';
        });
        const target = document.getElementById(modalId);
        if (target)
            target.style.display = 'block';
    }
    closeAllModals() {
        const backdrop = document.getElementById('modal-backdrop');
        if (backdrop)
            backdrop.style.display = 'none';
        document.querySelectorAll('.modal-card').forEach((el) => {
            el.style.display = 'none';
        });
    }
    showGameOver(won, score, light, purified) {
        this.openModal('modal-gameover');
        const title = document.getElementById('gameover-title');
        const sub = document.getElementById('gameover-subtitle');
        const sc = document.getElementById('go-score');
        const li = document.getElementById('go-light');
        const pur = document.getElementById('go-purified');
        if (title)
            title.textContent = won ? 'AURORA ALCANÇADA!' : 'A PESSOA ACORDOU!';
        if (sub)
            sub.textContent = won ? 'O Obsessor-Mor foi purificado e a paz astral reina.' : 'A perturbação acordou o corpo físico. Tente novamente.';
        if (sc)
            sc.textContent = String(score);
        if (li)
            li.textContent = String(light);
        if (pur)
            pur.textContent = String(purified);
        if (won) {
            audioSynth.playBell();
            apiClient.submitScore({
                player_name: "Guardião Astral",
                score,
                remaining_light: light,
                wave_reached: 4,
                mode: "normal",
            });
        }
    }
    async loadRanking() {
        const tbody = document.getElementById('ranking-list');
        if (!tbody)
            return;
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
    async checkBackendStatus() {
        const badge = document.getElementById('backend-status-badge');
        const isOnline = await apiClient.checkHealth();
        if (badge) {
            badge.textContent = isOnline ? 'Online (FastAPI :8000)' : 'Modo Offline (LocalStorage)';
            badge.style.color = isOnline ? '#48BB78' : '#ED8936';
        }
    }
}
//# sourceMappingURL=UIManager.js.map