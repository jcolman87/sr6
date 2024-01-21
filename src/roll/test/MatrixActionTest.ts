import LifeformDataModel from '@/actor/data/LifeformDataModel';
import SR6Actor from '@/actor/SR6Actor';
import MatrixActionDataModel from '@/item/data/action/MatrixActionDataModel';
import SR6Item from '@/item/SR6Item';
import BaseTest, { BaseTestData } from '@/roll/test/BaseTest';
import { RollDataDelta, TestType } from '@/roll/test/index';
import OpposedTest from '@/roll/test/OpposedTest';
import { SR6Roll } from '@/roll/v2/SR6Roll';

import { Component } from 'vue';
import ChatComponent from '@/roll/test/vue/chat/MatrixActionTest.vue';

export interface MatrixActionTestData extends BaseTestData {}

export default class MatrixActionTest extends BaseTest<MatrixActionTestData> {
	override type: TestType = TestType.MatrixAction;

	matrixAction: SR6Item<MatrixActionDataModel>;

	chatComponent(): Component {
		return ChatComponent;
	}

	opposed(actor: SR6Actor, item: undefined | SR6Item): OpposedTest<MatrixActionTestData> {
		let pool = 0;
		if (actor.systemData instanceof LifeformDataModel) {
			pool = actor.solveFormula(this.matrixAction.systemData.formulas!.defend!);
		} else {
			pool = actor.solveFormula(this.matrixAction.systemData.formulas!.deviceDefend!);
		}

		return new OpposedTest<MatrixActionTestData>({
			actor,
			item,
			data: {
				pool,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				oppposedData: this.toJSON() as any,
			},
		});
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
