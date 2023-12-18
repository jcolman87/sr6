import { SR6Dialog } from "./SR6Dialog.js";
import { Enums } from "../config.js";
import { SR6Roll } from "../SR6Roll.js";
class ImportDialog extends SR6Dialog {
    actor;
    weapon;
    constructor(actor, weapon) {
        super({}, {});
        this.actor = actor;
        this.weapon = weapon;
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["sheet"],
            popOut: true,
            width: 400,
            height: 600,
            resizable: true,
            closeOnSubmit: false,
            submitOnClose: true,
            submitOnChange: true,
            template: "systems/sr6/templates/dialogs/WeaponRollDialog.html",
            tabs: []
        });
    }
    _onComplete(html, event) {
        const pool_modifier = parseInt(html.find("#pool-modifier").val());
        const distance = Enums.Distance[html.find("#distance").val()];
        const firemode = Enums.FireMode[html.find("#firemode").val()];
        //console.log("WeaponRollDialog::_onComplete", pool_modifier, Enums.Distance[distance] as string, Enums.FireMode[firemode] as string);
        const data = {
            type: Enums.RollType.WeaponAttack,
            actor: this.actor,
            weapon: this.weapon,
            distance: distance,
            firemode: firemode,
            pool_modifier: pool_modifier
        };
        let attack_formula = this.weapon.weapon().attack_formula;
        const formula = `(${attack_formula} + ${pool_modifier})d6`;
        let roll = new SR6Roll(formula, data);
        roll.evaluate({ async: false });
        roll.toMessage(roll, {});
        this.close({});
    }
    activateListeners(html) {
        super.activateListeners(html);
        html.find("#do-roll").click(this._onComplete.bind(this, html));
    }
    getData(options) {
        let data = super.getData(options);
        data.actor = this.actor;
        data.weapon = this.weapon;
        return data;
    }
    close(options) {
        return super.close();
    }
}
