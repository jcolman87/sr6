import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';
import BaseTest, { BaseTestData, TestConstructorData } from '@/test/BaseTest';
import { ITest, RollDataDelta, testFromData, TestType } from '@/test/index';
import SR6Roll from '@/roll/SR6Roll';
import { RangedAttackTestData } from '@/test/RangedAttackTest';
import { Component } from 'vue';

import ChatComponent from '@/test/vue/chat/RangedDefenseTest.vue';

export interface RangedDefenseTestData extends BaseTestData {
	oppposedData: TestConstructorData<RangedAttackTestData>;
}

export default class RangedDefenseTest<
	TOpposedData extends BaseTestData = BaseTestData,
> extends BaseTest<RangedDefenseTestData> {
	override type: TestType = TestType.RangedDefense;

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
		data: RangedDefenseTestData;
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
