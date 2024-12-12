import { _decorator, Button, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Layout_BattleResult')
export class Layout_BattleResult extends Component {
    @property(Button)
    btNext: Button;

    @property(Node)
    light: Node;

    @property(Node)
    winNode: Node;

    @property(Node)
    levStars: Node = null!;

}