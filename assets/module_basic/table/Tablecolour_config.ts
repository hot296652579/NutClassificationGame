
import { JsonUtil } from "db://assets/core_tgx/base/utils/JsonUtil";

export class Tablecolour_config {
    static TableName: string = "colour_config";

    private data: any;

    init(id: number) {
        const table = JsonUtil.get(Tablecolour_config.TableName);
        this.data = table[id];
        this.id = id;
    }

    /** 编号【KEY】 */
    id: number = 0;

    /** 色号 */
    get colour(): string {
        return this.data.colour;
    }
    /** 颜色 */
    get color(): string {
        return this.data.color;
    }
}
    