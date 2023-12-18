import { SR6RollDialog } from "./SR6RollDialog.js";
import { SR6DefenseRoll, SR6DefenseRollData } from "../rolls/Rolls.js";
export class SR6DefenseRollDialog extends SR6RollDialog {
    get template() {
        return "systems/sr6/templates/dialogs/DefenseRollDialog.html";
    }
    prepareData() {
        super.prepareData();
    }
    activateListeners(html) {
        super.activateListeners(html);
    }
    constructor(actor, attack_roll, options = {}) {
        super(SR6DefenseRoll.make, new SR6DefenseRollData(actor, attack_roll), options);
    }
}
