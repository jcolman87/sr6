import LifeformDataModel from '@/actor/data/LifeformDataModel';
import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';
import BaseTest, { BaseTestData, BaseTestMessageData } from '@/roll/test/BaseTest';
import { ITest, RollDataDelta, testFromData, TestType } from '@/roll/test/index';
import { SR6Roll } from '@/roll/v2/SR6Roll';
import { Component } from 'vue';

import ChatComponent from '@/roll/test/vue/chat/OpposedTest.vue';

export interface OpposedTestData extends BaseTestData {
	oppposedData: BaseTestMessageData;
}

export default class OpposedTest<TOpposedData extends BaseTestData = BaseTestData> extends BaseTest<OpposedTestData> {
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
		data.threshold = opposedTest.roll?.hits;

		super({ actor, item, data, roll, delta });

		this.opposedTest = opposedTest as any;
	}
}
