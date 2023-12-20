import { SR6RollDialog } from "./SR6RollDialog.js";
import { SR6MatrixRoll, SR6MatrixRollData } from "../rolls/Rolls.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6Gear } from "../items/SR6Gear.js";
import { Enums, Rules } from "../config.js";

export class SR6MatrixRollDialog extends SR6RollDialog<SR6MatrixRoll, SR6MatrixRollData> {
	get template(): string {
		return "systems/sr6/templates/dialogs/MatrixRollDialog.html";
	}

	prepareData() {
		super.prepareData();
	}

	activateListeners(html: JQuery): void {
		super.activateListeners(html);
	}

	constructor(actor: SR6Actor, matrix_action: Enums.MatrixAction, options: any = {}) {
		super(SR6MatrixRoll.make, new SR6MatrixRollData(actor, matrix_action), options);
	}
}
