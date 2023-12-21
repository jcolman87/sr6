import { SR6Roll, SR6RollData } from "./SR6Roll.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6Spell } from "../items/SR6Spell.js";
import { Enums, SkillUse } from "../config.js";
import * as Rules from "../rules.js";

export class SR6SpellRollData extends SR6RollData {
	spell: SR6Spell;
	damage: number;
	autoroll_drain: boolean;

	// TODO: AMP UP
	constructor(actor: SR6Actor, spell: SR6Spell, autoroll_drain: boolean = true) {
		super(actor);

		this.spell = spell;
		this.autoroll_drain = autoroll_drain;
		this.pool = Rules.Magic.calcSpellAttackPool(actor, this.spell);
		this.damage = Rules.Magic.calcSpellStartingDamage(actor, this.spell);
	}
}

export class SR6SpellRoll extends SR6Roll<SR6SpellRollData> {
	static CHAT_TEMPLATE: string = "systems/sr6/templates/rolls/SR6SpellRoll.html";

	get template() {
		return SR6SpellRoll.CHAT_TEMPLATE;
	}

	get spell(): SR6Spell {
		return this.data.spell;
	}

	get attacker(): SR6Actor | null {
		return this.data.getActor();
	}

	get drain(): number {
		return this.data.spell.drain;
	}

	get damage(): number {
		return this.data.damage + this.hits;
	}

	static make(data: SR6SpellRollData): SR6SpellRoll {
		console.log("SR6SpellRoll", data);
		return new SR6SpellRoll("(@pool)d6", data);
	}

	async finish() {
		if(this.data.autoroll_drain) {
			
		}
	}
}
