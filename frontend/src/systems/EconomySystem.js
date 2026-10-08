/**
 * EconomySystem — Gestão financeira e de recursos da partida
 */
export class EconomySystem {
    essence = 250;
    crystals = 100;
    light = 20;
    maxLight = 20;
    purifiedCount = 0;
    startTime = Date.now();
    isChallengeMode = false;
    onUpdateCallback;
    constructor() {
        this.startTime = Date.now();
    }
    setOnUpdate(cb) {
        this.onUpdateCallback = cb;
        this.notify();
    }
    notify() {
        if (this.onUpdateCallback) {
            this.onUpdateCallback({
                essence: this.essence,
                crystals: this.crystals,
                light: this.light,
            });
        }
    }
    getEssence() {
        return this.essence;
    }
    getCrystals() {
        return this.crystals;
    }
    getLight() {
        return this.light;
    }
    getPurifiedCount() {
        return this.purifiedCount;
    }
    setCrystals(val) {
        this.crystals = Math.max(0, val);
        this.notify();
    }
    addEssence(amount) {
        this.essence += amount;
        this.notify();
    }
    spendEssence(amount) {
        if (this.essence >= amount) {
            this.essence -= amount;
            this.notify();
            return true;
        }
        return false;
    }
    spendCrystals(amount) {
        if (this.crystals >= amount) {
            this.crystals -= amount;
            this.notify();
            return true;
        }
        return false;
    }
    addCrystals(amount) {
        this.crystals += amount;
        this.notify();
    }
    recordPurification(reward) {
        this.purifiedCount++;
        this.addEssence(reward);
    }
    takeDamage(damage) {
        this.light = Math.max(0, this.light - damage);
        this.notify();
        return this.light <= 0;
    }
    healLight(amount) {
        this.light = Math.min(this.maxLight, this.light + amount);
        this.notify();
    }
    calculateSellRefund(totalInvested) {
        return Math.floor(totalInvested * 0.7);
    }
    calculateFinalScore() {
        const elapsedSeconds = (Date.now() - this.startTime) / 1000;
        const timeBonus = Math.max(0, Math.floor(1000 - elapsedSeconds * 2));
        const baseScore = (this.light * 100) + this.essence + timeBonus + (this.purifiedCount * 15);
        return Math.floor(this.isChallengeMode ? baseScore * 1.5 : baseScore);
    }
}
//# sourceMappingURL=EconomySystem.js.map