import { SR6Roll, SR6RollData } from "./SR6Roll.js";
import * as Rules from "../rules.js";
export class SR6SpellRollData extends SR6RollData {
    skill;
    constructor(actor, skill) {
        super(actor);
        this.skill = skill;
        this.pool = Rules.calcSkillPool(this.actor, this.skill);
    }
}
export class SR6SpellRoll extends SR6Roll {
    static CHAT_TEMPLATE = "systems/sr6/templates/rolls/SR6SpellRoll.html";
    static make(data) {
        return new SR6SpellRoll("(@pool)d6", data);
    }
}
