import { Component, Label, Node, ParticleSystem, Prefab, ProgressBar, Tween, Vec3, _decorator, instantiate, physics, tween, v3 } from 'cc';
import { EventDispatcher } from '../core_tgx/easy_ui_framework/EventDispatcher';
import { tgxUIMgr } from '../core_tgx/tgx';
import { UI_ExtraTime, UI_Magnetic, UI_TopInfo } from '../scripts/UIDef';
import { GameEvent } from './Script/Enum/GameEvent';
import { AdvertMgr } from './Script/Manager/AdvertMgr';
import { LevelManager } from './Script/Manager/LevelMgr';
import { UserManager } from './Script/Manager/UserMgr';
import { TYPE_GAME_STATE } from './Script/Model/LevelModel';
import { NutGameAudioMgr } from './Script/Manager/NutGameAudioMgr';
const { ccclass, property } = _decorator;

@ccclass('RoosterNutEntry')
export class RoosterNutEntry extends Component {
    @property(Prefab)
    levelPrefabs: Prefab[] = [];
    @property(Node)
    gameUI: Node = null;
    @property(Node)
    btnsLayout: Node = null!;

    @property(Prefab)
    particleRock: Prefab = null!;// 碎片特效

    start() {
        NutGameAudioMgr.initilize();
        AdvertMgr.instance.initilize();
        this.initilize();
        this.addEventListen();
    }

    initilize() {
        this.initilizeUI();
        LevelManager.instance.parent = this.node;
        LevelManager.instance.levelPrefabs = this.levelPrefabs;

        LevelManager.instance.initilizeModel();
        UserManager.instance.initilizeModel();
        const { level } = LevelManager.instance.levelModel;
        LevelManager.instance.loadLevel(level);
        EventDispatcher.instance.emit(GameEvent.EVENT_UI_INITILIZE);//去通知界面初始化

        this.prepStageView();
        tgxUIMgr.inst.showUI(UI_TopInfo);
    }

    private initilizeUI(): void {

    }

    addEventListen() {
        EventDispatcher.instance.on(GameEvent.EVENT_GAME_START, this.onGameStart, this);
        EventDispatcher.instance.on(GameEvent.EVENT_BATTLE_SUCCESS_LEVEL_UP, this.levelUpHandler, this);
        EventDispatcher.instance.on(GameEvent.EVENT_BATTLE_FAIL_LEVEL_RESET, this.resetGameByLose, this);
        //增加特效监听
        EventDispatcher.instance.on(GameEvent.EVENT_ADD_PARTICLE_ROCK, this.onAddParticleRock, this);
    }

    protected onDestroy(): void {
        EventDispatcher.instance.off(GameEvent.EVENT_GAME_START, this.onGameStart);
        EventDispatcher.instance.off(GameEvent.EVENT_BATTLE_SUCCESS_LEVEL_UP, this.levelUpHandler);
        EventDispatcher.instance.off(GameEvent.EVENT_BATTLE_FAIL_LEVEL_RESET, this.resetGameByLose);
        EventDispatcher.instance.off(GameEvent.EVENT_ADD_PARTICLE_ROCK, this.onAddParticleRock);
    }

    onGameStart() {

    }

    /** 关卡升级*/
    private levelUpHandler(): void {
        LevelManager.instance.clearLevelData();
        LevelManager.instance.upgradeLevel();

        this.loadLevelInfo();
        this.prepStageView();
        LevelManager.instance.levelModel.curGameState = TYPE_GAME_STATE.GAME_STATE_INIT;
    }

    /** 闯关失败重载当前关卡*/
    private resetGameByLose(): void {
        LevelManager.instance.clearLevelData();
        this.loadLevelInfo();
        this.prepStageView();
        LevelManager.instance.levelModel.curGameState = TYPE_GAME_STATE.GAME_STATE_INIT;
    }

    private loadLevelInfo(): void {
        const { level } = LevelManager.instance.levelModel;
        LevelManager.instance.loadLevel(level);
    }

    private onAddParticleRock(...args): void {
        // console.log("onAddParticleRock 添加粒子特效碎片");
        const data = args[0];
        const nutComponent = data[0];
        const topRing = nutComponent.getTopRingNode();
        const particle = instantiate(this.particleRock)!;
        particle.setParent(topRing);
        particle.setPosition(v3(Vec3.ZERO));
    }

    /** 准备阶段界面*/
    private prepStageView(): void {
        NutGameAudioMgr.play(NutGameAudioMgr.getMusicIdName(2), 1.0);

    }
}

