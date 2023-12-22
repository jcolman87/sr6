import { SR6Roll, SR6RollData, SR6DefenseRoll } from "./Rolls.js";
import { Rules } from "../config.js";
export class SR6SoakRollData extends SR6RollData {
    defense_roll;
    constructor(defender, defense_roll) {
        super(defender);
        this.defense_roll = defense_roll;
        this.pool = Rules.calcSoakPool(defender);
    }
}
export class SR6SoakRoll extends SR6Roll {
    static CHAT_TEMPLATE = "systems/sr6/templates/rolls/SR6SoakRoll.html";
    get template() {
        return SR6SoakRoll.CHAT_TEMPLATE;
    }
    get damage() {
        console.log("damage", this.data.defense_roll.damage, this.hits);
        return this.data.defense_roll.damage - this.hits;
    }
    get item() {
        return this.data.defense_roll.attack_roll.item;
    }
    get attacker() {
        return this.data.defense_roll.attack_roll.attacker;
    }
    get defender() {
        return this.actor;
    }
    get defense_roll() {
        return this.data.defense_roll;
    }
    get attack_roll() {
        return this.data.defense_roll.attack_roll;
    }
    static make(data) {
        return new SR6SoakRoll(`(@pool)d6`, data);
    }
    // NOTE: we need to do this to copy in teh actual class instance of the sub-roll caried here
    static fromData(data) {
        const roll = super.fromData(data);
        roll.data.defense_roll = SR6DefenseRoll.fromData(roll.data.defense_roll);
        return roll;
    }
}
