import { SR6RollDialog } from "./SR6RollDialog.js";
import { SR6MatrixRoll, SR6MatrixRollData } from "../rolls/Rolls.js";
export class SR6MatrixRollDialog extends SR6RollDialog {
    get template() {
        return "systems/sr6/templates/dialogs/MatrixRollDialog.html";
    }
    prepareData() {
        super.prepareData();
    }
    activateListeners(html) {
        super.activateListeners(html);
    }
    constructor(actor, matrix_action, options = {}) {
        super(SR6MatrixRoll.make, new SR6MatrixRollData(actor, matrix_action), options);
    }
}
