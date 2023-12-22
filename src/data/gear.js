import { Enums } from "../config.js";
import * as shared from "./shared.js";

export class Gear extends foundry.abstract.DataModel {
	static _enableV10Validation = true;

	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			description: new fields.StringField({ initial: "This is a description", required: true, blank: false }),
			category: new fields.SchemaField(
				{
					type: new fields.StringField({ initial: "INVALID", required: true, blank: false, nullable: false }),
					subtype: new fields.StringField({ initial: "INVALID", required: true, blank: false, nullable: false })
				},
				{ required: true, blank: false, nullable: true }
			),

			rating: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true }),
			size: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true }),
			types: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true }),

			// has-condition
			condition: new fields.EmbeddedDataField(shared.Attribute, { required: false, nullable: false }),
			// has-skill-use
			skill_use: new fields.EmbeddedDataField(shared.SkillUse, { required: false, nullable: false }),

			// has-cost
			cost: new fields.StringField({ initial: "0", required: false, blank: false, nullable: false }),
			cost: new fields.StringField({ initial: "0", required: false, blank: false, nullable: false }),
			cost: new fields.StringField({ initial: "0", required: false, blank: false, nullable: false }),

			// has-matrix
			matrix_active: new fields.BooleanField({ initial: false, required: true,  nullable: false }),
			matrix_attributes: new fields.EmbeddedDataField(shared.MatrixAttributesFormula, { required: false, nullable: false }),
			program_slots: new fields.StringField({ initial: "0", required: false, blank: false, nullable: false }),
			loaded_programs: new fields.ArrayField(new fields.StringField(), { initial: [], required: false, blank: false, nullable: false }),

			// has-defense
			dr: new fields.StringField({ initial: "0", required: false, blank: false, nullable: false }),

			// has-capacity
			capacity: new fields.StringField({ initial: "0", required: false, blank: false, nullable: false }),

			// has-explosive
			dv_gz: new fields.StringField({ initial: "0", required: false, blank: false, nullable: false }),
			dv_close: new fields.StringField({ initial: "0", required: false, blank: false, nullable: false }),
			dv_near: new fields.StringField({ initial: "0", required: false, blank: false, nullable: false }),
			blast: new fields.StringField({ initial: "0", required: false, blank: false, nullable: false }),

			// has-weapon-mountable
			locations: new fields.ArrayField(new fields.StringField(), { initial: [], required: false, blank: false, nullable: false }),
			attached: new fields.ArrayField(new fields.DocumentIdField({ nullable: false }), { required: true, nullable: true }),

			//weapoon
			attack_ratings: new fields.EmbeddedDataField(shared.AttackRatings, { required: false, nullable: false }),
			damage: new fields.StringField({ initial: "0", required: false, blank: false, nullable: false }),
			damage_type: new fields.StringField({ initial: "0", required: false, blank: false, nullable: false }),
			damage_form: new fields.StringField({ initial: "0", required: false, blank: false, nullable: false }),

			// firearm
			firemodes: new fields.ArrayField(new fields.StringField(), { initial: ["SS"], required: false, blank: false, nullable: false }),
		};
	}
}
