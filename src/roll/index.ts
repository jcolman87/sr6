import { IHasInitiative } from '@/data/interfaces';
import SR6Roll from '@/roll/SR6Roll';
import { RollType } from '@/roll/legacy';

export function register(): void {
	CONFIG.Dice.rolls = [SR6Roll, Roll];
}

export function getInitiativeRoll(systemData: IHasInitiative, formula: string): Roll {
	const poolModifier = systemData.getPool(RollType.Initiative);
	return new Roll(
		`(${formula}) + ${poolModifier}`,
		{ ...systemData.actor!.getRollData(), actor: systemData.actor! },
		{ initiativeRoll: true },
	);
}
