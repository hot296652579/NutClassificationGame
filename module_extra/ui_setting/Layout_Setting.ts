import { _decorator, Button, Component, Node, Toggle, ToggleComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Layout_Setting')
export class Layout_Setting extends Component {
    @property(Button)
    btnClose: Button;

    @property(Node)
    content: Node;

    @property(Toggle)
    musicToggle: Toggle;

    @property(Toggle)
    soundToggle: Toggle;
}