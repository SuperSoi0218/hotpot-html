/**
 * 游戏主控制器 - 串联所有系统的核心游戏循环
 */
import { GameManager } from './GameManager';
import { EventBus, GameEvents } from './EventBus';
import { SaveManager, SaveData } from '../utils/SaveManager';
import { LevelManager } from '../utils/LevelManager';
import { GameConstants } from '../utils/Constants';
import { EconomySystem } from '../systems/EconomySystem';
import { CustomerSystem } from '../systems/CustomerSystem';
import { CookingSystem } from '../systems/CookingSystem';
import { StaffSystem } from '../systems/StaffSystem';
import { UpgradeSystem } from '../systems/UpgradeSystem';

export class GameController {
  private systems = {
    economy: new EconomySystem(),
    customer: new CustomerSystem(),
    cooking: new CookingSystem(),
    staff: new StaffSystem(),
    upgrade: new UpgradeSystem(),
  };

  private isRunning = false;
  private gameTime = 0;       // 总游戏时间（秒）
  private dayTimer = 0;       // 一天内的计时
  private isNight = false;

  // 统计数据
  private stats = {
    totalEarned: 0,
    totalServed: 0,
    perfectCooks: 0,
    totalCustomers: 0,
    currentDayCustomers: 0,
    dayHighScore: 0,
  };

  // 经营状态
  private businessState: 'closed' | 'open' | 'busy' = 'closed';

  constructor() {
    this.registerEvents();
    LevelManager.init();
  }

  /** 初始化游戏 */
  async init(): Promise<void> {
    // 尝试加载存档
    const saveData = await SaveManager.load();
    if (saveData) {
      this.loadFromSave(saveData);
    } else {
      GameManager.getInstance().init();
    }

    LevelManager.init();
    SaveManager.startAutoSave(() => this.buildSaveData());
    this.businessState = 'open';
    this.isRunning = true;
    EventBus.emit('game_ready');
    console.log('[GameController] 游戏初始化完成');
  }

  /** 主循环（每帧调用） */
  update(dt: number): void {
    if (!this.isRunning) return;

    this.gameTime += dt;
    this.dayTimer += dt;

    // 昼夜切换（每 120 秒为一天）
    if (this.dayTimer >= 120) {
      this.dayTimer = 0;
      this.onDayEnd();
    }

    // 经营中才刷客
    if (this.businessState === 'open') {
      const newCustomer = this.systems.customer.update(dt, this.getPopularity());
      if (newCustomer) {
        this.stats.totalCustomers++;
        this.stats.currentDayCustomers++;
      }
    }

    // 更新顾客状态
    this.systems.customer.updateAll(dt);
    // 更新烹饪进度
    this.systems.cooking.update(dt);
    // 被动收入
    this.applyPassiveIncome(dt);

    // 自动存档
    if (this.gameTime % GameConstants.PERFORMANCE.AUTO_SAVE_INTERVAL < dt) {
      SaveManager.save(this.buildSaveData());
    }
  }

  // ===== 经营操作 =====

  /** 开门营业 */
  openBusiness(): void {
    this.businessState = 'open';
  }

  /** 打烊休息 */
  closeBusiness(): void {
    this.businessState = 'closed';
  }

  /** 顾客入座 */
  seatCustomer(customerId: number): boolean {
    const seated = this.systems.customer.seatCustomer(customerId);
    if (seated) {
      // 随机推荐菜单
      const menu = this.systems.economy.getUnlockedMenu(GameManager.getInstance().playerData.level);
      if (menu.length > 0) {
        const randomItem = menu[Math.floor(Math.random() * menu.length)];
        this.systems.customer.takeOrder(customerId, randomItem.id);
        this.systems.cooking.startCooking(randomItem.id);
      }
    }
    return seated;
  }

  /** 完成烹饪 → 上菜 → 结账 */
  serveCustomer(customerId: number): number {
    const customers = this.systems.customer.getCustomers();
    const customer = customers.find(c => c.id === customerId);
    if (!customer || customer.state !== 'eating') return 0;

    const menuId = customer.orderId!;
    const income = this.systems.economy.completeOrder(menuId, this.getPopularity());
    const tip = Math.floor(income * GameConstants.CUSTOMER.TIP_RATE * (customer.satisfaction / 100));

    const total = income + tip;
    this.stats.totalEarned += total;
    this.stats.totalServed++;

    // 顾客完成用餐
    this.systems.customer.completeMeal(customerId);
    return total;
  }

  /** 员工相关 */
  hireStaff(name: string, role: 'waiter' | 'chef' | 'cleaner' | 'manager'): boolean {
    const cost = GameConstants.STAFF.SALARY[role] * 100;
    if (!this.systems.economy.spendGold(cost)) return false;
    this.systems.staff.hire(name, role);
    return true;
  }

  trainStaff(staffId: number): boolean {
    const staff = this.systems.staff.getAllStaff().find(s => s.id === staffId);
    if (!staff) return false;
    const cost = GameConstants.STAFF.TRAIN_COST_BASE * Math.pow(GameConstants.STAFF.TRAIN_COST_GROWTH, staff.level - 1);
    if (!this.systems.economy.spendGold(cost)) return false;
    return this.systems.staff.train(staffId);
  }

  /** 购买升级 */
  purchaseUpgrade(upgradeId: number): boolean {
    return this.systems.upgrade.purchase(upgradeId);
  }

  // ===== 内部 =====

  private applyPassiveIncome(dt: number): void {
    if (this.businessState !== 'open') return;
    const gm = GameManager.getInstance();
    const staffBonus = this.systems.staff.getStaffByRole('manager')
      .reduce((sum, s) => sum + s.efficiency, 0);
    const income = GameConstants.GOLD.PASSIVE_INTERVAL * dt * (1 + staffBonus * 0.1);
    gm.playerData.gold += Math.floor(income);
  }

  private getPopularity(): number {
    return GameManager.getInstance().restaurantData.popularity;
  }

  private onDayEnd(): void {
    this.stats.dayHighScore = Math.max(this.stats.dayHighScore, this.stats.currentDayCustomers);
    console.log(`[Day] 结束，今日接待: ${this.stats.currentDayCustomers} 位顾客`);
    this.stats.currentDayCustomers = 0;
  }

  private registerEvents(): void {
    EventBus.on('level_up_rewards', (rewards: { gold: number; diamond: number }) => {
      const gm = GameManager.getInstance();
      gm.playerData.gold += rewards.gold;
      gm.playerData.diamond += rewards.diamond;
    });
    EventBus.on(GameEvents.PAYMENT_DONE, () => {
      // 检查升级
      const gm = GameManager.getInstance();
      const result = LevelManager.applyLevelUp(gm.playerData.level, gm.playerData.exp);
      if (result.newLevel !== gm.playerData.level) {
        gm.playerData.level = result.newLevel;
        gm.playerData.exp = result.remainingExp;
      }
    });
  }

  /** 构建存档数据 */
  private buildSaveData(): SaveData {
    const gm = GameManager.getInstance();
    return {
      version: 1,
      timestamp: Date.now(),
      player: { ...gm.playerData, energy: 100, lastEnergyTime: Date.now() },
      restaurant: { ...gm.restaurantData },
      staff: this.systems.staff.getAllStaff().map(s => ({
        id: s.id, name: s.name, role: s.role,
        level: s.level, efficiency: s.efficiency, morale: s.morale,
      })),
      upgrades: [], // 从 UpgradeSystem 获取
      stats: { ...this.stats },
    };
  }

  /** 从存档加载 */
  private loadFromSave(data: SaveData): void {
    const gm = GameManager.getInstance();
    gm.playerData.gold = data.player.gold;
    gm.playerData.diamond = data.player.diamond;
    gm.playerData.level = data.player.level;
    gm.playerData.exp = data.player.exp;
    gm.restaurantData.level = data.restaurant.level;
    gm.restaurantData.name = data.restaurant.name;
    gm.restaurantData.seats = data.restaurant.seats;
    gm.restaurantData.popularity = data.restaurant.popularity;
    this.stats = { ...data.stats, currentDayCustomers: 0, dayHighScore: 0 };
  }

  /** 获取统计 */
  getStats() { return { ...this.stats }; }
  getGameTime() { return this.gameTime; }
  getIsNight() { return this.isNight; }
  getBusinessState() { return this.businessState; }
  getSystems() { return this.systems; }
}
