import { SR6RollDialog } from "./SR6RollDialog.js";
import { SR6SpellRoll, SR6SpellRollData } from "../rolls/Rolls.js";
export class SR6SpellRollDialog extends SR6RollDialog {
    get template() {
        return "systems/sr6/templates/dialogs/SpellRollDialog.html";
    }
    constructor(actor, spell, options = {}) {
        super(SR6SpellRoll.make, new SR6SpellRollData(actor, spell), options);
    }
}
