import { SR6Roll } from "../SR6Roll.js";
import { Enums } from "../config.js";

export class SR6Actor extends Actor {
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

		roll.toMessage(roll, {
			rollMode: "gmroll"
		});
	}
}