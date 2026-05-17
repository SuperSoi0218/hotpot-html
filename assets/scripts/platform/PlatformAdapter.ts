/** 平台适配器接口 - 统一微信/抖音差异 */
import { MockAdapter } from './MockAdapter';

export interface PlatformConfig {
  platformName: string;
  isWeChat: boolean;
  isDouyin: boolean;
  isMock: boolean;
}

export interface LoginResult { code: string; success: boolean; }
export interface ShareOptions { title: string; imageUrl?: string; query?: string; }
export interface UserInfo { nickName: string; avatarUrl: string; gender?: number; }

export interface PlatformAdapter {
  readonly config: PlatformConfig;
  login(): Promise<LoginResult>;
  share(options: ShareOptions): Promise<void>;
  showRewardedAd(adId: string): Promise<boolean>;
  showBannerAd(adId: string): void;
  initCloud(): Promise<void>;
  callFunction(name: string, data?: any): Promise<any>;
  database(): any;
  getUserInfo(): Promise<UserInfo>;
}

function detectPlatform(): PlatformConfig {
  if (typeof wx !== 'undefined') {
    return { platformName: 'wechat', isWeChat: true, isDouyin: false, isMock: false };
  }
  if (typeof tt !== 'undefined') {
    return { platformName: 'douyin', isWeChat: false, isDouyin: true, isMock: false };
  }
  return { platformName: 'mock', isWeChat: false, isDouyin: false, isMock: true };
}

let _adapter: PlatformAdapter | null = null;

export function getPlatformAdapter(): PlatformAdapter {
  if (_adapter) return _adapter;
  // 开发环境统一使用 MockAdapter，运行时自动检测
  _adapter = new MockAdapter(detectPlatform());
  return _adapter;
}

export { MockAdapter } from './MockAdapter';
