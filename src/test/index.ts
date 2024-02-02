import SR6Actor from '@/actor/SR6Actor';
import { Target } from '@/data';
import { IEdgeBoost } from '@/edge';
import SR6Item from '@/item/SR6Item';
import { IModifier } from '@/modifier';
import SR6Roll from '@/roll/SR6Roll';
import { BaseTestData } from '@/test/BaseTest';
import ContactTest from '@/test/ContactTest';

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

export enum TestError {
	Cancelled,
	RollFailed,
	MissingDocument,
	FailedConstructor,
}

export enum TestType {
	INVALID = 'INVALID',
	Attribute = 'AttributeTest',
	Skill = 'SkillTest',
	Contact = 'ContactTest',

	RangedAttack = 'RangedAttackTest',
	RangedDefense = 'RangedDefenseTest',

	MeleeAttack = 'MeleeAttackTest',
	MeleeDefense = 'MeleeDefenseTest',

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
		ContactTest: ContactTest,

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
	actor: SR6Actor;
	item?: SR6Item;

	roll?: SR6Roll;

	get modifiers(): IModifier[];

	get type(): TestType;

	get isOwner(): boolean;

	get damage(): Maybe<number>;

	get data(): TData;
	set data(data: TData);

	get pool(): number;
	set pool(newValue: number);

	reset(): void;

	promptComponent?(): Component;
	chatComponent?(): Component;

	execute(): Promise<Result<null, TestError>>;

	toJSON(): Record<string, unknown>;

	// edge control
	canGainEdge(target: Target): boolean;
	canSpendEdge(target: Target): boolean;

	getEdgeGain(target: Target): number;

	setEdgeGain(target: Target, value: number): boolean;

	get availableEdge(): number;
	applyEdgeBoost(boost: IEdgeBoost): Promise<boolean>;
}
export function register(): void {}
