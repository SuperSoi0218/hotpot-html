/** UI 管理器 - 管理所有 UI 层级与交互 */
import { EventBus } from '../core/EventBus';

export enum UILayer {
  BACKGROUND = 0,
  GAME = 100,
  UI = 200,
  POPUP = 300,
  GUIDE = 400,
  LOADING = 500,
}

interface UIComponent {
  name: string;
  layer: UILayer;
  visible: boolean;
  show(): void;
  hide(): void;
  destroy(): void;
}

export class UIManager {
  private static components: Map<string, UIComponent> = new Map();
  private static layerOrder: UILayer[] = [
    UILayer.BACKGROUND, UILayer.GAME, UILayer.UI,
    UILayer.POPUP, UILayer.GUIDE, UILayer.LOADING,
  ];

  /** 注册 UI 组件 */
  static register(component: UIComponent): void {
    this.components.set(component.name, component);
  }

  /** 显示 UI */
  static show(name: string): void {
    const comp = this.components.get(name);
    if (comp) { comp.visible = true; comp.show(); }
  }

  /** 隐藏 UI */
  static hide(name: string): void {
    const comp = this.components.get(name);
    if (comp) { comp.visible = false; comp.hide(); }
  }

  /** 隐藏所有 UI */
  static hideAll(): void {
    this.components.forEach(c => {
      c.visible = false;
      c.hide();
    });
  }

  /** 销毁 UI */
  static destroy(name: string): void {
    const comp = this.components.get(name);
    if (comp) { comp.destroy(); this.components.delete(name); }
  }

  /** 获取顶层显示的组件名 */
  static getTopmost(): string | null {
    for (const layer of this.layerOrder.reverse()) {
      for (const [name, comp] of this.components) {
        if (comp.layer === layer && comp.visible) return name;
      }
    }
    return null;
  }
}
