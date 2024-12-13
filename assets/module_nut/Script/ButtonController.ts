import { Button, Component, Label, Node, NodeEventType, _decorator, find } from 'cc';
import { EventDispatcher } from '../../core_tgx/easy_ui_framework/EventDispatcher';
import { GameEvent } from './Enum/GameEvent';
import { TYPE_ITEM } from './Model/LevelModel';
import { NutManager } from './Manager/NutManager';
import { AdvertMgr } from './Manager/AdvertMgr';
const { ccclass, property } = _decorator;

/**
 * 底部按钮控制器
 */
@ccclass('ButtonController')
export class ButtonController extends Component {
    @property(Button) btUndo: Button = null!;
    @property(Button) btAddScrew: Button = null!;
    nutManager: NutManager = null!;

    protected start() {
        this.addUIEvent();
        this.setupUIListeners();
    }

    private addUIEvent(): void {
        this.btUndo.node.on(NodeEventType.TOUCH_END, () => this.onClickHandler(TYPE_ITEM.REVOKE), this);
        this.btAddScrew.node.on(NodeEventType.TOUCH_END, () => this.onClickHandler(TYPE_ITEM.ADDNUT), this);
    }

    private setupUIListeners(): void {
        const events = [
            { event: GameEvent.EVENT_UI_INITILIZE, handler: this.onResetAddition },
        ];

        events.forEach(({ event, handler }) =>
            EventDispatcher.instance.on(event, handler, this)
        );
    }

    private onResetAddition(): void {
        this.nutManager = find('Canvas').getComponentInChildren(NutManager);
    }

    private onClickHandler(type: TYPE_ITEM) {
        const { inOperation } = this.nutManager;
        if (inOperation) return;

        switch (type) {
            case TYPE_ITEM.REVOKE:
                const { operationStack } = this.nutManager;
                if (!operationStack || operationStack.length === 0) {
                    console.warn('没有可撤销的操作!!!');
                    this.nutManager.inOperation = false;
                    return;
                }

                AdvertMgr.instance.showReawardVideo(() => {
                    EventDispatcher.instance.emit(GameEvent.EVENT_UNDO_REVOKE);
                });
                break;
            case TYPE_ITEM.ADDNUT:
                AdvertMgr.instance.showReawardVideo(() => {
                    EventDispatcher.instance.emit(GameEvent.EVENT_ADD_SCREW);
                })
                break;

            default:
                break;
        }
    }

}
