/** 游戏工具类 */
export class GameUtil {

    /** 转换成hh:mm格式*/
    static formatToTimeString(totalSeconds: number): string {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    /** 重量单位转换*/
    static formatWeight(weight: number): string {
        if (weight < 1000) {
            return `${weight}KG`;
        }
        // 等于或超过1000时，转换为吨（T），保留两位小数并向下取整
        const inTons = Math.floor((weight / 1000) * 100) / 100;
        return `${inTons}T`;
    }

    /**
     * 将 16 进制颜色转换为 RGBA 格式
     * @param hex - 16 进制颜色字符串 (#FFE73A 或 FFE73A)
     * @param alpha - 可选的透明度值（范围 0~255，默认 255）
     * @returns Color - 包含 r, g, b, a 的对象
     */
    static hexToRGBA(hex: string, alpha: number = 255): { r: number; g: number; b: number; a: number } {
        // 去掉可能存在的 '#' 前缀
        hex = hex.replace(/^#/, '');

        // 如果是简写格式 (如 #F7A)，转换为完整格式 (FF77AA)
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }

        // 转换为 r, g, b
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // 返回 RGBA 颜色对象
        return { r, g, b, a: alpha };
    }

}