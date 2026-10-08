/**
 * EconomySystem — Gestão financeira e de recursos da partida
 */
export class EconomySystem {
  private essence: number = 250;
  private crystals: number = 100;
  private light: number = 20;
  private maxLight: number = 20;
  private purifiedCount: number = 0;
  private startTime: number = Date.now();
  private isChallengeMode: boolean = false;

  private onUpdateCallback?: (stats: { essence: number; crystals: number; light: number }) => void;

  constructor() {
    this.startTime = Date.now();
  }

  public setOnUpdate(cb: (stats: { essence: number; crystals: number; light: number }) => void) {
    this.onUpdateCallback = cb;
    this.notify();
  }

  private notify() {
    if (this.onUpdateCallback) {
      this.onUpdateCallback({
        essence: this.essence,
        crystals: this.crystals,
        light: this.light,
      });
    }
  }

  public getEssence(): number {
    return this.essence;
  }

  public getCrystals(): number {
    return this.crystals;
  }

  public getLight(): number {
    return this.light;
  }

  public getPurifiedCount(): number {
    return this.purifiedCount;
  }

  public setCrystals(val: number) {
    this.crystals = Math.max(0, val);
    this.notify();
  }

  public addEssence(amount: number) {
    this.essence += amount;
    this.notify();
  }

  public spendEssence(amount: number): boolean {
    if (this.essence >= amount) {
      this.essence -= amount;
      this.notify();
      return true;
    }
    return false;
  }

  public spendCrystals(amount: number): boolean {
    if (this.crystals >= amount) {
      this.crystals -= amount;
      this.notify();
      return true;
    }
    return false;
  }

  public addCrystals(amount: number) {
    this.crystals += amount;
    this.notify();
  }

  public recordPurification(reward: number) {
    this.purifiedCount++;
    this.addEssence(reward);
  }

  public takeDamage(damage: number): boolean {
    this.light = Math.max(0, this.light - damage);
    this.notify();
    return this.light <= 0;
  }

  public healLight(amount: number) {
    this.light = Math.min(this.maxLight, this.light + amount);
    this.notify();
  }

  public calculateSellRefund(totalInvested: number): number {
    return Math.floor(totalInvested * 0.7);
  }

  public calculateFinalScore(): number {
    const elapsedSeconds = (Date.now() - this.startTime) / 1000;
    const timeBonus = Math.max(0, Math.floor(1000 - elapsedSeconds * 2));
    const baseScore = (this.light * 100) + this.essence + timeBonus + (this.purifiedCount * 15);
    return Math.floor(this.isChallengeMode ? baseScore * 1.5 : baseScore);
  }
}
