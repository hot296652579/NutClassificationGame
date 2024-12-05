import { ScrewColor } from "../Enum/ScrewColor";


/** 螺丝圈数据 */
export class ScrewData {
    color: ScrewColor; // 螺丝圈颜色
    isShow: boolean; // 是否显示

    constructor(color: ScrewColor, isShow: boolean = false) {
        this.color = color;
        this.isShow = isShow;
    }
}