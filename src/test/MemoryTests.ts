import { EnumAttribute } from '@/actor/data';
import LifeformDataModel from '@/actor/data/LifeformDataModel';
import KnowledgeDataModel from '@/item/data/feature/KnowledgeDataModel';
import { TestType } from '@/test';
import BaseTest, { BaseTestData, TestConstructorData } from '@/test/BaseTest';
import ChatComponent from '@/test/vue/chat/MemoryTest.vue';
import { Component } from 'vue';

export interface MemoryTestData extends BaseTestData {
	knowledge?: KnowledgeDataModel;
}

export class MemoryTest extends BaseTest<MemoryTestData> {
	override get type(): TestType {
		return TestType.Memory;
	}

	chatComponent(): Component {
		return ChatComponent;
	}

	constructor(args: TestConstructorData<MemoryTestData, LifeformDataModel>) {
		super(args);
		if (!args.data.pool && !args.data.knowledge) {
			args.data.pool =
				args.actor.systemData.attribute(EnumAttribute.logic).value +
				args.actor.systemData.attribute(EnumAttribute.intuition).value;
		} else if (!args.data.pool && args.data.knowledge) {
		}
	}
}

export class KnowledgeTest extends MemoryTest {}

export class LanguageTest extends KnowledgeTest {}
