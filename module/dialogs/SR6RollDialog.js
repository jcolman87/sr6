import { SR6Dialog } from "./SR6Dialog.js";
import { SR6Roll } from "../rolls/SR6Roll.js";
export class SR6RollDialog extends SR6Dialog {
    maker;
    roll;
    original;
    pool_modifier = 0;
    action_text = "";
    header_text = "";
    get template() {
        return "systems/sr6/templates/dialogs/RollDialog.html";
    }
    simple(data, options = {}) {
        return new SR6RollDialog(SR6Roll.make, data, options);
    }
    constructor(maker, roll, header_text = "", action_text = "", options = {}) {
        super({}, options);
        this.maker = maker;
        this.roll = roll;
        this.header_text = header_text;
        this.action_text = action_text;
        this.original = Object.assign(Object.create(Object.getPrototypeOf(roll)), roll);
    }
    prepareData() {
        // Reset originals
        this.roll.pool = this.original.pool;
        if (this.original.pool > 0) {
            if (this.roll.pool + this.pool_modifier <= 0) {
                this.pool_modifier += 1 - (this.roll.pool + this.pool_modifier);
            }
        }
        // Apply modifier
        this.roll.pool += this.pool_modifier;
        // Fix-up edge
        this.roll.applyEdge();
    }
    getData(options) {
        let data = super.getData(options);
        this.prepareData();
        data.dialog = this;
        data.roll = this.roll;
        data.header_text = this.header_text;
        data.action_text = this.action_text;
        return data;
    }
    activateListeners(html) {
        super.activateListeners(html);
        html.find("#do-roll").focus();
        html.find("#do-roll").click(this._onComplete.bind(this, html));
        html.on("click", ".edge-select", async (event) => {
            event.preventDefault();
            let roll = $(event.currentTarget.parentElement);
            let tip = roll.find(".edge-select-collapsible");
            if (!tip.is(":visible")) {
                tip.slideDown(200);
            }
            else {
                tip.slideUp(200);
            }
        });
    }
    async _onComplete() {
        this.prepareData();
        let r = this.maker(this.roll);
        await r.evaluate();
        await r.finish();
        r.toMessage();
        this.close({});
    }
}
