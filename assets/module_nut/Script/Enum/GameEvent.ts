export class GameEvent {
    /** 通知UI实例化*/
    static readonly EVENT_UI_INITILIZE = 'EVENT_UI_INITILIZE';
    /** 游戏开始*/
    static readonly EVENT_GAME_START = 'EVENT_GAME_START';

    /** 闯关成功 关卡升级*/
    static readonly EVENT_BATTLE_SUCCESS_LEVEL_UP = 'EVENT_BATTLE_SUCCESS_LEVEL_UP';

    /** 闯关失败 关卡重载*/
    static readonly EVENT_BATTLE_FAIL_LEVEL_RESET = 'EVENT_BATTLE_FAIL_LEVEL_RESET';

    /** 用户余额更新*/
    static readonly EVENT_USER_MONEY_UPDATE = 'EVENT_USER_MONEY_UPDATE';

    /** 转场动画从小到大*/
    static readonly EVENT_ZERO_TO_FULL_TRANSITION = 'EVENT_ZERO_TO_FULL_TRANSITION';
    /** 转场动画从小到大完成*/
    static readonly EVENT_ZERO_TO_FULL_TRANSITION_FINISH = 'EVENT_ZERO_TO_FULL_TRANSITION_FINISH';
    /** 转场动画从大到小*/
    static readonly EVENT_FULL_TO_ZERO_TRANSITION = 'EVENT_FULL_TO_ZERO_TRANSITION';
    /** 转场动画从大到小完成*/
    static readonly EVENT_FULL_TO_ZERO_TRANSITION_FINISH = 'EVENT_FULL_TO_ZERO_TRANSITION_FINISH';
}