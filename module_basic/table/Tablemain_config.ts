
import { JsonUtil } from "db://assets/core_tgx/base/utils/JsonUtil";

export class Tablemain_config {
    static TableName: string = "main_config";

    private data: any;

    init(id: number) {
        const table = JsonUtil.get(Tablemain_config.TableName);
        this.data = table[id];
        this.id = id;
    }

    /** 编号【KEY】 */
    id: number = 0;

    /** 参数 */
    get param(): number {
        return this.data.param;
    }
    /** 数据说明 */
    get content(): string {
        return this.data.content;
    }
}
    