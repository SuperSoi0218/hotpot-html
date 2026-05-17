/** 游戏主界面 HUD - 显示金币/钻石/等级等 */
import { EventBus, GameEvents } from '../core/EventBus';
import { GameManager } from '../core/GameManager';

export class GameHUD {
  private goldLabel: any = null;
  private diamondLabel: any = null;
  private levelLabel: any = null;
  private expBar: any = null;

  constructor() {
    this.registerEvents();
  }

  private registerEvents(): void {
    EventBus.on(GameEvents.GOLD_CHANGED, (amount: number) => this.updateGold(amount));
    EventBus.on(GameEvents.DIAMOND_CHANGED, (amount: number) => this.updateDiamond(amount));
    EventBus.on(GameEvents.RESTAURANT_LEVEL_UP, (level: number) => this.updateLevel(level));
  }

  /** 初始化 HUD 数据 */
  init(): void {
    const gm = GameManager.getInstance();
    this.updateGold(gm.playerData.gold);
    this.updateDiamond(gm.playerData.diamond);
    this.updateLevel(gm.playerData.level);
  }

  private updateGold(amount: number): void {
    console.log(`[HUD] 金币: ${amount}`);
  }

  private updateDiamond(amount: number): void {
    console.log(`[HUD] 钻石: ${amount}`);
  }

  private updateLevel(level: number): void {
    console.log(`[HUD] 等级: ${level}`);
  }
}
