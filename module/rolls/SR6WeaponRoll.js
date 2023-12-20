import { SR6Roll, SR6ItemRollData } from "./Rolls.js";
import { Enums, Rules } from "../config.js";
export class SR6WeaponRollData extends SR6ItemRollData {
    firemode = Enums.FireMode.SS;
    distance = Enums.Distance.Near;
    damage = 0;
    attack_rating = 0;
    constructor(actor, item) {
        super(actor, item);
        this.pool = Rules.calcWeaponPool(this.actor, this.item);
        this.damage = Rules.calcWeaponDamage(this.actor, this.item);
        this.attack_rating = this.item.getAttackRating(this.distance);
    }
}
export class SR6WeaponRoll extends SR6Roll {
    static CHAT_TEMPLATE = "systems/sr6/templates/rolls/SR6WeaponRoll.html";
    get item() {
        return this.data.item;
    }
    get attacker() {
        return this.data.actor;
    }
    get template() {
        return SR6WeaponRoll.CHAT_TEMPLATE;
    }
    get damage() {
        return this.data.damage + this.hits;
    }
    static make(data) {
        return new SR6WeaponRoll(`(@pool)d6`, data);
    }
}
