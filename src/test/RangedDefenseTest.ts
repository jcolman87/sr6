import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';
import BaseTest, { BaseTestData, TestSourceData } from '@/test/BaseTest';
import { RollDataDelta, TestType } from '@/test/index';
import SR6Roll from '@/roll/SR6Roll';
import RangedAttackTest, { RangedAttackTestData } from '@/test/RangedAttackTest';
import { Component } from 'vue';

import ChatComponent from '@/test/vue/chat/RangedDefenseTest.vue';

export interface RangedDefenseTestData extends BaseTestData {
	oppposedData: TestSourceData<RangedAttackTestData>;
}

export default class RangedDefenseTest extends BaseTest<RangedDefenseTestData> {
	override type: TestType = TestType.RangedDefense;

	opposedTest: RangedAttackTest;

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
		const opposedTest = BaseTest.fromData<RangedAttackTest>(data.oppposedData);
		if (opposedTest.ok) {
			data.threshold = opposedTest.val.roll?.hits;
		} else {
			throw opposedTest.val;
		}

		super({ actor, item, data, roll, delta });

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.opposedTest = opposedTest.val;
	}
}
