import { PlatformAdapter, PlatformConfig, LoginResult, ShareOptions, UserInfo } from './PlatformAdapter';

/** 开发环境模拟适配器 */
export class MockAdapter implements PlatformAdapter {
  readonly config: PlatformConfig;

  constructor(config: PlatformConfig) {
    this.config = config;
  }

  async login(): Promise<LoginResult> {
    return { code: 'mock_code', success: true };
  }

  async share(_options: ShareOptions): Promise<void> {
    console.log('[Mock] 分享:', _options.title);
  }

  async showRewardedAd(_adId: string): Promise<boolean> {
    console.log('[Mock] 激励广告:', _adId);
    return true;
  }

  showBannerAd(_adId: string): void {
    console.log('[Mock] 横幅广告:', _adId);
  }

  async initCloud(): Promise<void> {
    console.log('[Mock] 云开发初始化');
  }

  async callFunction(_name: string, _data?: any): Promise<any> {
    return { result: 'mock' };
  }

  database(): any {
    return { collection: () => ({}) };
  }

  async getUserInfo(): Promise<UserInfo> {
    return { nickName: '开发者', avatarUrl: '' };
  }
}
