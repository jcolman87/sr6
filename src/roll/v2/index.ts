import { IHasInitiative } from '@/data/interfaces';
import { ROLL_TEMPLATES, RollType } from '@/roll';
import { SR6Roll as SR6Roll2 } from '@/roll/v2/SR6Roll';

export function register(): void {
	CONFIG.Dice.rolls.push(SR6Roll2);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(window as any).SR6Roll2 = SR6Roll2;
}

export function getInitiativeRoll(systemData: IHasInitiative, formula: string): Roll {
	const poolModifier = systemData.getPool(RollType.Initiative);
	return new Roll(
		`(${formula}) + ${poolModifier}`,
		{ ...systemData.actor!.getRollData(), actor: systemData.actor! },
		{ initiativeRoll: true },
	);
}
