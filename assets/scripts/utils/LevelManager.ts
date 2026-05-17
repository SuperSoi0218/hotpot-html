/** 关卡/等级管理器 */
import { GameConstants } from './Constants';
import { EventBus, GameEvents } from '../core/EventBus';

export interface LevelConfig {
  level: number;
  expRequired: number;
  rewards: { gold: number; diamond: number };
  unlocks: string[];
  title: string;
}

export class LevelManager {
  private static levelCache: Map<number, LevelConfig> = new Map();

  static init(): void {
    for (let i = 1; i <= GameConstants.LEVEL.MAX_PLAYER; i++) {
      this.levelCache.set(i, {
        level: i,
        expRequired: Math.floor(GameConstants.LEVEL.EXP_BASE * Math.pow(GameConstants.LEVEL.EXP_GROWTH, i - 1)),
        rewards: { gold: 100 * i, diamond: Math.floor(i / 2) },
        unlocks: this.getUnlocksForLevel(i),
        title: this.getTitleForLevel(i),
      });
    }
  }

  /** 获取等级配置 */
  static getConfig(level: number): LevelConfig {
    return this.levelCache.get(level) ?? this.levelCache.get(1)!;
  }

  /** 检查是否可以升级 */
  static canLevelUp(currentLevel: number, currentExp: number): boolean {
    if (currentLevel >= GameConstants.LEVEL.MAX_PLAYER) return false;
    return currentExp >= this.getConfig(currentLevel).expRequired;
  }

  /** 执行升级（返回新等级） */
  static applyLevelUp(level: number, exp: number): { newLevel: number; remainingExp: number } {
    const needed = this.getConfig(level).expRequired;
    if (exp < needed || level >= GameConstants.LEVEL.MAX_PLAYER) {
      return { newLevel: level, remainingExp: exp };
    }
    const remaining = exp - needed;
    const newLevel = level + 1;
    const rewards = this.getConfig(level).rewards;
    EventBus.emit(GameEvents.RESTAURANT_LEVEL_UP, newLevel);
    EventBus.emit('level_up_rewards', rewards);
    return { newLevel, remainingExp: remaining };
  }

  /** 升级所需经验 */
  static expForLevel(level: number): number {
    return this.getConfig(level).expRequired;
  }

  /** 当前进度百分比 (0~1) */
  static progressPercent(level: number, exp: number): number {
    const needed = this.getConfig(level).expRequired;
    return Math.min(1, exp / needed);
  }

  private static getUnlocksForLevel(level: number): string[] {
    const map: Record<number, string[]> = {
      1: ['经典麻辣锅', '肥牛', '毛肚'],
      2: ['番茄牛腩锅', '菌菇养生锅', '素菜拼盘'],
      3: ['员工招聘', '虾滑', '海鲜拼盘'],
      4: ['装修功能', '豆腐', '面条'],
      5: ['社交系统', '豪华套餐', '年糕'],
      6: ['员工培训', 'VIP顾客'],
      7: ['活动系统', '连锁扩张'],
      8: ['至尊火锅', '高级装修'],
      9: ['店长解锁'],
     10: ['成就系统'],
    };
    return map[level] ?? [];
  }

  private static getTitleForLevel(level: number): string {
    const titles = [
      '', '街边学徒', '小摊主', '火锅新星', '火热小店',
      '人气旺铺', '城市美食', '火锅达人', '餐饮名家',
      '火锅大师', '连锁老板', '餐饮大亨', '火锅传奇',
      '美食帝王', '火锅之神', '万店之皇',
    ];
    return titles[level] ?? `LV.${level} 火锅王者`;
  }
}
