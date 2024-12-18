import { tween, Tween, UIOpacity, UITransform, Vec3 } from "cc";
import { UIController } from "../UIController";
import { UIMgr } from "../UIMgr";
import { Layout_UITips } from "./Layout_UITips";

export class UITipsOptions {
    private _content?: string;

    setTitle(content: string): UITipsOptions {
        this._content = content;
        return this;
    }

}

export class UITips extends UIController {
    private _curOpacity: UIOpacity | null = null;
    private _curPositon = new Vec3;
    private _transform: UITransform = null!;
    private _options: UITipsOptions;
    private _time: number = 1;

    public static show(content: string): UITipsOptions {
        let opts = new UITipsOptions() as any;
        opts._content = content;
        UIMgr.inst.showUI(UITips, (alert: UITips) => {
            alert.init(opts);
        }) as UITips;
        return opts;
    }

    private init(opts: UITipsOptions) {
        this._options = opts;
        let options = this._options as any as { _content: string };
        let layout = this.layout as Layout_UITips;
        if (options.hasOwnProperty('_content')) {
            layout.content.string = options._content || '';
        }
    }

    protected onCreated(): void {
        this._curOpacity = this.node.getComponent(UIOpacity);
        this._transform = this.node.getComponent(UITransform) as UITransform;
        this.fadeIn();
        this.runTimeOut(this._time);
    }

    private runTimeOut(time: number) {
        let self = this;
        tween(this.node).delay(time).call(() => {
            self.fadeOut();
        }).start();
    }

    public fadeIn() {
        if (!this._curOpacity) return;
        Tween.stopAllByTarget(this._curOpacity);
        this._curOpacity.opacity = 0;
        tween(this._curOpacity)
            .to(0.5, { opacity: 255 })
            .start();
        // this.moveTo(0, this.node.position.y + this._transform.height * 2);
        this.node.setPosition(0, this.node.position.y + this._transform.height * 4);
    }

    public fadeOut() {
        if (!this._curOpacity) return;
        Tween.stopAllByTarget(this._curOpacity);
        tween(this._curOpacity)
            .to(2, { opacity: 0 })
            .call(() => {
                this.stopAllActions();
                this.node?.removeFromParent();
            })
            .start();
        // this.moveTo(0, this.node.position.y + this._transform.height * 2);
    }

    public moveTo(x: number, y: number) {
        Tween.stopAllByTarget(this._curPositon);
        this._curPositon.set(this.node.position);
        tween(this._curPositon).to(0.5, { x: x, y: y }, {
            onUpdate: (target) => {
                this.node?.setPosition(target as Vec3);
            }, easing: "expoOut"
        }).start();
    }

    public stopAllActions(): void {
        Tween.stopAllByTarget(this.node);
        Tween.stopAllByTarget(this._curPositon);
        if (this._curOpacity) {
            Tween.stopAllByTarget(this._curOpacity);
        }
    }
}