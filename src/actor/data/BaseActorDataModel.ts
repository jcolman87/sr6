import MonitorsDataModel, { WoundModifierData } from '@/actor/data/MonitorsDataModel';
import BaseDataModel from '@/data/BaseDataModel';
import { IHasPools } from '@/data/interfaces';
import { MatrixAttributesData } from '@/data/MatrixAttributesDataModel';
import AdeptPowerDataModel from '@/item/data/feature/AdeptPowerDataModel';
import AugmentationDataModel from '@/item/data/feature/AugmentationDataModel';
import ComplexFormDataModel from '@/item/data/feature/ComplexFormDataModel';
import ContactDataModel from '@/item/data/feature/ContactDataModel';
import LifestyleDataModel from '@/item/data/feature/LifestyleDataModel';
import MatrixPersonaDataModel, { PersonaType } from '@/item/data/feature/MatrixPersonaDataModel';
import QualityDataModel from '@/item/data/feature/QualityDataModel';
import SINDataModel from '@/item/data/feature/SINDataModel';
import SkillDataModel from '@/item/data/feature/SkillDataModel';
import CredstickDataModel from '@/item/data/gear/CredstickDataModel';
import GearDataModel from '@/item/data/gear/GearDataModel';
import WeaponDataModel from '@/item/data/gear/WeaponDataModel';
import WearableDataModel from '@/item/data/gear/WearableDataModel';
import MatrixProgramDataModel from '@/item/data/MatrixProgramDataModel';

import SR6Item from '@/item/SR6Item';
import { RollType } from '@/roll';

export default abstract class BaseActorDataModel extends BaseDataModel implements IHasPools {
	abstract monitors: MonitorsDataModel;
	abstract description: string;
	abstract source: string;

	// IHasPools
	get defenseRating(): number {
		return 0;
	}

	getPool(_type: RollType): number {
		// TODO:
		return 0;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	is<I>(): this is I {
		return true;
	}

	get skills(): SkillDataModel[] {
		return this.actor!.items.filter((i) => i.type === 'skill').map(
			(i) => (i as SR6Item<SkillDataModel>).systemData,
		);
	}

	get gear(): GearDataModel[] {
		return this.actor!.items.filter((i) => i.type === 'gear').map((i) => (i as SR6Item<GearDataModel>).systemData);
	}

	get augmentations(): AugmentationDataModel[] {
		return this.actor!.items.filter((i) => i.type === 'augmentation').map(
			(i) => (i as SR6Item<AugmentationDataModel>).systemData,
		);
	}

	get contacts(): ContactDataModel[] {
		return this.actor!.items.filter((i) => i.type === 'contact').map(
			(i) => (i as SR6Item<ContactDataModel>).systemData,
		);
	}

	get lifestyles(): LifestyleDataModel[] {
		return this.actor!.items.filter((i) => i.type === 'lifestyle').map(
			(i) => (i as SR6Item<LifestyleDataModel>).systemData,
		);
	}

	get sins(): SINDataModel[] {
		return this.actor!.items.filter((i) => i.type === 'sin').map((i) => (i as SR6Item<SINDataModel>).systemData);
	}

	get qualities(): QualityDataModel[] {
		return this.actor!.items.filter((i) => i.type === 'quality').map(
			(i) => (i as SR6Item<QualityDataModel>).systemData,
		);
	}

	get credsticks(): CredstickDataModel[] {
		return this.actor!.items.filter((i) => i.type === 'credstick').map(
			(i) => (i as SR6Item<CredstickDataModel>).systemData,
		);
	}

	get adeptPowers(): AdeptPowerDataModel[] {
		return this.actor!.items.filter((i) => i.type === 'adeptpower').map(
			(i) => (i as SR6Item<AdeptPowerDataModel>).systemData,
		);
	}

	get complexForms(): ComplexFormDataModel[] {
		return this.actor!.items.filter((i) => i.type === 'complexform').map(
			(i) => (i as SR6Item<ComplexFormDataModel>).systemData,
		);
	}

	get matrixPrograms(): MatrixProgramDataModel[] {
		return this.actor!.items.filter((i) => i.type === 'matrix_program').map(
			(i) => (i as SR6Item<MatrixProgramDataModel>).systemData,
		);
	}

	get weapons(): WeaponDataModel[] {
		return this.actor!.items.filter((i) => i.type === 'weapon').map(
			(i) => (i as SR6Item<WeaponDataModel>).systemData,
		);
	}

	get wearables(): WearableDataModel[] {
		return this.actor!.items.filter((i) => i.type === 'wearable').map(
			(i) => (i as SR6Item<WearableDataModel>).systemData,
		);
	}

	get woundModifiers(): WoundModifierData {
		return {};
	}

	get woundModifier(): number {
		return Object.entries(this.woundModifiers).reduce((acc, [_key, value]) => (acc += value), 0);
	}

	get totalNuyen(): number {
		return [...this.actor!.credsticks.map((item: SR6Item<CredstickDataModel>) => item.systemData.nuyen), 0].reduce(
			(total, nuyen) => total + nuyen,
		);
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
		device: SR6Item<GearDataModel> | null = null,
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
						attributes: {
							base: attributes,
							current: attributes,
						},
					},
				},
			])
		)[0] as SR6Item<MatrixPersonaDataModel>;

		// Bugfix, because of the differeing types of data the creation fails, we need to update the partials instead
		//await persona.update({ ['system.attributes.base']: attributes, ['system.attributes.current']: attributes });

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
