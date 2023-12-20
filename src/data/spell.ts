import DataModel from "./foundry/abstract/data.js";
import * as fields from "./foundry/data/fields.js";

export class Spell extends DataModel {
	static _enableV10Validation = true;
	static defineSchema() {
		return {
			description: new fields.StringField({ initial: "This is a description", required: true, blank: false }),
			drain: new fields.NumberField({ initial: 1, required: true, nullable: false, integer: true, min: 0, max: 99 }),
			range: new fields.SchemaField({
				type: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0, max: 2 }),
				value: new fields.NumberField({ initial: 1, required: false, nullable: false, integer: true })
			}),
			duration: new fields.SchemaField({
				type: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0, max: 3 }),
				value: new fields.NumberField({ initial: 1, required: false, nullable: false, integer: true })
			})
		};
	}
}
