
import { Tween, tween } from "cc";
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
        this.updateUserInfo();
        this.updateLevelLb();

        let layout = this.layout as Layout_TopInfo;
        this.onButtonEvent(layout.btSet, () => {
            NutGameAudioMgr.playOneShot(NutGameAudioMgr.getMusicIdName(5), 1.0);
            const show = tgxUIMgr.inst.isShowing(UI_Setting);
            if (!show) {
                tgxUIMgr.inst.showUI(UI_Setting);
            }
        });
    }

    private addListener(): void {
        EventDispatcher.instance.on(GameEvent.EVENT_USER_MONEY_UPDATE, this.updateUserInfo, this);
        EventDispatcher.instance.on(GameEvent.EVENT_BATTLE_SUCCESS_LEVEL_UP, this.levelUpHandler, this);
        EventDispatcher.instance.on(GameEvent.EVENT_BATTLE_FAIL_LEVEL_RESET, this.resetGameByLose, this);
    }

    private updateUserInfo(): void {
        const { money } = UserManager.instance.userModel;
        const { lbMoney } = this.layout;
        const from = parseFloat(lbMoney.string) || 0;
        this.startRolling(from, money, 0.2);
    }

    private updateLevelLb(): void {
        const { level } = LevelManager.instance.levelModel;
        console.log(`当前关卡等级:${level}`);
        const { lbLevel } = this.layout;
        lbLevel.string = `关卡${level}`;
    }

    //关卡升级事件
    private levelUpHandler(): void {
        this.updateLevelLb();
    }

    //闯关失败事件
    private resetGameByLose(): void {
        this.updateLevelLb();
    }

    /**
     * 开始滚动金钱数额
     * @param from 起始金额
     * @param to 目标金额
     * @param duration 滚动持续时间（秒）
     */
    private startRolling(from: number, to: number, duration: number) {
        const { lbMoney } = this.layout;

        if (this.rollingTween) {
            this.rollingTween.stop();
            this.rollingTween = null;
        }
        if (!lbMoney) return;

        // 定义一个对象来存储滚动的数值
        const rollingData = { value: from };

        this.rollingTween = tween(rollingData)
            .to(duration, { value: to }, {
                onUpdate: () => {
                    if (lbMoney) {
                        lbMoney.string = rollingData.value.toFixed(0); // 更新文本显示为整数
                    }
                },
            })
            .call(() => {
                if (lbMoney) {
                    lbMoney.string = to.toFixed(0); // 确保最终显示的是目标值
                }
                this.rollingTween = null;
            })
            .start();
    }

    protected onDispose(): void {
        EventDispatcher.instance.off(GameEvent.EVENT_USER_MONEY_UPDATE, this.updateUserInfo);
        EventDispatcher.instance.off(GameEvent.EVENT_BATTLE_SUCCESS_LEVEL_UP, this.levelUpHandler);
        EventDispatcher.instance.off(GameEvent.EVENT_BATTLE_FAIL_LEVEL_RESET, this.resetGameByLose);
    }

}

tgxModuleContext.attachImplClass(UI_TopInfo, UI_TopInfo_Impl);