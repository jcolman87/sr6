import { SR6Roll, SR6RollData, SR6MatrixRoll } from "./Rolls.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6CharacterActor } from "../actors/SR6CharacterActor.js";
import { SR6Gear } from "../items/SR6Gear.js";
import { Enums, Rules, EffectChangeData } from "../config.js";
import { applyChangesetToObject } from "../util.js";
import { Data } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/dice/roll.js";

export class SR6MatrixDefenseRollData extends SR6RollData {
	attack_roll: SR6MatrixRoll;

	constructor(defender: SR6Actor, attack_roll: SR6MatrixRoll) {
		super(defender);
		this.attack_roll = attack_roll;
		console.log("SR6MatrixDefenseRoll::constructor", this);
		this.pool = Rules.calcMatrixDefensePool(defender, this.attack_roll.matrix_action_id);
	}
}

export class SR6MatrixDefenseRoll extends SR6Roll<SR6MatrixDefenseRollData> {
	static CHAT_TEMPLATE: string = "systems/sr6/templates/rolls/SR6MatrixDefenseRoll.html";

	get template() {
		return SR6MatrixDefenseRoll.CHAT_TEMPLATE;
	}

	get defender(): SR6Actor | null {
		return this.actor;
	}

	get attacker(): SR6Actor | null {
		return this.data.attack_roll.actor;
	}

	get success(): boolean {
		return this.hits > this.data.attack_roll.hits;
	}

	get damage(): null | number {
		if(this.data.attack_roll.damage) {
			return this.data.attack_roll.damage;
		} else {
			return null;
		}
	}

	get matrix_action_id(): Enums.MatrixAction {
		return this.data.attack_roll.matrix_action_id;
	}

	get attack_roll(): SR6MatrixRoll {
		return this.data.attack_roll;
	}

	static make(data: SR6MatrixDefenseRollData): SR6MatrixDefenseRoll {
		return new SR6MatrixDefenseRoll(`(@pool)d6`, data);
	}

	// NOTE: we need to do this to copy in teh actual class instance of the sub-roll caried here
	static fromData<T extends Roll>(this: ConstructorOf<T>, data: Data): T {
		const roll: Roll = super.fromData(data);

		(roll as any).data.attack_roll = SR6MatrixRoll.fromData((roll as any).data.attack_roll);

		return roll as T;
	}
}
