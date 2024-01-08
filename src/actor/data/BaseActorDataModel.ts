import MonitorsDataModel, { MonitorType, WoundModifierData } from '@/actor/data/MonitorsDataModel';
import ConditionDataModel, { ConditionSituation } from '@/condition/ConditionDataModel';
import BaseDataModel from '@/data/BaseDataModel';
import IHasPools from '@/data/IHasPools';
import { MatrixAttributesData } from '@/data/MatrixAttributesDataModel';
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

	get woundModifiers(): WoundModifierData {
		return {};
	}

	get woundModifier(): number {
		return Object.entries(this.woundModifiers).reduce((acc, [key, value]) => (acc += value), 0);
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

	getHighestMatrixAttributes(): MatrixAttributesData {
		return this.actor!.items.filter((i) => i.type === 'gear')
			.map((i) => i as SR6Item<GearDataModel>)
			.filter((i) => i.systemData.matrix?.attributes)
			.map((i) => i.systemData.matrix!.attributes!)
			.reduce((acc, i, _idx, _arr) => {
				acc.attack = Math.max(acc.attack, i.attack);
				acc.sleaze = Math.max(acc.sleaze, i.sleaze);
				acc.dataProcessing = Math.max(acc.dataProcessing, i.dataProcessing);
				acc.firewall = Math.max(acc.firewall, i.firewall);
				return acc;
			});
	}

	protected async _activateMatrixPersona(
		device: SR6Item<GearDataModel> | null = null
	): Promise<SR6Item<MatrixPersonaDataModel>> {
		// Remove any existing persona
		this.actor!.items.filter((i) => i.type === 'matrix_persona').forEach((i) => i.delete());

		const personaType = device ? PersonaType.Device : PersonaType.Living;

		const attributes =
			personaType === PersonaType.Device
				? this.getHighestMatrixAttributes()
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
						type: personaType,
					},
				},
			])
		)[0] as SR6Item<MatrixPersonaDataModel>;

		// Bugfix, because of the differeing types of data the creation fails, we need to update the partials instead
		await persona.update({ ['system.attributes.base']: attributes, ['system.attributes.current']: attributes });

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
