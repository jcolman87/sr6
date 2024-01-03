import MonitorsDataModel from '@/actor/data/MonitorsDataModel';
import ConditionDataModel, { ConditionSituation } from '@/condition/ConditionDataModel';
import BaseDataModel from '@/data/BaseDataModel';
import IHasPools from '@/data/IHasPools';
import SR6Item from '@/item/SR6Item';
import { RollType } from '@/roll';

export default abstract class BaseActorDataModel extends BaseDataModel implements IHasPools {
	abstract monitors: MonitorsDataModel;

	get conditions(): ConditionDataModel[] {
		return this.actor!.items.filter((i) => i.type === 'condition').map((i) => (i as SR6Item<ConditionDataModel>).systemData);
	}

	get woundModifier(): number {
		return this.monitors.woundModifier;
	}

	getPool(type: RollType): number {
		let pool = 0;

		this.getRollConditions(type).forEach((condition) => {
			pool += condition.getPoolModifier(type);
		});

		return pool;
	}

	getRollConditions(type: RollType): ConditionDataModel[] {
		return this.getSituationalConditions(ConditionSituation.Roll).filter((condition) => condition.getModifiersForRoll(type).length > 0);
	}

	getSituationalConditions(situation: ConditionSituation): ConditionDataModel[] {
		return this.conditions.filter((condition) => {
			return condition.activationSituation === ConditionSituation.Always || condition.activationSituation === situation;
		});
	}

	override prepareData(): void {
		super.prepareData();
	}

	override prepareDerivedData(): void {
		super.prepareDerivedData();
	}

	override getRollData(): Record<string, unknown> {
		return super.getRollData();
	}

	static defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;
		return {
			monitors: new fields.EmbeddedDataField(MonitorsDataModel, { required: true, nullable: false }),
		};
	}
}
