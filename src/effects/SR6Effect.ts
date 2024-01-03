/**
 *
 * @author jaynus
 * @file ActiveEffects Customizations
 */
import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import SR6Actor from '@/actor/SR6Actor';
import ConditionDataModel from '@/condition/ConditionDataModel';
import SR6Item from '@/item/SR6Item';

export default class SR6Effect extends ActiveEffect {
	constructor(data: PreCreate<foundry.data.ActiveEffectSource>, context?: DocumentConstructionContext<ActiveEffect>) {
		super(data, context);
	}

	// Ghetto hack, determine if we are a condition by our name
	get isStatusEffectCondition(): boolean {
		const parent = this.parent as SR6Item<ConditionDataModel>;
		if (parent.systemData.statusEffectId) {
			return true;
		}

		return false;
	}

	override prepareDerivedData(): void {
		super.prepareDerivedData();
	}

	override get isSuppressed(): boolean {
		return this.disabled;
	}

	override apply(actor: Actor, change: ApplicableChangeData<this>): unknown {
		return super.apply(actor, change);
	}

	override _applyCustom(actor: Actor, change: ApplicableChangeData<this>): unknown {
		const baseActor = actor as SR6Actor<BaseActorDataModel>;

		return null;
	}
}
