/**
 * 像素风格渲染器
 * 使用 Cocos Creator Graphics 组件绘制像素风格图形
 * 像素基础单位: 4px (1 像素块 = 4x4 物理像素)
 */
export const PIXEL_UNIT = 4;
export const PIXEL_COLORS = {
  // 火锅主题色
  RED: '#CC3333',
  DARK_RED: '#881111',
  ORANGE: '#FF6633',
  YELLOW: '#FFCC00',
  GOLD: '#DAA520',
  BROWN: '#8B4513',
  DARK_BROWN: '#5C2E00',
  GREEN: '#339933',
  DARK_GREEN: '#226622',
  WHITE: '#FFFFFF',
  CREAM: '#FFF8E7',
  LIGHT_GRAY: '#DDDDDD',
  GRAY: '#888888',
  DARK_GRAY: '#444444',
  BLACK: '#222222',
  BLUE: '#3366CC',
  SKIN: '#FFCC99',
  WATER: '#66CCFF',
  TRANSPARENT: 'transparent',
};

interface PixelSprite {
  width: number;   // 像素块数量(宽)
  height: number;  // 像素块数量(高)
  data: string[][]; // 颜色矩阵
}

/** 创建简单的像素精灵数据 */
export class PixelRenderer {
  /** 生成像素火锅图标 8x8 */
  static generateHotpotIcon(): PixelSprite {
    const c = PIXEL_COLORS;
    return {
      width: 8, height: 8,
      data: [
        [c.GRAY, c.GRAY, c.GRAY, c.GRAY, c.GRAY, c.GRAY, c.GRAY, c.GRAY],
        [c.GRAY, c.DARK_RED, c.RED, c.RED, c.RED, c.RED, c.DARK_RED, c.GRAY],
        [c.GRAY, c.RED, c.ORANGE, c.ORANGE, c.ORANGE, c.ORANGE, c.RED, c.GRAY],
        [c.GRAY, c.RED, c.ORANGE, c.YELLOW, c.YELLOW, c.ORANGE, c.RED, c.GRAY],
        [c.GRAY, c.RED, c.ORANGE, c.ORANGE, c.ORANGE, c.ORANGE, c.RED, c.GRAY],
        [c.GRAY, c.DARK_RED, c.RED, c.RED, c.RED, c.RED, c.DARK_RED, c.GRAY],
        [c.GRAY, c.BROWN, c.BROWN, c.DARK_BROWN, c.DARK_BROWN, c.BROWN, c.BROWN, c.GRAY],
        [c.GRAY, c.GRAY, c.GRAY, c.GRAY, c.GRAY, c.GRAY, c.GRAY, c.GRAY],
      ]
    };
  }

  /** 生成像素金币图标 6x6 */
  static generateCoinIcon(): PixelSprite {
    const c = PIXEL_COLORS;
    return {
      width: 6, height: 6,
      data: [
        [c.GOLD, c.GOLD, c.GOLD, c.GOLD, c.GOLD, c.GOLD],
        [c.GOLD, c.YELLOW, c.YELLOW, c.YELLOW, c.YELLOW, c.GOLD],
        [c.GOLD, c.YELLOW, c.WHITE, c.WHITE, c.YELLOW, c.GOLD],
        [c.GOLD, c.YELLOW, c.WHITE, c.WHITE, c.YELLOW, c.GOLD],
        [c.GOLD, c.YELLOW, c.YELLOW, c.YELLOW, c.YELLOW, c.GOLD],
        [c.GOLD, c.GOLD, c.GOLD, c.GOLD, c.GOLD, c.GOLD],
      ]
    };
  }

  /** 生成像素顾客头像 6x6 */
  static generateCustomerAvatar(index: number): PixelSprite {
    const c = PIXEL_COLORS;
    const skins = [c.SKIN, c.CREAM, c.YELLOW, c.ORANGE];
    const skin = skins[index % skins.length];
    const hairColors = [c.BLACK, c.BROWN, c.GOLD, c.DARK_GRAY];
    const hair = hairColors[index % hairColors.length];
    return {
      width: 6, height: 6,
      data: [
        [hair, hair, hair, hair, hair, hair],
        [hair, hair, hair, hair, hair, hair],
        [skin, skin, skin, skin, skin, skin],
        [skin, c.WHITE, skin, skin, c.WHITE, skin],
        [skin, c.RED, skin, skin, c.RED, skin],
        [skin, skin, skin, skin, skin, skin],
      ]
    };
  }

  /** 像素精灵绘制到 Canvas（Cocos Creator Graphics） */
  static drawSprite(graphics: any, sprite: PixelSprite, x: number, y: number, scale: number = 1): void {
    const s = PIXEL_UNIT * scale;
    for (let row = 0; row < sprite.height; row++) {
      for (let col = 0; col < sprite.width; col++) {
        const color = sprite.data[row][col];
        if (color && color !== 'transparent') {
          graphics.fillColor = color;
          graphics.fillRect(x + col * s, y + row * s, s, s);
        }
      }
    }
  }

  /** 生成像素风格矩形（用于 UI 元素背景） */
  static drawPixelBorder(graphics: any, x: number, y: number, w: number, h: number, borderColor: string, fillColor: string): void {
    const s = PIXEL_UNIT;
    // 边框
    graphics.fillColor = borderColor;
    graphics.fillRect(x, y, w, s);           // 上
    graphics.fillRect(x, y + h - s, w, s);   // 下
    graphics.fillRect(x, y, s, h);            // 左
    graphics.fillRect(x + w - s, y, s, h);    // 右
    // 填充
    graphics.fillColor = fillColor;
    graphics.fillRect(x + s, y + s, w - 2 * s, h - 2 * s);
  }
}
