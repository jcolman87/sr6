import { Enums } from "../config.js";
import { SR6InitiativeRoll } from "../rolls/SR6InitiativeRoll.js";
export class SR6Combatant extends Combatant {
    constructor(data, context) {
        super(data, context);
        //
        if (this.isOwner) {
            this.setFlag("sr6", "actions", this.actor.actions);
            this.setFlag("sr6", "initiative_type", Enums.Initiative.Physical);
        }
    }
    get actions() {
        return this.getFlag("sr6", "actions");
    }
    get initiative_type() {
        return this.getFlag("sr6", "initiative_type");
    }
    get actor_data() {
        return this.actor.base_data;
    }
    _getInitiativeFormula() {
        console.log("SR6Combatant::_getInitiativeFormula", this.actor_data);
        switch (this.initiative_type) {
            case Enums.Initiative.Physical: {
                if (this.actor_data.initiatives.physical_formula == undefined) {
                    ui.notifications.error(`Actor'${this.actor.name}'[${this.actor.id}] does not have Physical initiative`);
                }
                else {
                    return this.actor_data.initiatives.physical_formula;
                }
            }
            case Enums.Initiative.Astral:
                if (this.actor_data.initiatives.astral_formula == undefined) {
                    ui.notifications.error(`Actor'${this.actor.name}'[${this.actor.id}] does not have Astral initiative`);
                }
                else {
                    return this.actor_data.initiatives.astral_formula;
                }
            case Enums.Initiative.Matrix:
                if (this.actor_data.initiatives.matrix_formula == undefined) {
                    ui.notifications.error(`Actor'${this.actor.name}'[${this.actor.id}] does not have Matrix initiative`);
                }
                else {
                    return this.actor_data.initiatives.matrix_formula;
                }
            default:
                return super._getInitiativeFormula();
        }
    }
    rollInitiative(formula) {
        return super.rollInitiative(formula);
    }
    getInitiativeRoll(f) {
        return new SR6InitiativeRoll(this._getInitiativeFormula(), { actor: this.actor });
    }
}
