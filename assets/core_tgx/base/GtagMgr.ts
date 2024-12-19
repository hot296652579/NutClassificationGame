/** 上报管理器*/
export class GtagMgr {

    private static _inst: GtagMgr = null;
    private gtag: any = null;
    public static get inst(): GtagMgr {
        if (!this._inst) {
            this._inst = new GtagMgr();
        }
        return this._inst;
    }

    public init() {
        if (typeof window.gtag === 'function') {
            console.log('gtag is available.');
            this.gtag = window.gtag;
        } else {
            console.error('gtag is not available.');
        }
    }

    public doGameDot(_events, value?) {
        if (!this.gtag) {
            console.log('gtag获取失败 无法上报!');
            return;
        }
        if (_events === GtagType.game_start) {
            console.log('gtag上报游戏开始!');
            this.gtag('event', _events, {
                'game_name': document.title
            })
        }

        if (_events === GtagType.level_start) {
            this.gtag('event', _events, {
                'level_name': value.level,
                'game_name': document.title

            })
        }
        if (_events === GtagType.level_end) {
            this.gtag('event', _events, {
                'level_name': value.level,
                'success': 'level success',
                'game_name': document.title
            })
        }

        if (_events === GtagType.ad_error) {
            this.gtag('event', _events, {
                'game_name': document.title

            })
        }
    }
}

export const GtagType = {
    game_start: "game_start",
    level_start: "level_start",
    level_end: "level_end",
    ad_error: "ad_error",
}