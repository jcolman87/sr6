import { SR6Roll, SR6RollData } from "../rolls/Rolls.js";
import { ActorTypes } from "./Data.js";
export class SR6Actor extends Actor {
    get base_data() {
        return this.system;
    }
    getData() {
        //if(this.isCharacter) { TODO
        let data = this.system;
        return data;
        //}
    }
    constructor(a, b) {
        super(a, b);
        console.log("SR6Actor::constructor");
    }
    solveFormula(formula) {
        let roll = new SR6Roll(formula, new SR6RollData(this));
        roll.evaluate({ async: false });
        return roll.total;
    }
    getSkill(ty) {
        return new ActorTypes.Skill();
    }
    getAttribute(ty) {
        return new ActorTypes.Attribute();
    }
    applyDamage(value, type) { ui.notifications.error("applyDamage not implemented on this actor type"); }
    healDamage(value, type) { ui.notifications.error("healDamage not implemented on this actor type"); }
    get wound_modifier() {
        return 0;
    }
}
