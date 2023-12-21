import { SR6Roll, SR6RollData } from "./SR6Roll.js";
import { SR6CharacterActor } from "../actors/SR6CharacterActor.js";
import { Enums, SkillUse } from "../config.js";
import * as Rules from "../rules.js";

export class SR6SkillRollData extends SR6RollData {
	skill: SkillUse;

	constructor(actor: SR6CharacterActor, skill: SkillUse) {
		super(actor);

		this.skill = skill;

		this.pool = Rules.calcSkillPool(actor, this.skill);
	}
}

export class SR6SkillRoll extends SR6Roll<SR6SkillRollData> {
	static CHAT_TEMPLATE: string = "systems/sr6/templates/rolls/SR6SkillRoll.html";

	static make(data: SR6SkillRollData): SR6SkillRoll {
		return new SR6SkillRoll("(@pool)d6", data);
	}
}
