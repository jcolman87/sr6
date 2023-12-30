import BaseDataModel from '@/data/BaseDataModel';

export default abstract class MatrixAttributesDataModel extends BaseDataModel {
	abstract attack: number;
	abstract sleaze: number;
	abstract dataProcessing: number;
	abstract firewall: number;

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			attack: new fields.NumberField({ initial: 0, min: 0, required: true, nullable: false }),
			sleaze: new fields.NumberField({ initial: 0, min: 0, required: true, nullable: false }),
			dataProcessing: new fields.NumberField({ initial: 0, min: 0, required: true, nullable: false }),
			firewall: new fields.NumberField({ initial: 0, min: 0, required: true, nullable: false }),
		};
	}
}
