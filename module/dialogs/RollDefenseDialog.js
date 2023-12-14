import { Enums } from "../config.js";
import { SR6Roll } from "../SR6Roll.js";
class RollDefenseDialog extends FormApplication {
    actor;
    attacker;
    weapon;
    threshold;
    constructor(actor, attacker, weapon, threshold) {
        super({}, {});
        this.actor = actor;
        this.attacker = attacker;
        this.weapon = weapon;
        this.threshold = threshold;
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
            template: "systems/sr6/templates/dialogs/RollDefenseDialog.html",
            tabs: []
        });
    }
    async _updateObject(event, formData) { }
    _onComplete(html, event) {
        const pool_modifier = parseInt(html.find("#pool-modifier").val());
        const data = {
            type: Enums.RollType.Defend,
            actor: this.actor,
            attacker: this.attacker,
            weapon: this.weapon,
            threshold: this.threshold,
            pool_modifier: pool_modifier
        };
        //let attack_formula = this.weapon.weapon()!.attack_formula;
        //console.log("RollDefense");
        const formula = `(@actor.system.attributes.reaction.pool + @actor.system.attributes.intuition.pool + ${pool_modifier})d6`;
        //console.log("formual = ", formula);
        //const formula: string = `(${attack_formula} + ${pool_modifier})d6`
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
export async function showRollDefenseDialog(actor, attacker, weapon, threshold) {
    let dialog = new RollDefenseDialog(actor, attacker, weapon, threshold).render(true);
}
