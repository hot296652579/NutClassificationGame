import { _decorator, Component, Node, Quat, tween, Vec3 } from 'cc';
import { ScrewColor } from './Enum/ScrewColor';
import { duration } from './NutComponent';

const { ccclass, property } = _decorator;

/** 螺丝圈组件*/
@ccclass('Ring')
export class Ring extends Component {
    @property
    color: ScrewColor = ScrewColor.RED; //对应各自的颜色枚举

    @property
    hoverHeight: number = 0.3; // 悬浮高度（上下浮动的幅度）

    @property
    tiltAngle: number = 2; // 左右倾斜的角度（度数）

    @property
    duration: number = 2; // 单次浮动的时间（秒）

    private originalPosition: Vec3 = new Vec3(); // 初始位置
    private originalRotation: Quat = new Quat(); // 保存初始旋转

    onLoad() {
    }

    //悬浮效果
    suspensionEffect() {
        const pos = this.node.position;
        const rotation = this.node.rotation;
        // 定义上下浮动的目标位置
        const upPosition = new Vec3(
            pos.x,
            pos.y + this.hoverHeight,
            pos.z
        );
        const downPosition = new Vec3(
            pos.x,
            pos.y - this.hoverHeight,
            pos.z
        );

        // 定义左右倾斜的目标旋转
        const leftTilt = Quat.fromEuler(
            new Quat(),
            rotation.x,
            rotation.y,
            rotation.z - this.tiltAngle
        );
        const rightTilt = Quat.fromEuler(
            new Quat(),
            rotation.x,
            rotation.y,
            rotation.z + this.tiltAngle
        );

        // 使用 tween 实现上下浮动和左右倾斜的组合效果
        tween(this.node)
            .parallel( // 并行执行上下浮动和旋转动画
                tween()
                    .to(this.duration, { position: upPosition }, { easing: 'sineInOut' })
                    .to(this.duration, { position: downPosition }, { easing: 'sineInOut' }),
                tween()
                    .to(this.duration, { rotation: leftTilt }, { easing: 'sineInOut' })
                    .to(this.duration, { rotation: rightTilt }, { easing: 'sineInOut' })
            )
            .union() // 合并动画序列
            .repeatForever() // 无限循环
            .start();
    }
    stopHover() {
        tween(this.node).stop();
        this.node.setPosition(this.originalPosition);
        this.node.setRotation(this.originalRotation);
    }
}


