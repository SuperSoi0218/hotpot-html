/**
 * 游戏配置表
 * 可从飞书多维表格导出同步至此
 */
export const GameConfig = {
  /** 初始值 */
  INITIAL: {
    GOLD: 1000,
    DIAMOND: 50,
    ENERGY: 100,
    SEATS: 4,
    RESTAURANT_LEVEL: 1,
  },

  /** 经济参数 */
  ECONOMY: {
    GOLD_PER_SECOND: 1,          // 每秒自动收入
    ENERGY_RECOVER_SEC: 300,     // 体力恢复时间(秒)
    ENERGY_MAX: 100,
    DIAMOND_TO_GOLD: 100,        // 钻石兑换金币比例
    SHARE_REWARD: 50,            // 分享奖励金币
    AD_REWARD_GOLD: 200,         // 广告奖励金币
    AD_REWARD_DIAMOND: 5,        // 广告奖励钻石
  },

  /** 顾客参数 */
  CUSTOMER: {
    BASE_PATIENCE: 30,
    PATIENCE_VAR: 15,
    SPAWN_INTERVAL: 8,
    MAX_CUSTOMERS: 20,
    SATISFACTION_DECAY: 0.5,
    TIP_RATE: 0.15,
    PARTY_MIN: 1,
    PARTY_MAX: 6,
  },

  /** 员工参数 */
  STAFF: {
    MAX_LEVEL: 10,
    TRAIN_COST_BASE: 500,
    TRAIN_COST_GROWTH: 2.0,
    SALARY_BASE: { waiter: 5, chef: 8, cleaner: 3, manager: 12 },
    EFFICIENCY_PER_LEVEL: 0.1,
  },

  /** 升级 */
  UPGRADE: {
    LEVELUP_EXP_BASE: 100,
    LEVELUP_EXP_GROWTH: 1.5,
    MAX_RESTAURANT_LEVEL: 20,
  },

  /** 菜品 */
  MENU: [
    { id: 1, name: '经典麻辣锅', price: 68, cost: 30, cookTime: 5, unlockLevel: 1 },
    { id: 2, name: '番茄牛腩锅', price: 88, cost: 38, cookTime: 6, unlockLevel: 2 },
    { id: 3, name: '菌菇养生锅', price: 78, cost: 35, cookTime: 5, unlockLevel: 2 },
    { id: 4, name: '海鲜拼盘', price: 128, cost: 55, cookTime: 8, unlockLevel: 3 },
    { id: 5, name: '极品肥牛', price: 68, cost: 28, cookTime: 3, unlockLevel: 1 },
    { id: 6, name: '毛肚拼盘', price: 58, cost: 22, cookTime: 3, unlockLevel: 1 },
    { id: 7, name: '豪华套餐', price: 198, cost: 80, cookTime: 10, unlockLevel: 4 },
    { id: 8, name: '至尊火锅', price: 388, cost: 150, cookTime: 15, unlockLevel: 5 },
  ],

  /** 关卡/等级配置 */
  LEVELS: [] as LevelConfig[],
};

interface LevelConfig {
  level: number;
  expNeeded: number;
  unlockItems: number[];
  rewardGold: number;
  rewardDiamond: number;
}

// 生成等级配置
for (let i = 1; i <= 20; i++) {
  GameConfig.LEVELS.push({
    level: i,
    expNeeded: Math.floor(100 * Math.pow(1.5, i - 1)),
    unlockItems: i <= 5 ? [i] : [],
    rewardGold: 100 * i,
    rewardDiamond: Math.floor(i / 2),
  });
}

export default GameConfig;
