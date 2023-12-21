import { SR6Roll, SR6RollData, SR6SpellRoll } from "./Rolls.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6CharacterActor } from "../actors/SR6CharacterActor.js";
import { SR6Spell } from "../items/SR6Spell.js";
import { Enums, Rules, EffectChangeData } from "../config.js";
import { applyChangesetToObject } from "../util.js";
import { Data } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/dice/roll.js";

export class SR6SpellDrainRollData extends SR6RollData {
	attack_roll: SR6SpellRoll;

	constructor(defender: SR6Actor, attack_roll: SR6SpellRoll) {
		super(defender);
		this.attack_roll = attack_roll;
		this.pool = Rules.Magic.calcSpellDrainPool(defender, this.attack_roll.spell!);
	}
}

export class SR6SpellDrainRoll extends SR6Roll<SR6SpellDrainRollData> {
	static CHAT_TEMPLATE: string = "systems/sr6/templates/rolls/SR6SpellDrainRoll.html";
	get template() {
		return SR6SpellDrainRoll.CHAT_TEMPLATE;
	}

	get success(): boolean {
		return this.hits >= (this.spell as any).system.drain;
	}

	get drain(): number {
		return (this.spell as any).system.drain - this.hits;
	}

	get spell() : SR6Spell {
		return this.data.attack_roll.spell;
	}

	static make(data: SR6SpellDrainRollData): SR6SpellDrainRoll {
		return new SR6SpellDrainRoll(`(@pool)d6`, data);
	}

	// NOTE: we need to do this to copy in teh actual class instance of the sub-roll caried here
	static fromData<T extends Roll>(this: ConstructorOf<T>, data: Data): T {
		const roll: Roll = super.fromData(data);

		(roll as any).data.attack_roll = SR6SpellRoll.fromData((roll as any).data.attack_roll);

		return roll as T;
	}
}
