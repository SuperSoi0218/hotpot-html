/** 像素精灵程序化生成器 - 生成游戏内各种像素素材 */
import { PixelSprite, PIXEL_COLORS, PixelRenderer } from './PixelRenderer';

const c = PIXEL_COLORS;

export class PixelSpriteGenerator {

  /** 生成食材像素图标 (6x6) */
  static ingredientIcon(ingredientId: number): PixelSprite {
    const icons: Record<number, PixelSprite> = {
      1: this.pepperIcon(),     // 辣椒
      2: this.butterIcon(),     // 牛油
      3: this.tomatoIcon(),     // 番茄
      4: this.beefIcon(),       // 牛腩
      5: this.mushroomIcon(),   // 菌菇
      6: this.shrimpIcon(),     // 虾
      7: this.fishIcon(),       // 鱼片
    };
    return icons[ingredientId] ?? this.fallbackIcon();
  }

  /** 生成顾客满意度图标 (6x6) */
  static satisfactionIcon(score: number): PixelSprite {
    if (score >= 80) return this.happyFace();
    if (score >= 50) return this.neutralFace();
    return this.sadFace();
  }

  /** 火焰特效（火锅沸腾） */
  static fireEffect(frame: number): PixelSprite {
    const fireData = [
      [c.TRANSPARENT, c.TRANSPARENT, c.ORANGE, c.YELLOW, c.TRANSPARENT, c.TRANSPARENT],
      [c.TRANSPARENT, c.ORANGE, c.RED, c.ORANGE, c.YELLOW, c.TRANSPARENT],
      [c.ORANGE, c.RED, c.RED, c.ORANGE, c.YELLOW, c.YELLOW],
      [c.TRANSPARENT, c.ORANGE, c.ORANGE, c.YELLOW, c.YELLOW, c.TRANSPARENT],
    ];
    const h = fireData.length;
    const w = fireData[0].length;
    return { width: w, height: h, data: fireData };
  }

  // ========= 私有 =========

  private static pepperIcon(): PixelSprite {
    return { width: 6, height: 6, data: [
      [c.TRANSPARENT, c.GREEN, c.GREEN, c.GREEN, c.TRANSPARENT, c.TRANSPARENT],
      [c.GREEN, c.RED, c.RED, c.RED, c.GREEN, c.TRANSPARENT],
      [c.GREEN, c.RED, c.RED, c.RED, c.GREEN, c.TRANSPARENT],
      [c.TRANSPARENT, c.GREEN, c.RED, c.RED, c.GREEN, c.TRANSPARENT],
      [c.TRANSPARENT, c.TRANSPARENT, c.GREEN, c.GREEN, c.TRANSPARENT, c.TRANSPARENT],
      [c.TRANSPARENT, c.TRANSPARENT, c.TRANSPARENT, c.TRANSPARENT, c.TRANSPARENT, c.TRANSPARENT],
    ]};
  }

  private static butterIcon(): PixelSprite {
    return { width: 6, height: 6, data: [
      [c.YELLOW, c.YELLOW, c.YELLOW, c.YELLOW, c.YELLOW, c.YELLOW],
      [c.YELLOW, c.CREAM, c.CREAM, c.CREAM, c.CREAM, c.YELLOW],
      [c.YELLOW, c.CREAM, c.CREAM, c.CREAM, c.CREAM, c.YELLOW],
      [c.YELLOW, c.YELLOW, c.YELLOW, c.YELLOW, c.YELLOW, c.YELLOW],
    ]};
  }

  private static tomatoIcon(): PixelSprite {
    return { width: 6, height: 6, data: [
      [c.GREEN, c.GREEN, c.GREEN, c.TRANSPARENT, c.TRANSPARENT, c.TRANSPARENT],
      [c.RED, c.RED, c.RED, c.RED, c.RED, c.TRANSPARENT],
      [c.RED, c.ORANGE, c.ORANGE, c.ORANGE, c.RED, c.RED],
      [c.RED, c.ORANGE, c.ORANGE, c.ORANGE, c.RED, c.RED],
      [c.TRANSPARENT, c.RED, c.RED, c.RED, c.RED, c.TRANSPARENT],
    ]};
  }

  private static beefIcon(): PixelSprite {
    return { width: 6, height: 6, data: [
      [c.DARK_RED, c.RED, c.RED, c.RED, c.RED, c.DARK_RED],
      [c.RED, c.CREAM, c.CREAM, c.CREAM, c.CREAM, c.RED],
      [c.RED, c.CREAM, c.CREAM, c.CREAM, c.CREAM, c.RED],
      [c.RED, c.CREAM, c.CREAM, c.CREAM, c.CREAM, c.RED],
      [c.DARK_RED, c.RED, c.RED, c.RED, c.RED, c.DARK_RED],
    ]};
  }

  private static mushroomIcon(): PixelSprite {
    return { width: 6, height: 6, data: [
      [c.TRANSPARENT, c.BROWN, c.BROWN, c.BROWN, c.BROWN, c.TRANSPARENT],
      [c.BROWN, c.CREAM, c.CREAM, c.CREAM, c.CREAM, c.BROWN],
      [c.BROWN, c.CREAM, c.CREAM, c.CREAM, c.CREAM, c.BROWN],
      [c.BROWN, c.BROWN, c.BROWN, c.BROWN, c.BROWN, c.BROWN],
      [c.TRANSPARENT, c.CREAM, c.TRANSPARENT, c.TRANSPARENT, c.CREAM, c.TRANSPARENT],
      [c.TRANSPARENT, c.CREAM, c.TRANSPARENT, c.TRANSPARENT, c.CREAM, c.TRANSPARENT],
    ]};
  }

  private static shrimpIcon(): PixelSprite {
    return { width: 6, height: 6, data: [
      [c.TRANSPARENT, c.ORANGE, c.ORANGE, c.ORANGE, c.TRANSPARENT, c.TRANSPARENT],
      [c.ORANGE, c.ORANGE, c.ORANGE, c.ORANGE, c.ORANGE, c.TRANSPARENT],
      [c.TRANSPARENT, c.ORANGE, c.ORANGE, c.ORANGE, c.ORANGE, c.ORANGE],
      [c.TRANSPARENT, c.TRANSPARENT, c.DARK_RED, c.DARK_RED, c.TRANSPARENT, c.TRANSPARENT],
    ]};
  }

  private static fishIcon(): PixelSprite {
    return { width: 6, height: 6, data: [
      [c.TRANSPARENT, c.BLUE, c.BLUE, c.BLUE, c.TRANSPARENT, c.TRANSPARENT],
      [c.BLUE, c.WHITE, c.WHITE, c.WHITE, c.BLUE, c.TRANSPARENT],
      [c.TRANSPARENT, c.BLUE, c.WHITE, c.WHITE, c.BLUE, c.TRANSPARENT],
      [c.TRANSPARENT, c.TRANSPARENT, c.BLUE, c.BLUE, c.TRANSPARENT, c.TRANSPARENT],
    ]};
  }

  private static happyFace(): PixelSprite {
    return { width: 6, height: 6, data: [
      [c.TRANSPARENT, c.GREEN, c.GREEN, c.GREEN, c.GREEN, c.TRANSPARENT],
      [c.GREEN, c.GREEN, c.GREEN, c.GREEN, c.GREEN, c.GREEN],
      [c.GREEN, c.WHITE, c.GREEN, c.GREEN, c.WHITE, c.GREEN],
      [c.GREEN, c.GREEN, c.GREEN, c.GREEN, c.GREEN, c.GREEN],
      [c.GREEN, c.TRANSPARENT, c.GREEN, c.GREEN, c.TRANSPARENT, c.GREEN],
      [c.TRANSPARENT, c.GREEN, c.TRANSPARENT, c.TRANSPARENT, c.GREEN, c.TRANSPARENT],
    ]};
  }

  private static neutralFace(): PixelSprite {
    return { width: 6, height: 6, data: [
      [c.TRANSPARENT, c.YELLOW, c.YELLOW, c.YELLOW, c.YELLOW, c.TRANSPARENT],
      [c.YELLOW, c.YELLOW, c.YELLOW, c.YELLOW, c.YELLOW, c.YELLOW],
      [c.YELLOW, c.BLACK, c.YELLOW, c.YELLOW, c.BLACK, c.YELLOW],
      [c.YELLOW, c.YELLOW, c.YELLOW, c.YELLOW, c.YELLOW, c.YELLOW],
      [c.YELLOW, c.YELLOW, c.GRAY, c.GRAY, c.YELLOW, c.YELLOW],
      [c.TRANSPARENT, c.YELLOW, c.YELLOW, c.YELLOW, c.YELLOW, c.TRANSPARENT],
    ]};
  }

  private static sadFace(): PixelSprite {
    return { width: 6, height: 6, data: [
      [c.TRANSPARENT, c.RED, c.RED, c.RED, c.RED, c.TRANSPARENT],
      [c.RED, c.RED, c.RED, c.RED, c.RED, c.RED],
      [c.RED, c.WHITE, c.RED, c.RED, c.WHITE, c.RED],
      [c.RED, c.RED, c.RED, c.RED, c.RED, c.RED],
      [c.RED, c.RED, c.GRAY, c.GRAY, c.RED, c.RED],
      [c.TRANSPARENT, c.RED, c.RED, c.RED, c.RED, c.TRANSPARENT],
    ]};
  }

  private static fallbackIcon(): PixelSprite {
    return { width: 4, height: 4, data: [
      [c.GRAY, c.GRAY, c.GRAY, c.GRAY],
      [c.GRAY, c.WHITE, c.WHITE, c.GRAY],
      [c.GRAY, c.WHITE, c.WHITE, c.GRAY],
      [c.GRAY, c.GRAY, c.GRAY, c.GRAY],
    ]};
  }
}
