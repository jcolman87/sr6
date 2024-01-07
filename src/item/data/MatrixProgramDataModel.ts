import BaseItemDataModel from '@/item/data/BaseItemDataModel';

export enum MatrixProgramType {
	Basic = 'basic',
	Hacking = 'hacking',
}
export default abstract class MatrixProgramDataModel extends BaseItemDataModel {
	abstract type: MatrixProgramType;

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;
		return {
			...super.defineSchema(),
			type: new fields.StringField({
				initial: MatrixProgramType.Basic,
				required: true,
				nullable: false,
				blank: false,
				choices: Object.values(MatrixProgramType),
			}),
		};
	}
}
