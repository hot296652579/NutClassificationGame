import { Color, Component, Label, Node, ParticleSystem, Prefab, ProgressBar, Tween, Vec3, _decorator, instantiate, physics, tween, v3 } from 'cc';
import { EventDispatcher } from '../core_tgx/easy_ui_framework/EventDispatcher';
import { tgxUIMgr } from '../core_tgx/tgx';
import { UI_ExtraTime, UI_Magnetic, UI_TopInfo } from '../scripts/UIDef';
import { GameEvent } from './Script/Enum/GameEvent';
import { AdvertMgr } from './Script/Manager/AdvertMgr';
import { LevelManager } from './Script/Manager/LevelMgr';
import { UserManager } from './Script/Manager/UserMgr';
import { TYPE_GAME_STATE } from './Script/Model/LevelModel';
import { NutGameAudioMgr } from './Script/Manager/NutGameAudioMgr';
import { NutComponent } from './Script/NutComponent';
import { Ring } from './Script/Ring';
import { GameUtil } from './Script/Utils';
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
    @property(Prefab)
    particleOpenBox: Prefab = null!;// 增加开盲盒特效
    @property(Prefab)
    particleWinner: Prefab = null!;// 增加通关特效

    particleNodes: Node[] = [];

    protected onLoad(): void {
        NutGameAudioMgr.initilize();
        AdvertMgr.instance.initilize();
        NutGameAudioMgr.play(NutGameAudioMgr.getMusicIdName(1), 1.0);
    }

    start() {
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
        EventDispatcher.instance.on(GameEvent.EVENT_ADD_PARTICLE_OPEN_BOX, this.onAddParticleOpenBox, this);
        EventDispatcher.instance.on(GameEvent.EVENT_ADD_PARTICLE_LEVEL_UP, this.onAddParticleWinner, this);
        EventDispatcher.instance.on(GameEvent.EVENT_CLEAR_ALL_PARTICLE, this.onClearAllParticle, this);
    }

    protected onDestroy(): void {
        EventDispatcher.instance.off(GameEvent.EVENT_GAME_START, this.onGameStart);
        EventDispatcher.instance.off(GameEvent.EVENT_BATTLE_SUCCESS_LEVEL_UP, this.levelUpHandler);
        EventDispatcher.instance.off(GameEvent.EVENT_BATTLE_FAIL_LEVEL_RESET, this.resetGameByLose);
        EventDispatcher.instance.off(GameEvent.EVENT_ADD_PARTICLE_ROCK, this.onAddParticleRock);
        EventDispatcher.instance.off(GameEvent.EVENT_ADD_PARTICLE_DUST, this.onAddParticleDust);
        EventDispatcher.instance.off(GameEvent.EVENT_ADD_PARTICLE_LEVEL_UP, this.onAddParticleWinner);
        EventDispatcher.instance.off(GameEvent.EVENT_CLEAR_ALL_PARTICLE, this.onClearAllParticle);
        EventDispatcher.instance.off(GameEvent.EVENT_ADD_PARTICLE_COLOR_BAR, this.onAddParticleColorBar);
        EventDispatcher.instance.off(GameEvent.EVENT_ADD_PARTICLE_OPEN_BOX, this.onAddParticleOpenBox);
    }

    onGameStart() {

    }

    /** 关卡升级*/
    private levelUpHandler(): void {
        this.onClearAllParticle();
        LevelManager.instance.clearLevelData();
        LevelManager.instance.upgradeLevel();

        this.loadLevelInfo();
        LevelManager.instance.levelModel.curGameState = TYPE_GAME_STATE.GAME_STATE_INIT;
    }

    /** 闯关失败重载当前关卡*/
    private resetGameByLose(): void {
        LevelManager.instance.clearLevelData();
        this.loadLevelInfo();
        LevelManager.instance.levelModel.curGameState = TYPE_GAME_STATE.GAME_STATE_INIT;
    }

    private loadLevelInfo(): void {
        const { level } = LevelManager.instance.levelModel;
        LevelManager.instance.loadLevel(level);
    }

    // 碎片特效
    private onAddParticleRock(data: [any]): void {
        const nutComponent = data[0];
        const particle = this.createParticle(this.particleRock, nutComponent.getTopRingNode());
        this.particleNodes.push(particle);
    }

    // 灰尘特效
    private onAddParticleDust(screwsNode: Node): void {
        // console.log("onAddParticleDust 添加粒子特效灰尘");
        const highestVisibleNode = screwsNode.children.reduce((topChild, child) => {
            if (child.active && (!topChild || child.getSiblingIndex() > topChild.getSiblingIndex())) {
                return child;
            }
            return topChild;
        }, null);
        if (highestVisibleNode) {
            const particle = this.createParticle(this.particleDust, highestVisibleNode);
            this.particleNodes.push(particle);
        }
    }

    // 归类 撒花特效
    private onAddParticleColorBar(nutComponent: any): void {
        const getTopRingNode = nutComponent.getComponent(NutComponent).getTopRingNode();
        const colorHex = getTopRingNode.getComponent(Ring)!.colorHex;
        console.log('需要转换的16进制颜色:' + colorHex);
        const particle = this.createParticle(this.particleColorBar, nutComponent.node, colorHex);
        this.particleNodes.push(particle);
    }

    // 添加拆盲盒特效
    private onAddParticleOpenBox(nutComponent: Node): void {
        const particle = this.createParticle(this.particleOpenBox, nutComponent);
        this.particleNodes.push(particle);
    }

    // 添加通关特效
    private onAddParticleWinner(nutComponent: Node): void {
        const particle = this.createParticle(this.particleWinner, nutComponent);
        this.particleNodes.push(particle);
    }

    // 创建粒子方法
    private createParticle(particlePrefab: any, parentNode: Node, color?: string): Node {
        const particle = instantiate(particlePrefab)!;
        const particleSystem = particle.getComponent(ParticleSystem)!;

        if (particleSystem && color) {
            const startColor = GameUtil.hexToRGBA(color);
            console.log('转成rgba startColor:', startColor);
            particleSystem.startColor.color = startColor;
        }

        particle.setParent(parentNode);
        particle.setPosition(v3(0, 0, 1));
        return particle;
    }
    //清除所有特效
    private onClearAllParticle(): void {
        console.log("onClearAllParticle 清除所有粒子特效")
        for (const particle of this.particleNodes) {
            particle.removeFromParent();
            particle.destroy();
        }
    }
}

