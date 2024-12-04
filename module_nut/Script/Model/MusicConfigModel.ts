/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-11-21 23:14:36
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-11-21 23:23:40
 * @FilePath: /cocoscreator_hole/assets/module_hole/Script/Model/MusicConfigModel.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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