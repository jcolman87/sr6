/**
 *
 * @author jaynus
 * @file SR6 Items Root.
 */
import SR6Roll from '@/roll/SR6Roll';

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

	SpellCast,
	SpellDrain,
	SpellDefend,
	SpellSoak,
}
