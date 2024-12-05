
import { JsonUtil } from "db://assets/core_tgx/base/utils/JsonUtil";

export class Tableprop_config {
    static TableName: string = "prop_config";

    private data: any;

    init(id: number) {
        const table = JsonUtil.get(Tableprop_config.TableName);
        this.data = table[id];
        this.id = id;
    }

    /** 编号【KEY】 */
    id: number = 0;

    /** 道具名称备注 */
    get content(): string {
        return this.data.content;
    }
    /** 调用模型名 */
    get model(): string {
        return this.data.model;
    }
    /** 经验 */
    get exp(): number {
        return this.data.exp;
    }
    /** 重量 */
    get weight(): number {
        return this.data.weight;
    }
}
    