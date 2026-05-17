/** 游戏内事件总线 */
type Listener = (...args: any[]) => void;

export class EventBus {
  private static listeners: Map<string, Set<Listener>> = new Map();

  static on(event: string, listener: Listener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  static off(event: string, listener: Listener): void {
    this.listeners.get(event)?.delete(listener);
  }

  static emit(event: string, ...args: any[]): void {
    this.listeners.get(event)?.forEach(fn => fn(...args));
  }

  static clear(): void {
    this.listeners.clear();
  }
}

// 游戏事件定义
export const GameEvents = {
  // 经营
  CUSTOMER_ARRIVE: 'customer_arrive',
  ORDER_TAKEN: 'order_taken',
  MEAL_SERVED: 'meal_served',
  PAYMENT_DONE: 'payment_done',
  // 经济
  GOLD_CHANGED: 'gold_changed',
  DIAMOND_CHANGED: 'diamond_changed',
  // 员工
  STAFF_HIRED: 'staff_hired',
  STAFF_LEVEL_UP: 'staff_level_up',
  // 升级
  RESTAURANT_LEVEL_UP: 'restaurant_level_up',
  RECIPE_UNLOCKED: 'recipe_unlocked',
  // 系统
  SAVE_COMPLETE: 'save_complete',
  LOAD_COMPLETE: 'load_complete',
  SCENE_TRANSITION: 'scene_transition',
};
