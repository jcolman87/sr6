import { RollDialog } from "./RollDialog.js";
import { Enums } from "../config.js";
class RollWeaponDialog extends RollDialog {
    actor;
    weapon;
    constructor(actor, weapon) {
        super();
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
            template: "systems/sr6/templates/dialogs/RollWeaponDialog.html",
            tabs: []
        });
    }
    getBasePool() {
        return this.actor.calculateSkillPool(this.weapon.skill_use());
    }
    getRollData(html) {
        const distance = Enums.Distance[html.find("#distance").val()];
        const firemode = Enums.FireMode[html.find("#firemode").val()];
        let data = {
            type: Enums.RollType.WeaponAttack,
            actor: this.actor,
            weapon: this.weapon,
            distance: distance,
            firemode: firemode
        };
        return data;
    }
}
export async function showRollWeaponDialog(actor, weapon) {
    let dialog = new RollWeaponDialog(actor, weapon).render(true);
}
