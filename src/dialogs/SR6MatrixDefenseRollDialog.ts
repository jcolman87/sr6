import { SR6RollDialog } from "./SR6RollDialog.js";
import { SR6MatrixDefenseRoll, SR6MatrixDefenseRollData, SR6MatrixRoll } from "../rolls/Rolls.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6Gear } from "../items/SR6Gear.js";
import { Rules, SR6CONFIG } from "../config.js";

export class SR6MatrixDefenseRollDialog extends SR6RollDialog<SR6MatrixDefenseRoll, SR6MatrixDefenseRollData> {
	get template(): string {
		return "systems/sr6/templates/dialogs/MatrixDefenseRollDialog.html";
	}

	prepareData() {
		super.prepareData();
	}

	activateListeners(html: JQuery): void {
		super.activateListeners(html);
	}

	constructor(actor: SR6Actor, attack_roll: SR6MatrixRoll, options: any = {}) {
		super(SR6MatrixDefenseRoll.make, new SR6MatrixDefenseRollData(actor, attack_roll), options);
	}

	getData(options: any) {
		let data = super.getData(options);

		(data as any).matrix_action = SR6CONFIG.matrix_actions.get(this.roll.attack_roll.matrix_action)!;

		return data;
	}
}
