/**
 *
 * @author jaynus
 * @file Basic data model
 */

import { EnumNumberField } from '@/data/fields';
import MonitorDataModel from '@/actor/data/MonitorDataModel';
import SkillUseDataModel from '@/data/SkillUseDataModel';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import MatrixAttributesDataModel from '@/data/MatrixAttributesDataModel';
import { MatrixUseType } from '@/data/matrix';
import { GearSize } from '@/data/gear';

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

export default abstract class GearDataModel extends BaseItemDataModel {
	abstract rating: number;
	abstract size: GearSize;
	abstract costFormula: string;
	abstract availability: GearAvailability;

	abstract monitors: GearMonitors;

	abstract skillUse: SkillUseDataModel | null;

	get cost(): number {
		return this.solveFormula(this.costFormula);
	}

	static override defineSchema() {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
			rating: new fields.NumberField({ initial: 1, nullable: false, required: true, min: 1, max: 6 }),
			costFormula: new fields.StringField({ initial: '0', nullable: false, required: true, blank: false }),
			availability: new fields.SchemaField(
				{
					illegal: new fields.BooleanField({ initial: false, required: true, nullable: false }),
					license: new fields.StringField({ initial: null, blank: false, nullable: true, required: true, choices: Object.values(LicenseType) }),
					rating: new fields.NumberField({ initial: 1, nullable: false, required: true, min: 1 }),
				},
				{ required: true, nullable: false },
			),
			size: new EnumNumberField({ initial: 0, nullable: false, required: true, min: 0 }),
			monitors: new fields.SchemaField(
				{
					matrix: new fields.EmbeddedDataField(MonitorDataModel, { initial: null, required: true, nullable: true }),
					physical: new fields.EmbeddedDataField(MonitorDataModel, { initial: { damage: 0, max: 0, formula: '8 + ceil(@rating / 2)' }, required: true, nullable: false }),
				},
				{ required: true, nullable: false },
			),
			matrix: new fields.SchemaField(
				{
					active: new fields.BooleanField({ initial: true, required: true, nullable: false }),
					supportsModes: new fields.ArrayField(new fields.StringField({ blank: false, nullable: false, required: true, choices: Object.values(MatrixUseType) }), { initial: [], required: true, nullable: false }),
					attributes: new fields.EmbeddedDataField(MatrixAttributesDataModel, { initial: null, required: true, nullable: true }),
				},
				{ initial: null, required: true, nullable: true },
			),
			skillUse: new fields.EmbeddedDataField(SkillUseDataModel, { initial: null, required: true, nullable: true }),
		};
	}

	override prepareDerivedData() {
		if (this.monitors.matrix) {
			this.monitors.matrix.prepareDerivedData();
		}
		this.monitors.physical.prepareDerivedData();
	}
}
