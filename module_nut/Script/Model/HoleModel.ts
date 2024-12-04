import { Tableblackhole_config } from "../../../module_basic/table/Tableblackhole_config";

/**黑洞数据模型
 * @param diameter 直径
 * @param speed 速度
 * @param view 视野大小
*/
export class BlackholeModel {
    public config: Tableblackhole_config;
    public holeLevel: number;
    public curHoleExpL: number;
    public isMagment: boolean = false;

    constructor(holeLevel: number = 1) {
        this.holeLevel = holeLevel;
        this.curHoleExpL = 0;
        this.config = new Tableblackhole_config();
        this.config.init(holeLevel);
    }

    /** 黑洞直径*/
    get diameter(): number {
        return this.config.diameter;
    }

    /** 黑洞移动速度*/
    get speed(): number {
        return this.config.speed;
    }

    /** 黑洞视野大小*/
    get view(): number {
        return this.config.view;
    }

    /** 黑洞半径*/
    get radius(): number {
        return this.config.radius;
    }

    /** 黑洞升级所需经验*/
    get exp(): number {
        return this.config.exp;
    }
}