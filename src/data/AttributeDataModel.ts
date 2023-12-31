import { EnumAttribute } from '@/actor/data';
import BaseDataModel from '@/data/BaseDataModel';

export default abstract class AttributeDataModel extends BaseDataModel {
	abstract base: number;
	abstract mod: number;
	abstract value: number;

	get pool(): number {
		return this.solveFormula(`${this.value}`);
	}

	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			base: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0 }),
			mod: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0 }),
			value: new fields.NumberField({ initial: 2, required: true, nullable: false, integer: true, min: 1 }),
		};
	}

	override prepareData() {
		this.value = this.base + this.mod;
	}
}
