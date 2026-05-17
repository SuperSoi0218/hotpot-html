/** 员工系统 - 招聘/培训/岗位管理 */
import { EventBus, GameEvents } from '../core/EventBus';

interface Staff {
  id: number;
  name: string;
  role: 'waiter' | 'chef' | 'cleaner' | 'manager';
  level: number;
  salary: number;        // 每秒工资
  efficiency: number;    // 效率倍率 1.0 = 100%
  morale: number;        // 士气 0-100
  isWorking: boolean;
}

interface StaffConfig {
  baseSalary: Record<string, number>;
  salaryGrowth: number;
  efficiencyPerLevel: number;
}

export class StaffSystem {
  private staffList: Staff[] = [];
  private config: StaffConfig = {
    baseSalary: { waiter: 5, chef: 8, cleaner: 3, manager: 12 },
    salaryGrowth: 1.5,
    efficiencyPerLevel: 0.1,
  };

  /** 招聘员工 */
  hire(name: string, role: Staff['role']): Staff {
    const staff: Staff = {
      id: this.staffList.length + 1,
      name,
      role,
      level: 1,
      salary: this.config.baseSalary[role],
      efficiency: 1.0,
      morale: 80,
      isWorking: true,
    };
    this.staffList.push(staff);
    EventBus.emit(GameEvents.STAFF_HIRED, staff);
    return staff;
  }

  /** 培训员工 */
  train(staffId: number): boolean {
    const s = this.staffList.find(st => st.id === staffId);
    if (!s || s.level >= 10) return false;
    s.level++;
    s.efficiency = 1 + (s.level - 1) * this.config.efficiencyPerLevel;
    s.salary = Math.floor(this.config.baseSalary[s.role] * Math.pow(this.config.salaryGrowth, s.level - 1));
    EventBus.emit(GameEvents.STAFF_LEVEL_UP, s);
    return true;
  }

  /** 计算员工总工资 */
  getTotalSalary(): number {
    return this.staffList.filter(s => s.isWorking).reduce((sum, s) => sum + s.salary, 0);
  }

  /** 获取某岗位员工 */
  getStaffByRole(role: Staff['role']): Staff[] {
    return this.staffList.filter(s => s.role === role && s.isWorking);
  }

  /** 获取所有员工 */
  getAllStaff(): Staff[] {
    return this.staffList;
  }

  /** 员工士气影响 */
  updateMorale(factor: number): void {
    this.staffList.forEach(s => {
      s.morale = Math.max(0, Math.min(100, s.morale + factor));
    });
  }
}
