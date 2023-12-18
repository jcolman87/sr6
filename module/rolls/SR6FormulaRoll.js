import { SR6Roll, SR6RollData } from "./SR6Roll.js";
export class SR6FormulaRollData extends SR6RollData {
    item = null;
    constructor(actor = null, item = null) {
        super(actor);
        this.item = item;
    }
}
export class SR6FormulaRoll extends SR6Roll {
}
