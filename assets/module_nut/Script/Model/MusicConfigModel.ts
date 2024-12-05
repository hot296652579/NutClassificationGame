import { Tablemusic_config } from "../../../module_basic/table/Tablemusic_config";
/**
 * 音乐配置数据
*/
export class MusicConfigModel {
    private config: Tablemusic_config;
    private id: number;

    constructor(id: number = 1) {
        this.id = id;
        this.config = new Tablemusic_config();
    }

    /** 音效用途说明*/
    get content(): string {
        return this.config.content;
    }

    /** 音效文件名*/
    get name(): string {
        return this.config.name;
    }

    /** 根据id获取音乐文件名*/
    getNameById(id: number = 1): string {
        this.config.init(id);
        return this.name;
    }
}