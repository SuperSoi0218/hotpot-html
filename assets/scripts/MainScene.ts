/**
 * 主场景组件 - Cocos Creator Component
 * 挂载到场景根节点即可运行游戏
 */
import { _decorator, Component, Node, Label, Button, director } from 'cc';
import { GameController } from './core/GameController';
import { GameManager } from './core/GameManager';
import { EventBus, GameEvents } from './core/EventBus';
import { GameHUD } from './ui/GameHUD';
import { LevelManager } from './utils/LevelManager';

const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Component {
    @property(Label)
    goldLabel: Label | null = null;

    @property(Label)
    diamondLabel: Label | null = null;

    @property(Label)
    levelLabel: Label | null = null;

    @property(Label)
    statusLabel: Label | null = null;

    private controller!: GameController;
    private hud!: GameHUD;

    start() {
        this.controller = new GameController();
        this.hud = new GameHUD();

        this.initGame();
        this.registerUIEvents();
        console.log('[Game] 火锅店开张啦！');
    }

    private async initGame() {
        if (this.statusLabel) this.statusLabel.string = '加载中...';

        await this.controller.init();
        this.hud.init();
        this.controller.openBusiness();

        if (this.statusLabel) this.statusLabel.string = '营业中 🍲';
        this.refreshHUD();
    }

    update(dt: number) {
        this.controller.update(dt);
    }

    // ===== UI 事件 =====

    private registerUIEvents() {
        EventBus.on(GameEvents.GOLD_CHANGED, () => this.refreshHUD());
        EventBus.on(GameEvents.DIAMOND_CHANGED, () => this.refreshHUD());
        EventBus.on(GameEvents.RESTAURANT_LEVEL_UP, (level: number) => {
            const title = LevelManager.getConfig(level).title;
            console.log(`升级! ${title} (Lv.${level})`);
            this.refreshHUD();
        });
    }

    private refreshHUD() {
        const gm = GameManager.getInstance();
        if (this.goldLabel) this.goldLabel.string = `${gm.playerData.gold}`;
        if (this.diamondLabel) this.diamondLabel.string = `${gm.playerData.diamond}`;
        if (this.levelLabel) this.levelLabel.string = `Lv.${gm.playerData.level}`;
    }

    // ===== 按钮事件 =====

    onEnterKitchen() { director.loadScene('KitchenScene'); }
    onOpenUpgrade() { director.loadScene('UpgradeScene'); }
    onOpenStaff() { director.loadScene('StaffScene'); }
    onOpenSocial() { director.loadScene('SocialScene'); }
}
