import { SR6RollDialog } from "./SR6RollDialog.js";
import { SR6SoakRoll, SR6SoakRollData } from "../rolls/Rolls.js";
export class SR6SoakRollDialog extends SR6RollDialog {
    get template() {
        return "systems/sr6/templates/dialogs/SoakRollDialog.html";
    }
    prepareData() {
        super.prepareData();
    }
    activateListeners(html) {
        super.activateListeners(html);
    }
    constructor(actor, defense_roll, options = {}) {
        super(SR6SoakRoll.make, new SR6SoakRollData(actor, defense_roll), options);
    }
}
