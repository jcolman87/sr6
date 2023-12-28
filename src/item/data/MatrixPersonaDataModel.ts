import { ConditionMonitorDataModel, MatrixAttributesDataModel } from '@/data/SharedDataModels';

export abstract class MatrixPersonaDataModel extends foundry.abstract.DataModel {
	static _enableV10Validation = true;

	abstract monitor: ConditionMonitorDataModel;

	abstract baseAttributes: MatrixAttributesDataModel;
	abstract attributes: MatrixAttributesDataModel;

	get a(): number {
		return this.attributes.attack;
	}
	get s(): number {
		return this.attributes.sleaze;
	}
	get d(): number {
		return this.attributes.dataProcessing;
	}
	get f(): number {
		return this.attributes.firewall;
	}

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			device: new fields.DocumentIdField({ initial: null, nullable: true, required: true }),
			attributes: new fields.EmbeddedDataField(MatrixAttributesDataModel, { required: true, nullable: false }),
			baseAttributes: new fields.EmbeddedDataField(MatrixAttributesDataModel, { required: true, nullable: false }),
			monitor: new fields.EmbeddedDataField(ConditionMonitorDataModel, { required: true, nullable: false, initial: { value: 0, max: 0, formula: '' } }),
		};
	}
}
