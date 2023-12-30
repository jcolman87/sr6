import { EnumAttribute } from '@/actor/data/index';
import SR6Item from '@/item/SR6Item';
import BaseDataModel from '@/data/BaseDataModel';
import IHasPools from '@/data/IHasPools';
import ConditionDataModel, { ConditionEffectChangeData, ConditionSituation } from '@/condition/ConditionDataModel';
import { RollType } from '@/roll';

export default abstract class BaseActorDataModel extends BaseDataModel implements IHasPools {
	get conditions(): ConditionDataModel[] {
		return this.actor!.items.filter((i) => i.type == 'condition').map((i) => (i as SR6Item<ConditionDataModel>).systemData);
	}

	getPool(type: RollType): number {
		let pool = 0;

		this.getSituationalConditions(ConditionSituation.Roll).forEach((condition) => {
			pool += condition.getPoolModifier(type);
		});

		return pool;
	}

	getRollConditions(type: RollType): ConditionDataModel[] {
		return this.getSituationalConditions(ConditionSituation.Roll).filter((condition) => {
			return (
				condition.poolModifiers.find((modifier) => {
					return modifier.key == RollType[RollType.Any] || modifier.key == RollType[type];
				}) != undefined
			);
		});
	}

	getSituationalConditions(situation: ConditionSituation): ConditionDataModel[] {
		return this.conditions.filter((condition) => {
			return condition.situation == ConditionSituation.Any || condition.situation == situation;
		});
	}

	override prepareData() {
		super.prepareData();
	}

	override prepareDerivedData() {
		super.prepareDerivedData();
	}

	override getRollData(): Record<string, unknown> {
		return super.getRollData();
	}

	static defineSchema() {
		return {};
	}
}
