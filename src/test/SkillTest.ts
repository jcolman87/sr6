import BaseTest, { BaseTestData, TestConstructorData } from '@/test/BaseTest';
import { TestType } from '@/test';
import ChatComponent from '@/test/vue/chat/SkillTest.vue';
import SkillUseDataModel from '@/data/SkillUseDataModel';
import SkillUse from '@/vue/components/SkillUse.vue';
import { Component } from 'vue';
import { toRaw } from 'vue/dist/vue';

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
		super(args);
		if (!args.data.pool) {
			if (args.data.skillUse) {
				args.data.skillUse = new SkillUseDataModel(args.data.skillUse, { parent: this.actor });
			}
			args.data.pool = args.data.skillUse.pool;
		}
	}
}
