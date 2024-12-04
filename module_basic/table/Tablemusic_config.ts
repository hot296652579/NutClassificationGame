
import { JsonUtil } from "db://assets/core_tgx/base/utils/JsonUtil";

export class Tablemusic_config {
    static TableName: string = "music_config";

    private data: any;

    init(id: number) {
        const table = JsonUtil.get(Tablemusic_config.TableName);
        this.data = table[id];
        this.id = id;
    }

    /** 编号【KEY】 */
    id: number = 0;

    /** 音效文件ID */
    get name(): string {
        return this.data.name;
    }
    /** 音效的类型 */
    get type(): number {
        return this.data.type;
    }
    /** 音效内置cd */
    get cd(): number {
        return this.data.cd;
    }
    /** 音效用途说明 */
    get content(): string {
        return this.data.content;
    }
}
    