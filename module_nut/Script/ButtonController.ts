import { Button, Component, Label, Node, NodeEventType, _decorator } from 'cc';
import { EventDispatcher } from '../../core_tgx/easy_ui_framework/EventDispatcher';
import { GameEvent } from './Enum/GameEvent';
import { TYPE_ITEM } from './Model/LevelModel';
const { ccclass, property } = _decorator;

/**
 * 底部按钮控制器
 */
@ccclass('ButtonController')
export class ButtonController extends Component {
    @property(Button) btUndo: Button = null!;
    @property(Button) btAddScrew: Button = null!;

    protected start() {
        this.addUIEvent();
        this.setupUIListeners();
    }

    private onResetAddition(): void {

    }

    private addUIEvent(): void {
        this.btUndo.node.on(NodeEventType.TOUCH_END, () => this.handleUpgrade(TYPE_ITEM.ADDNUT), this);
        this.btAddScrew.node.on(NodeEventType.TOUCH_END, () => this.handleUpgrade(TYPE_ITEM.REVOKE), this);
    }

    private setupUIListeners(): void {
        const events = [
            { event: GameEvent.EVENT_UI_INITILIZE, handler: this.onResetAddition },
        ];

        events.forEach(({ event, handler }) =>
            EventDispatcher.instance.on(event, handler, this)
        );
    }

    private handleUpgrade(type: TYPE_ITEM): void {

    }

}
