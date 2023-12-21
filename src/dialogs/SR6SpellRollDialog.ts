import { SR6RollDialog } from "./SR6RollDialog.js";
import { SR6SpellRoll, SR6SpellRollData } from "../rolls/Rolls.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6Spell } from "../items/SR6Spell.js";
import { Enums, Rules } from "../config.js";

export class SR6SpellRollDialog extends SR6RollDialog<SR6SpellRoll, SR6SpellRollData> {

	get template(): string {
		return "systems/sr6/templates/dialogs/SpellRollDialog.html";
	}

	constructor(actor: SR6Actor, spell: SR6Spell, options: any = {}) {
		super(SR6SpellRoll.make, new SR6SpellRollData(actor, spell), options);
	}
}
