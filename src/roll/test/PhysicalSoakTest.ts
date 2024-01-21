import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';
import BaseTest, { BaseTestData } from '@/roll/test/BaseTest';
import { RollDataDelta, TestType } from '@/roll/test/index';
import { OpposedTestData } from '@/roll/test/OpposedTest';
import { SR6Roll } from '@/roll/v2/SR6Roll';

import { Component } from 'vue';
import ChatComponent from '@/roll/test/vue/chat/PhysicalSoakTest.vue';

export interface PhysicalSoakTestData extends BaseTestData {
	defenseTest: OpposedTestData;
}

export default class PhysicalSoakTest extends BaseTest<PhysicalSoakTestData> {
	override type: TestType = TestType.PhysicalSoak;

	damage(opposedHits: number = 0): number {
		if (this.roll) {
			return this.baseDamage() - this.roll.hits - opposedHits;
		} else {
			return this.baseDamage() - opposedHits;
		}
	}

	baseDamage(): number {
		return this.data.threshold!;
	}

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
		data: PhysicalSoakTestData;
		delta?: RollDataDelta;
		roll?: SR6Roll;
	}) {
		super({ actor, item, data, delta, roll });
	}
}
