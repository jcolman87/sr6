import { SR6RollDialog } from "./SR6RollDialog.js";
import { SR6SpellDrainRoll, SR6SpellDrainRollData } from "../rolls/Rolls.js";
export class SR6SpellDrainRollDialog extends SR6RollDialog {
    get template() {
        return "systems/sr6/templates/dialogs/SR6SpellDrainRollDialog.html";
    }
    prepareData() {
        super.prepareData();
    }
    activateListeners(html) {
        super.activateListeners(html);
    }
    constructor(actor, attack_roll, options = {}) {
        super(SR6SpellDrainRoll.make, new SR6SpellDrainRollData(actor, attack_roll), options);
    }
}
