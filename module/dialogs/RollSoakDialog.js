import { RollDialog } from "./RollDialog.js";
import { Enums } from "../config.js";
class RollSoakDialog extends RollDialog {
    actor;
    attacker;
    weapon;
    damage;
    constructor(actor, attacker, weapon, damage) {
        super();
        this.actor = actor;
        this.attacker = attacker;
        this.weapon = weapon;
        this.damage = damage;
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
            template: "systems/sr6/templates/dialogs/RollSoakDialog.html",
            tabs: []
        });
    }
    getBasePool() {
        return this.actor.solveFormula(`@actor.system.attributes.body.pool`);
    }
    getRollData(html) {
        const data = {
            type: Enums.RollType.SoakDamage,
            actor: this.actor,
            attacker: this.attacker,
            weapon: this.weapon,
            damage: this.damage
        };
        return data;
    }
}
export async function showRollSoakDialog(actor, attacker, weapon, damage) {
    let dialog = new RollSoakDialog(actor, attacker, weapon, damage).render(true);
}
