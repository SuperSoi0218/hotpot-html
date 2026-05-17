/** 顾客系统 - 顾客行为与满意度 */
import { EventBus, GameEvents } from '../core/EventBus';

interface Customer {
  id: number;
  name: string;
  avatarIndex: number;
  patience: number;      // 耐心值（秒）
  orderId: number | null; // 点的菜品ID
  satisfaction: number;   // 满意度 0-100
  state: 'waiting' | 'ordering' | 'eating' | 'paying' | 'left';
  partySize: number;      // 人数
}

interface CustomerConfig {
  basePatience: number;
  patiencePerSeat: number;
  satisfactionDecay: number;
  tipMultiplier: number;
}

export class CustomerSystem {
  private customers: Customer[] = [];
  private config: CustomerConfig = {
    basePatience: 30,
    patiencePerSeat: 10,
    satisfactionDecay: 0.5,
    tipMultiplier: 0.15,
  };
  private nextId = 1;
  private spawnTimer = 0;

  /** 生成顾客（按间隔自动生成） */
  update(dt: number, popularity: number): Customer | null {
    this.spawnTimer += dt;
    const spawnInterval = Math.max(3, 10 - popularity * 0.5);

    if (this.spawnTimer >= spawnInterval && this.customers.filter(c => c.state !== 'left').length < 20) {
      this.spawnTimer = 0;
      return this.spawnCustomer();
    }
    return null;
  }

  private spawnCustomer(): Customer {
    const customer: Customer = {
      id: this.nextId++,
      name: `顾客${this.nextId}`,
      avatarIndex: Math.floor(Math.random() * 4),
      patience: this.config.basePatience + Math.random() * this.config.patiencePerSeat,
      orderId: null,
      satisfaction: 100,
      state: 'waiting',
      partySize: Math.floor(Math.random() * 4) + 1,
    };
    this.customers.push(customer);
    EventBus.emit(GameEvents.CUSTOMER_ARRIVE, customer);
    return customer;
  }

  /** 顾客入座 */
  seatCustomer(customerId: number): boolean {
    const c = this.customers.find(c => c.id === customerId);
    if (!c || c.state !== 'waiting') return false;
    c.state = 'ordering';
    return true;
  }

  /** 顾客点单 */
  takeOrder(customerId: number, menuItemId: number): void {
    const c = this.customers.find(c => c.id === customerId);
    if (!c) return;
    c.orderId = menuItemId;
    c.state = 'eating';
    EventBus.emit(GameEvents.ORDER_TAKEN, c);
  }

  /** 顾客完成用餐 */
  completeMeal(customerId: number): number {
    const c = this.customers.find(c => c.id === customerId);
    if (!c) return 0;

    c.state = 'paying';
    const tip = Math.floor(c.satisfaction * this.config.tipMultiplier);
    EventBus.emit(GameEvents.MEAL_SERVED, c);

    // 顾客离开
    setTimeout(() => {
      c.state = 'left';
      this.customers = this.customers.filter(cust => cust.id !== customerId);
    }, 2000);

    return tip;
  }

  /** 更新所有顾客状态 */
  updateAll(dt: number): void {
    this.customers.forEach(c => {
      if (c.state === 'waiting' || c.state === 'eating') {
        c.patience -= dt;
        if (c.patience <= 0) {
          c.satisfaction = Math.max(0, c.satisfaction - this.config.satisfactionDecay * dt);
        }
      }
    });
  }

  /** 获取当前所有顾客 */
  getCustomers(): Customer[] {
    return this.customers.filter(c => c.state !== 'left');
  }

  /** 获取等待中的顾客数 */
  getWaitingCount(): number {
    return this.customers.filter(c => c.state === 'waiting').length;
  }
}
