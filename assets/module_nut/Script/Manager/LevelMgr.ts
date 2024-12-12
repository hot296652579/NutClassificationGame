import { _decorator, Node, Prefab, instantiate, Component } from 'cc';
import { LevelModel } from '../Model/LevelModel';
import { GlobalConfig } from '../Config/GlobalConfig';
import { EventDispatcher } from 'db://assets/core_tgx/easy_ui_framework/EventDispatcher';
import { GameEvent } from '../Enum/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('LevelManager')
export class LevelManager {
    private static _instance: LevelManager | null = null;
    public static get instance(): LevelManager {
        if (!this._instance) this._instance = new LevelManager();
        return this._instance;
    }

    levelPrefabs: Prefab[] = [];
    parent: Node = null!;
    currentLevel: Node = null!;

    public levelModel: LevelModel = null;

    initilizeModel(): void {
        this.levelModel = new LevelModel();
    }

    loadLevel(level: number): void {
        const levelPrefab = this.levelPrefabs[level - 1];
        if (!levelPrefab) {
            console.error(`关卡预设不存在 level: ${level}.`);
            return;
        }

        if (this.currentLevel) {
            this.currentLevel.destroy();
        }

        this.currentLevel = instantiate(levelPrefab);
        this.parent.removeAllChildren();
        this.parent.addChild(this.currentLevel);
        this.currentLevel.active = true;
        console.log(`Loaded level: ${level}.`);
    }

    /** 关卡等级升级 */
    upgradeLevel(up: number = 1): void {
        this.levelModel.level += up;
        if (this.levelModel.level > GlobalConfig.levelTotal) {
            const level = Math.floor(Math.random() * GlobalConfig.levelTotal) + 1;
            this.levelModel.level = level;
        }
        this.levelModel.levelConfig.init(this.levelModel.level);
    }

    /** 添加步数*/
    addLevelStep(step: number = 1): void {
        this.levelModel.playerStep += step;
        this.calculateStarLevel();
    }

    /** 计算操作后 星星等级*/
    calculateStarLevel(): void {
        const { mainConfig, levelConfig } = LevelManager.instance.levelModel;
        const configStepStar = mainConfig.getStepStar;
        const levelStep = levelConfig.step;      // 关卡配置步数
        const playerStep = this.levelModel.playerStep;  // 玩家当前步数
        const remainingSteps = levelStep - playerStep;  // 剩余步数

        // 根据 configStar 数组判断星级
        if (remainingSteps >= configStepStar[0]) {
            this.levelModel.star = 3;
        } else if (remainingSteps >= configStepStar[1]) {
            this.levelModel.star = 2;
        } else {
            this.levelModel.star = 1;
        }
        EventDispatcher.instance.emit(GameEvent.EVENT_UPDATE_STAR_STEP);
    }

    /** 清除关卡数据*/
    clearLevelData(): void {
        this.levelModel.clearLevel();
    }
}
