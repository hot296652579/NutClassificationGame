import { _decorator, Node, Prefab, instantiate, Component, Camera, UITransform, v3, game, view, screen, tween, Vec3 } from 'cc';
import { UserModel } from '../Model/UserModel';
import { LevelManager } from './LevelMgr';
import { EventDispatcher } from '../../../core_tgx/easy_ui_framework/EventDispatcher';
import { ADEvent } from '../Enum/ADEvent';
import { AudioMgr } from '../../../core_tgx/base/AudioMgr';
const { ccclass, property } = _decorator;

/** 广告管理*/
@ccclass('AdvertMgr')
export class AdvertMgr {
    private static _instance: AdvertMgr | null = null;
    public static get instance(): AdvertMgr {
        if (!this._instance) this._instance = new AdvertMgr();
        return this._instance;
    }

    adInstance: any = null;

    initilize(): void {
        this.adInstance = (window as any)['adInstance'];
        console.log('ad sdk初始化');
        console.log(this.adInstance);
    }

    /** 显示激励广告*/
    showReawardVideo(cb?: () => void): void {
        if (!this.adInstance) {
            cb && cb();
            return;
        }

        this.adInstance.rewardAd({
            beforeAd() {
                console.log('The ad starts playing, and the game should pause.');
                EventDispatcher.instance.emit(ADEvent.REWARD_VIDEO_PLAY);
                AudioMgr.inst.pause();
            },
            adDismissed() {
                console.log('Player dismissed the ad before completion.');
                EventDispatcher.instance.emit(ADEvent.REWARD_VIDEO_DISMISSED);
                AudioMgr.inst.resume();
            },
            adViewed() {
                console.log('Ad was viewed and closed.');
                if (cb) cb();
                EventDispatcher.instance.emit(ADEvent.REWARD_VIDEO_CLOSEED);
                AudioMgr.inst.resume();
            },
            error(err: any) {
                console.log(`激励广告错误:${err}`);
                EventDispatcher.instance.emit(ADEvent.REWARD_VIDEO_ERROR);
                AudioMgr.inst.resume();
            }
        });
    }
}
