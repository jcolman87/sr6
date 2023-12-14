export class SIN extends foundry.abstract.DataModel {
	static _enableV10Validation = true;
	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			description: new fields.StringField({initial: "This is a description", required: true, blank: false}),
			rating: new fields.NumberField({initial: 0, required: true, nullable: false, integer: true, min: 0, max: 6}),
		}
	}
}

export class Lifestyle extends foundry.abstract.DataModel {
	static _enableV10Validation = true;
	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			description: new fields.StringField({initial: "This is a description", required: true, blank: false}),
			rating: new fields.NumberField({initial: 1, required: true, nullable: false, integer: true, min: 1, max: 6}),
		}
	}
}

export class Contact extends foundry.abstract.DataModel {
	static _enableV10Validation = true;
	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			description: new fields.StringField({initial: "This is a description", required: true, blank: false}),
			rating: new fields.NumberField({initial: 1, required: true, nullable: false, integer: true, min: 1, max: 12}),
			loyalty: new fields.NumberField({initial: 1, required: true, nullable: false, integer: true, min: 1, max: 12}),
		}
	}
}