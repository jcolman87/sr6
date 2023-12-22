import { SR6Roll, SR6RollData } from "./SR6Roll.js";
import * as Rules from "../rules.js";
export class SR6AttributeRollData extends SR6RollData {
    attribute;
    constructor(actor, attribute) {
        super(actor);
        this.attribute = attribute;
        this.pool = Rules.calcAttributePool(actor, this.attribute);
    }
}
export class SR6AttributeRoll extends SR6Roll {
    static CHAT_TEMPLATE = "systems/sr6/templates/rolls/SR6AttributeRoll.html";
    static make(data) {
        return new SR6AttributeRoll("(@pool)d6", data);
    }
}
