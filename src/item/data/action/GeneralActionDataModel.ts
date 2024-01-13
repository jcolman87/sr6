import SR6Combat from '@/combat/SR6Combat';
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

	get available(): boolean {
		if (!game.combat) {
			return true;
		} else {
			const combat = game.combat! as SR6Combat;
			if (!combat.combatant) {
				return true;
			}
			// Is it our turn?
			if (
				this.limits.activationPeriod === ActivationPeriod.Initiative &&
				combat.combatant!.actor.uuid !== this.actor!.uuid
			) {
				return false;
			}

			// Do we have enough actions?
			const combatData = combat.getCombatantData(this.actor!);
			if (!combatData) {
				ui.notifications.warning('Unable to fetch combat data for actor');
				return true;
			}
			switch (this.limits.activationType) {
				case ActivationType.Major: {
					return combatData.roundActions.major > 0;
				}
				case ActivationType.Minor: {
					return combatData.roundActions.minor > 0;
				}
				default: {
					ui.notifications.error('invalid action type for a consuming action?');
					return true;
				}
			}
		}
	}

	async use(consumeAction: boolean = true, sendToChat: boolean = true): Promise<boolean> {
		if (!this.actor) {
			ui.notifications.error('Applying action error!?');
			return false;
		}

		// Consume action if in combat
		if (consumeAction && game.combat) {
			const combatData = (game.combat! as SR6Combat).getCombatantData(this.actor!);
			if (combatData) {
				switch (this.limits.activationType) {
					case ActivationType.Major: {
						if (combatData.roundActions.major < 1) {
							ui.notifications.error('No actions left to consume this');
							return false;
						}
						combatData.roundActions.major -= 1;
						break;
					}
					case ActivationType.Minor: {
						if (combatData.roundActions.minor < 1) {
							ui.notifications.error('No actions left to consume this');
							return false;
						}
						combatData.roundActions.minor -= 1;
						break;
					}
					default: {
						ui.notifications.error('invalid action type for a consuming action?');
						return false;
					}
				}
				await (game.combat! as SR6Combat).setCombatantData(this.actor!, combatData);
			}
		}

		// Apply the conditions
		for (const condition of this.conditions) {
			if (condition.activation === ConditionActivation.OnUse && condition.target === ConditionTarget.Self) {
				await condition.applyToActor(this.actor!);
			}
		}

		// Send action to chat
		if (sendToChat) {
			await this.toMessage(this.actor!);
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
				{ required: true, nullable: false },
			),
			conditions: new fields.ArrayField(new fields.EmbeddedDataField(ConditionDataModel), {
				initial: [],
				required: true,
				nullable: false,
			}),
		};
	}
}
