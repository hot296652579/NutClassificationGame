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
}