import IHasMatrix from '@/data/IHasMatrix';
import BaseDataModel from '@/data/BaseDataModel';
import MatrixPersonaDataModel from '@/item/data/feature/MatrixPersonaDataModel';
import SR6Item from '@/item/SR6Item';

export default abstract class MatrixICDataModel extends BaseDataModel /* implements IHasMatrix */ {
	abstract rating: number;

	get matrixPersona(): null | MatrixPersonaDataModel {
		const persona = this.actor!.items.find((i) => i.type === 'matrix_persona')! as SR6Item<MatrixPersonaDataModel>;
		return persona ? persona.systemData : null;
	}

	static defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			rating: new fields.NumberField({ initial: 0, min: 0, max: 20, nullable: false, required: true }),
		};
	}
}
