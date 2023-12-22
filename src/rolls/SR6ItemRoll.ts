import { Data } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/dice/roll.js";
import { SR6Roll, SR6RollData } from "./SR6Roll.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6CharacterActor } from "../actors/SR6CharacterActor.js";
import { SR6Gear } from "../items/SR6Gear.js";
import { Enums, Rules } from "../config.js";

export class SR6ItemRollData extends SR6RollData {
	item: SR6Gear | null = null;
	item_id: string | null = null;

	constructor(actor: SR6Actor, item: SR6Gear) {
		super(actor);

		this.item = item;
		this.item_id = item.id;

		this.pool = Rules.calcSkillPool(actor, item.skill_use!);
	}
}

export class SR6ItemRoll extends SR6Roll<SR6ItemRollData> {
	get item(): SR6Gear | null {
		let item = this.actor!.items.get(this.data.item_id!);
		return (item == undefined) ? null : item as SR6Gear;
	}

	static make(data: SR6ItemRollData): SR6ItemRoll {
		return new SR6ItemRoll(`(@pool)d6`, data);
	}

	toMessage(messageData: any = {}): any {
		this.data.item = null;
		let msg = super.toMessage(messageData);
	
		return msg;
	}

	toJSON() {
		const json = super.toJSON();
		(json as any).data = this.data;
		(json as any).data.item = null;
		return json;
	}

	// NOTE: we need to do this to copy in teh actual class instance of the sub-roll caried here
	static fromData<T extends Roll>(this: ConstructorOf<T>, data: Data): T {
		const roll: Roll = super.fromData(data);
		(roll as SR6ItemRoll).data.item = (roll as SR6ItemRoll).item;
		return roll as T;
	}
}
