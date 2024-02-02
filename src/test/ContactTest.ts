import ContactDataModel from '@/item/data/feature/ContactDataModel';
import SR6Item from '@/item/SR6Item';
import SR6Roll from '@/roll/SR6Roll';
import BaseTest, { BaseTestData, TestConstructorData } from '@/test/BaseTest';
import { TestType } from '@/test';
import ChatComponent from '@/test/vue/chat/ContactTest.vue';
import { Ok, Result } from 'ts-results';
import { Component } from 'vue';

export interface ContactTestData extends BaseTestData {
	connectionRollData: RollJSON;
}

export default class ContactTest extends BaseTest<ContactTestData> {
	connectionRoll?: SR6Roll;

	get contact(): SR6Item<ContactDataModel> {
		return this.item as SR6Item<ContactDataModel>;
	}

	override get type(): TestType {
		return TestType.Contact;
	}

	chatComponent(): Component {
		return ChatComponent;
	}

	override createRoll(): SR6Roll {
		this.connectionRoll = SR6Roll.createRoll(
			this.contact.systemData.connectionPool,
			{
				actor: this.actor.getRollData(),
				item: this.item?.getRollData(),
			},
			{
				threshold: this.data.threshold,
				parameters: this.data.parameters,
			},
		);

		return super.createRoll();
	}

	override async performRoll(): Promise<Result<null, string>> {
		let testResult = await super.performRoll();

		if (this.connectionRoll && !this.connectionRoll._evaluated) {
			this.connectionRoll = await this.connectionRoll?.evaluate({ async: true });
			if (this.connectionRoll?.options.explode) {
				await this.connectionRoll?.explode();
			}
			this.data.connectionRollData = this.connectionRoll.toJSON();
		}

		return testResult;
	}

	constructor(args: TestConstructorData<ContactTestData>) {
		super(args);
		if (!this.baseData.pool) {
			this.baseData.pool = this.contact.systemData.pool;
		}
		if (this.data.connectionRollData) {
			this.connectionRoll = SR6Roll.fromData(this.data.connectionRollData);
		}
	}
}
