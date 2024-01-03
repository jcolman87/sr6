/**
 *
 * @author jaynus
 * @file SR6 Items Root.
 */
import { SR6Roll, SR6RollData } from '@/roll/SR6Roll';

export enum RollType {
	Other = 0,
	Initiative,

	Attribute,
	Skill,

	WeaponAttack,
	WeaponDefend,
	WeaponSoak,

	MatrixAction,
	MatrixActionDefend,
	MatrixActionSoak,

	SpellAction,
	SpellDrain,
	SpellDefend,
	SpellSoak,

	Any = 9999,
}

export const ROLL_CATEGORIES = new Map([
	['Vision', [RollType.WeaponAttack, RollType.WeaponDefend, RollType.SpellAction, RollType.SpellDefend]],
	[
		'AllPoolButSoak',
		Array.from(
			Object.keys(RollType)
				.filter((t) => ![RollType[RollType.Initiative], RollType[RollType.SpellSoak], RollType[RollType.SpellSoak]].includes(t))
				.map((t) => RollType[t as keyof typeof RollType]),
		),
	],
]);

export function getRollCategory(key: string): RollType[] {
	return ROLL_CATEGORIES.has(key) ? ROLL_CATEGORIES.get(key)! : [];
}

export const ROLL_TEMPLATES = new Map([
	[RollType.Initiative, 'systems/sr6/templates/chat/rolls/InitiativeRoll.hbs'],
	[RollType.Attribute, 'systems/sr6/templates/chat/rolls/SR6Roll.hbs'],
	[RollType.Skill, 'systems/sr6/templates/chat/rolls/SR6Roll.hbs'],

	[RollType.WeaponAttack, 'systems/sr6/templates/chat/rolls/WeaponAttackRoll.hbs'],
	[RollType.WeaponDefend, 'systems/sr6/templates/chat/rolls/WeaponDefendRoll.hbs'],
	[RollType.WeaponSoak, 'systems/sr6/templates/chat/rolls/WeaponSoakRoll.hbs'],

	[RollType.MatrixAction, 'systems/sr6/templates/chat/rolls/MatrixActionRoll.hbs'],
]);

export function register(): void {
	CONFIG.Dice.rolls = [SR6Roll];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(window as any).SR6Roll = SR6Roll;
}
