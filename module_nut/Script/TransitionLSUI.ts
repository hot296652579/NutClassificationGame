import { _decorator, Component, instantiate, Label, Node, Prefab, ProgressBar, Size, tween, Tween, UIOpacity, Vec3, view } from 'cc';
import { EventDispatcher } from '../../core_tgx/easy_ui_framework/EventDispatcher';
import { GameEvent } from './Enum/GameEvent';
const { ccclass, property } = _decorator;

/** 转场动画 阶梯式*/
@ccclass('TransitionLSUI')
export class TransitionLSUI extends Component {

    @property(Prefab)
    blockPrefab: Prefab = null!; // 小方块的预制件

    @property
    blockSize: number = 50; // 每个小方块的大小

    private screenSize: Size = new Size(); // 屏幕大小
    private isFillingScheduled = false;
    private isClearingScheduled = false;

    start() {
        this.node.active = false;
        if (!this.blockPrefab) {
            console.error("请绑定小方块预制件和容器节点！");
            return;
        }

        this.screenSize.width = view.getVisibleSize().width;
        this.screenSize.height = view.getVisibleSize().height;

        this.createBlocks();
        this.setupUIListeners();
    }

    private setupUIListeners(): void {
        EventDispatcher.instance.on(GameEvent.EVENT_ZERO_TO_FULL_TRANSITION, this.startFillingAnimation, this);
        EventDispatcher.instance.on(GameEvent.EVENT_FULL_TO_ZERO_TRANSITION, this.startClearingAnimation, this);
    }

    /**
     * 动态生成小方块
     */
    createBlocks() {
        const cols = Math.ceil(this.screenSize.width / this.blockSize);
        const rows = Math.ceil(this.screenSize.height / this.blockSize);

        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                const block = instantiate(this.blockPrefab);
                this.node!.addChild(block);
                block.setPosition(
                    col * this.blockSize - this.screenSize.width / 2 + this.blockSize / 2,
                    this.screenSize.height / 2 - row * this.blockSize - this.blockSize / 2,
                    0
                );

                // 添加 UIOpacity 组件并设置初始透明度
                const uiOpacity = block.addComponent(UIOpacity);
                uiOpacity.opacity = 0; // 初始透明度为 0
            }
        }
    }

    /**
     * 开始水平阶梯式铺满动画
     */
    startFillingAnimation() {
        console.log("开始水平阶梯式铺满动画");
        this.node.active = true;
        const blocks = this.node!.children;
        const rows = Math.ceil(this.screenSize.height / this.blockSize);
        const cols = Math.ceil(this.screenSize.width / this.blockSize);

        for (let col = 0; col < cols; col++) {
            const delay = col * 0.01; // 每列延迟时间
            for (let row = 0; row < rows; row++) {
                const blockIndex = col * rows + row; // 当前小方块的索引
                const block = blocks[blockIndex];
                const uiOpacity = block.getComponent(UIOpacity);

                if (uiOpacity) {
                    tween(uiOpacity)
                        .delay(delay + row * 0.02) // 列与行的延迟叠加
                        .to(0.1, { opacity: 255 }) // 透明度变化动画
                        .start();
                }
            }
        }

        this.isFillingScheduled = true;
        this.scheduleOnce(() => {
            this.isFillingScheduled = false;
            EventDispatcher.instance.emit(GameEvent.EVENT_ZERO_TO_FULL_TRANSITION_FINISH);
        }, cols * 0.05 + rows * 0.01);
    }

    /**
     * 开始水平阶梯式移除动画
     */
    startClearingAnimation() {
        this.node.active = true;
        const blocks = this.node!.children;
        const rows = Math.ceil(this.screenSize.height / this.blockSize);
        const cols = Math.ceil(this.screenSize.width / this.blockSize);

        for (let col = cols - 1; col >= 0; col--) {
            const delay = (cols - 1 - col) * 0.01; // 每列延迟时间，从右到左
            for (let row = 0; row < rows; row++) {
                const blockIndex = col * rows + row; // 当前小方块的索引
                const block = blocks[blockIndex];
                const uiOpacity = block.getComponent(UIOpacity);

                if (uiOpacity) {
                    tween(uiOpacity)
                        .delay(delay + row * 0.02) // 列与行的延迟叠加
                        .to(0.1, { opacity: 0 }) // 透明度变化动画
                        .call(() => {
                            // block.active = false; // 动画完成后隐藏小方块
                        })
                        .start();
                }
            }
        }

        this.isClearingScheduled = true;
        this.scheduleOnce(() => {
            this.isClearingScheduled = false;
            this.onTransitionComplete();
        }, cols * 0.05 + rows * 0.01); // 根据动画时长调整
    }

    /**
     * 过场动画完成
     */
    onTransitionComplete() {
        EventDispatcher.instance.emit(GameEvent.EVENT_FULL_TO_ZERO_TRANSITION_FINISH);
    }

    /**
         * 清理所有定时器
         */
    clearTimers() {
        if (this.isFillingScheduled) {
            this.unscheduleAllCallbacks(); // 无法直接清除 scheduleOnce，只能清除所有定时器
            this.isFillingScheduled = false;
        }

        if (this.isClearingScheduled) {
            this.unscheduleAllCallbacks(); // 清理所有剩余的 scheduleOnce
            this.isClearingScheduled = false;
        }
    }

    protected onDestroy(): void {
        this.clearTimers();
    }
}


