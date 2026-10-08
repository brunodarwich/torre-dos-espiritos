/**
 * AudioSynth — Sintetizador Procedural Web Audio API
 * Produz sons harmoniosos, suaves e espirituais sem peso de download.
 */
export class AudioSynth {
    ctx = null;
    enabled = true;
    constructor() {
        // Inicialização atrasada no primeiro gesto de interação
    }
    initContext() {
        if (!this.ctx && typeof window !== 'undefined') {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    isEnabled() {
        return this.enabled;
    }
    /**
     * Som de Purificação de Espírito (Chime de Luz Celestial)
     */
    playPurify() {
        if (!this.enabled)
            return;
        this.initContext();
        if (!this.ctx)
            return;
        const now = this.ctx.currentTime;
        const notes = [587.33, 880, 1174.66]; // D5, A5, D6 (harmonia de luz)
        notes.forEach((freq, idx) => {
            if (!this.ctx)
                return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);
            gain.gain.setValueAtTime(0.08, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.4);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 0.45);
        });
    }
    /**
     * Som de Disparo do Mentor de Luz (Feixe cristalino)
     */
    playLaser() {
        if (!this.enabled)
            return;
        this.initContext();
        if (!this.ctx)
            return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
    }
    /**
     * Som da Benzedeira (Sussurro suave de folhas e oração)
     */
    playHerbs() {
        if (!this.enabled)
            return;
        this.initContext();
        if (!this.ctx)
            return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(330, now + 0.25);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
    }
    /**
     * Som do Pajé (Fogo Sagrado e Tambor grave)
     */
    playFire() {
        if (!this.enabled)
            return;
        this.initContext();
        if (!this.ctx)
            return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.31);
    }
    /**
     * Sino Tibetano de Início / Fim de Horda
     */
    playBell() {
        if (!this.enabled)
            return;
        this.initContext();
        if (!this.ctx)
            return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, now); // Frequência do amor/cura 528Hz
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 1.3);
    }
    /**
     * Clique suave de madeira no HUD
     */
    playClick() {
        if (!this.enabled)
            return;
        this.initContext();
        if (!this.ctx)
            return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
    }
}
export const audioSynth = new AudioSynth();
//# sourceMappingURL=AudioSynth.js.map