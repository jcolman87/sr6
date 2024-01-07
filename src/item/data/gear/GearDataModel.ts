/**
 *
 * @author jaynus
 * @file Basic data model
 */

import BaseDataModel from '@/data/BaseDataModel';
import { EnumNumberField } from '@/data/fields';
import { MonitorDataModel } from '@/actor/data/MonitorsDataModel';
import SkillUseDataModel from '@/data/SkillUseDataModel';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import { AdjustableMatrixAttributesDataModel, MatrixAttributesDataModel } from '@/data/MatrixAttributesDataModel';
import { MatrixUseType } from '@/data/matrix';
import { GearSize } from '@/data/gear';
import MatrixProgramDataModel from '@/item/data/MatrixProgramDataModel';
import SR6Item from '@/item/SR6Item';
import { getItem } from '@/util';

export enum LicenseType {
	HeavyWeapon = 'heavyweapon',
	Firearm = 'firearm',
}

export type GearAvailability = {
	illegal: boolean;
	license: null | LicenseType;
	rating: number;
};

export type GearMonitors = {
	matrix: MonitorDataModel | null;
	physical: MonitorDataModel;
};

type ProgramSlotsData = {
	total: number;
	available: number;
	programs: SR6Item<MatrixProgramDataModel>[];
};
export abstract class GearMatrixDataModel extends BaseDataModel {
	abstract active: boolean;
	abstract supportsModes: MatrixUseType[];
	abstract attributes: MatrixAttributesDataModel | null;
	abstract availableSlotsFormula: string;

	protected abstract _programSlots: ItemUUID[];

	get programSlots(): ProgramSlotsData {
		const total = this.solveFormula(this.availableSlotsFormula);
		return {
			total: total,
			available: total - this._programSlots.length,
			programs: this._programSlots.map((uuid) => getItem(SR6Item<MatrixProgramDataModel>, uuid)!),
		};
	}
	async setProgramSlots(programs: SR6Item<MatrixProgramDataModel>[]) {
		this._programSlots = programs.map((p) => p.uuid).slice(0, this.programSlots.total);
	}
	async clearProgramSlots() {
		this._programSlots = [];
	}

	static defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			active: new fields.BooleanField({ initial: true, required: true, nullable: false }),
			supportsModes: new fields.ArrayField(
				new fields.StringField({
					blank: false,
					nullable: false,
					required: true,
					choices: Object.values(MatrixUseType),
				}),
				{ initial: [], required: true, nullable: false }
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
			_programSlots: new fields.ArrayField(new fields.StringField({ nullable: false, blank: false }), {
				initial: [],
				nullable: false,
				required: true,
			}),
		};
	}
}

export default abstract class GearDataModel extends BaseItemDataModel {
	abstract rating: number;
	abstract size: GearSize;
	abstract costFormula: string;
	abstract availability: GearAvailability;

	abstract monitors: GearMonitors;

	abstract skillUse: SkillUseDataModel | null;

	abstract matrix: GearMatrixDataModel | null;

	async toggleWireless(): Promise<boolean> {
		if (!this.matrix) {
			return false;
		}

		await this.item!.update({
			['system.matrix.active']: !this.matrix!.active,
		});

		return this.matrix!.active;
	}

	get cost(): number {
		return this.solveFormula(this.costFormula);
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
			rating: new fields.NumberField({ initial: 1, nullable: false, required: true, min: 1, max: 6 }),
			costFormula: new fields.StringField({ initial: '0', nullable: false, required: true, blank: false }),
			availability: new fields.SchemaField(
				{
					illegal: new fields.BooleanField({ initial: false, required: true, nullable: false }),
					license: new fields.StringField({
						initial: null,
						blank: false,
						nullable: true,
						required: true,
						choices: Object.values(LicenseType),
					}),
					rating: new fields.NumberField({ initial: 1, nullable: false, required: true, min: 1 }),
				},
				{ required: true, nullable: false }
			),
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
				{ required: true, nullable: false }
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
		};
	}

	override prepareDerivedData(): void {
		//if (this.monitors.matrix) {
		//	this.monitors.matrix.prepareDerivedData();
		//}
		//this.monitors.physical.prepareDerivedData();
	}
}
