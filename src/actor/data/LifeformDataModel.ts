/**
 *
 * @author jaynus
 * @file Player Character
 */


class SkillDataModel extends foundry.abstract.DataModel {
	static _enableV10Validation = true;

	declare points: number;
	//declare pool: number;
	//declare modifier: number;

	//declare specialization: Specialization;
	//declare expertise: Specialization;

	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			points: new fields.NumberField({ initial: 2, required: true, nullable: false, integer: true, min: 0, max: 9 })
		};
	}
}

export class AttributeDataModel extends foundry.abstract.DataModel {
	static _enableV10Validation = true;

	declare base: number;
	declare mod: number;
	declare value: number;

	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			base: new fields.NumberField({ initial: 2, required: true, nullable: false, integer: true, positive: true }),
			mod: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, positive: true  }),
			value: new fields.NumberField({ initial: 2, required: true, nullable: false, integer: true, positive: true  }),
		};
	}
}

export default class LifeformDataModel extends foundry.abstract.DataModel {
	static _enableV10Validation = true;

	declare soak: number;

	declare attributes: {
		body: AttributeDataModel,
		agility: AttributeDataModel,
		reaction:  AttributeDataModel,
		strength: AttributeDataModel,
		willpower: AttributeDataModel,
		logic: AttributeDataModel,
		intuition: AttributeDataModel,
		charisma: AttributeDataModel,
	};

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			soak: new fields.NumberField({ integer: true, initial: 0 }),

			attributes: new fields.SchemaField({
				body: new fields.EmbeddedDataField(AttributeDataModel, { initial: new AttributeDataModel, required: true, nullable: false  }),
				agility: new fields.EmbeddedDataField(AttributeDataModel, { initial: new AttributeDataModel, required: true, nullable: false }),
				reaction: new fields.EmbeddedDataField(AttributeDataModel, { initial: new AttributeDataModel, required: true, nullable: false }),
				strength: new fields.EmbeddedDataField(AttributeDataModel, { initial: new AttributeDataModel, required: true, nullable: false }),
				willpower: new fields.EmbeddedDataField(AttributeDataModel, { initial: new AttributeDataModel, required: true, nullable: false }),
				logic: new fields.EmbeddedDataField(AttributeDataModel, { initial: new AttributeDataModel, required: true, nullable: false }),
				intuition: new fields.EmbeddedDataField(AttributeDataModel, { initial: new AttributeDataModel, required: true, nullable: false }),
				charisma: new fields.EmbeddedDataField(AttributeDataModel, { initial: new AttributeDataModel, required: true, nullable: false }),
			}),

			//skills: new fields.SchemaField({
			//	astral: new fields.EmbeddedDataField(SkillDataModel, { initial: new SkillDataModel, required: true  })
			//}),
		};
	}
}
