import { SR6Roll, SR6ItemRoll, SR6ItemRollData } from "./Rolls.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6CharacterActor } from "../actors/SR6CharacterActor.js";
import { SR6Gear } from "../items/SR6Gear.js";
import { Enums, Rules, EffectChangeData } from "../config.js";
import { applyChangesetToObject } from "../util.js";

export class SR6WeaponRollData extends SR6ItemRollData {
	firemode: Enums.FireMode = Enums.FireMode.SS;
	distance: Enums.Distance = Enums.Distance.Near;

	damage: number = 0;
	attack_rating: number = 0;

	constructor(actor: SR6Actor, item: SR6Gear) {
		super(actor, item);

		this.pool = Rules.calcWeaponPool(actor, item);
		this.damage = Rules.calcWeaponDamage(actor, item);
		this.attack_rating = item.getAttackRating(this.distance);
	}
}

export class SR6WeaponRoll extends SR6Roll<SR6WeaponRollData> {
	static CHAT_TEMPLATE: string = "systems/sr6/templates/rolls/SR6WeaponRoll.html";

	get template() {
		return SR6WeaponRoll.CHAT_TEMPLATE;
	}
	
	get item(): SR6Gear | null {
		let item = this.actor!.items.get(this.data.item_id!);
		return (item == undefined) ? null : item as SR6Gear;
	}

	get attacker(): SR6Actor | null {
		return this.actor;
	}

	get damage(): number {
		return this.data.damage + this.hits;
	}

	static make(data: SR6WeaponRollData): SR6WeaponRoll {
		return new SR6WeaponRoll(`(@pool)d6`, data);
	}
}
