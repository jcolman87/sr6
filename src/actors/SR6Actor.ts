import { SR6Roll } from "../SR6Roll.js";
import { Enums } from "../config.js";
import { ActorTypes, BaseActorData } from "./Data.js";

export class SR6Actor extends Actor {
	get base_data(): BaseActorData {
		return  (this as any).system as BaseActorData;
	}

	constructor(a: any, b: any) {
		super(a, b);
		console.log("SR6Actor::constructor");
	}

	solveFormula(formula: string): number {
		let roll = new SR6Roll(formula, { actor: this });
		roll.evaluate({ async: false });

		return roll.total!;
	}

	rollFormula(formula: string, type: Enums.RollType) {
		let pool = this.solveFormula(formula);
		let roll = new SR6Roll(pool + "d6", { actor: this, type: type });

		roll.evaluate({ async: false });

		roll.toMessage(roll, {});
	}

	prepareAttribute(attr: ActorTypes.Attribute) {
		let formulaSolution: number = 0;
		if (attr.formula) {
			formulaSolution = this.solveFormula(attr.formula);
		}
		attr.pool = attr.base + attr.modifier + attr.augment + formulaSolution;
	}

	prepareMonitor(attr: ActorTypes.Attribute) {
		let formulaSolution: number = 0;
		if (attr.formula) {
			formulaSolution = Math.ceil(this.solveFormula(attr.formula));
		}

		attr.base = attr.modifier + attr.augment + formulaSolution;
	}

}