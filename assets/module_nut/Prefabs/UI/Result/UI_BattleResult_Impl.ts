import { isValid, Label, tween, v3, Vec3, Node, Tween } from "cc";
import { EventDispatcher } from "../../../../core_tgx/easy_ui_framework/EventDispatcher";
import { tgxModuleContext } from "../../../../core_tgx/tgx";
import { GameUILayers } from "../../../../scripts/GameUILayers";
import { UI_BattleResult } from "../../../../scripts/UIDef";
import { GameEvent } from "../../../Script/Enum/GameEvent";
import { NutGameAudioMgr } from "../../../Script/Manager/NutGameAudioMgr";
import { LevelManager } from "../../../Script/Manager/LevelMgr";
import { UserManager } from "../../../Script/Manager/UserMgr";
import { Layout_BattleResult } from "./Layout_BattleResult";
import { AdvertMgr } from "../../../../core_tgx/base/ad/AdvertMgr";
import { duration } from "../../../Script/NutComponent";
import { GtagMgr, GtagType } from "db://assets/core_tgx/base/GtagMgr";

export class UI_BattleResult_Impl extends UI_BattleResult {
    rewardBase: number = 0; //基础奖励
    rewardAdditional: number = 0; //额外奖励
    timeoutIds: Array<number | NodeJS.Timeout> = [];
    win: boolean = true;

    constructor() {
        super('Prefabs/UI/Result/UI_BattleResult', GameUILayers.POPUP, Layout_BattleResult);
    }

    public getRes(): [] {
        return [];
    }

    protected onCreated(): void {
        this.playStartEffect();
        const soundId = this.win ? 3 : 3;
        NutGameAudioMgr.playOneShot(NutGameAudioMgr.getMusicIdName(soundId), 1.0);

        let layout = this.layout as Layout_BattleResult;
        this.onButtonEvent(layout.btNext, () => {
            NutGameAudioMgr.playOneShot(NutGameAudioMgr.getMusicIdName(5), 1.0);
            this.onClickRewardBase(); //领取基础奖励
        });
        this.rotationLight();
        this.updateStar();

        const { level } = LevelManager.instance.levelModel;
        GtagMgr.inst.doGameDot(GtagType.level_end, { level });
    }

    private playStartEffect(): void {
        let layout = this.layout as Layout_BattleResult;
        const { winNode } = layout;
        winNode.setScale(new Vec3(0, 0, 0));
        tween(winNode)
            .to(duration, { scale: new Vec3(1, 1, 1) })
            .start()
    }

    private rotationLight(): void {
        const { light } = this.layout;
        light.eulerAngles = v3(0, 0, 0);
        tween(light)
            .repeatForever(
                tween()
                    .to(5, { eulerAngles: new Vec3(0, 0, 360) }, { easing: 'linear' })
                    .call(() => {
                        light!.eulerAngles = new Vec3(0, 0, 0);
                    })
            )
            .start();
    }

    private updateStar(): void {
        const { star } = LevelManager.instance.levelModel;
        const { levStars } = this.layout;
        console.log(`当前关卡星星:${star}`);

        let soundId = 8;
        levStars.children.forEach((child, index) => {
            const sprite = child.getChildByName('Sprite');
            sprite.active = false; // 初始隐藏


            // 延迟显示，间隔 0.5 秒
            const timeoutId = setTimeout(() => {
                sprite.active = index < star;
                if (sprite.active) {
                    NutGameAudioMgr.playOneShot(NutGameAudioMgr.getMusicIdName(soundId), 1.0);
                    // 播放从大到小的动画
                    sprite.scale = new Vec3(1.4, 1.4, 1.4);
                    tween(sprite)
                        .to(0.3, { scale: new Vec3(1, 1, 1) })
                        .start();
                }
                soundId++;
            }, index * 500);
            this.timeoutIds.push(timeoutId);
        });
    }

    private emitEvent(): void {
        if (this.win) {
            EventDispatcher.instance.emit(GameEvent.EVENT_BATTLE_SUCCESS_LEVEL_UP);
        } else {
            EventDispatcher.instance.emit(GameEvent.EVENT_BATTLE_FAIL_LEVEL_RESET);
        }
    }

    onClickRewardBase(): void {
        UserManager.instance.addMoney(this.rewardBase);
        EventDispatcher.instance.emit(GameEvent.EVENT_USER_MONEY_UPDATE);
        this.emitEvent();
        this.destoryMyself();
    }

    private addAdverHandler(): void {
        AdvertMgr.instance.showReawardVideo(() => {
            UserManager.instance.addMoney(this.rewardAdditional);
            EventDispatcher.instance.emit(GameEvent.EVENT_USER_MONEY_UPDATE);
            this.emitEvent();
            this.destoryMyself();
        })
    }

    clearAllTimeouts() {
        this.timeoutIds.forEach((id) => clearTimeout(id)); // 类型正常，无需强制转换
        this.timeoutIds = [];
    }

    private destoryMyself(): void {
        Tween.stopAllByTarget(this.node)
        if (isValid(this.node)) {
            this.node.removeFromParent();
            this.node.destroy();
        }
        this.clearAllTimeouts();
    }
}

tgxModuleContext.attachImplClass(UI_BattleResult, UI_BattleResult_Impl);