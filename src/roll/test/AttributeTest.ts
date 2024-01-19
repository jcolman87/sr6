import { EnumAttribute } from '@/actor/data';
import LifeformDataModel from '@/actor/data/LifeformDataModel';
import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';
import BaseTest, { BaseTestData } from '@/roll/test/BaseTest';
import { TestType } from '@/roll/test/index';

export interface AttributeTestData extends BaseTestData {
	attribute: EnumAttribute;
}

export default class AttributeTest extends BaseTest<AttributeTestData> {
	override type: TestType = TestType.Attribute;

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
