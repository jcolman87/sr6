import * as Rolls from "../rolls/Rolls.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { ItemFormula } from "./Data.js";

export class SR6Item extends Item {
	solveFormula(formula: ItemFormula): number {
		return this.solveFormulaWithActor(this.actor as SR6Actor, formula);
	}
	solveFormulaWithActor(actor: SR6Actor | undefined, formula: ItemFormula): number {
		let roll = new Rolls.SR6ItemRoll(formula as string, { actor: this.actor, item: this });
		roll.evaluate({ async: false });
		return roll.total!;
	}

	prepareData() {
		super.prepareData();
	}
}