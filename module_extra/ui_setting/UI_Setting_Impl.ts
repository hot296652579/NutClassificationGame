
import { Toggle } from "cc";
import { AudioMgr } from "../../core_tgx/base/AudioMgr";
import { tgxModuleContext } from "../../core_tgx/tgx";
import { GameUILayers } from "../../scripts/GameUILayers";
import { UI_Setting } from "../../scripts/UIDef";
import { Layout_Setting } from "./Layout_Setting";
import { NutGameAudioMgr } from "../../module_nut/Script/Manager/NutGameAudioMgr";

export class UI_Setting_Impl extends UI_Setting {
    constructor() {
        super('ui_setting/UI_Setting', GameUILayers.POPUP, Layout_Setting);
    }

    public getRes(): [] {
        return [];
    }

    protected onCreated(): void {
        let layout = this.layout as Layout_Setting;
        this.onButtonEvent(layout.btnClose, () => {
            NutGameAudioMgr.playOneShot(NutGameAudioMgr.getMusicIdName(5), 1.0);
            this.hide();
        });

        this.initilizeUI();
    }

    private initilizeUI(): void {
        let layout = this.layout as Layout_Setting;
        let { musicToggle, soundToggle } = layout;

        musicToggle.node.on('toggle', this.musicSwitch, this);
        soundToggle.node.on('toggle', this.soundSwitch, this);

        const { bgMusicEnabled, soundEffectsEnabled } = AudioMgr.inst;
        AudioMgr.inst.toggleBgMusic(bgMusicEnabled);
        AudioMgr.inst.toggleBgMusic(soundEffectsEnabled);
        musicToggle.isChecked = bgMusicEnabled;
        soundToggle.isChecked = soundEffectsEnabled;
    }

    private musicSwitch(toggle: Toggle): void {
        AudioMgr.inst.toggleBgMusic(toggle.isChecked);
    }

    private soundSwitch(toggle: Toggle): void {
        AudioMgr.inst.toggleSoundEffects(toggle.isChecked);
    }
}

tgxModuleContext.attachImplClass(UI_Setting, UI_Setting_Impl);