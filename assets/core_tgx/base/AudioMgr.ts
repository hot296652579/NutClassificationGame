import { AudioClip, AudioSource, Node, assetManager, director } from 'cc';

/**
 * @en
 * This is a singleton class for audio play, can be easily called from anywhere in your project.
 * @zh
 * 这是一个用于播放音频的单件类，可以很方便地在项目的任何地方调用。
 */
export class AudioMgr {
    private static _inst: AudioMgr;
    public static get inst(): AudioMgr {
        if (this._inst == null) {
            this._inst = new AudioMgr();
        }
        return this._inst;
    }

    private _audioSource: AudioSource;
    private _bgMusicEnabled: boolean = true; // 是否开启背景音乐
    private _soundEffectsEnabled: boolean = true; // 是否开启音效

    constructor() {
        // 创建一个节点作为 audioMgr
        let audioMgr = new Node();
        audioMgr.name = '__audioMgr__';

        // 添加节点到场景
        director.getScene().addChild(audioMgr);

        // 标记为常驻节点，这样场景切换的时候就不会被销毁了
        director.addPersistRootNode(audioMgr);

        // 添加 AudioSource 组件，用于播放音频
        this._audioSource = audioMgr.addComponent(AudioSource);
    }

    public get audioSource() {
        return this._audioSource;
    }
    public get bgMusicEnabled() {
        return this._bgMusicEnabled;
    }
    public get soundEffectsEnabled() {
        return this._soundEffectsEnabled;
    }

    /**
     * @en
     * Play short audio, such as strikes, explosions
     * @zh
     * 播放短音频，比如 打击音效，爆炸音效等
     * @param sound Clip or URL for the audio
     * @param volume 
     */
    playOneShot(sound: AudioClip | string, volume: number = 1.0, bundleName: string = 'resources') {
        if (!this._soundEffectsEnabled) {
            return; // 如果音效开关关闭，则不播放音效
        }

        if (sound instanceof AudioClip) {
            this._audioSource.playOneShot(sound, volume);
        } else {
            let bundle = assetManager.getBundle(bundleName);
            bundle.load(sound, (err, clip: AudioClip) => {
                if (err) {
                    console.log(err);
                } else {
                    this._audioSource.playOneShot(clip, volume);
                }
            });
        }
    }

    /**
     * @en
     * Play long audio, such as the bg music
     * @zh
     * 播放长音频，比如 背景音乐
     * @param sound Clip or URL for the sound
     * @param volume 
     */
    play(sound: AudioClip | string, volume: number = 1.0, bundleName: string = 'resources') {
        if (!this._bgMusicEnabled) {
            return; // 如果背景音乐开关关闭，则不播放音乐
        }

        if (sound instanceof AudioClip) {
            this._audioSource.clip = sound;
            this._audioSource.play();
            this._audioSource.loop = true;
            this.audioSource.volume = volume;
        } else {
            if (this._audioSource.clip) {
                this._audioSource.stop();
                this._audioSource.clip = null;
            }

            let bundle = assetManager.getBundle(bundleName);
            bundle.load(sound, (err, clip: AudioClip) => {
                if (err) {
                    console.log(err);
                } else {
                    this._audioSource.clip = clip;
                    this._audioSource.play();
                    this._audioSource.loop = true;
                    this.audioSource.volume = volume;
                }
            });
        }
    }

    /**
     * Stop the audio play
     */
    stop() {
        this._audioSource.stop();
    }

    /**
     * Pause the audio play
     */
    pause() {
        this._audioSource.pause();
    }

    /**
     * Resume the audio play
     */
    resume() {
        if (this._bgMusicEnabled) {
            this._audioSource.play();
        }
    }

    /**
     * Enable or disable background music
     * 开启或关闭背景音乐
     * @param enabled 
     */
    toggleBgMusic(enabled: boolean) {
        this._bgMusicEnabled = enabled;
        if (enabled) {
            this.resume(); // 开启时恢复播放背景音乐
        } else {
            this.stop(); // 关闭时停止背景音乐
        }
    }

    /**
     * Enable or disable sound effects
     * 开启或关闭音效
     * @param enabled 
     */
    toggleSoundEffects(enabled: boolean) {
        this._soundEffectsEnabled = enabled;
    }
}
