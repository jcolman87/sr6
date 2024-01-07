/**
 *
 * @author jaynus
 * @file Basic data model
 */

import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import CharacterDataModel from '@/actor/data/CharacterDataModel';
import SR6Actor from '@/actor/SR6Actor';
import ConditionDataModel, { ConditionActivation } from '@/condition/ConditionDataModel';
import { ActivationPeriod, ActivationType } from '@/data';
import { MatrixAccessLevel, MatrixActionType, MatrixAttribute } from '@/data/matrix';
import SkillUseDataModel from '@/data/SkillUseDataModel';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';

export type MatrixActionLimits = {
	illegal: boolean;
	access_level: MatrixAccessLevel[];
	activation_type: ActivationType;
	activation_period: ActivationPeriod;
};

export type MatrixActionFormulas = {
	attack: null | string;
	attackRating: null | string;
	defend: null | string;
	deviceDefend: null | string;
	damage: null | string;
	soak: null | string;
};

export default abstract class MatrixActionDataModel extends BaseItemDataModel {
	abstract type: MatrixActionType;

	abstract skillUse: SkillUseDataModel | null;
	abstract linkedAttribute: string | null;
	abstract limits: MatrixActionLimits;

	abstract formulas: MatrixActionFormulas;

	abstract conditions: ConditionDataModel[];

	async getHitConditions(): Promise<ConditionDataModel[]> {
		return this.conditions.filter((condition) => (condition.activation = ConditionActivation.OnHit));
	}

	get pool(): number {
		if (this.skillUse) {
			return this.solveFormula(`@${this.skillUse!.attribute} + @${this.skillUse!.skill.toLowerCase()}`);
		} else if (this.formulas.attack) {
			return this.solveFormula(this.formulas.attack!);
		}

		return 0;
	}

	defendAgainstPool<TDataModel extends BaseActorDataModel = BaseActorDataModel>(
		defender: SR6Actor<TDataModel>
	): number {
		const fuckme = defender;
		if (defender instanceof SR6Actor<CharacterDataModel>) {
			return this.formulas.defend ? defender.solveFormula(this.formulas.defend!) : 0;
		}
		return this.formulas.deviceDefend ? fuckme.solveFormula(this.formulas.deviceDefend!) : 0;
	}

	get damage(): number {
		return this.formulas.damage ? this.solveFormula(this.formulas.damage!) : 0;
	}

	get attackRating(): number {
		return this.formulas.attackRating ? this.solveFormula(this.formulas.attackRating!) : 0;
	}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;
		return {
			...super.defineSchema(),
			type: new fields.StringField({
				initial: MatrixActionType.IC,
				required: true,
				nullable: false,
				blank: false,
				choices: Object.values(MatrixActionType),
			}),
			skillUse: new fields.EmbeddedDataField(SkillUseDataModel, {
				initial: { skill: 'Cracking', specialization: 'Hacking' },
				required: true,
				nullable: true,
			}),
			linkedAttribute: new fields.StringField({
				initial: null,
				required: true,
				nullable: true,
				blank: false,
				choices: Object.values(MatrixAttribute),
			}),
			limits: new fields.SchemaField(
				{
					illegal: new fields.BooleanField({ initial: false, required: true, nullable: false }),
					accessLevel: new fields.ArrayField(
						new fields.StringField({
							initial: MatrixAccessLevel.Outsider,
							required: true,
							nullable: false,
							blank: false,
							choices: Object.values(MatrixAccessLevel),
						}),
						{
							required: true,
							nullable: false,
						}
					),
					activationType: new fields.StringField({
						initial: ActivationType.Major,
						required: true,
						nullable: false,
						blank: false,
						choices: Object.values(ActivationType),
					}),
					activationPeriod: new fields.StringField({
						initial: ActivationPeriod.Initiative,
						required: true,
						nullable: false,
						blank: false,
						choices: Object.values(ActivationPeriod),
					}),
				},
				{ required: true, nullable: false }
			),
			conditions: new fields.ArrayField(new fields.EmbeddedDataField(ConditionDataModel), {
				initial: [],
				required: true,
				nullable: false,
			}),
			formulas: new fields.SchemaField(
				{
					attackRating: new fields.StringField({
						initial: null,
						required: true,
						nullable: true,
						blank: false,
					}),
					attack: new fields.StringField({ initial: null, required: true, nullable: true, blank: false }),
					defend: new fields.StringField({ initial: null, required: true, nullable: true, blank: false }),
					deviceDefend: new fields.StringField({
						initial: null,
						required: true,
						nullable: true,
						blank: false,
					}),
					damage: new fields.StringField({ initial: null, required: true, nullable: true, blank: false }),
					soak: new fields.StringField({ initial: null, required: true, nullable: true, blank: false }),
				},
				{ required: true, nullable: false }
			),
		};
	}
}
