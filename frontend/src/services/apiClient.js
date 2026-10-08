/**
 * API Client — Comunicação com o backend FastAPI (Marco 3)
 * Inclui resiliência Offline-First com fallback automático para localStorage.
 */
const API_BASE = '/api'; // Redirecionado pelo proxy do Vite para http://localhost:8000
export class ApiClient {
    isOnline = true;
    constructor() {
        this.checkHealth();
    }
    async checkHealth() {
        try {
            const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
            this.isOnline = res.ok;
            return res.ok;
        }
        catch {
            this.isOnline = false;
            return false;
        }
    }
    getOnlineStatus() {
        return this.isOnline;
    }
    /**
     * Busca saldo de cristais (ou resgata do localStorage se offline)
     */
    async getWalletBalance() {
        const local = Number(localStorage.getItem('torre_crystals') ?? '100');
        if (!this.isOnline)
            return local;
        try {
            const res = await fetch(`${API_BASE}/wallet`);
            if (res.ok) {
                const data = await res.json();
                const balance = data.balance ?? local;
                localStorage.setItem('torre_crystals', String(balance));
                return balance;
            }
        }
        catch {
            this.isOnline = false;
        }
        return local;
    }
    /**
     * Atualiza saldo local e tenta sincronizar com API
     */
    async updateWalletBalance(delta) {
        const current = Number(localStorage.getItem('torre_crystals') ?? '100');
        const newBalance = Math.max(0, current + delta);
        localStorage.setItem('torre_crystals', String(newBalance));
        if (this.isOnline) {
            try {
                const endpoint = delta >= 0 ? `${API_BASE}/wallet/earn` : `${API_BASE}/wallet/spend`;
                await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: Math.abs(delta) }),
                });
            }
            catch {
                // Modo silencioso, valor já salvo localmente
            }
        }
        return newBalance;
    }
    /**
     * Busca ranking semanal Top 100
     */
    async getWeeklyRanking() {
        if (this.isOnline) {
            try {
                const res = await fetch(`${API_BASE}/scores/weekly`);
                if (res.ok) {
                    const list = await res.json();
                    if (Array.isArray(list) && list.length > 0) {
                        return list;
                    }
                }
            }
            catch {
                this.isOnline = false;
            }
        }
        // Mock gracioso para exibição offline inicial
        return [
            { id: 1, player_name: "Camila (Guardiã)", score: 2850, remaining_light: 20, created_at: "Hoje" },
            { id: 2, player_name: "Bruno D.", score: 2600, remaining_light: 18, created_at: "Hoje" },
            { id: 3, player_name: "Médium Astral", score: 2320, remaining_light: 16, created_at: "Ontem" },
            { id: 4, player_name: "Luz Eterna", score: 1980, remaining_light: 15, created_at: "Ontem" },
            { id: 5, player_name: "Defensor das Sombras", score: 1750, remaining_light: 12, created_at: "Ontem" },
        ];
    }
    /**
     * Envia pontuação final
     */
    async submitScore(data) {
        if (this.isOnline) {
            try {
                const res = await fetch(`${API_BASE}/scores`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (res.ok)
                    return true;
            }
            catch {
                this.isOnline = false;
            }
        }
        // Salva no histórico local
        const history = JSON.parse(localStorage.getItem('torre_scores_history') ?? '[]');
        history.push({ ...data, created_at: new Date().toISOString() });
        localStorage.setItem('torre_scores_history', JSON.stringify(history));
        return true;
    }
    /**
     * Dispara telemetria para /events
     */
    async trackEvent(eventName, props = {}) {
        if (this.isOnline) {
            try {
                await fetch(`${API_BASE}/events`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ event: eventName, properties: props, timestamp: Date.now() }),
                });
            }
            catch {
                // Silencioso
            }
        }
    }
    /**
     * Envia feedback do jogador
     */
    async sendFeedback(message, email) {
        if (this.isOnline) {
            try {
                const res = await fetch(`${API_BASE}/feedback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message, email }),
                });
                return res.ok;
            }
            catch {
                return false;
            }
        }
        return true;
    }
}
export const apiClient = new ApiClient();
//# sourceMappingURL=apiClient.js.map