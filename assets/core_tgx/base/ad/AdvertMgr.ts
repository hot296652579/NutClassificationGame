import { _decorator, Node, Prefab, instantiate, Component, Camera, UITransform, v3, game, view, screen, tween, Vec3 } from 'cc';
import { UserModel } from '../../../module_nut/Script/Model/UserModel';
import { LevelManager } from '../../../module_nut/Script/Manager/LevelMgr';
import { EventDispatcher } from '../../easy_ui_framework/EventDispatcher';
import { ADEvent } from './ADEvent';
import { AudioMgr } from '../AudioMgr';
import { tgxUITips } from 'db://assets/core_tgx/tgx';
import { GtagMgr, GtagType } from 'db://assets/core_tgx/base/GtagMgr';
import { error } from 'console';
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
    gtag: any = null;

    initilize(): void {
        this.adInstance = (window as any)['adInstance'];
        console.log('ad sdk初始化');
        console.log(this.adInstance);
    }

    /** 显示插屏广告*/
    showInterstitial(cb?: () => void): void {
        if (!this.adInstance) {
            cb && cb();
            return;
        }

        this.adInstance.interstitialAd({
            beforeAd() {
                console.log('The ad starts playing');
            },
            afterAd() {
                console.log('The ad ends playing');
            },
            error(err) {
                // console.log('The ad failed to load');
                tgxUITips.show(err)
            }
        });
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
                // console.log(`激励广告错误:${err}`);
                tgxUITips.show(err);
                EventDispatcher.instance.emit(ADEvent.REWARD_VIDEO_ERROR);
                AudioMgr.inst.resume();
                GtagMgr.inst.doGameDot(GtagType.ad_error);
            }
        });
    }
}
