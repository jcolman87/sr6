import { SR6Roll } from "../SR6Roll.js";
export class SR6Actor extends Actor {
    get base_data() {
        return this.system;
    }
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
        roll.toMessage(roll, {});
    }
    prepareAttribute(attr) {
        let formulaSolution = 0;
        if (attr.formula) {
            formulaSolution = this.solveFormula(attr.formula);
        }
        attr.pool = attr.base + attr.modifier + attr.augment + formulaSolution;
    }
    prepareMonitor(attr) {
        let formulaSolution = 0;
        if (attr.formula) {
            formulaSolution = Math.ceil(this.solveFormula(attr.formula));
        }
        attr.base = attr.modifier + attr.augment + formulaSolution;
    }
}
