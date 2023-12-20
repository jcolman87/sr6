import * as Rolls from "../rolls/Rolls.js";
export class SR6Item extends Item {
    solveFormula(formula) {
        return this.solveFormulaWithActor(this.actor, formula);
    }
    solveFormulaWithActor(actor, formula) {
        let roll = new Rolls.SR6ItemRoll(formula, { actor: this.actor, item: this });
        roll.evaluate({ async: false });
        return roll.total;
    }
    prepareData() {
        super.prepareData();
    }
}
