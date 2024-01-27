import BaseTest, { BaseTestData, TestConstructorData } from '@/test/BaseTest';
import { TestType } from '@/test';
import ChatComponent from '@/test/vue/chat/SkillTest.vue';
import SkillUseDataModel from '@/data/SkillUseDataModel';
import { Component } from 'vue';

export interface SkillTestData extends BaseTestData {
	skillUse: SkillUseDataModel;
}

export default class SkillTest extends BaseTest<SkillTestData> {
	override get type(): TestType {
		return TestType.Skill;
	}

	chatComponent(): Component {
		return ChatComponent;
	}

	constructor(args: TestConstructorData<SkillTestData>) {
		args.data.pool = args.data.skillUse.pool;

		super(args);
	}
}
