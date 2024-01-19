import SR6Actor from '@/actor/SR6Actor';
import MatrixActionDataModel from '@/item/data/action/MatrixActionDataModel';
import SR6Item from '@/item/SR6Item';
import BaseTest, { BaseTestData } from '@/roll/test/BaseTest';
import { RollDataDelta, TestType } from '@/roll/test/index';
import { SR6Roll } from '@/roll/v2/SR6Roll';

import { Component } from 'vue';
import ChatComponent from '@/roll/test/vue/chat/MatrixAction.vue';

export interface MatrixActionTestData extends BaseTestData {}

export default class MatrixActionTest extends BaseTest<MatrixActionTestData> {
	override type: TestType = TestType.MatrixAction;

	matrixAction: SR6Item<MatrixActionDataModel>;

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
		data: MatrixActionTestData;
		delta?: RollDataDelta;
		roll?: SR6Roll;
	}) {
		const matrixAction = item as SR6Item<MatrixActionDataModel>;
		data.pool = matrixAction.systemData.pool;
		super({ actor, item, data, delta, roll });

		this.matrixAction = matrixAction;
	}
}
