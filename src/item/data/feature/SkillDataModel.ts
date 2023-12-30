/**
 *
 * @author jaynus
 * @file Basic data model
 */

import { EnumAttribute } from '@/actor/data';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';

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
		return this.solveFormula(`@${EnumAttribute[this.attribute]} + ${this.points}`);
	}
	static override defineSchema() {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
			points: new fields.NumberField({ initial: 0, nullable: false, required: true, min: 0 }),

			category: new fields.StringField({ nullable: false, blank: false, required: true, choices: Object.values(SkillCategory) }),

			attribute: new fields.StringField({ initial: 'body', nullable: false, blank: false, required: true, choices: Object.keys(EnumAttribute) }),

			specialization: new fields.StringField({ initial: null, required: true, nullable: true, blank: false }),
			expertise: new fields.StringField({ initial: null, required: true, nullable: true, blank: false }),

			specializations: new fields.ArrayField(new fields.StringField({ required: true, nullable: false, blank: false })),

			canUntrained: new fields.BooleanField({ initial: true, nullable: false, required: true }),
		};
	}
}
