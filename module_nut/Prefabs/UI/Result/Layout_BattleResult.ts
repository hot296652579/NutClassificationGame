import { _decorator, Button, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Layout_BattleResult')
export class Layout_BattleResult extends Component {
    @property(Button)
    btGet: Button;
    @property(Button)
    btExtra: Button;
    @property(Node)
    winNode: Node;
    @property(Node)
    LoseNode: Node;
}