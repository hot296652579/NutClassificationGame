import { _decorator, Node, Prefab, instantiate, Component } from 'cc';
import { LevelModel } from '../Model/LevelModel';
import { EventDispatcher } from '../../../core_tgx/easy_ui_framework/EventDispatcher';
import { GameEvent } from '../Enum/GameEvent';
import { Tablecultivate_config } from '../../../module_basic/table/Tablecultivate_config';
import { JsonUtil } from '../../../core_tgx/base/utils/JsonUtil';
import { GlobalConfig } from '../Config/GlobalConfig';
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
        const currentLevelNode = instantiate(levelPrefab);
        this.parent.removeAllChildren();
        this.parent.addChild(currentLevelNode);
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

    /** 清除关卡数据*/
    clearLevelData(): void {

    }
}
