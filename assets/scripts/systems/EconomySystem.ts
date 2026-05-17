/** 经济系统 - 金币/钻石/收支管理 */
import { GameManager } from '../core/GameManager';
import { EventBus, GameEvents } from '../core/EventBus';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  cost: number;
  cookTime: number;
  unlockLevel: number;
}

interface PriceConfig {
  baseIncome: number;     // 基础客单价
  popularityBonus: number; // 人气加成
  levelMultiplier: number; // 等级倍率
}

export class EconomySystem {
  private menu: MenuItem[] = [];
  private config: PriceConfig = {
    baseIncome: 50,
    popularityBonus: 0.02,
    levelMultiplier: 1.1,
  };

  constructor() {
    this.initMenu();
  }

  private initMenu(): void {
    this.menu = [
      { id: 1, name: '经典麻辣锅', price: 68, cost: 30, cookTime: 5, unlockLevel: 1 },
      { id: 2, name: '番茄牛腩锅', price: 88, cost: 38, cookTime: 6, unlockLevel: 2 },
      { id: 3, name: '菌菇养生锅', price: 78, cost: 35, cookTime: 5, unlockLevel: 2 },
      { id: 4, name: '海鲜拼盘', price: 128, cost: 55, cookTime: 8, unlockLevel: 3 },
      { id: 5, name: '极品肥牛', price: 68, cost: 28, cookTime: 3, unlockLevel: 1 },
      { id: 6, name: '毛肚拼盘', price: 58, cost: 22, cookTime: 3, unlockLevel: 1 },
      { id: 7, name: '豪华套餐', price: 198, cost: 80, cookTime: 10, unlockLevel: 4 },
      { id: 8, name: '至尊火锅', price: 388, cost: 150, cookTime: 15, unlockLevel: 5 },
    ];
  }

  /** 完成一笔订单 */
  completeOrder(menuItemId: number, popularity: number): number {
    const item = this.menu.find(m => m.id === menuItemId);
    if (!item) return 0;

    const gm = GameManager.getInstance();
    const level = gm.restaurantData.level;
    const popularityBonus = 1 + popularity * this.config.popularityBonus;
    const finalPrice = Math.floor(item.price * popularityBonus * Math.pow(this.config.levelMultiplier, level - 1));

    gm.addGold(finalPrice);
    gm.addExp(Math.floor(finalPrice * 0.1));
    EventBus.emit(GameEvents.PAYMENT_DONE, { item, price: finalPrice });
    return finalPrice;
  }

  /** 获取已解锁菜品 */
  getUnlockedMenu(playerLevel: number): MenuItem[] {
    return this.menu.filter(m => m.unlockLevel <= playerLevel);
  }

  /** 获取所有菜品 */
  getAllMenu(): MenuItem[] {
    return this.menu;
  }

  /** 检查金币是否足够 */
  canAfford(cost: number): boolean {
    return GameManager.getInstance().playerData.gold >= cost;
  }

  /** 扣除金币 */
  spendGold(amount: number): boolean {
    const gm = GameManager.getInstance();
    if (gm.playerData.gold < amount) return false;
    gm.playerData.gold -= amount;
    EventBus.emit(GameEvents.GOLD_CHANGED, gm.playerData.gold);
    return true;
  }
}
