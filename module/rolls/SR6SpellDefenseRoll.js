import { SR6Roll, SR6RollData } from "./Rolls.js";
import { Rules } from "../config.js";
export class SR6SpellDefenseRollData extends SR6RollData {
    attack_roll;
    get spell() {
        return this.attack_roll.spell;
    }
    constructor(defender, attack_roll) {
        super(defender);
        this.attack_roll = attack_roll;
        this.pool = Rules.Magic.calcSpellDefensePool(defender, this.spell);
    }
}
export class SR6SpellDefenseRoll extends SR6Roll {
    static CHAT_TEMPLATE = "systems/sr6/templates/rolls/SR6SpellDefenseRoll.html";
    get template() {
        return SR6SpellDefenseRoll.CHAT_TEMPLATE;
    }
    get defender() {
        return this.actor;
    }
    get success() {
        return this.hits > this.data.attack_roll.hits;
    }
    get damage() {
        return this.data.attack_roll.damage - this.hits;
    }
    get spell() {
        return this.data.spell;
    }
    static make(data) {
        return new SR6SpellDefenseRoll(`(@pool)d6`, data);
    }
    // NOTE: we need to do this to copy in teh actual class instance of the sub-roll caried here
    static fromData(data) {
        const roll = super.fromData(data);
        roll.data.attack_roll = SR6SpellDefenseRoll.fromData(roll.data.attack_roll);
        return roll;
    }
}
