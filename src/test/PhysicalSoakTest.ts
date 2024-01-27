import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';
import BaseTest, { BaseTestData } from '@/test/BaseTest';
import { RollDataDelta, TestType } from '@/test/index';
import { RangedDefenseTestData } from '@/test/RangedTests';
import SR6Roll from '@/roll/SR6Roll';

import { Component } from 'vue';
import ChatComponent from '@/test/vue/chat/PhysicalSoakTest.vue';

export interface PhysicalSoakTestData extends BaseTestData {
	defenseTest: RangedDefenseTestData;
}

export default class PhysicalSoakTest extends BaseTest<PhysicalSoakTestData> {
	override get type(): TestType {
		return TestType.PhysicalSoak;
	}

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
