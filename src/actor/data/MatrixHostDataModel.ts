import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import { DocumentUUIDField } from '@/data/fields';
import { IHasMatrixPersona } from '@/data/interfaces';
import { IHasPostCreate } from '@/data/interfaces';
import { AdjustableMatrixAttributesDataModel } from '@/data/MatrixAttributesDataModel';
import MatrixPersonaDataModel, { PersonaType } from '@/item/data/feature/MatrixPersonaDataModel';
import GearDataModel from '@/item/data/gear/GearDataModel';
import MatrixICDataModel from '@/item/data/MatrixICDataModel';
import SR6Item from '@/item/SR6Item';

export default abstract class MatrixHostDataModel
	extends BaseActorDataModel
	implements IHasMatrixPersona, IHasPostCreate
{
	abstract rating: number;
	abstract attributes: AdjustableMatrixAttributesDataModel;

	protected abstract _personas: (() => SR6Item<MatrixPersonaDataModel>)[];

	get matrixPersona(): null | MatrixPersonaDataModel {
		return this._matrixPersona;
	}

	set matrixPersona(persona: null | MatrixPersonaDataModel) {
		this._matrixPersona = persona;
	}

	async activateMatrixPersona(
		device: SR6Item<GearDataModel> | null = null
	): Promise<SR6Item<MatrixPersonaDataModel>> {
		return this.actor!.items.find((item) => item.type === 'matrix_persona')! as SR6Item<MatrixPersonaDataModel>;
	}

	async deactivateMatrixPersona(): Promise<boolean> {
		return false;
	}

	get programs(): SR6Item<MatrixICDataModel>[] {
		return this.actor!.items.filter((item) => item.type === 'matrix_ic').map(
			(item) => item as SR6Item<MatrixICDataModel>
		);
	}

	override prepareDerivedData(): void {
		super.prepareDerivedData();
		this.attributes.prepareDerivedData();
	}

	override getRollData(): Record<string, unknown> {
		return {
			...super.getRollData(),
			persona: {
				...this.attributes.getRollData(),
				type: PersonaType.IC,
			},
		};
	}

	async onPostCreate(): Promise<void> {
		// Create our persona
		await this.actor!.createEmbeddedDocuments('Item', [
			{
				type: 'matrix_persona',
				name: `${this.actor!.name} persona`,
				system: {
					sourceDevice: null,
					attributes: this.attributes,
					type: PersonaType.IC,
				},
			},
		]);
	}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
			rating: new fields.NumberField({ initial: 1, min: 1, max: 20, nullable: false, required: true }),
			_personas: new fields.ArrayField(new DocumentUUIDField()),
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
