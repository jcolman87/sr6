import { SR6RollDialog } from "./SR6RollDialog.js";
import { SR6SpellDefenseRoll, SR6SpellDefenseRollData } from "../rolls/Rolls.js";
export class SR6SpellDefenseRollDialog extends SR6RollDialog {
    get template() {
        return "systems/sr6/templates/dialogs/SR6SpellDefenseRollDialog.html";
    }
    prepareData() {
        super.prepareData();
    }
    activateListeners(html) {
        super.activateListeners(html);
    }
    constructor(actor, attack_roll, options = {}) {
        super(SR6SpellDefenseRoll.make, new SR6SpellDefenseRollData(actor, attack_roll), options);
    }
}
