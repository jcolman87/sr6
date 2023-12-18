import { SR6Dialog } from "./SR6Dialog.js";
export class SR6RollDialog extends SR6Dialog {
    maker;
    roll;
    original;
    pool_modifier = 0;
    get template() {
        return "systems/sr6/templates/dialogs/RollDialog.html";
    }
    constructor(maker, roll, options = {}) {
        super({}, options);
        this.maker = maker;
        this.roll = roll;
        this.original = Object.assign(Object.create(Object.getPrototypeOf(roll)), roll);
    }
    prepareData() {
        // Reset originals
        this.roll.pool = this.original.pool;
        if (this.roll.pool + this.pool_modifier <= 0) {
            this.pool_modifier += 1 - (this.roll.pool + this.pool_modifier);
        }
        // Apply modifier
        this.roll.pool += this.pool_modifier;
    }
    getData(options) {
        let data = super.getData(options);
        this.prepareData();
        data.dialog = this;
        data.roll = this.roll;
        return data;
    }
    activateListeners(html) {
        super.activateListeners(html);
        html.find("#do-roll").focus();
        html.find("#do-roll").click(this._onComplete.bind(this, html));
    }
    _onComplete() {
        this.prepareData();
        let r = this.maker(this.roll);
        r.evaluate({ async: false });
        r.toMessage();
        this.close({});
    }
}
