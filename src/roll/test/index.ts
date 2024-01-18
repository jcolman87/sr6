import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';
import { IModifier } from '@/modifier';
import { SR6Roll } from '@/roll/v2/SR6Roll';
import { getActorSync, getItemSync } from '@/util';

import BaseTest, { BaseTestData, BaseTestMessageData } from '@/roll/test/BaseTest';
import AttributeTest from '@/roll/test/AttributeTest';
import RangedAttackTest from '@/roll/test/RangedAttackTest';

export type RollDataDelta = Record<string, unknown>;

export interface ITest<TData extends BaseTestData = BaseTestData, TModifier extends IModifier = IModifier> {
	type: string;
	modifiers: TModifier[];
	actor: SR6Actor;

	roll: null | SR6Roll;

	get data(): TData;

	reset(): void;
}

export function testFromData(msgData: BaseTestMessageData): BaseTest {
	const actor = getActorSync(SR6Actor, msgData.baseData.actorId!);
	const item = msgData.baseData.itemId ? getItemSync(SR6Item, msgData.baseData.itemId) : null;

	const cls = _getTestClass(msgData.type);
	const instance = new cls({ actor, item, data: msgData.baseData });
	instance.delta = msgData.delta;
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
	};
}
