/**
 *
 * @author jaynus
 * @file ActiveEffects Customizations
 */
import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import SR6Actor from '@/actor/SR6Actor';
import ConditionDataModel, { ConditionActiveEffectData } from '@/condition/ConditionDataModel';
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

	get isCondition(): boolean {
		return this.parent instanceof SR6Item<ConditionDataModel>;
	}

	get condition(): ConditionDataModel | null {
		if (this.isCondition) {
			return (this.parent as SR6Item<ConditionDataModel>).systemData;
		}
		return null;
	}

	async getConditionData(): Promise<ConditionActiveEffectData | null> {
		const data = this.getFlag('sr6', 'ConditionActiveEffectData');
		return data ? (data as ConditionActiveEffectData) : null;
	}

	async setConditionData(data: ConditionActiveEffectData | null): Promise<void> {
		await this.setFlag('sr6', 'ConditionActiveEffectData', data);
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
