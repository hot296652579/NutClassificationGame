import { _decorator, Component, Label, Node, ProgressBar, tween, Tween, Vec3 } from 'cc';
import { EventDispatcher } from '../../core_tgx/easy_ui_framework/EventDispatcher';
import { GameEvent } from './Enum/GameEvent';
import { LevelManager } from './Manager/LevelMgr';
import { PropManager } from './Manager/PropMgr';
import { GameUtil } from './Utils';
const { ccclass, property } = _decorator;

const duration: number = 1;
/** 转场动画界面*/
@ccclass('TransitionUI')
export class TransitionUI extends Component {

    private isGrowing: boolean = true; // 控制动画的布尔值
    private tweenAction: Tween<Node> | null = null;

    start() {
        this.node.active = true;
        this.node.setScale(Vec3.ZERO);
        this.setupUIListeners();
    }

    private setupUIListeners(): void {
        EventDispatcher.instance.on(GameEvent.EVENT_ZERO_TO_FULL_TRANSITION, this.growingToBig, this);
        EventDispatcher.instance.on(GameEvent.EVENT_FULL_TO_ZERO_TRANSITION, this.growingToSmall, this);
    }

    private growingToBig(): void {
        this.node.active = true;
        this.node.setScale(Vec3.ZERO);
        this.isGrowing = true;
        this.startAnimation();
    }

    private growingToSmall(): void {
        this.node.active = true;
        this.node.setScale(1.3, 1.3, 1.3);
        this.isGrowing = false;
        this.startAnimation();
    }

    private startAnimation() {
        // 停止当前的动画
        if (this.tweenAction) {
            this.tweenAction.stop();
        }

        if (this.isGrowing) {
            // 变大动画
            this.tweenAction = tween(this.node)
                .to(duration, { scale: new Vec3(1.3, 1.3, 1.3) }, { easing: 'quadInOut' })
                .call(() => {
                    this.isGrowing = false;
                    EventDispatcher.instance.emit(GameEvent.EVENT_ZERO_TO_FULL_TRANSITION_FINISH);
                })
                .start();
        } else {
            // 缩小动画
            this.tweenAction = tween(this.node)
                .to(duration, { scale: new Vec3(0, 0, 0) }, { easing: 'quadInOut' })
                .call(() => {
                    this.isGrowing = true;
                    EventDispatcher.instance.emit(GameEvent.EVENT_FULL_TO_ZERO_TRANSITION_FINISH);
                })
                .start();
        }
    }

    protected onDestroy(): void {
        this.clearTween();
        EventDispatcher.instance.off(GameEvent.EVENT_ZERO_TO_FULL_TRANSITION, this.growingToBig);
        EventDispatcher.instance.off(GameEvent.EVENT_FULL_TO_ZERO_TRANSITION, this.growingToSmall);
    }

    private clearTween() {
        if (this.tweenAction) {
            this.tweenAction.stop();
            this.tweenAction = null;
        }
    }
}


