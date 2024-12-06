import { _decorator, CCBoolean, CCFloat, Component, Node, Tween, tween, v3, Vec3 } from 'cc';
import { NutData } from './Model/NutData';
import { NutOperationRecord } from './Manager/NutManager';


const { ccclass, property } = _decorator;

/** 螺母组件*/
@ccclass('NutComponent')
export class NutComponent extends Component {
    @property(Node)
    screwsNode: Node = null!; // 螺母中螺丝节点

    @property(Node)
    screwTranslucent: Node = null!; // 半透明螺丝

    @property(Node)
    ringsNode: Node = null!; // 螺母中的 Rings 节点

    @property(Node)
    suspensionNode: Node = null!; // 螺母中的 Suspension 节点

    @property(Node)
    capNode: Node = null!; // 螺母帽

    @property({ type: CCBoolean, tooltip: '是否归类形' })
    isGroup: boolean = false;    //是否是归类形

    @property({ type: CCFloat, tooltip: '螺母最大螺丝数量' })
    maxScrews: number = 6;      // 最大螺丝数量

    @property({ type: CCBoolean, tooltip: '是否可增加形' })
    canGrow: boolean = false;    //是否可增加形

    @property({ type: CCFloat, tooltip: '可增加螺母当前螺丝数量' })
    curScrews: number = 0;
    isDone: boolean = false; // 是否完成

    public data: NutData = new NutData();

    @property(Node)
    ringsUnknowNode: Node = null!; // 螺母中的 RingsUnknow 节点，用于存放未知螺丝圈

    protected start(): void {
        this.data.maxScrews = this.maxScrews;
        this.data.isGroup = this.isGroup;
        this.data.isDone = this.isDone;
        this.data.canGrow = this.canGrow;
        this.data.curScrews = this.curScrews;
    }

    initilizeScrews(): void {
        this.updateVisuals();
    }

    /**
     * 更新可增加类型螺丝的显示
     */
    public updateVisuals(): void {
        if (this.data.curScrews <= 0) {
            this.screwTranslucent.active = true;
            this.screwsNode.active = false;
            return;
        }

        this.screwTranslucent.active = !this.data.canGrow;
        if (this.data.canGrow) {
            this.screwsNode.active = true;
            this.screwsNode.children.forEach((child, index) => {
                child.active = index < this.data.curScrews;
            });
        }
    }

    // 获取顶部螺丝圈节点
    getTopRingNode(): Node | null {
        const rings = this.ringsNode.children;
        return rings.length > 0 ? rings[rings.length - 1] : null;
    }

    updateScrewVisibility(): void {
        const screws = this.data.screws;
        for (let i = 0; i < screws.length; i++) {
            const screw = screws[i];
            const screwNode = this.ringsNode.children[i];
            if (screwNode) {
                screwNode.active = screw.isShow; // 显示对应的螺丝圈节点
            }

            // 更新 ringsUnknowNode 的隐藏状态
            const ringsUnknowNode = this.ringsUnknowNode.children[i];
            if (ringsUnknowNode) {
                ringsUnknowNode.active = !screw.isShow;
            }
        }
    }

    // 添加螺丝圈到螺母动画
    addRingNode(ringNode: Node, isReturning: boolean = false, onComplete?: () => void) {
        const startPosition = ringNode.position.clone(); // 记录起始位置
        const diff = isReturning ? 1 : 0;
        const newY = (this.ringsNode.children.length - diff) * 1.5; // Y 坐标间隔 1.5
        const endPosition = new Vec3(0, newY, 0);

        // 将螺丝圈添加到节点并播放动画
        Tween.stopAllByTarget(ringNode);
        ringNode.setParent(this.ringsNode);
        ringNode.setPosition(this.suspensionNode.position);
        ringNode.eulerAngles = new Vec3(0, 0, 0);

        tween(ringNode)
            .to(0.3, { eulerAngles: new Vec3(0, 180, 0), position: new Vec3(endPosition.x, endPosition.y, endPosition.z) })
            .call(() => {
                if (onComplete) {
                    onComplete();
                }
            })
            .start();
    }

    // 获取悬浮位置
    getSuspensionPosition() {
        return this.suspensionNode.worldPosition;
    }

    //显示螺母帽
    displayNutCap(show: boolean) {
        this.capNode.active = show;
    }

    /**
     * 撤销操作：恢复节点位置和数据
     */
    undoRingNodeOperation(lastOperation: NutOperationRecord, onComplete?: () => void): void {
        const { opNode, fromNut, toNut, fromPosition, toPosition, fromScreews, toScreews } = lastOperation;
        // console.log('恢复的from screws数据:', fromScreews);
        tween(opNode)
            .to(0.3, { position: this.suspensionNode.position })
            .call(() => {
                const rings = fromNut.getComponent(NutComponent)!.ringsNode;
                opNode.parent = rings;
            })
            .to(0.3, { position: fromPosition })
            .call(() => {
                toNut.getComponent(NutComponent)!.data!.screws = toScreews;
                fromNut.getComponent(NutComponent)!.data!.screws = fromScreews;
                if (onComplete) {
                    onComplete();
                }
            })
            .start();
    }
}
