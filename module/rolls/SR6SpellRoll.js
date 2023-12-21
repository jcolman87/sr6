import { SR6Roll, SR6RollData } from "./SR6Roll.js";
import * as Rules from "../rules.js";
export class SR6SpellRollData extends SR6RollData {
    spell;
    damage;
    autoroll_drain;
    // TODO: AMP UP
    constructor(actor, spell, autoroll_drain = true) {
        super(actor);
        this.spell = spell;
        this.autoroll_drain = autoroll_drain;
        this.pool = Rules.Magic.calcSpellAttackPool(actor, this.spell);
        this.damage = Rules.Magic.calcSpellStartingDamage(actor, this.spell);
    }
}
export class SR6SpellRoll extends SR6Roll {
    static CHAT_TEMPLATE = "systems/sr6/templates/rolls/SR6SpellRoll.html";
    get template() {
        return SR6SpellRoll.CHAT_TEMPLATE;
    }
    get spell() {
        return this.data.spell;
    }
    get attacker() {
        return this.data.getActor();
    }
    get drain() {
        return this.data.spell.drain;
    }
    get damage() {
        return this.data.damage + this.hits;
    }
    static make(data) {
        console.log("SR6SpellRoll", data);
        return new SR6SpellRoll("(@pool)d6", data);
    }
    async finish() {
        if (this.data.autoroll_drain) {
        }
    }
}
