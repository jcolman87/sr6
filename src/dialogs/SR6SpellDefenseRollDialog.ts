import { SR6RollDialog } from "./SR6RollDialog.js";
import { SR6SpellRoll, SR6SpellDefenseRoll, SR6SpellDefenseRollData } from "../rolls/Rolls.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6Gear } from "../items/SR6Gear.js";
import * as Rules from "../rules.js";

export class SR6SpellDefenseRollDialog extends SR6RollDialog<SR6SpellDefenseRoll, SR6SpellDefenseRollData> {
	get template(): string {
		return "systems/sr6/templates/dialogs/SR6SpellDefenseRollDialog.html";
	}

	prepareData() {
		super.prepareData();
	}

	activateListeners(html: JQuery): void {
		super.activateListeners(html);
	}

	constructor(actor: SR6Actor, attack_roll: SR6SpellRoll, options: any = {}) {
		super(SR6SpellDefenseRoll.make, new SR6SpellDefenseRollData(actor, attack_roll), options);
	}
}
