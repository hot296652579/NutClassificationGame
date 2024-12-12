import { _decorator, CCString, Component, Node, Quat, Tween, tween, Vec3 } from 'cc';
import { ScrewColor } from './Enum/ScrewColor';
import { duration } from './NutComponent';

const { ccclass, property } = _decorator;

/** 螺丝圈组件*/
@ccclass('Ring')
export class Ring extends Component {
    @property
    color: ScrewColor = ScrewColor.PINK; //对应各自的颜色枚举

    @property(CCString)
    colorName: string = '粉红'; //对应各自的颜色名称 默认粉红

    @property
    hoverHeight: number = 0.3; // 悬浮高度（上下浮动的幅度）

    @property
    hoverWidth: number = 0.5; // 左右浮动的幅度

    @property
    duration: number = 2; // 单次浮动的时间（秒）

    private originalPosition: Vec3 = new Vec3(); // 初始位置

    onLoad() {
        this.originalPosition = this.node.position;
    }

    //悬浮效果
    suspensionEffect() {
        const ringNode = this.node.position;
        // 定义浮动的目标位置
        const upLeftPosition = new Vec3(
            ringNode.x - this.hoverWidth,
            ringNode.y + this.hoverHeight,
            ringNode.z
        );
        const upRightPosition = new Vec3(
            ringNode.x + this.hoverWidth,
            ringNode.y + this.hoverHeight,
            ringNode.z
        );
        const downLeftPosition = new Vec3(
            ringNode.x - this.hoverWidth,
            ringNode.y - this.hoverHeight,
            ringNode.z
        );
        const downRightPosition = new Vec3(
            ringNode.x + this.hoverWidth,
            ringNode.y - this.hoverHeight,
            ringNode.z
        );

        // 使用 tween 实现上下和左右浮动的组合效果
        tween(this.node)
            .sequence(
                tween().to(this.duration, { position: upLeftPosition }, { easing: 'sineInOut' }),
                tween().to(this.duration, { position: upRightPosition }, { easing: 'sineInOut' }),
                tween().to(this.duration, { position: downRightPosition }, { easing: 'sineInOut' }),
                tween().to(this.duration, { position: downLeftPosition }, { easing: 'sineInOut' })
            )
            .repeatForever() // 无限循环
            .start();
    }

    stopHover() {
        Tween.stopAllByTarget(this.node);
    }
}


