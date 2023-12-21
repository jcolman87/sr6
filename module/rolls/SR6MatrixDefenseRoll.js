import { SR6Roll, SR6RollData, SR6MatrixRoll } from "./Rolls.js";
import { Rules } from "../config.js";
export class SR6MatrixDefenseRollData extends SR6RollData {
    attack_roll;
    constructor(defender, attack_roll) {
        super(defender);
        this.attack_roll = attack_roll;
        console.log("SR6MatrixDefenseRoll::constructor", this);
        this.pool = Rules.calcMatrixDefensePool(defender, this.attack_roll.matrix_action);
    }
}
export class SR6MatrixDefenseRoll extends SR6Roll {
    static CHAT_TEMPLATE = "systems/sr6/templates/rolls/SR6MatrixDefenseRoll.html";
    get template() {
        return SR6MatrixDefenseRoll.CHAT_TEMPLATE;
    }
    get defender() {
        return this.data.getActor();
    }
    get attacker() {
        return this.data.attack_roll.actor;
    }
    get success() {
        return this.hits > this.data.attack_roll.hits;
    }
    get damage() {
        if (this.data.attack_roll.damage) {
            return this.data.attack_roll.damage;
        }
        else {
            return null;
        }
    }
    get attack_roll() {
        return this.data.attack_roll;
    }
    static make(data) {
        return new SR6MatrixDefenseRoll(`(@pool)d6`, data);
    }
    // NOTE: we need to do this to copy in teh actual class instance of the sub-roll caried here
    static fromData(data) {
        const roll = super.fromData(data);
        roll.data.attack_roll = SR6MatrixRoll.fromData(roll.data.attack_roll);
        return roll;
    }
}
