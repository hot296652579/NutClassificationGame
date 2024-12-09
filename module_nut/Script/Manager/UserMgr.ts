import { _decorator, Node, Prefab, instantiate, Component, Camera, UITransform, v3, game, view, screen, tween, Vec3 } from 'cc';
import { EventDispatcher } from '../../../core_tgx/easy_ui_framework/EventDispatcher';
import { GameEvent } from '../Enum/GameEvent';
import { UserModel } from '../Model/UserModel';
import { tgxUIAlert } from '../../../core_tgx/tgx';
import { LevelManager } from './LevelMgr';
const { ccclass, property } = _decorator;

/** 用户管理*/
@ccclass('UserManager')
export class UserManager {
    private static _instance: UserManager | null = null;
    public static get instance(): UserManager {
        if (!this._instance) this._instance = new UserManager();
        return this._instance;
    }

    public userModel: UserModel;
    initilizeModel(): void {
        this.userModel = new UserModel();

        //设置玩家初始货币
    }

    /** 检测余额是否足够*/
    checkEnough(deductMoney: number): boolean {
        // console.log(`用户余额:${this.userModel.money} ,扣除金额:${deductMoney}`);
        return this.userModel.money - deductMoney >= 0;
    }

    /** 扣钱*/
    deductMoney(money: number): void {
        let userModel = this.userModel.money;
        this.userModel.money = userModel - money;
        console.log(`剩余金钱:${this.userModel.money}`);
        EventDispatcher.instance.emit(GameEvent.EVENT_USER_MONEY_UPDATE);
    }

    /** 加钱*/
    addMoney(money: number): void {
        let userModel = this.userModel.money;
        this.userModel.money = userModel + money;
        EventDispatcher.instance.emit(GameEvent.EVENT_USER_MONEY_UPDATE);
    }
}
