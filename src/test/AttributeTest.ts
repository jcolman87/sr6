import { EnumAttribute } from '@/actor/data';
import LifeformDataModel from '@/actor/data/LifeformDataModel';
import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';
import BaseTest, { BaseTestData } from '@/test/BaseTest';
import { TestType } from '@/test/index';
import ChatComponent from '@/test/vue/chat/AttributeTest.vue';
import { Component } from 'vue';

export interface AttributeTestData extends BaseTestData {
	attribute: EnumAttribute;
}

export default class AttributeTest extends BaseTest<AttributeTestData> {
	override type: TestType = TestType.Attribute;

	chatComponent(): Component {
		return ChatComponent;
	}

	constructor({
		actor,
		item,
		data,
	}: {
		actor: SR6Actor<LifeformDataModel>;
		item?: SR6Item;
		data: AttributeTestData;
	}) {
		data.pool = actor.systemData.attribute(data.attribute).pool;

		super({ actor, item, data });
	}
}
