import { SR6Roll, SR6RollData } from "./SR6Roll.js";
import { Rules } from "../config.js";
export class SR6ItemRollData extends SR6RollData {
    item = null;
    constructor(actor, item) {
        super(actor);
        this.item = item;
        this.pool = Rules.calcSkillPool(this.actor, this.item.skill_use);
    }
}
export class SR6ItemRoll extends SR6Roll {
    get item() {
        return this.data.item;
    }
    static make(data) {
        return new SR6ItemRoll(`(@pool)d6`, data);
    }
}
