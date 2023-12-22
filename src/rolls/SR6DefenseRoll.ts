import { SR6Roll, SR6RollData, SR6WeaponRoll } from "./Rolls.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6CharacterActor } from "../actors/SR6CharacterActor.js";
import { SR6Gear } from "../items/SR6Gear.js";
import { Enums, Rules, EffectChangeData } from "../config.js";
import { applyChangesetToObject } from "../util.js";
import { Data } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/dice/roll.js";

export class SR6DefenseRollData extends SR6RollData {
	attack_roll: SR6WeaponRoll;

	constructor(defender: SR6Actor, attack_roll: SR6WeaponRoll) {
		super(defender);
		this.attack_roll = attack_roll;
		this.pool = Rules.calcDefensePool(defender);
	}
}

export class SR6DefenseRoll extends SR6Roll<SR6DefenseRollData> {
	static CHAT_TEMPLATE: string = "systems/sr6/templates/rolls/SR6DefenseRoll.html";
	get template() {
		return SR6DefenseRoll.CHAT_TEMPLATE;
	}

	get defender(): SR6Actor | null {
		return this.actor;
	}

	get success(): boolean {
		return this.hits > this.data.attack_roll.hits;
	}

	get damage(): number {
		return this.data.attack_roll.damage - this.hits;
	}

	get attack_roll(): SR6WeaponRoll {
		return this.data.attack_roll;
	}

	static make(data: SR6DefenseRollData): SR6DefenseRoll {
		return new SR6DefenseRoll(`(@pool)d6`, data);
	}

	// NOTE: we need to do this to copy in teh actual class instance of the sub-roll caried here
	static fromData<T extends Roll>(this: ConstructorOf<T>, data: Data): T {
		const roll: Roll = super.fromData(data);

		(roll as any).data.attack_roll = SR6WeaponRoll.fromData((roll as any).data.attack_roll);

		return roll as T;
	}
}
