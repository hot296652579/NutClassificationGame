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
    Palepink = 9, //浅粉
    Red = 10, //红色
}

export const HexScrewColor = {
    [ScrewColor.PINK]: '#FF8D8D',    //粉色
    [ScrewColor.BLUE]: '#26A1EF',   //蓝色
    [ScrewColor.YELLOW]: '#FAB524', //黄色
    [ScrewColor.GREEN]: '#92CC3C',  //绿色=
    [ScrewColor.ORANGE]: '#FFA500', //橙色
    [ScrewColor.WHITE]: '#C1B2D1',    //白色
    [ScrewColor.PURPLE]: '#921397', //紫色
    [ScrewColor.BLACK]: '#323135', //黑色
    [ScrewColor.Palepink]: '#EB9682', //浅粉
    [ScrewColor.Red]: '#F03636', //红色
}