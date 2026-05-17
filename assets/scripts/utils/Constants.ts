/** 全局常量表 */
export const GameConstants = {
  /** 设计分辨率 */
  DESIGN_WIDTH: 750,
  DESIGN_HEIGHT: 1334,

  /** 经济 */
  GOLD: {
    INITIAL: 1000,
    PASSIVE_INTERVAL: 1,       // 每秒
    SHARE_REWARD: 50,
    AD_REWARD: 200,
  },
  DIAMOND: {
    INITIAL: 50,
    AD_REWARD: 5,
    TO_GOLD_RATE: 100,         // 1钻石=100金币
  },
  ENERGY: {
    MAX: 100,
    INITIAL: 100,
    RECOVER_SEC: 300,          // 5分钟恢复1点
    SHARE_COST: 5,
  },

  /** 顾客 */
  CUSTOMER: {
    MAX_ON_SCENE: 20,
    SPAWN_INTERVAL_BASE: 8,    // 秒
    PATIENCE_BASE: 30,
    PATIENCE_VARIANCE: 15,
    SATISFACTION_MAX: 100,
    SATISFACTION_DECAY_RATE: 0.5,
    TIP_RATE: 0.15,
    PARTY_SIZE_MIN: 1,
    PARTY_SIZE_MAX: 6,
  },

  /** 员工 */
  STAFF: {
    MAX_LEVEL: 10,
    TRAIN_COST_BASE: 500,
    TRAIN_COST_GROWTH: 2.0,
    EFFICIENCY_PER_LV: 0.1,
    SALARY: { waiter: 5, chef: 8, cleaner: 3, manager: 12 },
  },

  /** 升级 */
  LEVEL: {
    MAX_PLAYER: 20,
    MAX_RESTAURANT: 10,
    EXP_BASE: 100,
    EXP_GROWTH: 1.5,
  },

  /** 烹饪 */
  COOKING: {
    STOVE_SLOTS: 4,
    PERFECT_ZONE: { start: 0.6, end: 0.85 },
    PERFECT_BONUS: 1.5,
    GOOD_ZONE: { start: 0.4, end: 0.9 },
    BURN_THRESHOLD: 1.0,
  },

  /** 平台 */
  PLATFORM: {
    WECHAT: 'wechat',
    DOUYIN: 'douyin',
    MOCK: 'mock',
  },

  /** 云开发集合 */
  DB_COLLECTIONS: {
    USERS: 'users',
    PLAYER_DATA: 'player_data',
    LEADERBOARD: 'leaderboard',
    GAME_CONFIG: 'game_config',
  },

  /** 性能 */
  PERFORMANCE: {
    UPDATE_INTERVAL: 0.033,    // ~30fps 逻辑帧
    AUTO_SAVE_INTERVAL: 60,    // 60秒自动存档
  },
} as const;
