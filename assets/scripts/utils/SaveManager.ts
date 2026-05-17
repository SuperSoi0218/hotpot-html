/** 存档管理器 - 云开发数据持久化 */
import { getPlatformAdapter } from '../platform/PlatformAdapter';
import { GameConstants } from './Constants';
import { EventBus, GameEvents } from '../core/EventBus';

interface SaveData {
  version: number;
  timestamp: number;
  player: {
    gold: number;
    diamond: number;
    level: number;
    exp: number;
    energy: number;
    lastEnergyTime: number;
  };
  restaurant: {
    level: number;
    name: string;
    seats: number;
    popularity: number;
  };
  staff: Array<{
    id: number; name: string; role: string;
    level: number; efficiency: number; morale: number;
  }>;
  upgrades: number[];
  stats: {
    totalEarned: number;
    totalServed: number;
    perfectCooks: number;
    totalCustomers: number;
  };
}

export class SaveManager {
  private static adapter = getPlatformAdapter();
  private static readonly SAVE_VERSION = 1;
  private static autoSaveTimer: ReturnType<typeof setInterval> | null = null;

  /** 初始存档数据 */
  static defaultSave(): SaveData {
    return {
      version: this.SAVE_VERSION,
      timestamp: Date.now(),
      player: {
        gold: GameConstants.GOLD.INITIAL,
        diamond: GameConstants.DIAMOND.INITIAL,
        level: 1, exp: 0,
        energy: GameConstants.ENERGY.MAX,
        lastEnergyTime: Date.now(),
      },
      restaurant: {
        level: 1, name: '老火锅店', seats: 4, popularity: 0,
      },
      staff: [],
      upgrades: [],
      stats: { totalEarned: 0, totalServed: 0, perfectCooks: 0, totalCustomers: 0 },
    };
  }

  /** 保存到云 */
  static async save(data: SaveData): Promise<boolean> {
    try {
      data.timestamp = Date.now();
      data.version = this.SAVE_VERSION;
      // 写入云数据库
      await this.adapter.callFunction('saveGame', { data });
      EventBus.emit(GameEvents.SAVE_COMPLETE);
      return true;
    } catch (e) {
      console.error('[Save] 保存失败:', e);
      // fallback: 本地缓存
      this.saveLocal(data);
      return false;
    }
  }

  /** 从云加载 */
  static async load(): Promise<SaveData | null> {
    try {
      const res = await this.adapter.callFunction('loadGame');
      if (res?.data) return this.migrate(res.data);
    } catch (_) { /* 忽略 */ }
    // fallback: 本地
    return this.loadLocal();
  }

  /** 保存到本地缓存 */
  static saveLocal(data: SaveData): void {
    try {
      wx.setStorageSync('hotpot_save', JSON.stringify(data));
    } catch (_) {}
  }

  /** 从本地缓存加载 */
  static loadLocal(): SaveData | null {
    try {
      const raw = wx.getStorageSync('hotpot_save');
      return raw ? this.migrate(JSON.parse(raw)) : null;
    } catch (_) {
      return null;
    }
  }

  /** 数据迁移（处理版本升级） */
  private static migrate(data: SaveData): SaveData {
    if (data.version < this.SAVE_VERSION) {
      // 未来版本兼容逻辑
      data.version = this.SAVE_VERSION;
    }
    return data;
  }

  /** 启动自动存档 */
  static startAutoSave(getData: () => SaveData): void {
    if (this.autoSaveTimer) return;
    this.autoSaveTimer = setInterval(() => {
      this.save(getData());
    }, GameConstants.PERFORMANCE.AUTO_SAVE_INTERVAL * 1000);
  }

  /** 停止自动存档 */
  static stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }
}
