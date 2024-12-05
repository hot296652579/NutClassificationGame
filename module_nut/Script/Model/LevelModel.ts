import { Tablelevels_config } from "../../../module_basic/table/Tablelevels_config";
import { GlobalConfig } from "../Config/GlobalConfig";

/**道具类型
 * @param REVOKE 撤销
 * @param ADDNUT 增加螺丝
*/
export enum TYPE_ITEM {
    REVOKE = 1,
    ADDNUT = 2,
}

export enum TYPE_GAME_STATE {
    GAME_STATE_INIT = 0, //准备阶段
    GAME_STATE_START = 1, //开始
    GAME_STATE_END = 2, //结束(倒计时结束)
    GAME_STATE_RESULT = 3, //结算
    GAME_STATE_PAUSE = 4, //暂停
}

/**关卡数据模型
 */
export class LevelModel {
    public levelConfig: Tablelevels_config;

    /** 当前关卡等级*/
    public level: number = 1;

    /** 当前游戏状态*/
    public curGameState: TYPE_GAME_STATE = TYPE_GAME_STATE.GAME_STATE_INIT;

    constructor() {
        this.levelConfig = new Tablelevels_config();
        this.level = GlobalConfig.initilizeLevel;
        this.levelConfig.init(this.level);
        this.initilizeData();
    }

    /** 初始化数据*/
    private initilizeData(): void {

    }

    /** 关卡等级升级*/
    upgradeLevel(up: number = 1) {
        this.level += up;
        this.levelConfig.init(this.level);
    }
}