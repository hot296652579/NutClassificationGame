
import { JsonUtil } from "db://assets/core_tgx/base/utils/JsonUtil";

export class Tableboss_config {
    static TableName: string = "boss_config";

    private data: any;

    init(id: number) {
        const table = JsonUtil.get(Tableboss_config.TableName);
        this.data = table[id];
        this.id = id;
    }

    /** 编号【KEY】 */
    id: number = 0;

    /** 备注信息 */
    get name(): string {
        return this.data.name;
    }
    /** 调用模型 */
    get model(): string {
        return this.data.model;
    }
    /** 重量 */
    get weight(): number {
        return this.data.weight;
    }
}
    