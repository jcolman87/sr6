import { SR6Roll, SR6RollData } from "./SR6Roll.js";
import { SR6CONFIG } from "../config.js";
export class SR6MatrixRollData extends SR6RollData {
    matrix_action;
    damage = null;
    constructor(actor, matrix_action) {
        super(actor);
        let action = SR6CONFIG.matrix_actions.get(matrix_action);
        this.matrix_action = matrix_action;
        this.pool = actor.solveFormula(action.formula);
        if (action.damageFormula) {
            this.damage = actor.solveFormula(action.damageFormula);
        }
    }
}
export class SR6MatrixRoll extends SR6Roll {
    static CHAT_TEMPLATE = "systems/sr6/templates/rolls/SR6MatrixRoll.html";
    static make(data) {
        return new SR6MatrixRoll("(@pool)d6", data);
    }
    get damage() {
        if (this.data.damage != null) {
            return this.data.damage + this.hits;
        }
        else {
            return null;
        }
    }
    get matrix_action() {
        return SR6CONFIG.matrix_actions.get(this.matrix_action_id);
    }
    get matrix_action_id() {
        return this.data.matrix_action;
    }
}
