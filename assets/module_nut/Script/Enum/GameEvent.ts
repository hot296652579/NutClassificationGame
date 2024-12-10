export class GameEvent {
    /** 通知UI实例化*/
    static readonly EVENT_UI_INITILIZE = 'EVENT_UI_INITILIZE';
    /** 游戏开始*/
    static readonly EVENT_GAME_START = 'EVENT_GAME_START';

    /** 执行撤销操作*/
    static readonly EVENT_UNDO_REVOKE = 'EVENT_UNDO_REVOKE';

    /** 增加螺丝事件*/
    static readonly EVENT_ADD_SCREW = 'EVENT_ADD_SCREW';

    /** 闯关成功 关卡升级*/
    static readonly EVENT_BATTLE_SUCCESS_LEVEL_UP = 'EVENT_BATTLE_SUCCESS_LEVEL_UP';

    /** 闯关失败 关卡重载*/
    static readonly EVENT_BATTLE_FAIL_LEVEL_RESET = 'EVENT_BATTLE_FAIL_LEVEL_RESET';

    /** 用户余额更新*/
    static readonly EVENT_USER_MONEY_UPDATE = 'EVENT_USER_MONEY_UPDATE';
}