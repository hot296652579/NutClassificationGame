
import { JsonUtil } from "db://assets/core_tgx/base/utils/JsonUtil";

export class Tableblackhole_config {
    static TableName: string = "blackhole_config";

    private data: any;

    init(id: number) {
        const table = JsonUtil.get(Tableblackhole_config.TableName);
        this.data = table[id];
        this.id = id;
    }

    /** 编号【KEY】 */
    id: number = 0;

    /** 等级 */
    get level(): number {
        return this.data.level;
    }
    /** 直径 */
    get diameter(): number {
        return this.data.diameter;
    }
    /** 速度 */
    get speed(): number {
        return this.data.speed;
    }
    /** 视野大小 */
    get view(): number {
        return this.data.view;
    }
    /** 升到此等级所需经验 */
    get exp(): number {
        return this.data.exp;
    }
}
    