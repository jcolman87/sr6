import { SR6RollDialog } from "./SR6RollDialog.js";
import { SR6SoakRoll, SR6SoakRollData, SR6DefenseRoll } from "../rolls/Rolls.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6Item } from "../items/SR6Item.js";
import * as Rules from "../rules.js";


export class SR6SoakRollDialog extends SR6RollDialog<SR6SoakRoll, SR6SoakRollData> {
	
	get template(): string {
		return "systems/sr6/templates/dialogs/SoakRollDialog.html";
	}

	prepareData() {
		super.prepareData();
	}

	activateListeners(html: JQuery): void {
		super.activateListeners(html);
	}

	constructor(actor: SR6Actor, defense_roll: SR6DefenseRoll, options: any = {}) {
		super(SR6SoakRoll.make, new SR6SoakRollData(actor, defense_roll), options);
	}
}

