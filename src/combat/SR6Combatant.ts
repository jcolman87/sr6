/**
 *
 * @author jaynus
 * @file
 */

import LifeformDataModel from '@/actor/data/LifeformDataModel';
import SR6Actor from '@/actor/SR6Actor';
import SR6Combat from '@/combat/SR6Combat';
import { ConditionActiveEffectData } from '@/condition/ConditionDataModel';
import { InitiativeType } from '@/data';
import IHasInitiative, { AvailableActions } from '@/data/IHasInitiative';
import { getInitiativeRoll } from '@/roll/Rollers';

export type CombatantFlagData = {
	initiativeType: InitiativeType;
	availableActions: AvailableActions;
	roundActions: AvailableActions;
};

export default class SR6Combatant extends Combatant<SR6Combat, SR6Actor> {
	get actorSystemData(): IHasInitiative {
		return this.actor.systemData as LifeformDataModel as IHasInitiative;
	}

	get systemData(): CombatantFlagData {
		return this.getFlag('sr6', 'CombatantFlagData') as CombatantFlagData;
	}

	constructor(data: PreCreate<foundry.data.CombatantSource>, context?: DocumentConstructionContext<Combatant>) {
		super(data, context);

		let availableActions = this.actorSystemData.getAvailableActions(InitiativeType.Physical);

		if (this.isOwner) {
			this._setSystemData({
				initiativeType: InitiativeType.Physical,
				availableActions: availableActions,
				roundActions: availableActions,
			});
		}
	}

	async _setSystemData(data: CombatantFlagData) {
		if (!this.isOwner && !game.user!.isGM) {
			ui.notifications.error('Cannot set combat data for unowned combatant');
		}

		await this.setFlag('sr6', 'CombatantFlagData', data);
	}

	async _resetActions() {
		const data = this.systemData;
		data.roundActions = data.availableActions;
		await this._setSystemData(data);
	}

	async _cycleConditions() {
		this.actor.effects.forEach((effect) => {
			if (effect.isTemporary && effect.duration.remaining != null && effect.duration.remaining <= 0) {
				let conditionData = effect.getFlag('sr6', 'ConditionActiveEffectData') as ConditionActiveEffectData;
				if (conditionData) {
					// it came from a condition, so delete the source condition too
					if (conditionData.sourceConditionId) {
						this.actor.items.delete(conditionData.sourceConditionId!);
					}
				}
				effect.delete();

				// if the sheet is up force a render
				if (this.actor.sheet.rendered) {
					this.actor.sheet.render(true);
				}
			}
		});
	}

	nextRound() {
		
	}

	beginTurn() {
		
		this._resetActions();
		this._cycleConditions();
	}

	endTurn() {
		
	}

	override _getInitiativeFormula(): string {
		
		let formula = this.actorSystemData.getInitiativeFormula(this.systemData.initiativeType);
		if (formula) {
			return formula!;
		} else {
			ui.notifications.error!(`This actor cannot do initiative of this type? ${this.systemData.initiativeType}`);
			throw 'ERR';
		}
	}

	override getInitiativeRoll(f: string): Roll {
		return getInitiativeRoll(this.actor, this._getInitiativeFormula());
	}
}
