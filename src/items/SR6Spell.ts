import { Enums } from "../config.js";
import { SR6Item } from "./SR6Item.js";
import { Spell } from "./Data.js";

export class SR6Spell extends SR6Item {
	get drain(): number {
		return this.getData().drain;
	}

	get damage(): null | {
			combat: Enums.SpellCombatType;
			type: Enums.DamageType;
			form: Enums.DamageForm;
	} {
		return this.getData().damage;
	}
	get range() : {
			type: Enums.SpellRangeType;
			value: number;
	} {
		return this.getData().range;
	}
	get duration(): {
			type: Enums.SpellDurationType;
			value: number;
	} {
		return this.getData().duration;
	}

	getData(): Spell.Spell {
		let data: Spell.Spell = (this as any).system;
		return data;
	}
}