import { SR6Roll } from "../SR6Roll.js";
export class SR6Actor extends Actor {
    constructor(a, b) {
        super(a, b);
        console.log("SR6Actor::constructor");
    }
    solveFormula(formula) {
        let roll = new SR6Roll(formula, { actor: this });
        roll.evaluate({ async: false });
        return roll.total;
    }
    rollFormula(formula, type) {
        let pool = this.solveFormula(formula);
        let roll = new SR6Roll(pool + "d6", { actor: this, type: type });
        roll.evaluate({ async: false });
        roll.toMessage(roll, {
            rollMode: "gmroll"
        });
    }
}
