/**
 *
 * @author jaynus
 * @file Basic data model
 */

import { EnumAttribute } from '@/actor/data';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import * as util from '@/util';

export enum SkillCategory {
	Matrix = 'matrix',
	Combat = 'combat',
	Magic = 'magic',
	Social = 'social',
	Other = 'other',
}

export default abstract class SkillDataModel extends BaseItemDataModel {
	abstract points: number;

	abstract category: SkillCategory;

	abstract attribute: EnumAttribute;
	abstract specialization: null | string;
	abstract expertise: null | string;

	abstract specializations: string[];

	abstract canUntrained: boolean;

	get pool(): number {
		return this.getPool();
	}

	getPool(specialization: string | null = null): number {
		const points = this.getPoints(specialization);
		return this.solveFormula(`@${EnumAttribute[this.attribute]} + ${points}`);
	}

	getPoints(specialization: string | null = null): number {
		let specializationPoints: number = 0;

		if (specialization) {
			if (specialization === this.specialization) {
				specializationPoints += 2;
			}
			if (specialization === this.expertise) {
				specializationPoints += 3;
			}
		}

		return this.points + specializationPoints;
	}

	get safe_specializations(): string[] {
		return this.specializations.map((special) => util.toSnakeCase(special));
	}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
			points: new fields.NumberField({ initial: 0, nullable: false, required: true, min: 0 }),

			category: new fields.StringField({
				initial: SkillCategory.Other,
				nullable: false,
				blank: false,
				required: true,
				choices: Object.values(SkillCategory),
			}),

			attribute: new fields.StringField({
				initial: 'body',
				nullable: false,
				blank: false,
				required: true,
				choices: Object.keys(EnumAttribute),
			}),

			specialization: new fields.StringField({ initial: null, required: true, nullable: true, blank: false }),
			expertise: new fields.StringField({ initial: null, required: true, nullable: true, blank: false }),

			specializations: new fields.ArrayField(
				new fields.StringField({ required: true, nullable: false, blank: false })
			),

			canUntrained: new fields.BooleanField({ initial: true, nullable: false, required: true }),
		};
	}
}
