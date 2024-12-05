import { Vec3, Node } from "cc";
import { ScrewData } from "./ScrewData";
import { ScrewColor } from "../Enum/ScrewColor";

/** 螺母数据 */
export class NutData {
    public screws: ScrewData[] = []; // 当前螺母的螺丝圈数据
    public maxScrews: number = 6; // 螺母最大容量 默认6个
    public isGroup: boolean = false; // 是否是归类类型
    public isDone: boolean = false; // 是否完成
    public canGrow: boolean = false; // 是否可以生长
    public curScrews: number = 0; // 当前显示的螺丝数量

    constructor() { }

    // 检查螺母是否为空
    isEmpty(): boolean {
        return this.screws.length === 0;
    }

    // 检查螺母是否已满
    isFull(): boolean {
        return this.screws.length >= this.maxScrews;
    }

    // 获取顶部螺丝圈
    getTopScrew(): ScrewData | null {
        return this.screws.length > 0 ? this.screws[this.screws.length - 1] : null;
    }

    // 添加螺丝圈
    addScrew(screwData: ScrewData) {
        if (this.screws.length < this.maxScrews) {
            this.screws.push(screwData);
        }
        // console.log('当前螺母最新螺丝数据:', this.screws);
    }

    // 移除顶部螺丝圈
    removeTopScrew(): ScrewData | null | undefined {
        return this.screws.length > 0 ? this.screws.pop() : null;
    }

    /**
    * 揭示当前螺母中顶部以下的螺丝圈
    * @param screwColor 需要揭示的螺丝圈颜色
    */
    revealBelowScrews(screwColor: ScrewColor): number {
        let revealCount = 0;

        // 从顶部向下查找第一个未隐藏的螺丝圈并揭示其后的相同颜色螺丝圈
        for (let i = this.screws.length - 1; i >= 0; i--) {
            const screw = this.screws[i];
            if (screw.color === screwColor && !screw.isShow) {
                screw.isShow = true; // 设置为显示，表示被揭示
                revealCount++;
            } else if (screw.color !== screwColor) {
                break;
            }
        }

        return revealCount;
    }

    /** 螺母是否完成*/
    checkIfGrouped(): boolean {
        if (this.isFull()) {
            const firstColor = this.screws[0].color;
            this.isDone = this.screws.every(screw => screw.color === firstColor);
            return this.isDone;
        }
        return false;
    }
}