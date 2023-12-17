import { RollDialog } from "./RollDialog.js";
import { Enums } from "../config.js";
class RollWeaponDialog extends RollDialog {
    actor;
    weapon;
    distance;
    firemode;
    modifiers;
    get damage() {
        return this.weapon.damage + this.modifiers.damage + this.actor.getData().effect_modifiers.damage;
    }
    get attack_rating() {
        return this.weapon.getAttackRating(this.distance) + this.modifiers.attack_rating;
    }
    get base_attack_rating() {
        return this.weapon.getAttackRating(this.distance);
    }
    getCurrentPool() {
        return super.getCurrentPool() + this.actor.getData().effect_modifiers.attack_pool;
    }
    constructor(actor, weapon) {
        super();
        this.actor = actor;
        this.weapon = weapon;
        this.distance = Enums.Distance.Near;
        this.firemode = Enums.FireMode.SS;
        this.modifiers = {
            pool: 0,
            damage: 0,
            attack_rating: 0
        };
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["sheet"],
            popOut: true,
            width: 400,
            height: 600,
            resizable: true,
            closeOnSubmit: false,
            submitOnClose: true,
            submitOnChange: true,
            template: "systems/sr6/templates/dialogs/RollWeaponDialog.html",
            tabs: []
        });
    }
    activateListeners(html) {
        super.activateListeners(html);
        html.find("#firemode").change((event) => {
            console.log("firemode", event.currentTarget.value);
            switch (event.currentTarget.value) {
                case Enums.FireMode.SS: {
                    this.modifiers = {
                        pool: 0,
                        damage: 0,
                        attack_rating: 0
                    };
                    break;
                }
                case Enums.FireMode.SA: {
                    this.modifiers = {
                        pool: 0,
                        damage: 1,
                        attack_rating: -2
                    };
                    break;
                }
                case Enums.FireMode.BF: {
                    this.modifiers = {
                        pool: 0,
                        damage: 2,
                        attack_rating: -4
                    };
                    break;
                }
                case Enums.FireMode.FA: {
                    this.modifiers = {
                        pool: 0,
                        damage: 0,
                        attack_rating: -6
                    };
                    break;
                }
            }
        });
    }
    getBasePool() {
        return this.actor.calculateSkillPool(this.weapon.skill_use());
    }
    getRollData(html) {
        let data = {
            type: Enums.RollType.WeaponAttack,
            actor: this.actor,
            weapon: this.weapon,
            distance: this.distance,
            firemode: this.firemode,
            damage: this.damage,
            attack_rating: this.attack_rating,
        };
        return data;
    }
}
export async function showRollWeaponDialog(actor, weapon) {
    let dialog = new RollWeaponDialog(actor, weapon).render(true);
}
