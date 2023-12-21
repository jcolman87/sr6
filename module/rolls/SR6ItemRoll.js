import { SR6Roll, SR6RollData } from "./SR6Roll.js";
import { Rules } from "../config.js";
export class SR6ItemRollData extends SR6RollData {
    item_id = null;
    getItem() {
        let item = this.getActor().items.get(this.item_id);
        return (item == undefined) ? null : item;
    }
    constructor(actor, item) {
        super(actor);
        this.item_id = item.id;
        this.pool = Rules.calcSkillPool(actor, item.skill_use);
    }
}
export class SR6ItemRoll extends SR6Roll {
    get item() {
        return this.data.getItem();
    }
    static make(data) {
        return new SR6ItemRoll(`(@pool)d6`, data);
    }
}
