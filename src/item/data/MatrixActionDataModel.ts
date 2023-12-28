/**
 *
 * @author jaynus
 * @file Basic data model
 */

import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import { ActivationType, ActivationPeriod, SkillUseDataModel } from '@/data';

export enum MatrixAccessLevel {
	Outsider = 'outsider',
	User = 'user',
	Admin = 'admin',
}

export enum MatrixActionType {
	Decker = 'decker',
	IC = 'ic',
	Resonance = 'resonance',
	Any = 'any',
}

export enum MatrixAttribute {
	Attack = 'a',
	Sleaze = 's',
	Dataprocessing = 'd',
	Firewall = 'f',
}

export type MatrixActionLimits = {
	illegal: boolean;
	access_level: MatrixAccessLevel[];
	activation_type: ActivationType;
	activation_period: ActivationPeriod;
};

export type MatrixActionFormulas = {
	attack: null | string;
	defend: null | string;
	damage: null | string;
	soak: null | string;
};

export default abstract class MatrixActionDataModel extends BaseItemDataModel {
	abstract type: MatrixActionType;

	abstract skillUse: SkillUseDataModel;
	abstract limits: MatrixActionLimits;

	abstract formulas: MatrixActionFormulas;

	static override defineSchema() {
		console.log('choices: ', Object.values(MatrixActionType));
		const fields = foundry.data.fields;
		return {
			...super.defineSchema(),
			type: new fields.StringField({ initial: MatrixActionType.IC, required: true, nullable: false, blank: false, choices: Object.values(MatrixActionType) }),
			skillUse: new fields.EmbeddedDataField(SkillUseDataModel, { initial: { skill: 'Cracking', specialization: 'Hacking' }, required: true, nullable: true }),
			linked_attribute: new fields.StringField({ initial: null, required: true, nullable: true, blank: false, choices: Object.values(MatrixAttribute) }),
			limits: new fields.SchemaField(
				{
					illegal: new fields.BooleanField({ initial: false, required: true, nullable: false }),
					access_level: new fields.ArrayField(new fields.StringField({ initial: MatrixAccessLevel.Outsider, required: true, nullable: false, blank: false, choices: Object.values(MatrixAccessLevel) }), {
						required: true,
						nullable: false,
					}),
					activation_type: new fields.StringField({ initial: ActivationType.Major, required: true, nullable: false, blank: false, choices: Object.values(ActivationType) }),
					activation_period: new fields.StringField({ initial: ActivationPeriod.Initiative, required: true, nullable: false, blank: false, choices: Object.values(ActivationPeriod) }),
				},
				{ required: true, nullable: false },
			),
			formulas: new fields.SchemaField(
				{
					attack: new fields.StringField({ initial: null, required: true, nullable: true, blank: false }),
					defend: new fields.StringField({ initial: null, required: true, nullable: true, blank: false }),
					device_defend: new fields.StringField({ initial: null, required: true, nullable: true, blank: false }),
					damage: new fields.StringField({ initial: null, required: true, nullable: true, blank: false }),
					soak: new fields.StringField({ initial: null, required: true, nullable: true, blank: false }),
				},
				{ required: true, nullable: false },
			),
		};
	}
}
