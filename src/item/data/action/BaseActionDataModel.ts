import SR6Actor from '@/actor/SR6Actor';
import SR6Combat from '@/combat/SR6Combat';
import { ActivationPeriod, ActivationType } from '@/data';
import { ActivationDataModel } from '@/data/ActivationDataModel';
import SR6Effect from '@/effect/SR6Effect';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';

export default abstract class BaseActionDataModel extends BaseItemDataModel {
	abstract activation: ActivationDataModel;

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
				this.activation.period === ActivationPeriod.Initiative &&
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
			switch (this.activation.type) {
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
				switch (this.activation.type) {
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

		// Send action to chat
		if (sendToChat) {
			await this.toMessage(this.actor!);
		}
		return true;
	}

	// Apply effects to the local actor
	async applyEffectLocal(): Promise<SR6Effect> {
		console.warn('TODO');
		throw 'TODO';
	}

	async applyEffectTarget(_actor: SR6Actor): Promise<SR6Effect> {
		console.warn('TODO');
		throw 'TODO';
	}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
			activation: new fields.EmbeddedDataField(ActivationDataModel, { required: true, nullable: false }),
		};
	}
}
