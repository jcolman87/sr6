import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import { AdjustableMatrixAttributesDataModel } from '@/data/MatrixAttributesDataModel';

import SR6Item from '@/item/SR6Item';
import GearDataModel from '@/item/data/gear/GearDataModel';
import { getItem } from '@/util';

export enum PersonaType {
	Device = 'device',
	Living = 'living',
	IC = 'ic',
}

/*
let actor = game.actors.getName("ic");
let item = actor.createEmbeddedDocuments('Item', [{
    name: 'persona',
    type: 'matrix_persona',
	system: {
		type: 'ic'
	}
}]);


 */

type MatrixPersonaFormulasData = {
	attackRating: string;
	defenseRating: string;
};

export default abstract class MatrixPersonaDataModel extends BaseItemDataModel {
	abstract sourceDeviceId: null | ItemUUID;
	abstract attributes: AdjustableMatrixAttributesDataModel;
	abstract formulas: MatrixPersonaFormulasData;
	abstract type: PersonaType;

	abstract _preparedOnce: boolean;

	get sourceDevice(): null | SR6Item<GearDataModel> {
		if (this.sourceDeviceId) {
			let device = getItem(SR6Item<GearDataModel>, this.sourceDeviceId);
			if (device) {
				return device;
			}
		}
		return null;
	}

	get a(): number {
		return this.attributes.current.attack;
	}

	get s(): number {
		return this.attributes.current.sleaze;
	}

	get d(): number {
		return this.attributes.current.dataProcessing;
	}

	get f(): number {
		return this.attributes.current.firewall;
	}

	get attackRating(): number {
		return this.actor!.solveFormula(this.formulas.attackRating);
	}

	get defenseRating(): number {
		return this.actor!.solveFormula(this.formulas.defenseRating);
	}

	override getRollData(): Record<string, unknown> {
		return {
			...super.getRollData(),
			...this.attributes.getRollData(),
			type: this.type,
		};
	}

	override prepareDerivedData(): void {
		super.prepareDerivedData();
		if (!this._preparedOnce) {
			this._preparedOnce = true;
			//this.item!.update({ ['system._preparedOnce']: true, ['system.attributes.current']: this.attributes.base });
		}
	}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
			sourceDeviceId: new fields.StringField({
				initial: null,
				nullable: true,
				required: true,
				blank: false,
			}),
			attributes: new fields.EmbeddedDataField(AdjustableMatrixAttributesDataModel, {
				nullable: false,
				required: true,
			}),
			formulas: new fields.SchemaField(
				{
					attackRating: new fields.StringField({
						initial: '@persona.a + @persona.s',
						required: true,
						nullable: false,
					}),
					defenseRating: new fields.StringField({
						initial: '@persona.d + @persona.f',
						required: true,
						nullable: false,
					}),
				},
				{ required: true, nullable: false }
			),
			type: new fields.StringField({
				initial: PersonaType.Device,
				required: true,
				nullable: false,
				blank: false,
				choices: Object.values(PersonaType),
			}),
			_preparedOnce: new fields.BooleanField({ required: true, initial: false }),
		};
	}
}
