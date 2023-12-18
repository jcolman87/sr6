import { Enums } from "../config.js";
import { BaseActorData } from "../actors/Data.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6InitiativeRoll } from "../rolls/SR6InitiativeRoll.js";

export class SR6Combatant extends Combatant {
	constructor(data: ConstructorParameters<typeof foundry.documents.BaseCombatant>[0], context: ConstructorParameters<typeof foundry.documents.BaseCombatant>[1]) {
		super(data, context);
		//
		if (this.isOwner) {
			this.setFlag("sr6", "Enums.Initiative", Enums.Initiative.Physical);
		}
	}

	get initiative_type(): Enums.Initiative {
		return this.getFlag("sr6", "Enums.Initiative") as Enums.Initiative;
	}

	get actor_data(): BaseActorData {
		return (this.actor as SR6Actor).base_data;
	}

	protected _getInitiativeFormula(): string {
		console.log("SR6Combatant::_getInitiativeFormula", this.actor_data);
		switch (this.initiative_type) {
			case Enums.Initiative.Physical: {
				if(this.actor_data.initiatives.physical_formula == undefined) {
					ui.notifications!.error(`Actor'${this.actor!.name}'[${this.actor!.id}] does not have Physical initiative`);
				} else {
					return this.actor_data.initiatives.physical_formula!;
				}
			}
			case Enums.Initiative.Astral:
				if(this.actor_data.initiatives.astral_formula == undefined) {
					ui.notifications!.error(`Actor'${this.actor!.name}'[${this.actor!.id}] does not have Astral initiative`);
				} else {
					return this.actor_data.initiatives.astral_formula!;
				}
			case Enums.Initiative.Matrix:
				if(this.actor_data.initiatives.matrix_formula == undefined) {
					ui.notifications!.error(`Actor'${this.actor!.name}'[${this.actor!.id}] does not have Matrix initiative`);
				} else {
					return this.actor_data.initiatives.matrix_formula!;
				}
			default:
				return super._getInitiativeFormula();
		}
	}

	rollInitiative(formula: string): Promise<this | undefined> {
		return super.rollInitiative(formula);
	}

	getInitiativeRoll(f?: string): Roll {
		let formula = this._getInitiativeFormula();
		console.log("SR6Combatant::getInitiativeRoll", formula);
		return new SR6InitiativeRoll(formula);
	}

}