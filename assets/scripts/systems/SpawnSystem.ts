/** 生成系统 - 管理顾客生成节奏和特殊事件 */
import { GameManager } from '../core/GameManager';
import { GameConstants } from '../utils/Constants';

export interface SpawnWave {
  waveId: number;
  customerCount: number;
  interval: number;        // 生成间隔(秒)
  customerTypes: string[];
  startDelay: number;      // 波次开始延迟
  isRush: boolean;         // 是否高峰
}

export class SpawnSystem {
  private currentWave: SpawnWave | null = null;
  private waveTimer = 0;
  private waveIndex = 0;
  private spawnCount = 0;
  private rushHourTimer = 0;

  /** 生成策略 */
  private static waves: SpawnWave[] = [
    { waveId: 1, customerCount: 3, interval: 10, customerTypes: ['normal'], startDelay: 0, isRush: false },
    { waveId: 2, customerCount: 5, interval: 7, customerTypes: ['normal', 'foodie'], startDelay: 5, isRush: false },
    { waveId: 3, customerCount: 8, interval: 4, customerTypes: ['normal', 'foodie', 'big_eater'], startDelay: 3, isRush: true },
    { waveId: 4, customerCount: 4, interval: 9, customerTypes: ['normal', 'couple'], startDelay: 8, isRush: false },
    { waveId: 5, customerCount: 10, interval: 3, customerTypes: ['normal', 'foodie', 'vip'], startDelay: 2, isRush: true },
  ];

  /** 更新波次（在 GameController.update 中调用） */
  update(dt: number): SpawnWave | null {
    this.waveTimer += dt;
    this.rushHourTimer += dt;

    // 高峰时段检测（每 60 秒进入一次高峰）
    const isRushHour = this.rushHourTimer >= 60 && this.rushHourTimer < 75;
    if (isRushHour && !this.currentWave?.isRush) {
      this.startWave(3);
    }
    if (this.rushHourTimer >= 75) {
      this.rushHourTimer = 0;
    }

    return this.currentWave;
  }

  /** 启动特定波次 */
  startWave(waveIndex: number): void {
    if (waveIndex < 0 || waveIndex >= SpawnSystem.waves.length) return;
    this.currentWave = SpawnSystem.waves[waveIndex];
    this.waveIndex = waveIndex;
    this.waveTimer = 0;
    this.spawnCount = 0;
  }

  /** 是否需要生成新顾客 */
  shouldSpawn(): boolean {
    if (!this.currentWave) {
      this.startWave(0);
      return true;
    }
    if (this.spawnCount >= this.currentWave.customerCount) {
      // 当前波次结束，自动进入下一波
      this.waveIndex = (this.waveIndex + 1) % SpawnSystem.waves.length;
      this.startWave(this.waveIndex);
      return false;
    }
    return this.waveTimer >= this.currentWave.startDelay + this.spawnCount * this.currentWave.interval;
  }

  /** 记录生成 */
  onSpawned(): void {
    this.spawnCount++;
  }

  /** 根据店铺等级调整生成参数 */
  static getAdjustedSpawnInterval(baseInterval: number, restaurantLevel: number): number {
    return Math.max(2, baseInterval - restaurantLevel * 0.3);
  }

  /** 获取当前时段描述 */
  getPeriodDescription(): string {
    if (this.currentWave?.isRush) return '🔥 用餐高峰';
    if (this.waveIndex < 2) return '☀️ 空闲时段';
    return '🌤 正常营业';
  }
}
