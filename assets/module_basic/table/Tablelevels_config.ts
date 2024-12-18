
import { JsonUtil } from "db://assets/core_tgx/base/utils/JsonUtil";

export class Tablelevels_config {
    static TableName: string = "levels_config";

    private data: any;

    init(id: number) {
        const table = JsonUtil.get(Tablelevels_config.TableName);
        this.data = table[id];
        this.id = id;
    }

    /** 编号【KEY】 */
    id: number = 0;

    /** 关卡数 */
    get level(): number {
        return this.data.level;
    }
    /** 关卡操作步数 */
    get step(): number {
        return this.data.step;
    }
    /** 是否参与随机 */
    get random(): number {
        return this.data.random;
    }
}
    