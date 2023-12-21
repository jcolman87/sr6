import { SR6RollDialog } from "./SR6RollDialog.js";
import { SR6WeaponRoll, SR6WeaponRollData } from "../rolls/Rolls.js";
import * as Rules from "../rules.js";
export class SR6WeaponRollDialog extends SR6RollDialog {
    get template() {
        return "systems/sr6/templates/dialogs/WeaponRollDialog.html";
    }
    prepareData() {
        super.prepareData();
        // Reset originals
        this.roll.damage = this.original.damage;
        // Apply attack rating
        this.roll.getItem().getAttackRating(this.roll.distance);
        // Apply Firemode
        this.roll.applyChangeset(Rules.getFiremodeModifiers(this.roll.firemode));
    }
    activateListeners(html) {
        super.activateListeners(html);
    }
    constructor(actor, item, options = {}) {
        super(SR6WeaponRoll.make, new SR6WeaponRollData(actor, item), options);
    }
}
