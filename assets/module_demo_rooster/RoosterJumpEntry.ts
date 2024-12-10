import { _decorator, Component } from 'cc';
import { tgxUI_Joystick, tgxUIMgr } from '../core_tgx/tgx';
import { UI_HUD } from '../module_basic/ui_hud/UI_HUD';
import { Tableblackhole_config } from '../module_basic/table/Tableblackhole_config';
import { Tablelevels_config } from '../module_basic/table/Tablelevels_config';
const { ccclass, property } = _decorator;

@ccclass('RoosterJumpEntry')
export class RoosterJumpEntry extends Component {
    start() {
        tgxUI_Joystick.inst.setButtonVisible('btn_slot_1', false);
        tgxUI_Joystick.inst.setButtonVisible('btn_slot_2', false);
        tgxUI_Joystick.inst.setButtonVisible('btn_slot_3', false);
        tgxUI_Joystick.inst.setButtonVisible('btn_slot_4', false);

        tgxUIMgr.inst.showUI(UI_HUD);

        const level = new Tablelevels_config();
        const test = new Tableblackhole_config();
        test.init(3);
        level.init(1);
        console.log(test);
    }

    update(deltaTime: number) {

    }
}

