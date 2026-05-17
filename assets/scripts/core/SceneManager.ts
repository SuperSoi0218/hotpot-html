/** 场景管理器 - 控制场景切换与过渡 */
export class SceneManager {
  private static currentScene: string = '';

  static readonly Scenes = {
    BOOT: 'BootScene',
    MAIN: 'MainScene',
    RESTAURANT: 'RestaurantScene',
    KITCHEN: 'KitchenScene',
    UPGRADE: 'UpgradeScene',
    STAFF: 'StaffScene',
    SHOP: 'ShopScene',
    SOCIAL: 'SocialScene',
    SETTINGS: 'SettingsScene',
  };

  /** 切换到目标场景（带动画过渡） */
  static switchScene(sceneName: string, data?: any): void {
    this.currentScene = sceneName;
    // 使用引擎 director 跳转（Cocos Creator 运行时）
    if (typeof cc !== 'undefined' && cc.director) {
      cc.director.loadScene(sceneName, () => {
        console.log(`[Scene] 切换到 ${sceneName}`, data);
      });
    } else {
      console.log(`[Scene] 场景切换: ${sceneName}`, data);
    }
  }

  static getCurrentScene(): string {
    return this.currentScene;
  }
}
