import { PlatformAdapter, PlatformConfig, LoginResult, ShareOptions, UserInfo } from '../PlatformAdapter';

export class DouyinAdapter implements PlatformAdapter {
  readonly config: PlatformConfig;

  constructor(config: PlatformConfig) {
    this.config = config;
  }

  async login(): Promise<LoginResult> {
    return new Promise(resolve => {
      tt.login({
        success: res => resolve({ code: res.code, success: true }),
        fail: () => resolve({ code: '', success: false }),
      });
    });
  }

  async share(options: ShareOptions): Promise<void> {
    tt.shareAppMessage({
      title: options.title,
      imageUrl: options.imageUrl,
      query: options.query,
    });
  }

  async showRewardedAd(adId: string): Promise<boolean> {
    return new Promise(resolve => {
      const ad = tt.createRewardedVideoAd({ adUnitId: adId });
      ad.onClose(res => resolve(res.isEnded ?? false));
      ad.show().catch(() => resolve(false));
    });
  }

  showBannerAd(adId: string): void {
    tt.createBannerAd({ adUnitId: adId, style: { left: 0, top: 0, width: 320 } });
  }

  async initCloud(): Promise<void> {
    // 抖音云开发初始化
    if (typeof tt.cloud !== 'undefined') {
      tt.cloud.init();
    }
  }

  async callFunction(name: string, data?: any): Promise<any> {
    return tt.cloud.callFunction({ name, data });
  }

  database(): any {
    return tt.cloud.database();
  }

  async getUserInfo(): Promise<UserInfo> {
    return new Promise(resolve => {
      // 抖音获取用户信息方式
      resolve({ nickName: '抖音玩家', avatarUrl: '' });
    });
  }
}
