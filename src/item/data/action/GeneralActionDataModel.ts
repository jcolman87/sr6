import ConditionDataModel, { ConditionActivation, ConditionTarget } from '@/condition/ConditionDataModel';
import { ActivationPeriod, ActivationType } from '@/data';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';

export enum GeneralActionCategory {
	Social = 'social',
	Combat = 'combat',
	General = 'general',
	Magic = 'magic',
}

export type GeneralActionLimits = {
	activationType: ActivationType;
	activationPeriod: ActivationPeriod;
};

export default abstract class GeneralActionDataModel extends BaseItemDataModel {
	abstract category: GeneralActionCategory;
	abstract limits: GeneralActionLimits;

	abstract conditions: ConditionDataModel[];

	available(): boolean {
		return false;
	}

	async use(consumeAction: boolean = true): Promise<boolean> {
		if (!this.actor) {
			ui.notifications.error('Applying action error!?');
		}
		// Apply the conditions
		for (const condition of this.conditions) {
			if (condition.activation === ConditionActivation.OnUse && condition.target === ConditionTarget.Self) {
				await condition.applyToActor(this.actor!);
			}
		}
		return true;
	}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;
		return {
			...super.defineSchema(),
			category: new fields.StringField({
				initial: GeneralActionCategory.General,
				required: true,
				nullable: false,
				blank: false,
				choices: Object.values(GeneralActionCategory),
			}),
			limits: new fields.SchemaField(
				{
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
		};
	}
}
