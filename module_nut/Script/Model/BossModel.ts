import { Tableboss_config } from "../../../module_basic/table/Tableboss_config";

/**BOSS数据模型
 * @param name boss名称
 * @param model boss模型名
 * @param weight boss重量
*/
export class BossModel {
    public config: Tableboss_config;
    public id: number;
    public curHoleExpL: number;

    constructor(id: number = 1) {
        this.id = id;
        this.config = new Tableboss_config();
        this.config.init(id);
    }

    /** boss名字*/
    get bossName(): string {
        return this.config.name;
    }

    /** boss模型名字*/
    get bossModel(): string {
        return this.config.model;
    }

    /** boss重量*/
    get bossWeight(): number {
        return this.config.weight;
    }

    /** 根据id设置当前boss属性*/
    gettBossById(id: number) {
        this.config.init(id);
        return this.config.weight;
    }
}