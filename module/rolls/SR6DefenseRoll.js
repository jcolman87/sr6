import { SR6Roll, SR6RollData, SR6WeaponRoll } from "./Rolls.js";
import { Rules } from "../config.js";
export class SR6DefenseRollData extends SR6RollData {
    attack_roll;
    constructor(defender, attack_roll) {
        super(defender);
        this.attack_roll = attack_roll;
        this.pool = Rules.calcDefensePool(defender);
    }
}
export class SR6DefenseRoll extends SR6Roll {
    static CHAT_TEMPLATE = "systems/sr6/templates/rolls/SR6DefenseRoll.html";
    get template() { return SR6DefenseRoll.CHAT_TEMPLATE; }
    get defender() {
        return this.data.actor;
    }
    get success() {
        return this.hits > this.data.attack_roll.hits;
    }
    get damage() {
        return this.data.attack_roll.damage - this.hits;
    }
    get attack_roll() {
        return this.data.attack_roll;
    }
    static make(data) {
        return new SR6DefenseRoll(`(@pool)d6`, data);
    }
    // NOTE: we need to do this to copy in teh actual class instance of the sub-roll caried here
    static fromData(data) {
        const roll = super.fromData(data);
        roll.data.attack_roll = SR6WeaponRoll.fromData(roll.data.attack_roll);
        return roll;
    }
}
