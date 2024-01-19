import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';
import { IModifier } from '@/modifier';
import MatrixActionTest from '@/roll/test/MatrixActionTest';
import OpposedTest from '@/roll/test/OpposedTest';
import PhysicalSoakTest from '@/roll/test/PhysicalSoakTest';

import { SR6Roll } from '@/roll/v2/SR6Roll';
import { getActorSync, getItemSync } from '@/util';

import BaseTest, { BaseTestData, BaseTestMessageData } from '@/roll/test/BaseTest';
import AttributeTest from '@/roll/test/AttributeTest';
import RangedAttackTest from '@/roll/test/RangedAttackTest';
import MeleeAttackTest from '@/roll/test/MeleeAttackTest';
import { Component } from 'vue';

export type RollDataDelta = Record<string, unknown>;

export enum TestType {
	Attribute = 'AttributeTest',

	MeleeAttack = 'MeleeAttackTest',

	RangedAttack = 'RangedAttackTest',

	PhysicalSoak = 'PhysicalSoakTest',

	//
	MatrixAction = 'MatrixActionTest',

	///
	Unknown = 'BaseTest',
	OpposedTest = 'OpposedTest',
}

export interface ITest<TData extends BaseTestData = BaseTestData, TModifier extends IModifier = IModifier> {
	type: string;
	modifiers: TModifier[];
	actor: SR6Actor;
	item?: SR6Item;

	roll?: SR6Roll;

	get isOwner(): boolean;

	get data(): TData;
	reset(): void;

	opposed?(actor: SR6Actor, item: undefined | SR6Item): OpposedTest<TData>;
	soak?(defense: OpposedTest<TData>): ITest;

	promptComponent?(): Component;
	chatComponent?(): Component;

	damage?(opposedHits: number): number;
	baseDamage?(): number;

	execute(): Promise<Result<null, null>>;
}

export function testFromData(msgData: BaseTestMessageData): BaseTest {
	const actor = getActorSync(SR6Actor, msgData.baseData.actorId!);
	const item = msgData.baseData.itemId ? getItemSync(SR6Item, msgData.baseData.itemId) : null;

	const cls = _getTestClass(msgData.type);
	const instance = new cls({
		actor,
		item,
		data: msgData.baseData,
		delta: msgData.delta,
		roll: msgData.roll ? SR6Roll.fromData(msgData.roll) : undefined,
	});
	return instance;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _getTestClass(testName: string): any | undefined {
	if (!testName) return undefined;

	if (!Object.prototype.hasOwnProperty.call(CONFIG.sr6.tests, testName)) {
		console.error(
			`Shadowrun 6e | Tried getting a Test Class ${testName}, which isn't registered in: `,
			CONFIG.sr6.tests,
		);
		return undefined;
	}

	return CONFIG.sr6.tests[testName];
}

export function register(): void {}

export function config(): Record<string, unknown> {
	return {
		AttributeTest: AttributeTest,
		RangedAttackTest: RangedAttackTest,
		MeleeAttackTest: MeleeAttackTest,
		OpposedTest: OpposedTest,

		PhysicalSoakTest: PhysicalSoakTest,

		MatrixActionTest: MatrixActionTest,
	};
}
