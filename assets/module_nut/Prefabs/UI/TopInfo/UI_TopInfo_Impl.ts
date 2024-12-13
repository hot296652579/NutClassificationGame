
import { math, Tween, tween } from "cc";
import { EventDispatcher } from "../../../../core_tgx/easy_ui_framework/EventDispatcher";
import { tgxModuleContext, tgxUIMgr } from "../../../../core_tgx/tgx";
import { GameUILayers } from "../../../../scripts/GameUILayers";
import { UI_Setting, UI_TopInfo } from "../../../../scripts/UIDef";
import { GameEvent } from "../../../Script/Enum/GameEvent";
import { NutGameAudioMgr } from "../../../Script/Manager/NutGameAudioMgr";
import { LevelManager } from "../../../Script/Manager/LevelMgr";
import { UserManager } from "../../../Script/Manager/UserMgr";
import { Layout_TopInfo } from "./Layout_TopInfo";

export class UI_TopInfo_Impl extends UI_TopInfo {
    private rollingTween: Tween<any> | null = null; // 滚动动画的 tween 对象
    constructor() {
        super('Prefabs/UI/TopInfo/UI_TopInfo', GameUILayers.OVERLAY, Layout_TopInfo);
    }

    public getRes(): [] {
        return [];
    }

    protected onCreated(): void {
        // let layout = this.layout as Layout_TopInfo;
        this.initilizeUI();
        this.addListener();
    }

    private initilizeUI(): void {
        this.updateLevelLb();
        this.onUpdateStarStep();

        let layout = this.layout as Layout_TopInfo;
        this.onButtonEvent(layout.btSet, () => {
            NutGameAudioMgr.playOneShot(NutGameAudioMgr.getMusicIdName(5), 1.0);
            const show = tgxUIMgr.inst.isShowing(UI_Setting);
            if (!show) {
                tgxUIMgr.inst.showUI(UI_Setting);
            }
        });

        this.onButtonEvent(layout.btReLoad, () => {
            NutGameAudioMgr.playOneShot(NutGameAudioMgr.getMusicIdName(5), 1.0);
            EventDispatcher.instance.emit(GameEvent.EVENT_BATTLE_FAIL_LEVEL_RESET);
        });
    }

    private addListener(): void {
        EventDispatcher.instance.on(GameEvent.EVENT_UPDATE_STAR_STEP, this.onUpdateStarStep, this);
        EventDispatcher.instance.on(GameEvent.EVENT_BATTLE_SUCCESS_LEVEL_UP, this.levelUpHandler, this);
        EventDispatcher.instance.on(GameEvent.EVENT_BATTLE_FAIL_LEVEL_RESET, this.resetGameByLose, this);
    }

    private updateLevelLb(): void {
        const { level } = LevelManager.instance.levelModel;
        // console.log(`当前关卡等级:${level}`);
        const { lbLevel } = this.layout;
        lbLevel.string = `LEVEL.${level}`;
    }

    private onUpdateStarStep(): void {
        this.updateStep();
        this.updateStar();
        this.updateStepProgress();
    }

    private updateStep(): void {
        const { levelConfig, playerStep } = LevelManager.instance.levelModel;
        const { lbRemainingSteps } = this.layout;
        let remain = Math.floor(levelConfig.step - playerStep);
        if (remain <= 0) {
            remain = 0;
        }
        lbRemainingSteps.string = remain;
    }

    private updateStepProgress(): void {
        const { levelConfig, playerStep } = LevelManager.instance.levelModel;
        const { levProgress } = this.layout;

        let remain = Math.floor(levelConfig.step - playerStep);
        if (remain <= 0) {
            remain = 0;
            return;
        }

        const total = levProgress.totalLength;
        const precision = 10000;
        const progressRatio = Math.floor((remain * precision) / levelConfig.step) / precision;
        const progressLength = progressRatio * total;
        levProgress.progress = progressLength / total;
    }

    private updateStar(): void {
        const { star } = LevelManager.instance.levelModel;
        const { levStars } = this.layout;
        console.log(`当前关卡星星:${star}`);
        levStars.children.forEach((child, index) => {
            child.getChildByName('Sprite').active = index < star;
        });
    }

    //关卡升级事件
    private levelUpHandler(): void {
        this.updateLevelLb();
        this.onUpdateStarStep();
    }

    //闯关失败事件
    private resetGameByLose(): void {
        this.updateLevelLb();
    }

    protected onDispose(): void {
        EventDispatcher.instance.off(GameEvent.EVENT_UPDATE_STAR_STEP, this.onUpdateStarStep);
        EventDispatcher.instance.off(GameEvent.EVENT_BATTLE_SUCCESS_LEVEL_UP, this.levelUpHandler);
        EventDispatcher.instance.off(GameEvent.EVENT_BATTLE_FAIL_LEVEL_RESET, this.resetGameByLose);
    }

}

tgxModuleContext.attachImplClass(UI_TopInfo, UI_TopInfo_Impl);