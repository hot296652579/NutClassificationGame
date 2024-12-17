import { _decorator, Button, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('tgxLayout_UITips')
export class Layout_UITips extends Component {

    @property(Label)
    content: Label;
}

