import MonitorsDataModel from '@/actor/data/MonitorsDataModel';
import ConditionDataModel, { ConditionSituation } from '@/condition/ConditionDataModel';
import BaseDataModel from '@/data/BaseDataModel';
import IHasPools from '@/data/IHasPools';
import { AdjustableMatrixAttributesDataModel, MatrixAttributesDataModel } from '@/data/MatrixAttributesDataModel';
import MatrixPersonaDataModel, { PersonaType } from '@/item/data/feature/MatrixPersonaDataModel';
import CredstickDataModel from '@/item/data/gear/CredstickDataModel';
import GearDataModel from '@/item/data/gear/GearDataModel';
import SR6Item from '@/item/SR6Item';
import { RollType } from '@/roll';

export default abstract class BaseActorDataModel extends BaseDataModel implements IHasPools {
	abstract monitors: MonitorsDataModel;
	abstract description: string;
	abstract source: string;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	is<I>(): this is I {
		return true;
	}

	get conditions(): ConditionDataModel[] {
		return this.actor!.items.filter((i) => i.type === 'condition').map(
			(i) => (i as SR6Item<ConditionDataModel>).systemData
		);
	}

	get woundModifier(): number {
		return 0;
	}

	getPool(type: RollType): number {
		let pool = 0;

		this.getRollConditions(type).forEach((condition) => {
			pool += condition.getPoolModifier(type);
		});

		return pool;
	}

	get totalNuyen(): number {
		return [...this.actor!.credsticks.map((item: SR6Item<CredstickDataModel>) => item.systemData.nuyen), 0].reduce(
			(total, nuyen) => total + nuyen
		);
	}

	getRollConditions(type: RollType): ConditionDataModel[] {
		return this.getSituationalConditions(ConditionSituation.Roll).filter((condition) => {
			return condition.getModifiersForRoll(type).length > 0;
		});
	}

	getSituationalConditions(situation: ConditionSituation): ConditionDataModel[] {
		/*
		return this.conditions.filter((condition) => {
			return (
				condition.activationSituation === ConditionSituation.Always ||
				condition.activationSituation === situation
			);
		});
		 */
		return this.conditions;
	}

	protected get _matrixPersona(): null | MatrixPersonaDataModel {
		const persona = this.actor!.items.find((i) => i.type === 'matrix_persona')! as SR6Item<MatrixPersonaDataModel>;
		return persona ? persona.systemData : null;
	}
	protected set _matrixPersona(newPersona: null | MatrixPersonaDataModel) {
		const persona = this.actor!.items.find((i) => i.type === 'matrix_persona')! as SR6Item<MatrixPersonaDataModel>;
		if (newPersona && persona) {
			persona.systemData.sourceDeviceId = newPersona.sourceDeviceId;
			persona.systemData.attributes = newPersona.attributes;
			persona.systemData.type = newPersona.type;
		} else if (persona) {
			this.actor!.items.delete(persona.id);
		}
	}

	protected async _activateMatrixPersona(
		device: SR6Item<GearDataModel> | null = null
	): Promise<SR6Item<MatrixPersonaDataModel>> {
		// Remove any existing persona
		this.actor!.items.filter((i) => i.type === 'matrix_persona').forEach((i) => i.delete());

		const personaType = device ? PersonaType.Device : PersonaType.Living;
		/*
		if (this.type == PersonaType.Device) {
			// Fetch the attributes from the device
			this.attributes.base = ;
		} else if (this.type == PersonaType.Living) {
			this.attributes.base.formulas = {
				attack: '@charisma',
				sleaze: '@intuition',
				dataProcessing: '@logic',
				firewall: '@willpower',
			};
		}
		 */
		const attributes =
			personaType == PersonaType.Device
				? device!.systemData.matrix!.attributes!
				: {
						formulas: {
							attack: '@charisma',
							sleaze: '@intuition',
							dataProcessing: '@logic',
							firewall: '@willpower',
						},
				  };

		// create it
		const persona = (
			await this.actor!.createEmbeddedDocuments('Item', [
				{
					type: 'matrix_persona',
					name: `${this.actor!.name} persona`,
					system: {
						sourceDeviceId: device ? device.uuid : null,
						attributes: {
							base: attributes,
							current: attributes,
						},
						type: personaType,
					},
				},
			])
		)[0] as SR6Item<MatrixPersonaDataModel>;

		return persona;
	}

	override prepareBaseData(): void {
		super.prepareBaseData();
	}

	override prepareData(): void {
		super.prepareData();
	}

	override prepareDerivedData(): void {
		super.prepareDerivedData();
	}

	override getRollData(): Record<string, unknown> {
		return super.getRollData();
	}

	static defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;
		return {
			description: new fields.HTMLField(),
			source: new fields.StringField(),
		};
	}
}
