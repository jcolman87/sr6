import { InitiativeType } from '@/data';
import InitiativeDataModel from '@/data/InitiativeDataModel';
import { AvailableActions, IHasInitiative } from '@/data/interfaces';
import { MatrixSimType } from '@/data/matrix';
import { AdjustableMatrixAttributesDataModel } from '@/data/MatrixAttributesDataModel';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import GearDataModel from '@/item/data/gear/GearDataModel';

import SR6Item from '@/item/SR6Item';
import { InitiativeRollData } from '@/roll/InitiativeRoll';
import { getItemSync } from '@/util';

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

export default abstract class MatrixPersonaDataModel extends BaseItemDataModel implements IHasInitiative {
	abstract sourceDeviceId: null | ItemUUID;
	abstract attributes: AdjustableMatrixAttributesDataModel;
	abstract formulas: MatrixPersonaFormulasData;
	abstract type: PersonaType;
	protected abstract _simType: MatrixSimType;

	getInitiative(type: InitiativeType): null | InitiativeRollData {
		if (type != InitiativeType.Matrix) {
			return null;
		}
		switch (this.simType) {
			case MatrixSimType.AR:
				return {
					score: this.solveFormula('@reaction + @intuition'),
					dice: 0,
				};
			case MatrixSimType.VRCold:
				return {
					score: this.solveFormula('@intuition + @persona.d'),
					dice: 1,
				};
			case MatrixSimType.VRHot:
				return {
					score: this.solveFormula('@intuition + @persona.d'),
					dice: 2,
				};
		}
	}

	getAvailableActions(type: InitiativeType): AvailableActions {
		return {
			major: 0,
			minor: 0,
		};
	}

	get simType(): MatrixSimType {
		return this._simType;
	}

	set simType(simType: MatrixSimType) {
		// Swap initiative for sim type
		this._simType = simType;
		// TODO:
	}

	get sourceDevice(): null | SR6Item<GearDataModel> {
		if (this.sourceDeviceId) {
			const device = getItemSync(SR6Item<GearDataModel>, this.sourceDeviceId);
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

	get woundModifier(): number {
		if (!this.sourceDevice) {
			return 0;
		}
		const modifier = this.sourceDevice?.systemData.monitors.matrix?.woundModifier;
		return modifier ? modifier : 0;
	}

	override getRollData(): Record<string, unknown> {
		return {
			...super.getRollData(),
			...this.attributes.getRollData(),
			persona: {
				type: this.type,
				simType: this.simType,
				...this.attributes.getRollData(),
			},
		};
	}

	override prepareBaseData(): void {
		super.prepareBaseData();
		this.attributes.prepareBaseData();
	}

	override prepareData(): void {
		super.prepareData();
		this.attributes.prepareData();
	}

	override prepareDerivedData(): void {
		super.prepareDerivedData();
		this.attributes.prepareDerivedData();
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
				{ required: true, nullable: false },
			),
			_simType: new fields.StringField({
				initial: MatrixSimType.AR,
				required: true,
				nullable: false,
				blank: false,
				choices: Object.values(MatrixSimType),
			}),
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
