/**
 *
 * @author jaynus
 * @file SR6 Items Root.
 */
import { SR6Roll, SR6RollData } from '@/roll/SR6Roll';

import { EnumAttribute } from '@/actor/data';

export enum RollType {
	Other = 0,
	Attribute,
	Skill,

	WeaponAttack,
	WeaponDefend,
	WeaponSoak,

	MatrixAction,
	MatrixActionDefend,
	MatrixActionSoak,

	SpellAction,
	SpellDefend,
	SpellSoak,
}

export interface AttributeRollData extends SR6RollData {
	attribute: EnumAttribute;
}

export function register() {
	CONFIG.Dice.rolls = [SR6Roll];

	(window as any).SR6Roll = SR6Roll;
}
