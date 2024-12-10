import { Tablemain_config } from "../../../module_basic/table/Tablemain_config";

/**main 配置表模型
 * */
export class MainConfigModel {

    public config: Tablemain_config = null!;

    constructor() {
    }

    initilizeModel(): IMainConfig {
        const obj: IMainConfig = {
            adCDTime: this.getPramById(Main_Enum.AD_CD_TIME),
            getStepStar: this.getPramById(Main_Enum.STEP_STAR),
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
    AD_CD_TIME = 1,//广告弹出间隔
    STEP_STAR = 2  //星星对应步数
}

/** main属性接口
 * @param adCDTime 广告间隔时间
 * @param getStepStar 步数星星奖励
 * @param initMoeny 玩家初始货币
*/
export interface IMainConfig {
    adCDTime: number,
    getStepStar: number,
}
