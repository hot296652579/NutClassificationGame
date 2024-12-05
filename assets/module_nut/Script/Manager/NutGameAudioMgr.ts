import { AudioClip } from 'cc';
import { tgxAudioMgr } from '../../../core_tgx/tgx';
import { ModuleDef } from '../../../scripts/ModuleDef';
import { MusicConfigModel } from '../Model/MusicConfigModel';


const BundleName = ModuleDef.MODULE_NUT;

export class NutGameAudioMgr {

    static _musicConfigModel: MusicConfigModel;

    public static initilize() {
        this._musicConfigModel = new MusicConfigModel();
    }

    /**
  * @en
  * play short audio, such as strikes,explosions
  * @zh
  * 播放短音频,比如 打击音效，爆炸音效等
  * @param sound clip or url for the audio
  * @param volume 
  */
    public static playOneShot(sound: AudioClip | string, volume: number = 1.0) {
        tgxAudioMgr.inst.playOneShot(sound, volume, BundleName);
    }

    /**
     * @en
     * play long audio, such as the bg music
     * @zh
     * 播放长音频，比如 背景音乐
     * @param sound clip or url for the sound
     * @param volume 
     */
    public static play(sound: AudioClip | string, volume: number = 1.0,) {
        tgxAudioMgr.inst.play(sound, volume, BundleName);
    }

    public static getMusicIdName(id: number): string {
        return 'Audio/' + this._musicConfigModel.getNameById(id);
    }

    /**
 * stop the audio play
 */
    public static stop() {
        tgxAudioMgr.inst.stop();
    }

    /**
     * pause the audio play
     */
    public static pause() {
        tgxAudioMgr.inst.pause();
    }

    /**
     * resume the audio play
     */
    public static resume() {
        tgxAudioMgr.inst.audioSource.play();
    }
}

