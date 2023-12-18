import { SR6Roll, SR6ItemRoll, SR6ItemRollData } from "./Rolls.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6CharacterActor } from "../actors/SR6CharacterActor.js";
import { SR6Item } from "../items/SR6Item.js";
import { Enums, Rules, EffectChangeData } from "../config.js";
import { applyChangesetToObject } from "../util.js";


export class SR6WeaponRollData extends SR6ItemRollData {
	firemode: Enums.FireMode = Enums.FireMode.SS;
	distance: Enums.Distance = Enums.Distance.Near;

	damage: number = 0;
	attack_rating: number = 0;

	constructor(actor: SR6Actor, item: SR6Item) {
		super(actor, item);
		this.pool = Rules.calcWeaponPool(this.actor!, this.item!);
		this.damage = Rules.calcWeaponDamage(this.actor!, this.item!);
		this.attack_rating = this.item!.getAttackRating(this.distance);
	}
}

export class SR6WeaponRoll extends SR6Roll<SR6WeaponRollData> {
	static CHAT_TEMPLATE: string = "systems/sr6/templates/rolls/SR6WeaponRoll.html";

	get item() : SR6Item | null {
		return this.data.item;
	}

	get attacker() : SR6Actor | null {
		return this.data.actor;
	}

	get template() { return SR6WeaponRoll.CHAT_TEMPLATE; }

	get damage() : number { 
		return this.data.damage + this.hits;
	}

	static make(data: SR6WeaponRollData) : SR6WeaponRoll {
		return new SR6WeaponRoll(`(@pool)d6`, data);
	}
}
