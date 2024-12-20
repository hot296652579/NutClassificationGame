export enum ScrewColor {
    Unknow = 0, //未知
    EMPTY = -1, //空
    PINK = 1,    //粉色
    BLUE = 2,   //蓝色
    YELLOW = 3, //黄色
    GREEN = 4,  //绿色
    ORANGE = 5, //橙色
    WHITE = 6,    //白色
    PURPLE = 7, //紫色
    BLACK = 8, //黑色
    PALEPINK = 9, //浅粉
    RED = 10, //红色
}

export const HexScrewColor = {
    [ScrewColor.PINK]: '#FC6294',    //粉色
    [ScrewColor.BLUE]: '#26A1EF',   //蓝色
    [ScrewColor.YELLOW]: '#FAB524', //黄色
    [ScrewColor.GREEN]: '#5CC931',  //绿色
    [ScrewColor.ORANGE]: '#FFA500', //橙色
    [ScrewColor.WHITE]: '#CE76F0',    //白色
    [ScrewColor.PURPLE]: '#752FF1', //紫色
    [ScrewColor.BLACK]: '#323135', //黑色
    [ScrewColor.PALEPINK]: '#FF6E61', //浅粉
    [ScrewColor.RED]: '#F03636', //红色
}