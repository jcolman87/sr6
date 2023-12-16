import { RollDialog } from "./RollDialog.js";
import { Enums } from "../config.js";
class RollDefenseDialog extends RollDialog {
    actor;
    attacker;
    weapon;
    threshold;
    constructor(actor, attacker, weapon, threshold) {
        super();
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
    getBasePool() {
        return this.actor.solveFormula(`@actor.system.attributes.reaction.pool + @actor.system.attributes.intuition.pool`);
    }
    getRollData(html) {
        const data = {
            type: Enums.RollType.Defend,
            actor: this.actor,
            attacker: this.attacker,
            weapon: this.weapon,
            threshold: this.threshold
        };
        return data;
    }
}
export async function showRollDefenseDialog(actor, attacker, weapon, threshold) {
    let dialog = new RollDefenseDialog(actor, attacker, weapon, threshold).render(true);
}
