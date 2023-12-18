import { SR6Dialog } from "./SR6Dialog.js";
import { SR6Roll } from "../rolls/SR6Roll.js";
export class RollDialog extends SR6Dialog {
    pool_modifier;
    current_pool;
    base_pool;
    constructor() {
        super({}, {});
        this.pool_modifier = 0;
        this.current_pool = 0;
        this.base_pool = 0;
    }
    getBasePool() { return 0; }
    getCurrentPool() {
        return this.getBasePool() + this.pool_modifier;
    }
    getRollData(html) { }
    getData(options) {
        let data = super.getData(options);
        this.current_pool = this.getCurrentPool();
        this.base_pool = this.getBasePool();
        data.data = this;
        return data;
    }
    activateListeners(html) {
        super.activateListeners(html);
        html.find("#do-roll").click(this._onComplete.bind(this, html));
    }
    _onComplete(html, event) {
        this.current_pool = this.getCurrentPool();
        let roll = new SR6Roll(`${this.current_pool}d6`, this.getRollData(html));
        roll.evaluate({ async: false });
        roll.toMessage();
        this.close({});
    }
}
