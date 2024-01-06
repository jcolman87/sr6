import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import { MonitorDataModel } from '@/actor/data/MonitorsDataModel';
import { AdjustableMatrixAttributesDataModel } from '@/data/MatrixAttributesDataModel';

import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';
import GearDataModel from '@/item/data/gear/GearDataModel';

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
		sourceActor: actor,
		type: 'ic'
	}
}]);


 */

type MatrixPersonaFormulasData = {
	attackRating: string;
	defenseRating: string;
};

export default abstract class MatrixPersonaDataModel extends BaseItemDataModel {
	abstract sourceDevice: null | SR6Item<GearDataModel>;
	abstract sourceActor: SR6Actor<BaseActorDataModel>;
	abstract attributes: AdjustableMatrixAttributesDataModel;
	abstract formulas: MatrixPersonaFormulasData;
	abstract type: PersonaType;

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

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
			sourceDevice: new fields.ForeignDocumentField(SR6Item<GearDataModel>, {
				initial: null,
				nullable: true,
				required: true,
			}),
			sourceActor: new fields.ForeignDocumentField(SR6Actor<BaseActorDataModel>, {
				nullable: false,
				required: true,
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
		};
	}
}
