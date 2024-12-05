
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

    /** 关卡编号 */
    get level(): number {
        return this.data.level;
    }
    /** 基础钞票奖励 */
    get reward_basics(): number {
        return this.data.reward_basics;
    }
    /** 额外钞票奖励 */
    get reward_additional(): number {
        return this.data.reward_additional;
    }
}
    