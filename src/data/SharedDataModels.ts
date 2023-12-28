/**
 *
 * @author jaynus
 * @file Generic data types relevant to Actor types.
 */

import { EnumAttribute } from '@/actor/data';

export abstract class AttributeDataModel extends foundry.abstract.DataModel {
	static _enableV10Validation = true;

	abstract base: number;
	abstract mod: number;
	abstract value: number;

	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			base: new fields.NumberField({ initial: 2, required: true, nullable: false, integer: true, positive: true }),
			mod: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0 }),
			value: new fields.NumberField({ initial: 2, required: true, nullable: false, integer: true, min: 0 }),
		};
	}
}

export abstract class SkillUseDataModel extends foundry.abstract.DataModel {
	static _enableV10Validation = true;

	abstract skill: string;
	abstract attribute: EnumAttribute;
	abstract specialization: null | string;

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			skill: new fields.StringField({ nullable: false, blank: false, required: true }),
			attribute: new fields.StringField({ initial: null, nullable: true, blank: false, required: true, choices: () => Object.keys(EnumAttribute) }),
			specialization: new fields.StringField({ nullable: false, blank: false, required: true }),
		};
	}
}

export abstract class ConditionMonitorDataModel extends foundry.abstract.DataModel {
	static _enableV10Validation = true;

	abstract value: number;
	abstract max: number;
	abstract formula: string;

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			value: new fields.NumberField({ initial: 0, required: true, nullable: false, min: 0 }),
			max: new fields.NumberField({ initial: 0, required: true, nullable: false, min: 0 }),
			formula: new fields.StringField({ initial: null, required: true, nullable: true, blank: false }),
		};
	}
}

export abstract class MatrixAttributesDataModel extends foundry.abstract.DataModel {
	abstract attack: number;
	abstract sleaze: number;
	abstract dataProcessing: number;
	abstract firewall: number;

	defineSchema() {
		const fields = foundry.data.fields;

		return {
			attack: new fields.NumberField({ initial: 0, min: 0, required: true, nullable: false }),
			sleaze: new fields.NumberField({ initial: 0, min: 0, required: true, nullable: false }),
			dataProcessing: new fields.NumberField({ initial: 0, min: 0, required: true, nullable: false }),
			firewall: new fields.NumberField({ initial: 0, min: 0, required: true, nullable: false }),
		};
	}
}
