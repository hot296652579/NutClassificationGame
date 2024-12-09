import { _decorator, Component, Label, Node, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Layout_TopInfo')
export class Layout_TopInfo extends Component {

    @property(Node)
    btSet: Node = null!;
    @property(Node)
    btReLoad: Node = null!;
    @property(Label)
    lbLevel: Label = null!;
    @property(Label)
    lbMoney: Label = null!;

    start() {

    }

    update(deltaTime: number) {

    }
}


