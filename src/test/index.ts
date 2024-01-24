import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';
import { IModifier } from '@/modifier';
import SR6Roll from '@/roll/SR6Roll';
import { BaseTestData } from '@/test/BaseTest';
import { Component } from 'vue';
import { Result } from 'ts-results';

/* Tests */
import RangedAttackTest from '@/test/RangedAttackTest';
import RangedDefenseTest from '@/test/RangedDefenseTest';
import PhysicalSoakTest from '@/test/PhysicalSoakTest';
import AttributeTest from '@/test/AttributeTest';

export type RollDataDelta = Record<string, unknown>;

export enum TestType {
	Attribute = 'AttributeTest',

	RangedAttack = 'RangedAttackTest',
	RangedDefense = 'RangedDefenseTest',

	PhysicalSoak = 'PhysicalSoakTest',
}

export interface ITest<TData extends BaseTestData = BaseTestData, TModifier extends IModifier = IModifier> {
	type: string;
	modifiers: TModifier[];
	actor: SR6Actor;
	item?: SR6Item;

	roll?: SR6Roll;

	get isOwner(): boolean;

	get data(): TData;
	set data(data: TData);

	reset(): void;

	promptComponent?(): Component;
	chatComponent?(): Component;

	execute(): Promise<Result<null, null>>;

	toJSON(): Record<string, unknown>;
}
export function register(): void {}

export function config(): Record<string, unknown> {
	return {
		AttributeTest: AttributeTest,
		RangedAttackTest: RangedAttackTest,
		RangedDefenseTest: RangedDefenseTest,

		PhysicalSoakTest: PhysicalSoakTest,
	};
}
