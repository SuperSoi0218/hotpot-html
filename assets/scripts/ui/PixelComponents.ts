/**
 * 像素风格 UI 组件
 * 提供基础 UI 元素的像素风格绘制
 */
import { PIXEL_COLORS, PIXEL_UNIT, PixelRenderer } from '../render/PixelRenderer';

const c = PIXEL_COLORS;
const PU = PIXEL_UNIT;

export interface PixelButtonConfig {
  width: number;
  height: number;
  label: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  onClick?: () => void;
}

export interface PixelPanelConfig {
  width: number;
  height: number;
  title?: string;
  bgColor?: string;
  borderColor?: string;
}

/** 像素按钮 */
export class PixelButton {
  private config: PixelButtonConfig;

  constructor(config: PixelButtonConfig) {
    this.config = {
      bgColor: c.RED,
      borderColor: c.DARK_RED,
      textColor: c.WHITE,
      ...config,
    };
  }

  /** 绘制按钮（接收 Cocos Creator Graphics 实例） */
  draw(graphics: any, x: number, y: number): void {
    const { width, height, bgColor, borderColor } = this.config;
    PixelRenderer.drawPixelBorder(graphics, x, y, width, height, borderColor!, bgColor!);
    // 绘制标签文字（引擎层面处理文字渲染）
  }

  /** 检测点击 */
  hitTest(px: number, py: number, x: number, y: number): boolean {
    return px >= x && px <= x + this.config.width &&
           py >= y && py <= y + this.config.height;
  }
}

/** 像素面板（对话框/窗口背景） */
export class PixelPanel {
  private config: PixelPanelConfig;

  constructor(config: PixelPanelConfig) {
    this.config = {
      bgColor: c.CREAM,
      borderColor: c.BROWN,
      ...config,
    };
  }

  draw(graphics: any, x: number, y: number): void {
    const { width, height, borderColor, bgColor } = this.config;
    // 阴影
    graphics.fillColor = c.DARK_GRAY;
    graphics.fillRect(x + PU, y - PU, width, height);
    // 主面板
    PixelRenderer.drawPixelBorder(graphics, x, y, width, height, borderColor!, bgColor!);
  }
}

/** 像素进度条 */
export class PixelProgressBar {
  draw(
    graphics: any, x: number, y: number,
    width: number, height: number,
    progress: number, // 0-1
    fgColor: string = c.RED,
    bgColor: string = c.LIGHT_GRAY,
    borderColor: string = c.DARK_GRAY,
  ): void {
    // 背景
    PixelRenderer.drawPixelBorder(graphics, x, y, width, height, borderColor, bgColor);
    // 前景
    if (progress > 0) {
      const fillWidth = Math.max(PU, Math.floor((width - 2 * PU) * progress));
      graphics.fillColor = fgColor;
      graphics.fillRect(x + PU, y + PU, fillWidth, height - 2 * PU);
    }
  }
}

/** 像素标签（数字/文本显示） */
export class PixelLabel {
  constructor(private text: string, private color: string = c.BLACK) {}

  setText(text: string): void { this.text = text; }

  /** 简单数字像素绘制（仅支持 0-9 和冒号） */
  drawNumber(graphics: any, x: number, y: number, scale: number = 1): void {
    const s = PU * scale;
    graphics.fillColor = this.color;
    let cx = x;
    for (const ch of this.text) {
      const cols = PixelLabel.getCharWidth(ch);
      this.drawChar(graphics, cx, y, ch, s);
      cx += (cols + 1) * s;
    }
  }

  private static getCharWidth(ch: string): number {
    if (ch === ':' || ch === '.') return 2;
    return 4;
  }

  private drawChar(graphics: any, x: number, y: number, ch: string, s: number): void {
    const dots = PixelLabel.FONT[ch];
    if (!dots) return;
    dots.forEach(([dx, dy]: number[]) => {
      graphics.fillRect(x + dx * s, y + dy * s, s, s);
    });
  }

  // 4x6 像素字体（数字 + 冒号）
  private static FONT: Record<string, number[][]> = {
    '0': [[0,1],[1,0],[2,0],[3,1],[3,2],[3,3],[3,4],[2,5],[1,5],[0,4],[0,3],[0,2]],
    '1': [[1,0],[1,1],[1,2],[1,3],[1,4],[1,5]],
    '2': [[0,0],[1,0],[2,0],[3,1],[2,2],[1,2],[0,3],[0,4],[1,5],[2,5],[3,5]],
    '3': [[0,0],[1,0],[2,0],[3,1],[2,2],[3,3],[3,4],[2,5],[1,5],[0,5]],
    '4': [[0,0],[0,1],[1,2],[2,2],[3,1],[3,0],[3,2],[3,3],[3,4],[3,5]],
    '5': [[3,0],[2,0],[1,0],[0,0],[0,1],[0,2],[1,2],[2,2],[3,3],[3,4],[2,5],[1,5],[0,5]],
    '6': [[2,0],[1,0],[0,1],[0,2],[0,3],[0,4],[1,3],[1,5],[2,5],[3,4],[3,3],[2,3]],
    '7': [[0,0],[1,0],[2,0],[3,0],[3,1],[2,2],[1,3],[1,4],[1,5]],
    '8': [[1,0],[2,0],[0,1],[3,1],[1,2],[2,2],[0,3],[3,3],[0,4],[3,4],[1,5],[2,5]],
    '9': [[1,0],[2,0],[0,1],[3,1],[1,2],[2,2],[3,2],[3,3],[3,4],[2,5],[1,5],[0,5]],
    ':': [[1,1],[1,3]],
    '.': [[1,4]],
    '-': [[0,2],[1,2],[2,2]],
    '+': [[1,0],[1,1],[0,2],[1,2],[2,2],[1,3],[1,4]],
  };
}
