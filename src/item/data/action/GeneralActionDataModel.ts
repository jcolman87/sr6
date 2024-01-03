import { ActivationPeriod, ActivationType } from '@/data';
import { MatrixAccessLevel } from '@/data/matrix';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import ConditionDataModel from '@/condition/ConditionDataModel';

export enum GeneralActionCategory {
	Social = 'social',
	Combat = 'combat',
	General = 'general',
}

export type GeneralActionLimits = {
	activation_type: ActivationType;
	activation_period: ActivationPeriod;
};

export default abstract class GeneralActionDataModel extends BaseItemDataModel {
	abstract category: GeneralActionCategory;
	abstract limits: GeneralActionLimits;

	abstract conditions: ConditionDataModel[];

	async use(): Promise<boolean> {
		return true;
	}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;
		return {
			...super.defineSchema(),
			limits: new fields.SchemaField(
				{
					activationType: new fields.StringField({ initial: ActivationType.Major, required: true, nullable: false, blank: false, choices: Object.values(ActivationType) }),
					activationPeriod: new fields.StringField({ initial: ActivationPeriod.Initiative, required: true, nullable: false, blank: false, choices: Object.values(ActivationPeriod) }),
				},
				{ required: true, nullable: false },
			),
			conditions: new fields.ArrayField(new fields.EmbeddedDataField(ConditionDataModel), { initial: [], required: true, nullable: false }),
		};
	}
}
