import { SR6RollDialog } from "./SR6RollDialog.js";
import { SR6WeaponRoll, SR6WeaponRollData } from "../rolls/Rolls.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6Gear } from "../items/SR6Gear.js";
import * as Rules from "../rules.js";

export class SR6WeaponRollDialog extends SR6RollDialog<SR6WeaponRoll, SR6WeaponRollData> {
	get template(): string {
		return "systems/sr6/templates/dialogs/WeaponRollDialog.html";
	}

	prepareData() {
		super.prepareData();
		// Reset originals
		this.roll.damage = this.original.damage;

		// Apply attack rating
		this.roll.getItem()!.getAttackRating(this.roll.distance);

		// Apply Firemode
		this.roll.applyChangeset(Rules.getFiremodeModifiers(this.roll.firemode));
	}

	activateListeners(html: JQuery): void {
		super.activateListeners(html);
	}

	constructor(actor: SR6Actor, item: SR6Gear, options: any = {}) {
		super(SR6WeaponRoll.make, new SR6WeaponRollData(actor, item), options);
	}
}
