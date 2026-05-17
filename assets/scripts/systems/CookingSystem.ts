/** 烹饪系统 - 食材准备与烹饪逻辑 */
import { EventBus, GameEvents } from '../core/EventBus';

interface Recipe {
  id: number;
  name: string;
  ingredients: Ingredient[];
  cookTime: number;       // 烹饪时间(秒)
  difficulty: number;      // 难度 1-5
  unlockLevel: number;
}

interface Ingredient {
  id: number;
  name: string;
  emoji: string;  // 像素风格用字符代替
  amount: number;
}

interface CookProcess {
  orderId: number;
  recipeId: number;
  progress: number;    // 0-1
  state: 'preparing' | 'cooking' | 'done' | 'served';
}

export class CookingSystem {
  private recipes: Recipe[] = [];
  private activeProcesses: CookProcess[] = [];
  private maxStoves = 4;

  constructor() {
    this.initRecipes();
  }

  private initRecipes(): void {
    this.recipes = [
      {
        id: 1, name: '经典麻辣锅', cookTime: 5, difficulty: 1, unlockLevel: 1,
        ingredients: [{ id: 1, name: '辣椒', emoji: '🌶', amount: 3 }, { id: 2, name: '牛油', emoji: '🧈', amount: 2 }]
      },
      {
        id: 2, name: '番茄牛腩锅', cookTime: 6, difficulty: 2, unlockLevel: 2,
        ingredients: [{ id: 3, name: '番茄', emoji: '🍅', amount: 3 }, { id: 4, name: '牛腩', emoji: '🥩', amount: 2 }]
      },
      {
        id: 3, name: '菌菇养生锅', cookTime: 5, difficulty: 2, unlockLevel: 2,
        ingredients: [{ id: 5, name: '菌菇', emoji: '🍄', amount: 4 }]
      },
      {
        id: 4, name: '海鲜拼盘', cookTime: 8, difficulty: 3, unlockLevel: 3,
        ingredients: [{ id: 6, name: '虾', emoji: '🦐', amount: 3 }, { id: 7, name: '鱼片', emoji: '🐟', amount: 2 }]
      },
    ];
  }

  /** 开始烹饪 */
  startCooking(recipeId: number): number | null {
    if (this.activeProcesses.filter(p => p.state !== 'served').length >= this.maxStoves) {
      return null; // 灶台满了
    }

    const process: CookProcess = {
      orderId: this.activeProcesses.length + 1,
      recipeId,
      progress: 0,
      state: 'preparing',
    };

    this.activeProcesses.push(process);
    return process.orderId;
  }

  /** 烹饪进度更新 */
  update(dt: number): void {
    this.activeProcesses.forEach(p => {
      if (p.state === 'done' || p.state === 'served') return;

      const recipe = this.recipes.find(r => r.id === p.recipeId);
      if (!recipe) return;

      p.progress += dt / recipe.cookTime;
      if (p.progress >= 1) {
        p.state = 'done';
      }
    });
  }

  /** 取出完成的菜品 */
  serveDish(orderId: number): boolean {
    const p = this.activeProcesses.find(pr => pr.orderId === orderId);
    if (!p || p.state !== 'done') return false;
    p.state = 'served';
    EventBus.emit(GameEvents.MEAL_SERVED, { orderId, recipeId: p.recipeId });
    return true;
  }

  /** 获取可用的食谱 */
  getAvailableRecipes(playerLevel: number): Recipe[] {
    return this.recipes.filter(r => r.unlockLevel <= playerLevel);
  }

  /** 获取所有食谱 */
  getAllRecipes(): Recipe[] {
    return this.recipes;
  }
}
