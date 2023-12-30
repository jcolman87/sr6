/**
 *
 * @author jaynus
 * @file Player Character
 */

import BaseDataModel from '@/data/BaseDataModel';
import GearDataModel from '@/item/data/gear/GearDataModel';
import { DamageType, FireMode, Distance } from '@/data';

export abstract class AttackRatingDataModel extends BaseDataModel {
	abstract closeFormula: string;
	abstract nearFormula: string;
	abstract mediumFormula: string;
	abstract farFormula: string;
	abstract extremeFormula: string;

	atDistance(distance: Distance): number {
		switch (distance) {
			case Distance.Close: {
				return this.close;
			}
			case Distance.Near: {
				return this.near;
			}
			case Distance.Medium: {
				return this.medium;
			}
			case Distance.Far: {
				return this.far;
			}
			case Distance.Extreme: {
				return this.extreme;
			}
		}
		return 0;
	}

	get close(): number {
		return this.solveFormula(this.closeFormula);
	}
	get near(): number {
		return this.solveFormula(this.nearFormula);
	}
	get medium(): number {
		return this.solveFormula(this.mediumFormula);
	}
	get far(): number {
		return this.solveFormula(this.farFormula);
	}
	get extreme(): number {
		return this.solveFormula(this.extremeFormula);
	}

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			closeFormula: new fields.StringField({ initial: '0', required: true, nullable: false }),
			nearFormula: new fields.StringField({ initial: '0', required: true, nullable: false }),
			mediumFormula: new fields.StringField({ initial: '0', required: true, nullable: false }),
			farFormula: new fields.StringField({ initial: '0', required: true, nullable: false }),
			extremeFormula: new fields.StringField({ initial: '0', required: true, nullable: false }),
		};
	}
}

type WeaponDamage = {
	damageFormula: string;
	damageType: DamageType;
};

type WeaponCategory = {
	type: string;
	subtype: string;
};

export default abstract class WeaponDataModel extends GearDataModel {
	abstract isMelee: boolean;
	abstract attackRatings: AttackRatingDataModel;

	abstract category: WeaponCategory;
	abstract damageData: WeaponDamage;

	abstract firemodes: null | FireMode[];

	get damage(): number {
		return this.solveFormula(this.damageData.damageFormula);
	}

	get pool(): number {
		return this.skillUse ? this.skillUse!.pool : 0;
	}

	static override defineSchema() {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
			attackRatings: new fields.EmbeddedDataField(AttackRatingDataModel, { required: true, nullable: false }),
			category: new fields.SchemaField(
				{
					type: new fields.StringField({ initial: '', required: false, nullable: false }),
					subtype: new fields.StringField({ initial: '', required: false, nullable: false }),
				},
				{ required: true, nullable: false },
			),
			damageData: new fields.SchemaField(
				{
					damageFormula: new fields.StringField({ initial: '0', required: true, nullable: false }),
					damageType: new fields.StringField({ initial: DamageType.Physical, required: true, nullable: false, blank: false, choices: Object.values(DamageType) }),
				},
				{ required: true, nullable: false },
			),
			firemodes: new fields.ArrayField(new fields.StringField({ blank: false, choices: Object.values(FireMode) }), { initial: [FireMode.SS], required: true, nullable: true }),
		};
	}
}
