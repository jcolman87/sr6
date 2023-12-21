import { SR6Roll, SR6ItemRollData } from "./Rolls.js";
import { Enums, Rules } from "../config.js";
export class SR6WeaponRollData extends SR6ItemRollData {
    firemode = Enums.FireMode.SS;
    distance = Enums.Distance.Near;
    damage = 0;
    attack_rating = 0;
    constructor(actor, item) {
        super(actor, item);
        this.pool = Rules.calcWeaponPool(actor, item);
        this.damage = Rules.calcWeaponDamage(actor, item);
        this.attack_rating = item.getAttackRating(this.distance);
    }
}
export class SR6WeaponRoll extends SR6Roll {
    static CHAT_TEMPLATE = "systems/sr6/templates/rolls/SR6WeaponRoll.html";
    get template() {
        return SR6WeaponRoll.CHAT_TEMPLATE;
    }
    get item() {
        return this.data.getItem();
    }
    get attacker() {
        return this.data.getActor();
    }
    get damage() {
        return this.data.damage + this.hits;
    }
    static make(data) {
        return new SR6WeaponRoll(`(@pool)d6`, data);
    }
}
