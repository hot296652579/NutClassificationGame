import { _decorator, Component, Node, tween, PhysicsSystem, geometry, CameraComponent, input, Input, EventTouch, Vec3, ccenum, CCString } from 'cc';
import { NutComponent } from '../NutComponent';
import { Ring } from '../Ring';
import { ScrewData } from '../Model/ScrewData';
import { ScrewColor } from '../Enum/ScrewColor';


const { ccclass, property } = _decorator;

@ccclass('NutManager')
export class NutManager extends Component {
    @property({ type: CameraComponent })
    camera: CameraComponent = null!;

    @property([Node])
    nutNodes: Node[] = []; // 螺母节点数组

    @property({ type: [CCString], tooltip: "当前关卡需要归类的颜色" })
    private levelColorStrings: string[] = []; // 在编辑器中使用字符串数组

    private currentRing: Node | null = null; // 当前悬浮的螺丝圈
    private currentNut: Node | null = null; // 当前选择的螺母
    private operationStack: NutOperationRecord[] = []; // 操作栈
    private inOperation: boolean = false; // 是否在操作中

    start() {
        this.initNuts(); // 初始化数据
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    // 初始化螺母和螺丝圈的数据
    initNuts() {
        for (const nutNode of this.nutNodes) {
            const nutComponent = nutNode.getComponent(NutComponent)!;
            // 获取螺母中的 Rings 节点，并初始化其数据
            const rings = nutComponent.ringsNode.children;
            for (const ring of rings) {
                const ringComponent = ring.getComponent(Ring)!;
                const isShow = ring.active;
                const screwData = new ScrewData(ringComponent.color, isShow);
                nutComponent.data.addScrew(screwData);
            }
        }
    }

    onTouchStart(event: EventTouch) {
        const ray = new geometry.Ray();
        this.camera.screenPointToRay(event.getLocationX(), event.getLocationY(), ray);

        if (PhysicsSystem.instance.raycast(ray)) {
            const results = PhysicsSystem.instance.raycastResults;
            if (results.length > 0) {
                const hitNode = results[0].collider.node;
                const nutComponent = hitNode.getComponent(NutComponent);
                if (nutComponent) {
                    this.onNutClicked(nutComponent.node);
                }
            }
        }
    }

    onNutClicked(nutNode: Node) {
        if (this.inOperation) return;

        const nutComponent = nutNode.getComponent(NutComponent)!;
        const growCanOp = nutComponent.growCanOp();

        //增长类型 没解锁不可操作
        if (!growCanOp) {
            console.log('增加类型螺母未解锁，无法操作');
            return;
        }

        // 判断是否是归类类型且已经完成
        if (nutComponent.data.isGroup && nutComponent.data.isDone) {
            console.log('该螺母已完成归类，无法操作');
            return;
        }

        if (this.currentRing) {
            // 已有悬浮螺丝圈
            if (this.currentNut === nutNode) {
                console.log('点击同一螺母，归位操作');
                this.moveRingToNut(this.currentRing, nutComponent, true);
                this.resetCurrentSelection();
            } else {
                // 点击不同螺母
                const topScrew = nutComponent.data.getTopScrew();
                const currentRingColor = this.currentRing.getComponent(Ring)!.color;
                if (!topScrew || topScrew.color === currentRingColor) {
                    const full = nutComponent.data.isFull();
                    if (full) {
                        console.log('螺母已达到上限，无法操作');
                        return;
                    }

                    //连续移动逻辑
                    this.moveGroupRings(this.currentRing, this.currentNut, nutComponent, () => {
                        this.resetCurrentSelection();
                        this.checkAndDisplayNutCap(nutComponent);
                    });
                } else {
                    console.log('不符合移动要求，归位操作');
                    const currentNutComponent = this.currentRing.parent!.parent!.getComponent(NutComponent)!;
                    this.moveRingToNut(this.currentRing, currentNutComponent, true);
                    this.resetCurrentSelection();
                }
            }
        } else {
            // 没有悬浮螺丝圈时：直接选中顶部螺丝圈并移动
            const topRing = nutComponent.getTopRingNode();
            if (topRing) {
                this.currentRing = topRing;
                this.currentNut = nutNode;
                this.moveRingToSuspension(topRing, nutComponent);
            }
        }
    }

    // 连续移动螺丝圈逻辑
    moveGroupRings(
        startRing: Node,
        currentNutNode: Node,
        targetNutComponent: NutComponent,
        onComplete?: () => void
    ) {
        const currentNutComponent = currentNutNode.getComponent(NutComponent)!;
        const groupRings = this.getGroupRings(startRing, currentNutNode); //找到相邻同色的所有螺丝圈
        const freeSlots = targetNutComponent.getFreeSlots(); // 可用的数量
        const ringsToMove = groupRings.slice(0, freeSlots); // 截取可用的数量螺丝圈移动

        const moveNext = (index: number) => {
            if (index >= ringsToMove.length) {
                // 所有需要移动的螺丝圈移动完成
                if (onComplete) onComplete();
                return;
            }

            const ring = ringsToMove[index];
            if (ring === startRing) {
                // 当前悬浮螺丝圈：直接移动到目标螺母
                this.moveRingToSuspension(ring, targetNutComponent, () => {
                    this.moveRingToNut(ring, targetNutComponent, false);
                    moveNext(index + 1);
                });
            } else {
                // 后续螺丝圈：先移动到当前螺母悬浮位置，再移动到目标螺母
                this.moveRingToSuspension(ring, currentNutComponent, () => {
                    this.moveRingToSuspension(ring, targetNutComponent, () => {
                        this.moveRingToNut(ring, targetNutComponent, false);
                        moveNext(index + 1);
                    });
                });
            }
        };

        moveNext(0); // 开始移动
    }

    // 获取相邻的同颜色螺丝圈
    getGroupRings(startRing: Node, nutNode: Node): Node[] {
        const nutComponent = nutNode.getComponent(NutComponent)!;
        const allRings = nutComponent.ringsNode.children;
        const startColor = startRing.getComponent(Ring)!.color;

        // 找到与 `startRing` 相邻且颜色相同的螺丝圈
        const groupRings: Node[] = [];
        let foundStart = false;

        for (let i = allRings.length - 1; i >= 0; i--) {
            const ring = allRings[i];
            if (ring === startRing) foundStart = true;
            if (ring.getComponent(Ring)!.color === startColor) {
                groupRings.push(ring);
            } else if (foundStart) {
                break;
            }
        }

        return groupRings;
    }

    // 获取给定螺丝圈的索引
    ringIndexForScrew(screw: ScrewData): number {
        const nutComponent = this.currentNut?.getComponent(NutComponent);
        return nutComponent ? nutComponent.data.screws.indexOf(screw) : -1;
    }

    moveRingToSuspension(ringNode: Node, nutComponent: NutComponent, onComplete?: () => void) {
        const targetPos = nutComponent.getSuspensionPosition();
        tween(ringNode)
            .to(0.3, { worldPosition: targetPos })
            .call(() => {
                if (onComplete) onComplete();
            })
            .start();
    }

    /** 
     * 将当前选中的螺丝圈移动到螺丝上
     * @param ringNode 螺丝圈节点
     * @param nutComponent 螺丝组件
     * @param isReturning 是否归位操作
    */
    moveRingToNut(ringNode: Node, targetNutComponent: NutComponent, isReturning: boolean = false) {
        if (!ringNode) return;

        if (!isReturning && this.currentNut) {
            const currentNutComponent = this.currentNut.getComponent(NutComponent)!;
            this.saveOperation(ringNode, currentNutComponent, targetNutComponent);
            // 移除当前螺母顶部的螺丝圈
            const removedScrew = currentNutComponent.data.removeTopScrew();
            if (removedScrew) {
                // 揭示离开螺母的螺丝圈
                this.revealBelowScrews(currentNutComponent);
            }

            // 将新的螺丝圈数据添加到目标螺母的数据结构中
            const ringComponent = ringNode.getComponent(Ring)!;
            const screwData = new ScrewData(ringComponent.color);
            targetNutComponent.data.addScrew(screwData);
        }

        this.inOperation = true;
        targetNutComponent.addRingNode(ringNode, isReturning, () => {
            this.inOperation = false;
            this.handlePostMoveLogic();
        }
        );
    }

    /**
     * 处理移动后逻辑，包括通关检测
     */
    handlePostMoveLogic() {
        if (this.checkLevelCompletion()) {
            console.log('通关！');
        }
    }

    /**
     * 处理广告成功逻辑：找到第一个 `canGrow` 为 `false` 的螺母组件并设置为可增长
     */
    public handleAdSuccess(): void {
        for (const nutNode of this.nutNodes) {
            const nutComponent = nutNode.getComponent(NutComponent);
            if (nutComponent && nutComponent.data.canGrow) {
                nutComponent.data.curScrews++;

                if (nutComponent.data.curScrews >= nutComponent.data.maxScrews) {
                    nutComponent.data.curScrews = nutComponent.data.maxScrews;
                }

                nutComponent.updateVisuals();
                return;
            }
        }
    }

    /**
     * 处理移开顶部螺丝圈后的揭示逻辑
     * @param nutComponent 当前螺母组件
     */
    revealBelowScrews(nutComponent: NutComponent): void {
        const screws = nutComponent.data.screws;

        if (screws.length === 0) {
            console.log('没有螺丝需要揭示.');
            return;
        }

        let revealColor: ScrewColor | null = null;
        let foundVisibleScrew = false;

        for (let i = screws.length - 1; i >= 0; i--) {
            const screw = screws[i];
            if (!screw.isShow) {  // 找到第一个可见的螺丝圈
                revealColor = screw.color;
                foundVisibleScrew = true;
                break;
            }
        }

        if (!foundVisibleScrew || !revealColor) {
            console.log('没有找到隐藏的螺丝圈做揭示.');
            return;
        }

        nutComponent.data.revealBelowScrews(revealColor);
        // 更新显示效果
        nutComponent.updateScrewVisibility();
    }

    /** 检测归类的螺母是否完成归类*/
    checkAndDisplayNutCap(nutComponent: NutComponent) {
        const checkIfGrouped = nutComponent.data.checkIfGrouped();
        const isGroup = nutComponent.data.isGroup;
        if (checkIfGrouped && isGroup) {
            nutComponent.displayNutCap(checkIfGrouped);
        }
    }

    /**
     * 检查当前关卡是否通关
     * 通关条件：所有螺母中颜色归类完成，且关卡中所有颜色都归类完成。
     */
    checkLevelCompletion(): boolean {
        // 存储每种颜色的归类状态
        const groupedColors: Set<ScrewColor> = new Set();

        // 遍历所有的螺母节点
        for (const nutNode of this.nutNodes) {
            const nutComponent = nutNode.getComponent(NutComponent);
            if (!nutComponent) continue;

            // 如果螺母没有归类完成，跳过该螺母
            if (!nutComponent.data.checkIfGrouped()) {
                continue;
            }

            // 如果归类完成，添加螺母的颜色
            const screws = nutComponent.data.screws;
            const topColor = screws[0].color;
            groupedColors.add(topColor);
        }

        // 获取关卡所需归类的颜色
        const levelColors = this.getLevelColors();
        // 计算已归类的颜色数量
        const arrayColors = Array.from(groupedColors);
        const filteredColors = arrayColors.filter(function (color) {
            return levelColors.includes(color);
        });
        const result = filteredColors.length;
        return result >= levelColors.length;
    }


    /**
     * 获取当前关卡需要归类的颜色
     * @returns 当前关卡的颜色数组
     */
    getLevelColors(): ScrewColor[] {
        return this.levelColorStrings
            .map(colorStr => ScrewColor[colorStr as keyof typeof ScrewColor])
            .filter(color => color !== undefined);
    }

    resetCurrentSelection() {
        this.currentRing = null;
        this.currentNut = null;
    }

    /**
     * 保存操作记录
     * @param ringNode 当前移动的螺丝圈节点
     * @param curNutComponent 当前螺丝圈的螺母组件
     * @param targetNutComponent 目标螺母组件
     */
    saveOperation(ringNode: Node, curNutComponent: NutComponent, targetNutComponent: NutComponent): void {
        const fromNutNode = curNutComponent.node;
        const toNutNode = targetNutComponent.node;

        const newStartY = (curNutComponent.ringsNode.children.length - 1) * 1.5;
        const startPosition = new Vec3(0, newStartY, 0);

        const newEndY = (targetNutComponent.ringsNode.children.length) * 1.5;
        const endPosition = new Vec3(0, newEndY, 0);

        //深度拷贝
        const fromScreews = curNutComponent.data.screws.map(screw => ({ ...screw }));
        const toScreews = targetNutComponent.data.screws.map(screw => ({ ...screw }));

        const operation: NutOperationRecord = {
            fromNut: fromNutNode,
            toNut: toNutNode,
            opNode: ringNode,
            fromPosition: startPosition,
            toPosition: endPosition,
            fromScreews: fromScreews,
            toScreews: toScreews,
        }

        // console.log('保存的from screws数据:', operation.fromScreews);
        this.operationStack.push(operation);
    }

    /**
     * 撤销最近的操作
     */
    undoLastOperation(): void {
        const lastOperation = this.operationStack.pop();
        if (!lastOperation) {
            console.warn('没有可撤销的操作!!!');
            return;
        }

        this.inOperation = true;
        const { toNut } = lastOperation;
        toNut.getComponent(NutComponent)?.undoRingNodeOperation(lastOperation, () => {
            this.inOperation = false;
        });
    }

    /** 清除操作栈*/
    clearUndoStack(): void {
        this.operationStack = [];
    }
}

/**
 * 表示螺母操作记录的接口
 */
export interface NutOperationRecord {
    fromNut: Node;
    toNut: Node;
    opNode: Node;

    fromScreews: ScrewData[];
    toScreews: ScrewData[];

    fromPosition: Vec3;
    toPosition: Vec3;
}
