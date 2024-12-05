import { tgxModuleContext, tgxUIController } from "../core_tgx/tgx";
import { ModuleDef } from "./ModuleDef";

//define UI classes which are not in the basic bundle but be called by other bundles.

export class UI_AboutMe extends tgxUIController { }
export class UI_Setting extends tgxUIController { }
export class UI_BattleResult extends tgxUIController { }
export class UI_TopInfo extends tgxUIController { }
export class UI_ExtraTime extends tgxUIController { }
export class UI_Magnetic extends tgxUIController { }
tgxModuleContext.attachModule(UI_AboutMe, ModuleDef.EXTRA);
tgxModuleContext.attachModule(UI_Setting, ModuleDef.EXTRA);
tgxModuleContext.attachModule(UI_BattleResult, ModuleDef.MODULE_NUT);
tgxModuleContext.attachModule(UI_TopInfo, ModuleDef.MODULE_NUT);
tgxModuleContext.attachModule(UI_ExtraTime, ModuleDef.MODULE_NUT);
tgxModuleContext.attachModule(UI_Magnetic, ModuleDef.MODULE_NUT);