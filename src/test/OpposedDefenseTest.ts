import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';
import BaseTest, { BaseTestData, BaseTestMessageData } from '@/test/BaseTest';
import { ITest, RollDataDelta, testFromData, TestType } from '@/test/index';
import SR6Roll from '@/roll/SR6Roll';
import { Component } from 'vue';

import ChatComponent from '@/test/vue/chat/OpposedDefenseTest.vue';

export interface OpposedTestData extends BaseTestData {
	oppposedData: BaseTestMessageData;
}

export default class OpposedDefenseTest<
	TOpposedData extends BaseTestData = BaseTestData,
> extends BaseTest<OpposedTestData> {
	override type: TestType = TestType.OpposedTest;

	opposedTest: ITest<TOpposedData>;
	chatComponent(): Component {
		return ChatComponent;
	}

	constructor({
		actor,
		item,
		data,
		delta,
		roll,
	}: {
		actor: SR6Actor;
		item?: SR6Item;
		data: OpposedTestData;
		delta?: RollDataDelta;
		roll?: SR6Roll;
	}) {
		// Set the threshold automatically from the opposed data
		const opposedTest = testFromData(data.oppposedData);
		if (opposedTest.ok) {
			data.threshold = opposedTest.val.roll?.hits;
		}

		super({ actor, item, data, roll, delta });

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.opposedTest = opposedTest.val as unknown as ITest<TOpposedData>;
	}
}
