import BaseDataModel from '@/data/BaseDataModel';
import { AvailableActions } from '@/data/interfaces';

export default abstract class InitiativeDataModel extends BaseDataModel {
	abstract dice: number;
	abstract formula: string;

	abstract actions: {
		majorFormula: string;
		minorFormula: string;
	};

	get availableActions(): AvailableActions {
		return {
			major: this.solveFormula(this.actions.majorFormula),
			minor: this.solveFormula(this.actions.minorFormula),
		};
	}

	static defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			dice: new fields.NumberField({ initial: 1, required: true, nullable: false, integer: true, min: 1 }),
			formula: new fields.StringField({
				initial: '(@reaction + @intuition) + (@initiatives.physical.dice)d6',
				required: true,
				nullable: false,
				blank: false,
			}),
			actions: new fields.SchemaField(
				{
					majorFormula: new fields.StringField({
						initial: '1',
						required: true,
						nullable: false,
						blank: false,
					}),
					minorFormula: new fields.StringField({
						initial: '1 + @initiatives.physical.dice',
						required: true,
						nullable: false,
						blank: false,
					}),
				},
				{ required: true, nullable: false },
			),
		};
	}
}
