import { Tableprop_config } from "../../../module_basic/table/Tableprop_config";

/**道具数据模型
 * @param content 道具名称
 * @param model 模型名
 * @param exp 经验
 * @param weight 重量
*/
export class PropModel {
    private config: Tableprop_config;
    private id: number;

    constructor(id: number = 1) {
        this.id = id;
        this.config = new Tableprop_config();
        this.config.init(id);
    }

    /** 道具名称*/
    get content(): string {
        return this.config.content;
    }

    /** 模型名*/
    get model(): string {
        return this.config.model;
    }

    /** 经验*/
    get exp(): number {
        return this.config.exp;
    }

    /** 重量*/
    get weight(): number {
        return this.config.weight;
    }

    /** 缩放比例*/
    get narrow(): number {
        return this.config.narrow;
    }

    /** 根据id获取当前道具重量*/
    getWeightById(id: number = 1): number {
        this.config.init(id);
        return this.weight;
    }
}