import { SR6Roll, SR6RollData, SR6SpellRoll } from "./Rolls.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6CharacterActor } from "../actors/SR6CharacterActor.js";
import { SR6Spell } from "../items/SR6Spell.js";
import { Enums, Rules, EffectChangeData } from "../config.js";
import { applyChangesetToObject } from "../util.js";
import { Data } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/dice/roll.js";

export class SR6SpellDefenseRollData extends SR6RollData {
	attack_roll: SR6SpellRoll;

	get spell() : SR6Spell {
		return this.attack_roll.spell!;
	}

	constructor(defender: SR6Actor, attack_roll: SR6SpellRoll) {
		super(defender);
		this.attack_roll = attack_roll;
		this.pool = Rules.Magic.calcSpellDefensePool(defender, this.spell);
	}
}

export class SR6SpellDefenseRoll extends SR6Roll<SR6SpellDefenseRollData> {
	static CHAT_TEMPLATE: string = "systems/sr6/templates/rolls/SR6SpellDefenseRoll.html";
	get template() {
		return SR6SpellDefenseRoll.CHAT_TEMPLATE;
	}

	get defender(): SR6Actor | null {
		return this.data.getActor();
	}

	get success(): boolean {
		return this.hits > this.data.attack_roll.hits;
	}

	get damage(): number {
		return this.data.attack_roll.damage - this.hits;
	}

	get spell() : SR6Spell {
		return this.data.spell!;
	}

	static make(data: SR6SpellDefenseRollData): SR6SpellDefenseRoll {
		return new SR6SpellDefenseRoll(`(@pool)d6`, data);
	}

	// NOTE: we need to do this to copy in teh actual class instance of the sub-roll caried here
	static fromData<T extends Roll>(this: ConstructorOf<T>, data: Data): T {
		const roll: Roll = super.fromData(data);

		(roll as any).data.attack_roll = SR6SpellDefenseRoll.fromData((roll as any).data.attack_roll);

		return roll as T;
	}
}
