
import { JsonUtil } from "db://assets/core_tgx/base/utils/JsonUtil";

export class Tablecultivate_config {
    static TableName: string = "cultivate_config";

    private data: any;

    init(id: number) {
        const table = JsonUtil.get(Tablecultivate_config.TableName);
        this.data = table[id];
        this.id = id;
    }

    /** 编号【KEY】 */
    id: number = 0;

    /** 等级 */
    get level(): number {
        return this.data.level;
    }
    /** 属性类型 */
    get type(): number {
        return this.data.type;
    }
    /** 属性值 */
    get param(): number {
        return this.data.param;
    }
    /** 钞票 */
    get money(): number {
        return this.data.money;
    }
}
    