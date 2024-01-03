import { EnumAttribute } from '@/actor/data';
import BaseDataModel from '@/data/BaseDataModel';

export default abstract class SkillUseDataModel extends BaseDataModel {
	abstract skill: string;
	abstract attribute: EnumAttribute;
	abstract specialization: null | string;

	get pool(): number {
		// TODO: specialization bonus
		return this.solveFormula(`@${EnumAttribute[this.attribute]} + @${this.skill}`);
	}

	static defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			skill: new fields.StringField({ nullable: false, blank: false, required: true }),
			attribute: new fields.StringField({
				initial: null,
				nullable: true,
				blank: false,
				required: true,
				choices: () => Object.keys(EnumAttribute),
			}),
			specialization: new fields.StringField({ nullable: false, blank: false, required: true }),
		};
	}
}
