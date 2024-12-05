/**玩家数据模型
 * @param level 等级
 * @param money 金币
 * @param nickName 昵称
*/
export class UserModel {
    private _level: number = 1;
    private _money: number = 10000;
    private _nickName: string = '落山鸡';

    constructor() {
    }

    public get level(): number {
        return this._level;
    }
    public set level(value: number) {
        this._level = value;
    }

    public get money(): number {
        return this._money;
    }
    public set money(value: number) {
        this._money = value;
    }

    public get nickName(): string {
        return this._nickName;
    }
    public set nickName(value: string) {
        this._nickName = value;
    }
}