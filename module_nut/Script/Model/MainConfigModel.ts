import { Tablemain_config } from "../../../module_basic/table/Tablemain_config";
import { IMainConfig } from "./LevelModel";

/**main 配置表模型
 * @param extraTime 弹窗加时时间
 * @param magenetic 磁力
 * @param gameUpLev 游戏内升级黑洞大小等级
 * @param userInitMoney 玩家初始货币
 * */
export class MainConfigModel {

    public config: Tablemain_config = null!;

    constructor() {
    }

    initilizeModel(): IMainConfig {
        const obj: IMainConfig = {
            extraTime: this.getPramById(Main_Enum.EXTRA_TIME),
            magentic: this.getPramById(Main_Enum.MAGENTIC),
            gameUpLve: this.getPramById(Main_Enum.GAMEUP_LEV),
            initMoeny: this.getPramById(Main_Enum.INIT_MONEY)
        }
        return obj;
    }

    private getPramById(id: number) {
        const config = new Tablemain_config();
        config.init(id);
        const param = config.param;
        return param
    }
}

enum Main_Enum {
    EXTRA_TIME = 1,
    MAGENTIC = 2,
    GAMEUP_LEV = 3,
    INIT_MONEY = 4
}