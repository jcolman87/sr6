/**
 *
 * @author jaynus
 * @file Basic data model
 */

import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import SR6Actor from '@/actor/SR6Actor';
import BaseDataModel from '@/data/BaseDataModel';
import { DocumentUUIDField, EnumNumberField } from '@/data/fields';
import { MonitorDataModel } from '@/actor/data/MonitorsDataModel';
import SkillUseDataModel from '@/data/SkillUseDataModel';
import SR6Effect from '@/effect/SR6Effect';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import { MatrixAttributesDataModel } from '@/data/MatrixAttributesDataModel';
import { MatrixSimType } from '@/data/matrix';
import ProgramDataModel from '@/item/data/ProgramDataModel';
import SR6Item from '@/item/SR6Item';
import { createModifiers } from '@/modifier';
import { ModifierDataModel } from '@/modifier/ModifierDataModel';
import { getActorSync, getItemSync } from '@/util';

export enum GearSize {
	Large = 0,
	Bulky = 1,
	Tuckable = 2,
	Pocket = 3,
	Hand = 4,
	Slim = 5,
	Palmable = 6,
	Small = 7,
	Mini = 8,
	Fine = 9,
	Microscopic = 10,
}

export enum LicenseType {
	HeavyWeapon = 'heavyweapon',
	Firearm = 'firearm',
}

export enum GearType {
	Accessory = 'accessory',
	Armor = 'armor',
	Clothing = 'clothing',
	Bioware = 'bioware',
	Cyberware = 'cyberware',
	Tools = 'tools',
	Electronics = 'electronics',
	Nanoware = 'nanoware',
	Genetics = 'genetics',
	Weapon = 'weapon',
	Ammunition = 'ammunition',
	Chemicals = 'chemicals',
	Software = 'software',
	Survival = 'survival',
	Biology = 'biology',
	Magical = 'magical',
}

export type GearMonitors = {
	matrix: MonitorDataModel | null;
	physical: MonitorDataModel;
};

export type GearCategory = {
	type: GearType;
	subtype: string;
};

export type ProgramSlotsData = {
	total: number;
	available: number;
	programs: SR6Item<ProgramDataModel>[];
};

export abstract class GearWirelessBonusDataModel extends BaseDataModel {
	abstract description: string;
	abstract modifiers: ModifierDataModel[];
	abstract transfer: boolean;

	static defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			description: new fields.StringField({ initial: '', required: true, blank: true, nullable: false }),
			transfer: new fields.BooleanField({ initial: false, nullable: false, required: true }),
			modifiers: new fields.ArrayField(new fields.EmbeddedDataField(ModifierDataModel), {
				initial: [],
				required: true,
				nullable: false,
			}),
		};
	}
}

export abstract class GearMatrixDataModel extends BaseDataModel {
	abstract active: boolean;
	abstract wirelessBonus: GearWirelessBonusDataModel | null;
	abstract simModes: MatrixSimType[];
	abstract attributes: MatrixAttributesDataModel | null;
	abstract availableSlotsFormula: string;

	protected abstract _programSlots: ItemUUID[];

	get totalProgramSlots(): number {
		if (this.availableSlotsFormula) {
			return this.solveFormula(this.availableSlotsFormula);
		} else {
			return 0;
		}
	}

	get programSlots(): ProgramSlotsData {
		if (this.availableSlotsFormula) {
			const total = this.totalProgramSlots;
			return {
				total: total,
				available: total - this._programSlots.length,
				programs: this._programSlots.map((uuid) => getItemSync(SR6Item<ProgramDataModel>, uuid)!),
			};
		} else {
			return {
				total: 0,
				available: 0,
				programs: [],
			};
		}
	}

	async setProgramSlots(programs: SR6Item<ProgramDataModel>[]): Promise<boolean> {
		if (this.totalProgramSlots < programs.length) {
			this._programSlots = programs.map((p) => p.uuid).slice(0, this.programSlots.total);
			return true;
		} else {
			return false;
		}
	}

	async clearProgramSlots(): Promise<void> {
		this._programSlots = [];
	}

	static defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			active: new fields.BooleanField({ initial: true, required: true, nullable: false }),
			wirelessBonus: new fields.EmbeddedDataField(GearWirelessBonusDataModel, {
				initial: null,
				required: true,
				nullable: true,
			}),
			simModes: new fields.ArrayField(
				new fields.StringField({
					blank: false,
					nullable: false,
					required: true,
					choices: Object.values(MatrixSimType),
				}),
				{ initial: [], required: true, nullable: false },
			),
			attributes: new fields.EmbeddedDataField(MatrixAttributesDataModel, {
				initial: null,
				required: true,
				nullable: true,
			}),
			availableSlotsFormula: new fields.StringField({
				initial: '0',
				blank: false,
				required: true,
				nullable: true,
			}),
			_programSlots: new fields.ArrayField(new DocumentUUIDField(), {
				initial: [],
				nullable: false,
				required: true,
			}),
		};
	}
}

export abstract class GearAvailabilityDataModel extends BaseDataModel {
	abstract illegal: boolean;
	abstract requiresLicense: boolean;
	abstract rating: number;

	abstract licensingSinId: Maybe<DocumentUUIDField>;

	static defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			illegal: new fields.BooleanField({ initial: false, required: true, nullable: false }),
			requiresLicense: new fields.BooleanField({ initial: false, required: true, nullable: false }),
			rating: new fields.NumberField({ initial: 1, nullable: false, required: true, min: 1 }),
			licensingSinId: new DocumentUUIDField({ required: false, nullable: true }),
		};
	}
}

export default abstract class GearDataModel extends BaseItemDataModel {
	abstract isProxy: boolean;

	abstract category: GearCategory;

	abstract rating: number;
	abstract size: GearSize;
	abstract costFormula: string;
	abstract availability: GearAvailabilityDataModel;

	abstract monitors: GearMonitors;

	abstract skillUse: SkillUseDataModel | null;

	abstract matrix: GearMatrixDataModel | null;

	protected abstract _attachedTo: Maybe<ItemUUID | ActorUUID>;

	get attached(): boolean {
		return !!this._attachedTo;
	}

	get attachedTo(): null | SR6Actor<BaseActorDataModel> | SR6Item<GearDataModel> {
		if (!this._attachedTo) {
			return null;
		}
		const parsed = parseUuid(this._attachedTo);
		if (parsed.documentType === 'Actor' && parsed.embedded.length === 0) {
			return getActorSync(SR6Actor<BaseActorDataModel>, this._attachedTo as ActorUUID);
		} else {
			return getItemSync(SR6Item<GearDataModel>, this._attachedTo as ItemUUID);
		}
	}

	get wirelessBonusName(): string {
		return `${this.item!.name} (Wireless Bonus)`;
	}

	async toggleWireless(): Promise<boolean> {
		if (!this.matrix) {
			return false;
		}

		this.matrix!.active = !this.matrix!.active;
		await this.item!.update({
			['system.matrix.active']: this.matrix!.active,
		});

		if (this.matrix!.active && this.matrix!.wirelessBonus) {
			// Create an active effect for us being active and add its modifiers and conditions
			const effect = (
				await this.item!.createEmbeddedDocuments('ActiveEffect', [
					{
						label: this.wirelessBonusName,
						description: this.matrix!.wirelessBonus.description,
						icon: this.item!.img,
						disabled: false,
						transfer: this.matrix!.wirelessBonus.transfer,
					},
				])
			)[0] as SR6Effect;

			if (this.matrix?.wirelessBonus?.modifiers) {
				await createModifiers(this.item!, effect, this.matrix!.wirelessBonus!.modifiers);
			}
		} else {
			// Remove the wireless bonus effect if it was present
			await this.item!.getEffectByName(this.wirelessBonusName)?.delete();
		}

		return this.matrix!.active;
	}

	get cost(): number {
		return this.solveFormula(this.costFormula);
	}

	get defenseRating(): number {
		return 0;
	}

	get socialRating(): number {
		return 0;
	}

	override getRollData(): Record<string, unknown> {
		return {
			...super.getRollData(),
			rating: this.rating,
		};
	}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
			isProxy: new fields.BooleanField({ initial: false, required: true, nullable: false }),
			category: new fields.SchemaField(
				{
					type: new fields.StringField({
						blank: true,
						nullable: true,
						required: false,
						choices: Object.values(GearType),
					}),
					subtype: new fields.StringField({ initial: '', required: false, nullable: false }),
				},
				{ required: true, nullable: false },
			),
			rating: new fields.NumberField({ initial: 1, nullable: false, required: true, min: 1, max: 6 }),
			costFormula: new fields.StringField({ initial: '0', nullable: false, required: true, blank: false }),
			availability: new fields.EmbeddedDataField(GearAvailabilityDataModel, { required: true, nullable: false }),
			size: new EnumNumberField({ initial: 0, nullable: false, required: true, min: 0 }),
			monitors: new fields.SchemaField(
				{
					matrix: new fields.EmbeddedDataField(MonitorDataModel, {
						initial: null,
						required: true,
						nullable: true,
					}),
					physical: new fields.EmbeddedDataField(MonitorDataModel, {
						initial: { damage: 0, max: 0, formula: '8 + ceil(@rating / 2)' },
						required: true,
						nullable: false,
					}),
				},
				{ required: true, nullable: false },
			),
			matrix: new fields.EmbeddedDataField(GearMatrixDataModel, {
				initial: null,
				required: true,
				nullable: true,
			}),
			skillUse: new fields.EmbeddedDataField(SkillUseDataModel, {
				initial: null,
				required: true,
				nullable: true,
			}),
			_attachedTo: new DocumentUUIDField({ nullable: true }),
		};
	}

	override prepareBaseData(): void {
		this.monitors.physical.prepareBaseData();
		this.monitors.matrix?.prepareBaseData();
		this.matrix?.attributes?.prepareBaseData();
	}

	override prepareData(): void {
		this.monitors.physical.prepareData();
		this.monitors.matrix?.prepareData();
		this.matrix?.attributes?.prepareData();
	}

	override prepareDerivedData(): void {
		this.monitors.physical.prepareDerivedData();
		this.monitors.matrix?.prepareDerivedData();
		this.matrix?.attributes?.prepareDerivedData();
	}
}
