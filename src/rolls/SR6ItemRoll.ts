import { SR6Roll, SR6RollData } from "./SR6Roll.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6CharacterActor } from "../actors/SR6CharacterActor.js";
import { SR6Item } from "../items/SR6Item.js";
import { Enums, Rules } from "../config.js";

export class SR6ItemRollData extends SR6RollData {
	item: SR6Item | null = null;

	constructor(actor: SR6Actor, item: SR6Item) {
		super(actor);
		
		this.item = item;
		
		this.pool = Rules.calcSkillPool(this.actor!, this.item!.skill_use!);
	}
}

export class SR6ItemRoll extends SR6Roll<SR6ItemRollData> {

	get item() : SR6Item | null {
		return this.data.item;
	}

	static make(data: SR6ItemRollData) : SR6ItemRoll {
		return new SR6ItemRoll(`(@pool)d6`, data);
	}
}
