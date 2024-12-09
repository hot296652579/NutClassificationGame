import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { ScrewColor } from './Enum/ScrewColor';
import { duration } from './NutComponent';

const { ccclass, property } = _decorator;

/** 螺丝圈组件*/
@ccclass('Ring')
export class Ring extends Component {
    @property
    color: ScrewColor = ScrewColor.RED; //对应各自的颜色枚举

    @property
    hoverHeight: number = 0.2; // 悬浮高度（上下浮动的幅度）

    @property
    hoverWidth: number = 0.2; // 悬浮宽度（左右浮动的幅度）

    @property
    duration: number = 2; // 单次浮动的时间（秒）

    private originPosition: Vec3 = new Vec3(); // 初始位置


    onLoad() {
    }

    //悬浮效果
    suspensionEffect() {
        this.originPosition = this.node.position;

        // 定义上下浮动的目标位置
        const upPosition = new Vec3(
            this.node.position.x,
            this.node.position.y + this.hoverHeight,
            this.node.position.z
        );
        const downPosition = new Vec3(
            this.node.position.x,
            this.node.position.y - this.hoverHeight,
            this.node.position.z
        );

        // 定义左右浮动的目标位置
        const leftPosition = new Vec3(
            this.node.position.x - this.hoverWidth,
            this.node.position.y,
            this.node.position.z
        );
        const rightPosition = new Vec3(
            this.node.position.x + this.hoverWidth,
            this.node.position.y,
            this.node.position.z
        );

        // 使用 tween 实现上下和左右的浮动
        tween(this.node)
            .to(this.duration, { position: upPosition }, { easing: 'sineInOut' })
            .to(this.duration, { position: downPosition }, { easing: 'sineInOut' })
            .to(this.duration, { position: rightPosition }, { easing: 'sineInOut' })
            .to(this.duration, { position: leftPosition }, { easing: 'sineInOut' })
            .union() // 合并动画序列
            .repeatForever() // 无限循环
            .start();
    }

    stopHover() {
        tween(this.node).stop();
        this.node.setPosition(this.originPosition);
    }
}


