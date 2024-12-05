import { _decorator, Component, Node } from 'cc';
import { ScrewColor } from './Enum/ScrewColor';

const { ccclass, property } = _decorator;

/** 螺丝圈组件*/
@ccclass('Ring')
export class Ring extends Component {
    @property
    color: ScrewColor = ScrewColor.RED; //对应各自的颜色枚举
}


