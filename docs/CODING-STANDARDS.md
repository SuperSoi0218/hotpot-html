# Hotpot Game — 多智能体协作开发公约

> 本文档是 **Cherry（逻辑主程）** 与 **视觉 Bot（美术资源）** 在 `hotpot-game` 项目中并行开发的约定协议。
> 面向多 bot 协作场景，定义代码主权边界、接口契约、冲突处理流程和通用规范。
> 所有 bot 在修改项目代码前，必须阅读并遵守本文档。

---

## 目录

1. [项目概述](#1-项目概述)
2. [职责边界](#2-职责边界)
3. [文件所有权](#3-文件所有权)
4. [代码段所有权（index.html）](#4-代码段所有权indexhtml)
5. [接口契约](#5-接口契约)
6. [渲染规范](#6-渲染规范)
7. [命名与风格](#7-命名与风格)
8. [Git 工作流](#8-git-工作流)
9. [冲突处理协议](#9-冲突处理协议)
10. [沟通协议](#10-沟通协议)
11. [附录：当前 TM 贴图映射表](#11-附录当前-tm-贴图映射表)

---

## 1. 项目概述

- **项目名**: Hotpot Game — 火锅店模拟经营
- **根目录**: `D:/hotpot-game/`
- **入口文件**: `index.html`（单页应用，约 2200 行）
- **渲染方式**: Canvas 2D (`420×700px`，像素风格，PU=4)
- **仓库**: `SuperSoi0218/hotpot-html`
- **Pages**: `https://supersoi0218.github.io/hotpot-html/`
- **设计分辨率**: 750×1334, FIXED_HEIGHT（Cocos 阶段用）
- **最终目标**: 微信小游戏 + 抖音小游戏

### 核心参数

| 参数 | 值 | 含义 |
|------|-----|------|
| PU | 4 | 像素单位，所有坐标对齐到 PU 的倍数 |
| W×H | 420×700 | 画布尺寸（物理像素×PU = 1680×2800） |
| WW | 720 | 世界宽度（比画布宽，可横向滚动） |
| SH | 175 | 每条 strip 的高度（共 4 条 strip） |
| LPC_TILE | 32 | LPC 精灵图单个 tile 像素尺寸 |

---

## 2. 职责边界

### 2.1 Cherry（逻辑主程）— 本 bot

**负责**：
- 游戏逻辑（实体系统、AI、任务队列、升级系统）
- 数据模型（G 状态对象、TABLES、STOVES、顾客/员工类型）
- Update 循环（`upd()`）
- Canvas 渲染架构（`draw()` 的整体结构和流程）
- UI/HUD（顶部信息栏、按钮、弹出菜单）
- 输入处理（点击、键盘事件）
- LPC 精灵加载基础设施（`loadLPC()`、`drawLPC()`、`drawLPCChar()` 的函数签名和调用框架）
- Git 管理（commit、push、Pages 部署）
- 本文档的维护

**不负责**：
- 精灵图内容的调整（贴图坐标映射、新增 tile 调用）
- 像素美术资源的导入/裁剪/替换
- 视觉参数的精细调节（颜色值、位置微调、scale 微调）

### 2.2 视觉 Bot — 另一个 AI

**负责**：
- LPC 精灵图的贴图坐标映射（`TM` 对象中的 `[col,row]` 值）
- 新增/替换 LPC 精灵调用（在现有的 `drawLPC()` / `drawLPCChar()` 框架内）
- 墙壁装饰、地板纹理、食物模型等纯视觉元素的添加
- 像素美术资源的导入（下载、解压到 `assets/lpc/`）
- `drawLPC()` 函数中 tile 坐标参数的调整
- 程序化绘制（`dr()`、`pr()` 中的颜色矩阵和位置）的视觉优化
- LPC 调试模式（`drawLPCDebug()`）的增强

**不负责**：
- 修改 `drawLPC()` / `drawLPCChar()` 的函数签名
- 修改游戏实体状态机
- 修改 `upd()` 更新逻辑
- 添加新的游戏机制

### 2.3 共同维护区

以下区域两个 bot **都可能改动**，必须遵守接口契约（第 5 节）：
- `TXTAB()` 函数的主体（桌子的 LPC 渲染 part，逻辑 bot 负责框架，视觉 bot 负责贴图微调）
- `drawStrip3()` 中灶台渲染部分
- `drawEnts()` 中角色渲染部分
- `TM` 贴图映射对象

---

## 3. 文件所有权

| 文件 | 所有者 | 说明 |
|------|--------|------|
| `index.html` | **共同** | 按代码段划分职责（见第 4 节） |
| `docs/GDD.md` | Cherry | 游戏设计文档 |
| `docs/LPC-ASSET-GUIDE.md` | 视觉 Bot | LPC 资产分析引导（由 Cherry 移交） |
| `docs/CODING-STANDARDS.md` | Cherry | **本文档**，协作公约 |
| `assets/lpc/` | 视觉 Bot | 所有 LPC 精灵图资源 |
| `assets/lpc/characters/` | 共同 | 字符精灵图（视觉 bot 可新增文件） |
| `assets/*` (其他) | 视觉 Bot | 项目美术资产 |

---

## 4. 代码段所有权（index.html）

以下按行号范围划分 `index.html` 中各节的责任 bot。
**每个节必须写清楚自己的 bot 标识**：`// [Cherry]`, `// [Visual]`, `// [Shared]`

| 行号范围 | 节标题 | 所有者 | 说明 |
|----------|--------|--------|------|
| 1-21 | HTML+CSS 框架 | **Cherry** | DOM 结构、样式 |
| 23-47 | CONFIG | **Cherry** | 常量定义，不可修改视觉 bot 的配置 |
| 49-61 | PALETTE | **共同** | 颜色调色板，可新增但不可删除已用色 |
| 64-85 | RENDERER | **Cherry** | `r/pr/bx/tx/dr` 基础函数，**签名不可改** |
| 87-111 | CHARACTERS (程序化) | **共同** | `mkChar()` 和 CS 对象，可新增不可改签名 |
| 113-137 | SPRITES (程序化) | **Visual** | `SHP/SPL/SCO` 等程序化精灵矩阵 |
| 139-196 | LPC SPRITE LOADING | **Cherry** | `LPC` 对象、`drawLPC()`、`drawLPC2x1/2x2()`，**签名不可改** |
| 199-235 | TM TILE MAP | **Visual** | `TM` 贴图映射对象，坐标值由视觉 bot 维护 |
| 237-274 | LPC CHARACTER DRAWING | **Cherry** | `drawLPCChar()`、`getCharFrame()`，**签名不可改** |
| 276-326 | DEBUG | **共同** | `drawLPCDebug()`，视觉可增强显示内容 |
| 328-333 | STATE | **Cherry** | `G`、`E`、`orderQ`，**不可改动结构** |
| 335-457 | ENTITY SYSTEM | **Cherry** | `ENT` 对象，全部实体 AI |
| 459-599 | TASK + STAFF | **Cherry** | `TASKS`、`SROLES`、`hireStaff()`、`doStaffTask()` |
| 601-671 | SPAWN + QUEUE | **Cherry** | 生成逻辑、排队系统 |
| 671-711 | (spawn 相关) | **Cherry** | `spawnCust()`、`spawnPed()` |
| 711-783 | (菜单/结账) | **Cherry** | 点单、结账、菜品系统 |
| 783-803 | OFFLINE EARNINGS | **Cherry** | 离线收益 |
| 805-843 | CUSTOMER TYPES | **Cherry** | 顾客类型定义，`CUST_TYPES` **结构不可改** |
| 845-897 | RATING + LEVEL | **Cherry** | 评分等级系统 |
| 897-1032 | (点击处理) | **Cherry** | 所有鼠标/触摸交互 |
| 1032-1045 | TIP | **Cherry** | 提示系统 |
| 1045-1138 | UPDATE | **Cherry** | `upd()`，全部更新逻辑 |
| 1140-1163 | DRAW (主函数) | **Cherry** | `draw()` 主渲染函数 |
| 1165-1296 | drawStrip1 / drawStrip2 | **共同** | 墙壁、装饰由视觉 bot；表中的 `TXTAB()` 调用由Cherry |
| 1298-1419 | TXTAB | **共同** | **关键共享区域**，见下方细则 |
| 1421-1614 | drawStrip3 | **共同** | **关键共享区域**，灶台渲染 |
| 1616-1788 | drawRoad / drawEnts | **共同** | 道路、实体渲染，LPC 字符分支由视觉 bot 调参数 |
| 1788-1937 | LPC SPRITE CHARACTER | **共同** | 角色 LPC 渲染分支（Cherry 维护整体结构，视觉调位置/scale） |
| 1862-1936 | PROCEDURAL FALLBACK | **Cherry** | 程序化角色回退 |
| 1939-1986 | LPC SPRITE STAFF | **共同** | 员工 LPC 渲染分支 |
| 1974-2152 | PROCEDURAL STAFF / ENTS / HUD | **Cherry** | 程序化回退 + 整体实体循环 + HUD |
| 2153-2180 | LOOP | **Cherry** | 游戏主循环 |
| 2182-2210 | START | **Cherry** | 初始化流程 |

### TXTAB() 共享细则

```javascript
function TXTAB(cx2,tables){
  tables.forEach(t=>{
    // [Cherry] 阴影计算 + 位置计算
    // [Visual] LPC 精灵渲染分支（if(LPC.ready){...}）
    //          负责：桌面条纹、椅子位置、火锅冒菜、热锅位置
    // [Cherry] 程序化回退分支（else{...}）
    // [Cherry] UI 标签（桌位容量、状态文字、耐心条、清洁进度）
  });
}
```

> **重要规则**：`LPC.ready` 条件分支内的视觉位置/scale 值由视觉 bot 调整，
> Cherry 不修改这些视觉参数。反之，`else` 回退分支和 UI 标签部分由 Cherry 维护，视觉 bot 不改。

---

## 5. 接口契约

以下接口 **签名不可修改**（参数名可调整，但参数数量、顺序、类型不可变）。

### 5.1 核心渲染函数

```javascript
// 基础绘制 — 签名不可改
r(x, y, w, h, color)
pr(x, y, w, h, color)     // pixel-aligned rect
bx(x, y, w, h, borderColor, fillColor, strokeSize?)
tx(text, x, y, color, fontSize?)
dr(matrix, x, y, scale?)   // procedural pixel matrix

// LPC 精灵绘制 — 签名不可改
drawLPC(sheetName, col, row, dx, dy, scale?)
drawLPC2x1(sheetName, col, row, dx, dy, scale?)
drawLPC2x2(sheetName, col, row, dx, dy, scale?)
drawLPCChar(frameIdx, dir, dx, dy, scale?, tint?)
```

### 5.2 视觉 Bot 的可操作参数

视觉 bot 可以 **自由调整** 以下参数，无需通知 Cherry：
- `TM` 对象中的所有 `[col, row]` 贴图坐标
- `drawLPC()` 调用中的 `scale` 值
- `drawLPCChar()` 调用中的 `scale` 和 `tint` 值
- `drawLPC()` 调用中的 `dx, dy` 偏移量（仅限 `TXTAB` / `drawStrip3` / `drawEnts` 内部）
- LPC 精灵图文件路径（`LPC_SHEETS` 中的 `src`）

视觉 bot **不能改动** 以下：
- `drawLPC()` / `drawLPCChar()` 的函数签名
- `LPC` 全局对象的属性结构
- `LPC_SHEETS` 的对象键名（可以新增但不能删除）
- 任何以 `// [Cherry]` 标记的代码段内容

### 5.3 实体系统接口

视觉 bot 可以 **读取** 但不 **修改** 以下实体属性用于渲染决策：

```javascript
e.type    // 'cust' | 'staff' | 'ped' | 'food_fx'
e.st      // 'idle' | 'walk' | 'seat' | 'eat' | 'done' | 'angry' | 'staff_idle' | 'staff_walk' | ...
e.x, e.y  // 世界坐标
e.dir     // -1 (左) | 1 (右)
e.f       // 动画帧 (0|1)
e.role    // staff 角色名（如 'wang'）
e.order   // 订单对象（可用于判断是否已点单）
```

### 5.4 LPC 精灵加载契约

```javascript
const LPC = { ready: false, debug: false, charReady: false };
const LPC_SHEETS = {
  furniture: { src: '...', img: null, cols: 32, rows: 32 },
  cooking:   { src: '...', img: null, cols: 16, rows: 16 },
  deco:      { src: '...', img: null, cols: 16, rows: 56 },
  char:      { src: '...', img: null, fw: 48, fh: 64, cols: 3, rows: 4 },
};
```

- `LPC.ready` = 家具 + 烹饪 + 装饰都加载完毕
- `LPC.charReady` = 角色精灵加载完毕
- 所有 LPC 分支代码使用 `if(LPC.ready)` / `if(LPC.charReady)` 作为守卫

---

## 6. 渲染规范

### 6.1 坐标系

- **世界坐标**: 原点 (0,0) 在画布最左侧（`CAM.x` 控制横向滚动偏移）
- **屏幕坐标**: 需要减去 `CAM.x`（通常记为 `cx2 = CAM.x`）
- **画布尺寸**: 420×700（物理像素）
- **世界宽度**: 720（4 条 strip 共享同一世界空间）

### 6.2 Strip 布局

```
STRIP.top = 0          → 餐厅上区（2人桌/4人桌）
STRIP.mid = 175        → 餐厅中区（更多桌子）
STRIP.bot = 350        → 厨房+入口（灶台、门）
STRIP.road = 525       → 室外道路（行人）
```

### 6.3 像素对齐

- 所有矩形绘制优先使用 `pr()`（自动对齐到 PU=4 的倍数）
- 精灵图使用 `dx|0, dy|0` 整数化坐标
- scale 参数默认 `1.0`，建议不超过 `2.0`

### 6.4 LPC 精灵渲染顺序

```javascript
cx.imageSmoothingEnabled = false;  // 必须关闭，保持像素风
```

### 6.5 角色精灵布局（male_walk.png）

```
48×64px/帧，3列×4行
行0 = 朝南 (south)  → 坐下/工作中
行1 = 朝西 (west)   → 向左走
行2 = 朝北 (north)  → 未使用（可保留）
行3 = 朝东 (east)   → 向右走

帧0 → 左腿迈出
帧1 → 站立（中间帧）
帧2 → 右腿迈出
```

---

## 7. 命名与风格

### 7.1 代码风格

- 使用 `const` / `let`（不使用 `var`）
- 函数使用 `function` 声明（非箭头函数，除非作为回调）
- 大括号风格：`function foo(){` （同一行左花括号）
- 缩进：2 空格
- 注释：中文为主，代码含义用英文，逻辑说明用中文

### 7.2 命名约定

| 类别 | 风格 | 示例 |
|------|------|------|
| 常量 | 大写+下划线 | `LPC_TILE`, `WW`, `SH` |
| 全局对象 | 大写 | `G`, `C`, `TM`, `ENT` |
| 函数 | camelCase | `drawLPC()`, `mkChar()`, `loadGame()` |
| 实体属性 | 缩写 | `st`(state), `f`(frame), `ep`(eatProgress) |
| LPC sheet 名 | 字符串小写 | `'furniture'`, `'cooking'`, `'deco'` |

### 7.3 Section 标记格式

每个代码段必须以以下格式标记：

```javascript
// ============================================================
// [所有者] 节标题
// ============================================================
// 可选：细则说明
```

### 7.4 共享区域的修改注释规则

当两个 bot 需要修改同一区域时，必须使用 TODO 注释明确标注：

```javascript
// TODO: [Visual] 调整椅子精灵位置
// TODO: [Cherry] 添加新实体状态处理
```

---

## 8. Git 工作流

### 8.1 分支策略

有两种协作模式：

**模式 A：依次提交（推荐）**
1. Cherry 或视觉 bot 修改代码
2. 提交到 `main` 分支
3. 通知用户，另一个 bot 基于最新代码继续

**模式 B：Cherry 代提交**
视觉 bot 不直接操作 git，通过 Cherry 的 git 工具提交。
视觉 bot 把要改的内容通过用户/文档传达给 Cherry 来执行 git 操作。

**目前采用模式 A**，两个 bot 各自通过用户传达，Cherry 统一管理 git。

### 8.2 Commit 规范

```
<type>: <简短的改动描述>

<可选：详细说明>
```

- `feat:` — 新功能
- `fix:` — 修复
- `chore:` — 构建/部署
- `docs:` — 文档
- `refactor:` — 重构
- `visual:` — 视觉调整（视觉 bot 专属）

示例:
```
visual: 调整餐桌 LPC 贴图坐标，替换椅子精灵
feat: 添加排队系统等待超时逻辑
fix: 修复顾客结账后桌面状态未更新
```

### 8.3 特殊注意事项

- **Git token**: 存储在 Windows 凭据管理器中（Cherry 的持久记忆中有记录）
- **Push 流程**: `git remote set-url origin https://SuperSoi0218:TOKEN@github.com/SuperSoi0218/hotpot-html.git` → push → 恢复
- **Pages 部署**: push 后约 1-2 分钟生效
- **入口文件**: 必须为 `index.html`

---

## 9. 冲突处理协议

当两个 bot 的修改可能冲突时，按以下优先级处理：

### 9.1 层级一：第 4 节的代码段所有权

严格遵守，每个 bot 只修改自己有权修改的代码段。
如果某个功能需要双方协作修改（如新增一种桌子样式），先在各自的代码段内完成自己的工作，再通过用户协调。

### 9.2 层级二：接口契约优先于实现

如果视觉 bot 需要某个新的渲染能力（如新增 `drawLPC4x4()`），**不能直接写进代码**，需：
1. 通过用户向 Cherry 提出需求
2. Cherry 评估后添加新函数到接口契约
3. 视觉 bot 再使用新函数

### 9.3 层级三：视觉参数 vs 逻辑框架

当视觉 bot 调整参数影响逻辑，或 Cherry 调整框架影响视觉时：
- **视觉优先原则**: 视觉渲染位置的微小偏移（±10px 内）和 scale（±0.3内）以视觉 bot 为准
- **逻辑保护原则**: 如果视觉调整导致 UI 标签/点击区域偏移超出合理范围，Cherry 有权回退该调整并通知用户

### 9.4 冲突解决流程

```
发现冲突
    ↓
在对应代码段添加 TODO 注释（见 7.4 节）
    ↓
通过用户传达冲突细节（"我改了 X，但发现 Y 也被修改了"）
    ↓
用户决定先让哪个 bot 的修改合并
    ↓
先改的 bot 提交 → 用户通知另一个 bot → 另一个 bot 基于最新代码适配
```

---

## 10. 沟通协议

### 10.1 通过用户中转

两个 bot **不直接对话**，所有信息通过用户中转：

```
视觉 Bot → (输出代码/建议) → 用户 → (转发给 Cherry) → Cherry 执行/评估
Cherry   → (输出文档/代码) → 用户 → (转发给视觉 Bot) → 视觉 Bot 执行
```

### 10.2 信息传递格式

当 Cherry 需要向视觉 bot 传达信息时，使用 `docs/` 下的 MD 文档：
- 技术方案 → `docs/TECH-NOTES.md`（或新文件）
- 资产指引 → `docs/LPC-ASSET-GUIDE.md`（视觉 bot 接管后自行维护）
- 协作规则 → **本文档**

当视觉 bot 需要向 Cherry 传达信息时，通过用户转发：
- 需要新增的函数/接口 → 描述清楚签名和用途
- 发现的 bug → 提供复现步骤和截图描述
- 需要微调的 TM 值 → 列出 `TM.xxx = [newCol, newRow]`

### 10.3 文件锁定

为避免同时修改同一文件，采用 **隐式锁定**：
- 修改开始前，通过用户告知另一个 bot "我在改 X"
- 修改完成后（commit/push），通知另一个 bot "X 已改好"
- 如果没有收到显式的"锁定中"通知，默认可以修改自己的代码段

### 10.4 紧急回退

如果某个修改导致游戏崩溃或显示严重异常：
1. 立即通知用户
2. 优先使用 `git revert` 回退到上一个稳定版本
3. 分析原因后在文档中追加经验教训

---

## 11. 附录：当前 TM 贴图映射表

> 当前 `TM` 对象中的坐标值为基于像素分析的**最佳猜测**，需要视觉 bot 用截图验证后修正。

```javascript
const TM = {
  // -- Cooking sheet (16x16 tiles) --
  stoveBody:   [0, 0],    // LOW CONFIDENCE: 灶台主体
  stoveTop:    [0, 1],    // LOW: 灶台顶面
  stovePot:    [5, 2],    // MED: 锅
  stoveFire:   [12, 0],   // MED: 火焰
  foodPot:     [11, 7],   // LOW: 大锅食物
  foodPot2:    [12, 7],   // LOW: 第二个锅
  plate:       [0, 11],   // LOW: 盘子
  bowl:        [8, 11],   // LOW: 碗
  meat:        [2, 5],    // LOW: 生肉
  cookedMeat:  [4, 5],    // LOW: 熟肉

  // -- Furniture sheet (32x32 tiles) —
  tableTL:  [0, 0],    // HIGH: 桌子左上
  tableTR:  [2, 0],    // HIGH: 桌子右上
  tableBL:  [0, 2],    // HIGH: 桌子左下
  tableBR:  [2, 2],    // HIGH: 桌子右下
  tableTop: [0, 4],    // MED: 桌面木纹 (2x2)
  chair:    [7, 0],    // LOW: 椅子
  chairSeat:[5, 0],    // LOW: 椅面
  stool:    [24, 0],   // LOW: 凳子
  counter:  [0, 6],    // LOW: 柜台
  shelf:    [23, 0],   // LOW: 架子

  // -- Deco sheet (16x56 tiles) —
  bread:     [0, 0],    // LOW: 面包
  plateItem: [0, 3],    // LOW: 盘中餐
  coin:      [0, 6],    // LOW: 金币
  drink:     [0, 10],   // LOW: 饮料杯
  foodBowl:  [25, 0],   // LOW: 食物碗
  goldBar:   [8, 0],    // LOW: 金条
  bottle:    [16, 0],   // LOW: 瓶子
  flag:      [46, 0],   // LOW: 旗帜
};
```

所有 `LOW CONFIDENCE` 的条目需要视觉 bot 通过查看实际截图来修正。

---

## 附录 A：LPC 资源下载

| 资源 | 链接 | 说明 |
|------|------|------|
| Tavern 包 | https://opengameart.org/content/lpc-tavern | 家具+烹饪+装饰 |
| House Interior | https://opengameart.org/content/lpc-house-interior | 室内家具 |
| 角色生成器 | https://sanderfrenken.github.io/Universal-LPC-Spritesheet-Character-Generator/ | 生成自定义角色 |

## 附录 B：CC-BY-SA 3.0 署名

所有 LPC 资产基于 CC-BY-SA 3.0 协议，需要在游戏内（关于/设置页面）或 README 中署名：

> LPC Tavern assets by Lanea Zimmerman (Sharm), Tuomo Untinen, Daniel Eddeland,
> Hyptosis, Matthew Krohn, Johannes Sjölund, William Thompson, Manuel Riecke (MrBeast).
> Licensed under CC-BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/).

---

*最后更新: 2026-05-17*
*维护者: Cherry (逻辑主程)*
