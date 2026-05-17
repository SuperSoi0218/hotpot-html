import { PlatformAdapter, PlatformConfig, LoginResult, ShareOptions, UserInfo } from '../PlatformAdapter';

export class WeChatAdapter implements PlatformAdapter {
  readonly config: PlatformConfig;

  constructor(config: PlatformConfig) {
    this.config = config;
  }

  async login(): Promise<LoginResult> {
    return new Promise(resolve => {
      wx.login({
        success: res => resolve({ code: res.code, success: true }),
        fail: () => resolve({ code: '', success: false }),
      });
    });
  }

  async share(options: ShareOptions): Promise<void> {
    wx.shareAppMessage({
      title: options.title,
      imageUrl: options.imageUrl,
      query: options.query,
    });
  }

  async showRewardedAd(adId: string): Promise<boolean> {
    return new Promise(resolve => {
      const ad = wx.createRewardedVideoAd({ adUnitId: adId });
      ad.show().then(() => {
        ad.onClose(res => resolve(res.isEnded ?? false));
      }).catch(() => resolve(false));
    });
  }

  showBannerAd(adId: string): void {
    wx.createBannerAd({ adUnitId: adId, style: { left: 0, top: 0, width: 320 } });
  }

  async initCloud(): Promise<void> {
    wx.cloud.init({ env: wx.env.USER_DATA_URL });
  }

  async callFunction(name: string, data?: any): Promise<any> {
    return wx.cloud.callFunction({ name, data });
  }

  database(): any {
    return wx.cloud.database();
  }

  async getUserInfo(): Promise<UserInfo> {
    return new Promise(resolve => {
      wx.getUserProfile({
        desc: '用于游戏存档',
        success: res => resolve({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
          gender: res.userInfo.gender,
        }),
        fail: () => resolve({ nickName: '玩家', avatarUrl: '' }),
      });
    });
  }
}
