import { _decorator, Node, Prefab, instantiate, Component, sys, assetManager } from 'cc';
import { LevelModel } from '../Model/LevelModel';
import { GlobalConfig } from '../../../start/Config/GlobalConfig';
import { EventDispatcher } from 'db://assets/core_tgx/easy_ui_framework/EventDispatcher';
import { GameEvent } from '../Enum/GameEvent';
import { ResLoader, resLoader } from 'db://assets/core_tgx/base/ResLoader';
const { ccclass, property } = _decorator;

@ccclass('LevelManager')
export class LevelManager {
    private static _instance: LevelManager | null = null;
    public static get instance(): LevelManager {
        if (!this._instance) this._instance = new LevelManager();
        return this._instance;
    }

    parent: Node = null!;
    currentLevel: Node = null!;
    randomLevel: number = 0;

    public levelModel: LevelModel = null;

    initilizeModel(): void {
        this.levelModel = new LevelModel();
        this.levelModel.getRandomLevelList();
        this.preloadLevel();
    }

    async loadAsyncLevel(level: number): Promise<Prefab> {
        return new Promise((resolve, reject) => {
            const bundle = assetManager.getBundle(resLoader.gameBundleName);
            if (!bundle) {
                console.error("module_nut is null!");
                reject();
            }

            resLoader.loadAsync(resLoader.gameBundleName, `Prefabs/Level/Level${level}`, Prefab).then((prefab: Prefab) => {
                resolve(prefab);
            })
        })
    }

    /** 预加载关卡*/
    async preloadLevel() {
        const bundle = assetManager.getBundle(resLoader.gameBundleName);
        for (let i = 1; i <= GlobalConfig.levelTotal; i++) {
            bundle.preload(`Prefabs/Level/Level${i}`, Prefab, null, () => {
                // console.log(`Level:${i} 预加载完成!`);
            })
        }
    }

    async loadLevel(level: number) {
        let levelPrefab = null;
        if (this.levelModel.level > GlobalConfig.levelTotal) {
            console.log('随机关卡加载 this.randomLevel: ' + this.randomLevel);
            levelPrefab = await this.loadAsyncLevel(this.randomLevel);
        } else {
            levelPrefab = await this.loadAsyncLevel(level);
        }

        if (this.currentLevel) {
            this.currentLevel.destroy();
        }

        if (!levelPrefab) {
            console.log(`关卡预设不存在 level: ${level}.`)
            return;
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
        sys.localStorage.setItem('level', this.levelModel.level.toString());
        if (this.levelModel.level > GlobalConfig.levelTotal) {
            const randomLevelList = this.levelModel.randomLevelList;

            // 随机选择一个值
            let randomIndex = Math.floor(Math.random() * randomLevelList.length);
            let randomLevel = randomLevelList[randomIndex];

            // 如果随机到的关卡和当前关卡相同，则重新随机
            while (randomLevel === this.randomLevel && randomLevelList.length > 1) {
                randomIndex = Math.floor(Math.random() * randomLevelList.length);
                randomLevel = randomLevelList[randomIndex];
            }

            this.randomLevel = randomLevel;
            console.log(`随机真实关卡level: ${this.randomLevel}`);
            this.levelModel.levelConfig.init(this.randomLevel);
        }
        else {
            this.levelModel.levelConfig.init(this.levelModel.level);
        }
    }

    /** 添加步数*/
    addLevelStep(step: number = 1): void {
        this.levelModel.playerStep += step;
        this.calculateStarLevel();
    }

    /** 撤回步数*/
    backLevelStep(step: number = 1): void {
        this.levelModel.playerStep -= step;
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
