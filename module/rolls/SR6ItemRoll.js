import { SR6Roll, SR6RollData } from "./SR6Roll.js";
import { Rules } from "../config.js";
export class SR6ItemRollData extends SR6RollData {
    item = null;
    item_id = null;
    constructor(actor, item) {
        super(actor);
        this.item = item;
        this.item_id = item.id;
        this.pool = Rules.calcSkillPool(actor, item.skill_use);
    }
}
export class SR6ItemRoll extends SR6Roll {
    get item() {
        let item = this.actor.items.get(this.data.item_id);
        return (item == undefined) ? null : item;
    }
    static make(data) {
        return new SR6ItemRoll(`(@pool)d6`, data);
    }
    toMessage(messageData = {}) {
        this.data.item = null;
        let msg = super.toMessage(messageData);
        return msg;
    }
    toJSON() {
        const json = super.toJSON();
        json.data = this.data;
        json.data.item = null;
        return json;
    }
    // NOTE: we need to do this to copy in teh actual class instance of the sub-roll caried here
    static fromData(data) {
        const roll = super.fromData(data);
        roll.data.item = roll.item;
        return roll;
    }
}
