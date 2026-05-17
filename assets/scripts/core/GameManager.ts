/** 游戏全局管理器 - 单例 */
import { EventBus } from './EventBus';

export class GameManager {
  private static instance: GameManager;

  // 玩家数据
  playerData: PlayerData = { gold: 0, diamond: 0, level: 1, exp: 0 };
  // 店铺数据
  restaurantData: RestaurantData = {
    level: 1, name: '老火锅店', decorId: 1,
    seats: 4, cleanliness: 100, popularity: 0
  };

  static getInstance(): GameManager {
    if (!this.instance) this.instance = new GameManager();
    return this.instance;
  }

  /** 初始化游戏 */
  async init(): Promise<void> {
    await this.loadGameData();
    EventBus.emit('game_ready');
  }

  /** 保存游戏 */
  async saveGameData(): Promise<void> {
    // 平台云存档
    EventBus.emit('save_complete');
  }

  /** 读取存档 */
  async loadGameData(): Promise<void> {
    EventBus.emit('load_complete');
  }

  /** 添加金币 */
  addGold(amount: number): void {
    this.playerData.gold += amount;
    EventBus.emit('gold_changed', this.playerData.gold);
  }

  /** 添加钻石 */
  addDiamond(amount: number): void {
    this.playerData.diamond += amount;
    EventBus.emit('diamond_changed', this.playerData.diamond);
  }

  /** 添加经验 */
  addExp(amount: number): void {
    this.playerData.exp += amount;
    const expNeeded = this.levelUpExp();
    if (this.playerData.exp >= expNeeded) {
      this.playerData.exp -= expNeeded;
      this.playerData.level++;
      EventBus.emit('restaurant_level_up', this.playerData.level);
    }
  }

  private levelUpExp(): number {
    return 100 + this.playerData.level * 50;
  }
}

interface PlayerData {
  gold: number;
  diamond: number;
  level: number;
  exp: number;
}

interface RestaurantData {
  level: number;
  name: string;
  decorId: number;
  seats: number;
  cleanliness: number;
  popularity: number;
}
