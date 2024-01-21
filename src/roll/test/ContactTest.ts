import SR6Actor from '@/actor/SR6Actor';
import ContactDataModel from '@/item/data/feature/ContactDataModel';
import SR6Item from '@/item/SR6Item';
import BaseTest, { BaseTestData } from '@/roll/test/BaseTest';
import { RollDataDelta, TestType } from '@/roll/test/index';
import { SR6Roll } from '@/roll/v2/SR6Roll';
import ChatComponent from '@/roll/test/vue/chat/ContactTest.vue';

import { Component } from 'vue';
import { Result } from 'ts-results';
export interface ContactTestData extends BaseTestData {
	connectionHits?: number;
}

export default class ContactTest extends BaseTest<ContactTestData> {
	override type: TestType = TestType.ContactTest;

	get contact(): SR6Item<ContactDataModel> {
		return this.item as SR6Item<ContactDataModel>;
	}

	chatComponent(): Component {
		return ChatComponent;
	}

	override async performRoll(): Promise<Result<null, string>> {
		const res = await super.performRoll();
		if (res.ok) {
			const connectionRoll = await new SR6Roll(this.contact.systemData.connectionPool).evaluate({
				async: true,
			});
			await connectionRoll.showVisual();
			this.baseData.connectionHits = connectionRoll.hits;
		}

		return res;
	}

	constructor({
		actor,
		item,
		data,
		delta,
		roll,
	}: {
		actor: SR6Actor;
		item: SR6Item;
		data: ContactTestData;
		delta?: RollDataDelta;
		roll?: SR6Roll;
	}) {
		data.pool = (item! as SR6Item<ContactDataModel>).systemData.pool;
		super({ actor, item, data, delta, roll });
	}
}
