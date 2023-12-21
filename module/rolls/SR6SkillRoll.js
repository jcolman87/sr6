import { SR6Roll, SR6RollData } from "./SR6Roll.js";
import * as Rules from "../rules.js";
export class SR6SkillRollData extends SR6RollData {
    skill;
    constructor(actor, skill) {
        super(actor);
        this.skill = skill;
        this.pool = Rules.calcSkillPool(actor, this.skill);
    }
}
export class SR6SkillRoll extends SR6Roll {
    static CHAT_TEMPLATE = "systems/sr6/templates/rolls/SR6SkillRoll.html";
    static make(data) {
        return new SR6SkillRoll("(@pool)d6", data);
    }
}
