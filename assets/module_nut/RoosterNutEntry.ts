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
    @property(Prefab)
    particleDust: Prefab = null!;// 增加螺丝特效
    @property(Prefab)
    particleColorBar: Prefab = null!;// 增加撒花特效

    particleNodes: Node[] = [];

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
        EventDispatcher.instance.on(GameEvent.EVENT_ADD_PARTICLE_DUST, this.onAddParticleDust, this);
        EventDispatcher.instance.on(GameEvent.EVENT_ADD_PARTICLE_COLOR_BAR, this.onAddParticleColorBar, this);
        EventDispatcher.instance.on(GameEvent.EVENT_CLEAR_ALL_PARTICLE, this.onClearAllParticle, this);
    }

    protected onDestroy(): void {
        EventDispatcher.instance.off(GameEvent.EVENT_GAME_START, this.onGameStart);
        EventDispatcher.instance.off(GameEvent.EVENT_BATTLE_SUCCESS_LEVEL_UP, this.levelUpHandler);
        EventDispatcher.instance.off(GameEvent.EVENT_BATTLE_FAIL_LEVEL_RESET, this.resetGameByLose);
        EventDispatcher.instance.off(GameEvent.EVENT_ADD_PARTICLE_ROCK, this.onAddParticleRock);
        EventDispatcher.instance.off(GameEvent.EVENT_ADD_PARTICLE_DUST, this.onAddParticleDust);
        EventDispatcher.instance.off(GameEvent.EVENT_CLEAR_ALL_PARTICLE, this.onClearAllParticle);
        EventDispatcher.instance.off(GameEvent.EVENT_ADD_PARTICLE_COLOR_BAR, this.onAddParticleColorBar);
    }

    onGameStart() {

    }

    /** 关卡升级*/
    private levelUpHandler(): void {
        // this.onClearAllParticle();
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

    //碎片特效
    private onAddParticleRock(...args): void {
        // console.log("onAddParticleRock 添加粒子特效碎片");
        const data = args[0];
        const nutComponent = data[0];
        const topRing = nutComponent.getTopRingNode();
        const particle = instantiate(this.particleRock)!;
        particle.setParent(topRing);
        particle.setPosition(v3(Vec3.ZERO));
        this.particleNodes.push(particle);
    }

    //灰尘特效
    private onAddParticleDust(...args): void {
        console.log("onAddParticleDust 添加粒子特效灰尘");
        const screwsNode = args[0];
        const particle = instantiate(this.particleDust)!;
        const children = screwsNode.children;

        let highestVisibleNode: Node | null = null;
        const getHighestVisibleNode = () => {
            for (const child of children) {
                if (child.active) { // 检查节点是否是显示状态
                    highestVisibleNode = child; // 更新为当前显示的节点
                }
            }

            return highestVisibleNode; // 返回最高的显示节点
        }
        highestVisibleNode = getHighestVisibleNode();
        if (highestVisibleNode) {
            particle.setParent(highestVisibleNode);
            particle.setPosition(v3(Vec3.ZERO));
            this.particleNodes.push(particle);
        }
    }

    //归类 撒花特效
    private onAddParticleColorBar(...args): void {
        const nutComponent = args[0];
        const particle = instantiate(this.particleColorBar)!;
        particle.setParent(nutComponent.node);
        particle.setPosition(v3(Vec3.ZERO));
        this.particleNodes.push(particle);
    }

    //清除所有特效
    private onClearAllParticle(): void {
        console.log("onClearAllParticle 清除所有粒子特效")
        for (const particle of this.particleNodes) {
            particle.removeFromParent();
            particle.destroy();
        }
    }

    /** 准备阶段界面*/
    private prepStageView(): void {
        NutGameAudioMgr.play(NutGameAudioMgr.getMusicIdName(2), 1.0);

    }
}

