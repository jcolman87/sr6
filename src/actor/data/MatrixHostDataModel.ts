import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import IHasMatrixPersona from '@/data/IHasMatrixPersona';
import IHasPostCreate from '@/data/IHasPostCreate';
import { AdjustableMatrixAttributesDataModel } from '@/data/MatrixAttributesDataModel';
import MatrixPersonaDataModel, { PersonaType } from '@/item/data/feature/MatrixPersonaDataModel';
import MatrixICDataModel from '@/item/data/MatrixICDataModel';
import SR6Item from '@/item/SR6Item';

export default abstract class MatrixHostDataModel extends BaseActorDataModel implements IHasMatrixPersona {
	abstract rating: number;
	abstract attributes: AdjustableMatrixAttributesDataModel;

	protected abstract _personas: (() => SR6Item<MatrixPersonaDataModel>)[];

	get matrixPersona(): null | MatrixPersonaDataModel {
		return new MatrixPersonaDataModel(
			{
				sourceDevice: null,
				sourceActor: this.actor!,
				attributes: this.attributes,
				type: PersonaType.IC,
			},
			{ parent: this }
		);
	}

	get programs(): SR6Item<MatrixICDataModel>[] {
		return this.actor!.items.filter((item) => item.type === 'matrix_ic').map(
			(item) => item as SR6Item<MatrixICDataModel>
		);
	}

	get personas(): SR6Item<MatrixPersonaDataModel>[] {
		return [...this._personas.map((p) => p())];
	}

	override prepareDerivedData(): void {
		super.prepareDerivedData();
		this.attributes.prepareDerivedData();
	}

	override getRollData(): Record<string, unknown> {
		return {
			...super.getRollData(),
			...this.attributes.getRollData(),
			type: PersonaType.IC,
		};
	}

	async postCreate(): Promise<void> {}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
			rating: new fields.NumberField({ initial: 1, min: 1, max: 20, nullable: false, required: true }),
			_personas: new fields.ArrayField(new fields.ForeignDocumentField(SR6Item<MatrixPersonaDataModel>), {
				initial: [],
				required: true,
				nullable: false,
			}),
			attributes: new fields.EmbeddedDataField(AdjustableMatrixAttributesDataModel, {
				initial: {
					base: {
						attack: 0,
						sleaze: 0,
						dataProcessing: 0,
						firewall: 0,
						formulas: {
							attack: '@rating',
							sleaze: '@rating + 1',
							dataProcessing: '@rating + 2',
							firewall: '@rating + 3',
						},
					},
					current: {
						attack: 0,
						sleaze: 0,
						dataProcessing: 0,
						firewall: 0,
						formulas: null,
					},
				},
				nullable: false,
				required: true,
			}),
		};
	}
}
