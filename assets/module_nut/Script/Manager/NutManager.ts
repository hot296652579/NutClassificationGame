import { _decorator, Component, Node, tween, PhysicsSystem, geometry, CameraComponent, input, Input, EventTouch, Vec3, ccenum, CCString } from 'cc';
import { duration, NutComponent } from '../NutComponent';
import { Ring } from '../Ring';
import { ScrewData } from '../Model/ScrewData';
import { ScrewColor } from '../Enum/ScrewColor';
import { tgxUIMgr } from '../../../core_tgx/tgx';
import { UI_BattleResult } from '../../../scripts/UIDef';
import { EventDispatcher } from '../../../core_tgx/easy_ui_framework/EventDispatcher';
import { GameEvent } from '../Enum/GameEvent';
import { LevelManager } from './LevelMgr';
import { NutGameAudioMgr } from './NutGameAudioMgr';

const { ccclass, property } = _decorator;

@ccclass('NutManager')
export class NutManager extends Component {
    @property({ type: CameraComponent })
    camera: CameraComponent = null!;

    @property([Node])
    nutNodes: Node[] = []; // 螺母节点数组

    @property({ type: [CCString], tooltip: "当前关卡需要归类的颜色" })
    readonly levelColorStrings: String[] = []; // 在编辑器中使用字符串数组

    private currentRing: Node | null = null; // 当前悬浮的螺丝圈
    private currentNut: Node | null = null; // 当前选择的螺母
    public operationStack: NutOperationRecord[][] = []; // 操作栈，每次操作保存为一个记录数组
    public inOperation: boolean = false; // 是否在操作中

    protected onLoad(): void {
        for (const nutNode of this.nutNodes) {
            nutNode.active = true;
        }
        this.clearData();
    }

    setupUIListeners() {
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        EventDispatcher.instance.on(GameEvent.EVENT_UNDO_REVOKE, this.onUndoHandler, this);
        EventDispatcher.instance.on(GameEvent.EVENT_ADD_SCREW, this.onAddScrewHandler, this);
    }

    start() {
        this.initNuts(); // 初始化数据
        this.setupUIListeners();
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

    onTouchEnd(event: EventTouch) {
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
        const self = this;
        if (self.inOperation) return;

        self.inOperation = true;
        const nutComponent = nutNode.getComponent(NutComponent)!;
        const growCanOp = nutComponent.growCanOp();

        //增长类型 没解锁不可操作
        if (!growCanOp) {
            self.inOperation = false;
            console.log('增加类型螺母未解锁，无法操作');
            return;
        }

        // 判断是否是归类类型且已经完成
        if (nutComponent.data.isGroup && nutComponent.data.isDone) {
            self.inOperation = false;
            console.log('该螺母已完成归类，无法操作');
            return;
        }

        if (self.currentRing) {
            // 已有悬浮螺丝圈
            if (self.currentNut === nutNode) {
                console.log('点击同一螺母，归位操作');
                self.moveRingToNut(self.currentRing, nutComponent, true);
                self.resetCurrentSelection();
                self.inOperation = false;
            } else {
                // 点击不同螺母
                const topScrew = nutComponent.data.getTopScrew();
                const currentRingColor = self.currentRing.getComponent(Ring)!.color;
                if (!topScrew || topScrew.color === currentRingColor) {
                    const full = nutComponent.data.isFull();
                    if (full) {
                        console.log('螺母已达到上限，无法操作');
                        self.inOperation = false;
                        return;
                    }

                    // console.log('执行连续移动逻辑');
                    //连续移动逻辑
                    self.inOperation = true;
                    self.moveGroupRings(self.currentRing, self.currentNut, nutComponent, () => {
                        LevelManager.instance.addLevelStep();
                        self.resetCurrentSelection();
                        self.checkAndDisplayNutCap(nutComponent);
                        self.inOperation = false;
                        EventDispatcher.instance.emit(GameEvent.EVENT_ADD_PARTICLE_ROCK, [nutComponent, this.node]);
                    });
                } else {
                    console.log('不符合移动要求，归位操作');
                    const currentNutComponent = self.currentRing.parent!.parent!.getComponent(NutComponent)!;
                    self.moveRingToNut(self.currentRing, currentNutComponent, true);
                    self.resetCurrentSelection();
                    self.inOperation = false;
                }
            }
        } else {
            // 没有悬浮螺丝圈时：直接选中顶部螺丝圈并移动
            const topRing = nutComponent.getTopRingNode();
            if (topRing) {
                self.currentRing = topRing;
                self.currentNut = nutNode;
                self.moveRingToSuspension(topRing, nutComponent);
                self.inOperation = false;
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
        const self = this;
        const currentNutComponent = currentNutNode.getComponent(NutComponent)!;
        const groupRings = self.getGroupRings(startRing, currentNutNode); //找到相邻同色的所有螺丝圈
        const freeSlots = targetNutComponent.getFreeSlots(); // 可用的数量
        const ringsToMove = groupRings.slice(0, freeSlots); // 截取可用的数量螺丝圈移动

        const operationRecords: NutOperationRecord[] = []; // 存储本次移动的所有操作记录

        const moveNext = (index: number) => {
            if (index >= ringsToMove.length) {
                // 所有需要移动的螺丝圈移动完成
                if (operationRecords.length > 0) {
                    self.operationStack.push(operationRecords); // 保存整个移动操作为数组
                    // console.log('operationStack', self.operationStack);
                }
                if (onComplete) {
                    onComplete();
                }
                return;
            }

            const ring = ringsToMove[index];

            const createOperation = () => {
                const record = self.createNutOperationRecord(ring, currentNutComponent, targetNutComponent);
                operationRecords.push(record); // 保存每次移动的记录
            };

            if (ring === startRing) {
                // 当前悬浮螺丝圈：直接移动到目标螺母
                self.moveRingToSuspension(ring, targetNutComponent, () => {
                    createOperation();
                    self.moveRingToNut(ring, targetNutComponent, false);
                    moveNext(index + 1);
                });
            } else {
                // 后续螺丝圈：先移动到当前螺母悬浮位置，再移动到目标螺母
                self.moveRingToSuspension(ring, currentNutComponent, () => {
                    self.moveRingToSuspension(ring, targetNutComponent, () => {
                        createOperation();
                        self.moveRingToNut(ring, targetNutComponent, false);
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
        NutGameAudioMgr.playOneShot(NutGameAudioMgr.getMusicIdName(5), 1.0);
        const targetPos = nutComponent.getSuspensionPosition();
        tween(ringNode)
            .to(duration, { worldPosition: targetPos })
            .call(() => {
                if (onComplete) {
                    ringNode.getComponent(Ring)!.stopHover();
                    onComplete();
                } else {
                    ringNode.getComponent(Ring)!.suspensionEffect();
                }
            })
            .start();
    }

    /** 
     * 将当前选中的螺丝圈移动到螺丝上
     * @param ringNode 螺丝圈节点
     * @param nutComponent 螺丝组件
     * @param isReturning 是否归位操作
     * @param cb 回调函数
    */
    moveRingToNut(ringNode: Node, targetNutComponent: NutComponent, isReturning: boolean = false, cb?: () => void) {
        if (!ringNode) return;

        if (!isReturning && this.currentNut) {
            const currentNutComponent = this.currentNut.getComponent(NutComponent)!;
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

        targetNutComponent.addRingNode(ringNode, isReturning, () => {
            if (cb) cb();
            this.handlePostMoveLogic();
        }
        );
    }

    /**
     * 处理移动后逻辑，包括通关检测
     */
    handlePostMoveLogic() {
        // console.log('检测是否通关:' + this.checkLevelCompletion());
        if (this.checkLevelCompletion()) {
            tgxUIMgr.inst.showUI(UI_BattleResult);
        }
    }

    /**
     * 处理广告成功逻辑：找到第一个 `canGrow` 为 `false` 的螺母组件并设置为可增长
     */
    private handleAdSuccess(): void {
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
            EventDispatcher.instance.emit(GameEvent.EVENT_ADD_PARTICLE_COLOR_BAR, nutComponent);
        }
    }

    /**
     * 检查当前关卡是否通关
     * 通关条件：所有螺母中颜色归类完成，且关卡中所有颜色都归类完成。
     */
    checkLevelCompletion(): boolean {
        const groupedColors: Set<ScrewColor> = new Set();

        // 遍历所有的螺母节点
        for (const nutNode of this.nutNodes) {
            const nutComponent = nutNode.getComponent(NutComponent);
            if (!nutComponent) continue;

            // 如果螺母没有归类完成，跳过该螺母
            if (!nutComponent.data.checkIfGrouped()) {
                continue;
            }

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
        // console.log('Before levelColorStrings:', this.levelColorStrings); // 打印初始值
        return [...this.levelColorStrings]
            .map(colorStr => ScrewColor[colorStr as keyof typeof ScrewColor]);
    }

    resetCurrentSelection() {
        console.log('清除了操作的螺丝圈和螺母');
        this.currentRing = null;
        this.currentNut = null;
    }

    /**
     * 保存操作记录
     * @param ringNode 当前移动的螺丝圈节点
     * @param curNutComponent 当前螺丝圈的螺母组件
     * @param targetNutComponent 目标螺母组件
     */
    private createNutOperationRecord(
        ringNode: Node,
        curNutComponent: NutComponent,
        targetNutComponent: NutComponent
    ): NutOperationRecord {
        const fromNutNode = curNutComponent.node;
        const toNutNode = targetNutComponent.node;

        const newStartY = (curNutComponent.ringsNode.children.length - 1) * 1.5;
        const startPosition = new Vec3(0, newStartY, 0);

        const newEndY = (targetNutComponent.ringsNode.children.length) * 1.5;
        const endPosition = new Vec3(0, newEndY, 0);

        // 深度拷贝数据
        const fromScreews = curNutComponent.data.screws.map(screw => ({ ...screw }));
        const toScreews = targetNutComponent.data.screws.map(screw => ({ ...screw }));

        return {
            fromNut: fromNutNode,
            toNut: toNutNode,
            opNode: ringNode,
            fromPosition: startPosition,
            toPosition: endPosition,
            fromScreews: fromScreews,
            toScreews: toScreews,
        };
    }

    private onAddScrewHandler() {
        if (this.nutNodes) {
            this.handleAdSuccess();
        }
    }

    private async onUndoHandler() {
        await this.undoLastOperation();
    }

    /**
     * 撤销最近的操作
     */
    async undoLastOperation(): Promise<void> {
        console.log('before inOperation:' + this.inOperation);
        if (!this.operationStack || this.inOperation) return;
        this.inOperation = true;

        const executeUndoOperations = async () => {
            // 撤销操作
            const lastOperations = this.operationStack.pop();
            try {
                // 按逆序逐个撤销操作
                for (let i = lastOperations.length - 1; i >= 0; i--) {
                    const operation = lastOperations[i];
                    const { toNut } = operation;

                    // 先隐藏螺丝帽
                    toNut.getComponent(NutComponent).displayNutCap(false);
                    EventDispatcher.instance.emit(GameEvent.EVENT_CLEAR_ALL_PARTICLE);
                    await this.undoRingNodeOperationAsync(toNut, operation);
                }
                this.inOperation = false;
                console.log('撤销操作已完成');
            } finally {
                this.inOperation = false;
            }
        };

        if (this.currentNut) {
            const nutComponent = this.currentNut.getComponent(NutComponent);
            await new Promise<void>((resolve) => {
                this.moveRingToNut(this.currentRing, nutComponent, true, () => {
                    this.resetCurrentSelection();
                    resolve();
                });
            });
        }

        await executeUndoOperations();
    }

    private undoRingNodeOperationAsync(toNut: Node, operation: NutOperationRecord): Promise<void> {
        return new Promise((resolve) => {
            const nutComponent = toNut.getComponent(NutComponent);
            if (!nutComponent) {
                console.error('未找到 NutComponent，无法撤销');
                resolve(); // 无法处理，直接完成当前任务
                return;
            }

            nutComponent.undoRingNodeOperation(operation, () => {
                resolve(); // 完成一次撤销
            });
        });
    }

    /** 清除操作栈*/
    clearUndoStack(): void {
        this.operationStack = [];
    }

    /** 清除数据*/
    clearData(): void {
        this.clearUndoStack();
        this.resetCurrentSelection();

        for (const nutNode of this.nutNodes) {
            const nutComponent = nutNode.getComponent(NutComponent)!;
            nutComponent.initData();
        }

        this.inOperation = false;
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd);
        EventDispatcher.instance.off(GameEvent.EVENT_UNDO_REVOKE, this.onUndoHandler);
        EventDispatcher.instance.off(GameEvent.EVENT_ADD_SCREW, this.onAddScrewHandler);
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
