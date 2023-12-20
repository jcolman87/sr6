import { SR6Roll, SR6RollData } from "./SR6Roll.js";
import { SR6CharacterActor } from "../actors/SR6CharacterActor.js";
import { Enums, SkillUse } from "../config.js";
import * as Rules from "../rules.js";

export class SR6SpellRollData extends SR6RollData {
	skill: SkillUse;

	constructor(actor: SR6CharacterActor, skill: SkillUse) {
		super(actor);

		this.skill = skill;

		this.pool = Rules.calcSkillPool(this.actor!, this.skill);
	}
}

export class SR6SpellRoll extends SR6Roll<SR6SpellRollData> {
	static CHAT_TEMPLATE: string = "systems/sr6/templates/rolls/SR6SpellRoll.html";

	static make(data: SR6SpellRollData): SR6SpellRoll {
		return new SR6SpellRoll("(@pool)d6", data);
	}
}
