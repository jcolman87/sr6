import { InitiativeType } from '@/data';
import { AvailableActions } from '@/data/interfaces';
import { ModifierConstructorData, ModifierSourceData } from '@/modifier';
import BaseModifier from '@/modifier/BaseModifier';
import { InitiativeRollData } from '@/roll/InitiativeRoll';

export interface InitiativeModifierSourceData extends ModifierSourceData {
	dice?: number;
	score?: number;
	type?: InitiativeType;
}

export abstract class InitiativeModifier extends BaseModifier<InitiativeModifierSourceData> {
	prepareInitiative?(
		type: InitiativeType,
		initiative: Maybe<InitiativeRollData>,
		actions: Maybe<AvailableActions>,
	): void {
		if (this.data.type) {
			if (this.data.type !== type) {
				return;
			}
		}

		if (initiative) {
			initiative!.dice += this.data.dice || 0;
			initiative!.score += this.data.score || 0;

			if (actions) {
				actions!.minor = 1 + initiative.dice;
			}
		}
	}

	override toJSON(): ModifierSourceData {
		return {
			...super.toJSON(),
			dice: this.data.dice,
			score: this.data.score,
			type: this.data.type,
		};
	}

	protected constructor({ parent, source, conditions, data }: ModifierConstructorData<InitiativeModifierSourceData>) {
		super({ parent, source, conditions, data });
		if (!data.testClasses) {
			data.testClasses = [];
		}
	}
}
