import { SR6RollDialog } from "./SR6RollDialog.js";
import { SR6SpellRoll, SR6SpellDrainRoll, SR6SpellDrainRollData } from "../rolls/Rolls.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6Gear } from "../items/SR6Gear.js";
import * as Rules from "../rules.js";

export class SR6SpellDrainRollDialog extends SR6RollDialog<SR6SpellDrainRoll, SR6SpellDrainRollData> {
	get template(): string {
		return "systems/sr6/templates/dialogs/SR6SpellDrainRollDialog.html";
	}

	prepareData() {
		super.prepareData();
	}

	activateListeners(html: JQuery): void {
		super.activateListeners(html);
	}

	constructor(actor: SR6Actor, attack_roll: SR6SpellRoll, options: any = {}) {
		super(SR6SpellDrainRoll.make, new SR6SpellDrainRollData(actor, attack_roll), options);
	}
}
