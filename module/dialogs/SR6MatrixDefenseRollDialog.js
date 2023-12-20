import { SR6RollDialog } from "./SR6RollDialog.js";
import { SR6MatrixDefenseRoll, SR6MatrixDefenseRollData } from "../rolls/Rolls.js";
import { SR6CONFIG } from "../config.js";
export class SR6MatrixDefenseRollDialog extends SR6RollDialog {
    get template() {
        return "systems/sr6/templates/dialogs/MatrixDefenseRollDialog.html";
    }
    prepareData() {
        super.prepareData();
    }
    activateListeners(html) {
        super.activateListeners(html);
    }
    constructor(actor, attack_roll, options = {}) {
        super(SR6MatrixDefenseRoll.make, new SR6MatrixDefenseRollData(actor, attack_roll), options);
    }
    getData(options) {
        let data = super.getData(options);
        data.matrix_action = SR6CONFIG.matrix_actions.get(this.roll.attack_roll.matrix_action);
        return data;
    }
}
