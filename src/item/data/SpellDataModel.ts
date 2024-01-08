import { DamageType } from '@/data';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';

import { SpellDuration, SpellRangeType, SpellCombatType, SpellDamageForm, SpellType } from '@/data/magic';

export type SpellRangeData = {
	type: SpellRangeType;
	value: number;
};

export type SpellDurationData = {
	type: SpellDuration;
	value: number;
};

export type SpellDamageData = {
	combat: SpellCombatType;
	type: DamageType;
	form: SpellDamageForm;
};

export type SpellFormulaData = {
	drainFormula: string;
	damageFormula: string;
	defenseFormula: string;
	soakFormula: string;
};

export enum SpellAdjustmentType {
	AmpUp = 'amp',
	IncreaseArea = 'increase',
	ShiftArea = 'shift',
}

export function drainFromAdjustments(adjustments: SpellAdjustmentType[]): number {
	return adjustments.reduce((acc, adjustment) => {
		switch (adjustment) {
			case SpellAdjustmentType.AmpUp:
				acc += 2;
				break;
			case SpellAdjustmentType.IncreaseArea:
				acc += 1;
				break;
			case SpellAdjustmentType.ShiftArea:
				acc += 0;
				break;
		}
		return acc;
	}, 0);
}

export function damageFromAdjustments(adjustments: SpellAdjustmentType[]): number {
	return adjustments.reduce((acc, adjustment) => {
		switch (adjustment) {
			case SpellAdjustmentType.AmpUp:
				acc += 1;
				break;
			case SpellAdjustmentType.IncreaseArea:
			case SpellAdjustmentType.ShiftArea:
				acc += 0;
				break;
		}
		return acc;
	}, 0);
}

export default abstract class SpellDataModel extends BaseItemDataModel {
	abstract formulas: SpellFormulaData;
	abstract type: SpellType;
	abstract range: SpellRangeData;
	abstract duration: SpellDurationData;

	get pool(): number {
		return this.solveFormula('@magic + @spellcasting');
	}

	get drain(): number {
		return this.solveFormula(this.formulas.drainFormula);
	}

	get baseDamage(): number {
		return this.solveFormula(this.formulas.damageFormula);
	}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;
		return {
			...super.defineSchema(),
			type: new fields.StringField({
				initial: SpellType.Mana,
				required: true,
				nullable: false,
				blank: false,
				choices: Object.values(SpellType),
			}),
			formulas: new fields.SchemaField(
				{
					damageFormula: new fields.StringField({
						initial: '0',
						required: true,
						nullable: false,
						blank: false,
					}),
					drainFormula: new fields.StringField({
						initial: '0',
						required: true,
						nullable: false,
						blank: false,
					}),
					defenseFormula: new fields.StringField({
						initial: null,
						required: true,
						nullable: true,
						blank: false,
					}),
					soakFormula: new fields.StringField({
						initial: null,
						required: true,
						nullable: true,
						blank: false,
					}),
				},
				{ required: true, nullable: false }
			),
			range: new fields.SchemaField(
				{
					type: new fields.StringField({
						initial: SpellRangeType.Touch,
						required: true,
						nullable: false,
						blank: false,
						choices: Object.values(SpellRangeType),
					}),
					value: new fields.NumberField({ initial: 1, required: false, nullable: false, integer: true }),
				},
				{ required: true, nullable: false }
			),
			duration: new fields.SchemaField(
				{
					type: new fields.StringField({
						initial: SpellDuration.Instantaneous,
						required: true,
						nullable: false,
						blank: false,
						choices: Object.values(SpellDuration),
					}),
					value: new fields.NumberField({ initial: 1, required: false, nullable: false, integer: true }),
				},
				{ required: true, nullable: false }
			),
			damage: new fields.SchemaField(
				{
					combat: new fields.StringField({
						initial: SpellCombatType.Direct,
						required: true,
						nullable: false,
						blank: false,
						choices: Object.values(SpellCombatType),
					}),
					type: new fields.StringField({
						initial: DamageType.Physical,
						required: true,
						nullable: false,
						blank: false,
						choices: Object.values(DamageType),
					}),
					form: new fields.StringField({
						initial: SpellDamageForm.Force,
						required: true,
						nullable: false,
						blank: false,
						choices: Object.values(SpellDamageForm),
					}),
				},
				{ required: true, nullable: true }
			),
		};
	}
}
