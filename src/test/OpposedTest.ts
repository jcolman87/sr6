import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';
import SR6Roll from '@/roll/SR6Roll';
import BaseTest, { BaseTestData, TestConstructorData } from '@/test/BaseTest';
import { RollDataDelta, testFromData } from '@/test/index';

export interface OpposedTestData<TAttackTestData extends BaseTestData, TDefenseTestData extends BaseTestData>
	extends BaseTestData {
	attackTestData: TestConstructorData<TAttackTestData>;
	defenseTestData: TestConstructorData<TDefenseTestData>[];
}

export default abstract class OpposedTest<
	TAttackTest extends BaseTest<TDefenseTestData>,
	TAttackTestData extends BaseTestData,
	TDefenseTest extends BaseTest<TDefenseTestData>,
	TDefenseTestData extends BaseTestData,
> extends BaseTest<OpposedTestData<TAttackTestData, TDefenseTestData>> {
	attackTest: TAttackTest;
	defenseTests: TDefenseTest[];

	constructor({
		actor,
		item,
		data,
		delta,
		roll,
	}: {
		actor: SR6Actor;
		item?: SR6Item;
		data: OpposedTestData<TAttackTestData, TDefenseTestData>;
		delta?: RollDataDelta;
		roll?: SR6Roll;
	}) {
		super({ actor, item, data, roll, delta });

		const attackTest = testFromData<TAttackTest, TAttackTestData>(this.baseData.attackTestData);
		if (attackTest.ok) {
			this.attackTest = attackTest.val;
		} else {
			throw `Failed to deserialize attack test ${this.baseData.attackTestData.type}`;
		}

		this.defenseTests = [];
		this.baseData.defenseTestData.forEach((data) => {
			const defenseTest = testFromData<TDefenseTest, TDefenseTestData>(data);
			if (defenseTest.ok) {
				this.defenseTests.push(defenseTest.val);
			} else {
				throw `Failed to deserialize defense test ${data.type}`;
			}
		});
	}
}
