import BaseDataModel from '@/data/BaseDataModel';

export default abstract class MonitorDataModel extends BaseDataModel {
	abstract damage: number;
	abstract max: number;
	abstract formula: string | null;

	get value(): number {
		return Math.max(0, this.max - this.damage);
	}

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			damage: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0 }),
			max: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0 }),
			formula: new fields.StringField({ initial: null, required: true, nullable: true, blank: false }),
		};
	}

	override prepareData() {
		if (this.formula) {
			this.max = this.solveFormula(this.formula);
		}
	}
}
