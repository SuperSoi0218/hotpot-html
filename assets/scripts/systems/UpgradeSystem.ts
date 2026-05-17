/** 升级/养成系统 - 店铺升级与解锁 */
import { EventBus, GameEvents } from '../core/EventBus';
import { GameManager } from '../core/GameManager';

interface UpgradeItem {
  id: number;
  name: string;
  category: 'decor' | 'equipment' | 'recipe' | 'seat';
  level: number;
  cost: number;
  costType: 'gold' | 'diamond';
  effect: string;
  effectValue: number;
  icon: string;
}

export class UpgradeSystem {
  private upgrades: UpgradeItem[] = [];
  private purchased: Set<number> = new Set();

  constructor() {
    this.initUpgrades();
  }

  private initUpgrades(): void {
    this.upgrades = [
      // 装饰
      { id: 1, name: '温馨墙纸', category: 'decor', level: 1, cost: 500, costType: 'gold', effect: '人气+5', effectValue: 5, icon: 'wallpaper' },
      { id: 2, name: '复古吊灯', category: 'decor', level: 2, cost: 1200, costType: 'gold', effect: '人气+10', effectValue: 10, icon: 'lamp' },
      { id: 3, name: '中式屏风', category: 'decor', level: 3, cost: 3000, costType: 'gold', effect: '人气+20', effectValue: 20, icon: 'screen' },
      // 设备
      { id: 4, name: '双灶台', category: 'equipment', level: 1, cost: 800, costType: 'gold', effect: '出餐速度+20%', effectValue: 1.2, icon: 'stove' },
      { id: 5, name: '智能排烟', category: 'equipment', level: 2, cost: 2000, costType: 'gold', effect: '满意度+10', effectValue: 10, icon: 'vent' },
      // 座位
      { id: 6, name: '加2桌位', category: 'seat', level: 1, cost: 1000, costType: 'gold', effect: '座位+2', effectValue: 2, icon: 'seat' },
      { id: 7, name: '加4桌位', category: 'seat', level: 2, cost: 80, costType: 'diamond', effect: '座位+4', effectValue: 4, icon: 'seat' },
      // 食谱（通过经济系统处理）
      { id: 8, name: '食谱扩展包', category: 'recipe', level: 1, cost: 100, costType: 'diamond', effect: '解锁新菜谱', effectValue: 1, icon: 'recipe' },
    ];
  }

  /** 购买升级 */
  purchase(upgradeId: number): boolean {
    const item = this.upgrades.find(u => u.id === upgradeId);
    if (!item || this.purchased.has(upgradeId)) return false;

    const gm = GameManager.getInstance();
    const wallet = item.costType === 'gold' ? gm.playerData.gold : gm.playerData.diamond;
    if (wallet < item.cost) return false;

    // 扣钱
    if (item.costType === 'gold') {
      gm.playerData.gold -= item.cost;
      EventBus.emit(GameEvents.GOLD_CHANGED, gm.playerData.gold);
    } else {
      gm.playerData.diamond -= item.cost;
      EventBus.emit(GameEvents.DIAMOND_CHANGED, gm.playerData.diamond);
    }

    this.purchased.add(upgradeId);
    // 应用效果
    this.applyEffect(item);

    if (item.category === 'recipe') {
      EventBus.emit(GameEvents.RECIPE_UNLOCKED, item);
    }
    return true;
  }

  private applyEffect(item: UpgradeItem): void {
    const rd = GameManager.getInstance().restaurantData;
    switch (item.category) {
      case 'decor':
        rd.popularity += item.effectValue;
        break;
      case 'seat':
        rd.seats += item.effectValue;
        break;
      case 'equipment':
        // 通过 EventBus 通知烹饪系统
        break;
    }
  }

  /** 获取可购买升级 */
  getAvailableUpgrades(playerLevel: number, restaurantLevel: number): UpgradeItem[] {
    return this.upgrades.filter(u => !this.purchased.has(u.id) && u.level <= restaurantLevel);
  }

  /** 检查是否已购买 */
  isPurchased(upgradeId: number): boolean {
    return this.purchased.has(upgradeId);
  }
}
