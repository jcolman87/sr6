import { SR6Roll, SR6RollData } from "./SR6Roll.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6CharacterActor } from "../actors/SR6CharacterActor.js";
import { SR6Gear } from "../items/SR6Gear.js";
import { Enums, Rules } from "../config.js";

export class SR6ItemRollData extends SR6RollData {
	item_id: string | null = null;

	getItem(): SR6Gear | null {
		let item = this.getActor()!.items.get(this.item_id!);
		return (item == undefined) ? null : item as SR6Gear;
	}

	constructor(actor: SR6Actor, item: SR6Gear) {
		super(actor);

		this.item_id = item.id;

		this.pool = Rules.calcSkillPool(actor, item.skill_use!);
	}
}

export class SR6ItemRoll extends SR6Roll<SR6ItemRollData> {
	get item(): SR6Gear | null {
		return this.data.getItem();
	}

	static make(data: SR6ItemRollData): SR6ItemRoll {
		return new SR6ItemRoll(`(@pool)d6`, data);
	}
}
