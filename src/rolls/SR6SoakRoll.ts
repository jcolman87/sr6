import { SR6Roll, SR6RollData, SR6DefenseRoll, SR6WeaponRoll } from "./Rolls.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6CharacterActor } from "../actors/SR6CharacterActor.js";
import { SR6Gear } from "../items/SR6Gear.js";
import { Enums, Rules, EffectChangeData } from "../config.js";
import { applyChangesetToObject } from "../util.js";
import { Data } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/dice/roll.js";

export class SR6SoakRollData extends SR6RollData {
	defense_roll: SR6DefenseRoll;

	constructor(defender: SR6Actor, defense_roll: SR6DefenseRoll) {
		super(defender);
		this.defense_roll = defense_roll;
		this.pool = Rules.calcSoakPool(defender);
	}
}

export class SR6SoakRoll extends SR6Roll<SR6SoakRollData> {
	static CHAT_TEMPLATE: string = "systems/sr6/templates/rolls/SR6SoakRoll.html";
	get template() {
		return SR6SoakRoll.CHAT_TEMPLATE;
	}

	get damage(): number {
		console.log("damage", this.data.defense_roll.damage, this.hits);
		return this.data.defense_roll.damage - this.hits;
	}

	get item(): SR6Gear | null {
		return this.data.defense_roll.attack_roll.item;
	}

	get attacker(): SR6Actor | null {
		return this.data.defense_roll.attack_roll.attacker;
	}

	get defender(): SR6Actor | null {
		return this.data.getActor();
	}

	get defense_roll(): SR6DefenseRoll {
		return this.data.defense_roll;
	}

	get attack_roll(): SR6WeaponRoll {
		return this.data.defense_roll.attack_roll;
	}

	static make(data: SR6SoakRollData): SR6SoakRoll {
		return new SR6SoakRoll(`(@pool)d6`, data);
	}

	// NOTE: we need to do this to copy in teh actual class instance of the sub-roll caried here
	static fromData<T extends Roll>(this: ConstructorOf<T>, data: Data): T {
		const roll: Roll = super.fromData(data);

		(roll as any).data.defense_roll = SR6DefenseRoll.fromData((roll as any).data.defense_roll);

		return roll as T;
	}
}
