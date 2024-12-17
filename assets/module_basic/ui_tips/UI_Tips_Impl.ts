
import { tgxLayout_UITips, tgxModuleContext, tgxUITips } from "../../core_tgx/tgx";
import { GameUILayers } from "../../scripts/GameUILayers";

export class UITips_Impl extends tgxUITips {
    constructor() {
        super('ui_tips/UI_Tips', GameUILayers.ALERT, tgxLayout_UITips);
    }
}

tgxModuleContext.attachImplClass(tgxUITips, UITips_Impl);