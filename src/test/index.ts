import SR6Actor from '@/actor/SR6Actor';
import { IEdgeBoost } from '@/edge';
import SR6Item from '@/item/SR6Item';
import { IModifier } from '@/modifier';
import SR6Roll from '@/roll/SR6Roll';
import { BaseTestData } from '@/test/BaseTest';

import { Component } from 'vue';
import { Result } from 'ts-results';

/* Tests */
import AttributeTest from '@/test/AttributeTest';
import SkillTest from '@/test/SkillTest';
import { RangedAttackTest, RangedDefenseTest } from '@/test/RangedTests';
import PhysicalSoakTest from '@/test/PhysicalSoakTest';

import { MatrixActionTest, MatrixDefenseTest, MatrixSoakTest } from '@/test/MatrixTests';
import { SpellCastTest, SpellDrainTest, SpellDefenseTest, SpellSoakTest } from '@/test/SpellTests';
export type RollDataDelta = Record<string, unknown>;

export enum TestType {
	INVALID = 'INVALID',
	Attribute = 'AttributeTest',
	Skill = 'SkillTest',

	RangedAttack = 'RangedAttackTest',
	RangedDefense = 'RangedDefenseTest',

	PhysicalSoak = 'PhysicalSoakTest',

	MatrixAction = 'MatrixActionTest',
	MatrixDefense = 'MatrixDefenseTest',
	MatrixSoak = 'MatrixSoakTest',

	SpellCast = 'SpellCastTest',
	SpellDrain = 'SpellDrainTest',
	SpellDefense = 'SpellDefenseTest',
	SpellSoak = 'SpellSoakTest',
}
export function config(): Record<string, unknown> {
	return {
		// misc
		AttributeTest: AttributeTest,
		SkillTest: SkillTest,

		// combat
		RangedAttackTest: RangedAttackTest,
		RangedDefenseTest: RangedDefenseTest,

		PhysicalSoakTest: PhysicalSoakTest,

		// Matrix
		MatrixActionTest: MatrixActionTest,
		MatrixDefenseTest: MatrixDefenseTest,
		MatrixSoakTest: MatrixSoakTest,

		// Magic
		SpellCastTest: SpellCastTest,
		SpellDrainTest: SpellDrainTest,
		SpellDefenseTest: SpellDefenseTest,
		SpellSoakTest: SpellSoakTest,
	};
}

export interface ITest<TData extends BaseTestData = BaseTestData> {
	modifiers: IModifier[];
	actor: SR6Actor;
	item?: SR6Item;

	roll?: SR6Roll;

	get type(): TestType;

	get isOwner(): boolean;

	get data(): TData;
	set data(data: TData);

	reset(): void;

	promptComponent?(): Component;
	chatComponent?(): Component;

	execute(): Promise<Result<null, null>>;

	toJSON(): Record<string, unknown>;

	applyEdgeBoost(boost: IEdgeBoost): boolean;
}
export function register(): void {}
