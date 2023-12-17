import { Data } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/dice/roll.js";
import { SR6Actor } from "./actors/SR6Actor.js";
import { SR6Item } from "./items/SR6Item.js";
import { Enums } from "./config.js";

export interface Die {
	value: number;
	classes: string;
}

export interface BaseRollData {
	actor: SR6Actor;
	type: Enums.RollType;
}

export interface DefenseRollData extends BaseRollData {
	attacker: SR6Actor;
	weapon: SR6Item;
	damage: number;
}

export interface WeaponRollData extends BaseRollData {
	weapon: SR6Item;
	distance: Enums.Distance;
	firemode: Enums.FireMode;

	damage: number;
	attack_rating: number;
}

export class SR6Roll extends Roll {
	static CHAT_TEMPLATE = "systems/sr6/templates/SR6Roll.html";
	static TOOLTIP_TEMPLATE = "systems/sr6/templates/SR6RollTooltip.html";

	data: any | undefined = undefined;

	toJSON() {
		//
		const json = super.toJSON();
		////
		(json as any).data = this.data;
		return json;
	}

	static fromData<T extends Roll>(this: ConstructorOf<T>, data: Data): T {
		const roll: Roll = super.fromData(data);

		(roll as any).data = (data as any).data;
		return roll as T;
	}

	constructor(formula: string, data?: any, options?: Roll["options"]) {
		super(formula, data, options);
		this.data = data;
	}

	_getRenderData(): any {
		let hits: number = 0;
		let ones: number = 0;
		let pool: number = 0;
		let dice: Die[] = [];

		let glitch: boolean = false;
		let critical_glitch: boolean = false;

		if(this.data.type != Enums.RollType.Initiative) {
			(this.terms[0] as any).results.forEach((roll: any) => {
				if (roll.active) {
					dice.push({
						value: roll.result,
						classes: "die_" + roll.result
					});
					pool += 1;
					if (roll.result >= 5) {
						hits += 1;
					} else if (roll.result == 0) {
						ones += 1;
					}
				}
			});

			glitch = ones > Math.round(pool / 2);
			critical_glitch = glitch && hits == 0;
		}

		return {
			user: (game as Game).user,
			formula: this.formula,
			data: this.data,
			roll: this,
			hits: hits,
			ones: ones,
			pool: pool,
			glitch: glitch,
			critical_glitch: critical_glitch,
			dice: dice
		};
	}

	async render(options?: any): Promise<string> {
		return renderTemplate(SR6Roll.CHAT_TEMPLATE, this._getRenderData());
	}
}
