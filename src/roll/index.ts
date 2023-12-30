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

export const ROLL_TEMPLATES = new Map([
	[RollType.Initiative, 'systems/sr6/templates/chat/rolls/InitiativeRoll.hbs'],
	[RollType.Attribute, 'systems/sr6/templates/chat/rolls/SR6Roll.hbs'],

	[RollType.WeaponAttack, 'systems/sr6/templates/chat/rolls/WeaponAttackRoll.hbs'],
	[RollType.WeaponDefend, 'systems/sr6/templates/chat/rolls/WeaponDefendRoll.hbs'],
	[RollType.WeaponSoak, 'systems/sr6/templates/chat/rolls/WeaponSoakRoll.hbs'],

	[RollType.MatrixAction, 'systems/sr6/templates/chat/rolls/MatrixActionRoll.hbs'],
]);

export function register() {
	CONFIG.Dice.rolls = [SR6Roll];

	(window as any).SR6Roll = SR6Roll;
}
