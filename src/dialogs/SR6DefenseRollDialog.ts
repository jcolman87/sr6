import { SR6RollDialog } from "./SR6RollDialog.js";
import { SR6DefenseRoll, SR6DefenseRollData, SR6WeaponRoll } from "../rolls/Rolls.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6Gear } from "../items/SR6Gear.js";
import * as Rules from "../rules.js";

export class SR6DefenseRollDialog extends SR6RollDialog<SR6DefenseRoll, SR6DefenseRollData> {
	get template(): string {
		return "systems/sr6/templates/dialogs/DefenseRollDialog.html";
	}

	prepareData() {
		super.prepareData();
	}

	activateListeners(html: JQuery): void {
		super.activateListeners(html);
	}

	constructor(actor: SR6Actor, attack_roll: SR6WeaponRoll, options: any = {}) {
		super(SR6DefenseRoll.make, new SR6DefenseRollData(actor, attack_roll), options);
	}
}
