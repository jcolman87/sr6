import SR6Actor from '@/actor/SR6Actor';
import { getClass } from '@/data/serialize';
import SR6Item from '@/item/SR6Item';
import { IModifier } from '@/modifier';
import MatrixActionTest from '@/test/MatrixActionTest';
import RangedDefenseTest from '@/test/RangedDefenseTest';
import PhysicalSoakTest from '@/test/PhysicalSoakTest';
import ContactTest from '@/test/ContactTest';

import SR6Roll from '@/roll/SR6Roll';
import { ConstructorOf, getActorSync, getItemSync } from '@/util';

import BaseTest, { BaseTestData, TestConstructorData } from '@/test/BaseTest';
import AttributeTest from '@/test/AttributeTest';
import RangedAttackTest from '@/test/RangedAttackTest';
import { Component } from 'vue';
import { Result, Err, Ok } from 'ts-results';

export type RollDataDelta = Record<string, unknown>;

export enum TestType {
	Attribute = 'AttributeTest',

	RangedAttack = 'RangedAttackTest',
	RangedDefense = 'RangedDefenseTest',

	MeleeAttack = 'MeleeAttackTest',
	MeleeDefense = 'MeleeDefenseTest',

	PhysicalSoak = 'PhysicalSoakTest',

	//
	MatrixAction = 'MatrixActionTest',

	///
	Unknown = 'BaseTest',

	///
	ContactTest = 'ContactTest',
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

export function testFromData<TTest extends BaseTest = BaseTest, TData extends BaseTestData = BaseTestData>(
	msgData: TestConstructorData<TData>,
): Result<TTest, string> {
	const actor = getActorSync(SR6Actor, msgData.baseData.actorId!);
	const item = msgData.baseData.itemId ? getItemSync(SR6Item, msgData.baseData.itemId) : null;

	const cls = getClass<ConstructorOf<BaseTest>>(CONFIG.sr6.types.tests, { class: msgData.type });
	if (cls.ok) {
		return Ok(
			new cls.val({
				actor,
				item,
				data: msgData.baseData,
				delta: msgData.delta,
				roll: msgData.roll ? SR6Roll.fromData(msgData.roll) : undefined,
			}) as TTest,
		);
	}
	return Err(cls.val);
}

export function register(): void {}

export function config(): Record<string, unknown> {
	return {
		AttributeTest: AttributeTest,
		RangedAttackTest: RangedAttackTest,
		RangedDefenseTest: RangedDefenseTest,

		PhysicalSoakTest: PhysicalSoakTest,

		MatrixActionTest: MatrixActionTest,

		ContactTest: ContactTest,
	};
}
