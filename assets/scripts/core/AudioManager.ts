/** 音频管理器 */
export class AudioManager {
  private static bgmId: string | null = null;

  static playBGM(name: string): void {
    this.stopBGM();
    this.bgmId = name;
    console.log(`[Audio] 播放BGM: ${name}`);
    // Cocos Creator: cc.audioEngine.playMusic(audioClip, true);
  }

  static stopBGM(): void {
    if (this.bgmId) {
      console.log(`[Audio] 停止BGM: ${this.bgmId}`);
      this.bgmId = null;
    }
  }

  static playSFX(name: string): void {
    console.log(`[Audio] 播放音效: ${name}`);
    // Cocos Creator: cc.audioEngine.playEffect(audioClip, false);
  }

  static setBGMVolume(vol: number): void {
    // cc.audioEngine.setMusicVolume(vol);
  }

  static setSFXVolume(vol: number): void {
    // cc.audioEngine.setEffectsVolume(vol);
  }
}
