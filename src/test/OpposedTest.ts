import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';
import SR6Roll from '@/roll/SR6Roll';
import BaseTest, { BaseTestData } from '@/test/BaseTest';
import { RollDataDelta, testFromData } from '@/test/index';

export interface OpposedTestData<TAttackTestData extends BaseTestData, TDefenseTestData extends BaseTestData>
	extends BaseTestData {
	attackTestData: TAttackTestData;
	defenseTestData: TDefenseTestData[];
}

export default abstract class OpposedTest<
	TAttackTest extends BaseTest<TDefenseTestData>,
	TAttackTestData extends BaseTestData,
	TDefenseTest extends BaseTest<TDefenseTestData>,
	TDefenseTestData extends BaseTestData,
> extends BaseTest<OpposedTestData<TAttackTestData, TDefenseTestData>> {
	// attackTest: TAttackTest;
	// defenseTests: TDefenseTest[];

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
		// Set the threshold automatically from the opposed data
		// const opposedTest = testFromData(data.oppposedData);
		// if (opposedTest.ok) {
		//	data.threshold = opposedTest.val.roll?.hits;
		// }

		super({ actor, item, data, roll, delta });

		//this.opposedTests = [];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		// this.opposedTest = opposedTest.val;
	}
}
