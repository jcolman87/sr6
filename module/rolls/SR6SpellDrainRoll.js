import { SR6Roll, SR6RollData, SR6SpellRoll } from "./Rolls.js";
import { Rules } from "../config.js";
export class SR6SpellDrainRollData extends SR6RollData {
    attack_roll;
    constructor(defender, attack_roll) {
        super(defender);
        this.attack_roll = attack_roll;
        this.pool = Rules.Magic.calcSpellDrainPool(defender, this.attack_roll.spell);
    }
}
export class SR6SpellDrainRoll extends SR6Roll {
    static CHAT_TEMPLATE = "systems/sr6/templates/rolls/SR6SpellDrainRoll.html";
    get template() {
        return SR6SpellDrainRoll.CHAT_TEMPLATE;
    }
    get success() {
        return this.hits >= this.spell.system.drain;
    }
    get drain() {
        return this.spell.system.drain - this.hits;
    }
    get spell() {
        return this.data.attack_roll.spell;
    }
    static make(data) {
        return new SR6SpellDrainRoll(`(@pool)d6`, data);
    }
    // NOTE: we need to do this to copy in teh actual class instance of the sub-roll caried here
    static fromData(data) {
        const roll = super.fromData(data);
        roll.data.attack_roll = SR6SpellRoll.fromData(roll.data.attack_roll);
        return roll;
    }
}
