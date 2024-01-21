import LifeformDataModel from '@/actor/data/LifeformDataModel';
import SR6Actor from '@/actor/SR6Actor';
import { FireMode } from '@/data';
import SR6Item from '@/item/SR6Item';
import AttackTestData from '@/test/AttackTestData';
import BaseTest from '@/test/BaseTest';
import { TestType } from '@/test/index';

export interface MeleeAttackTestData extends AttackTestData {
	firemode: FireMode;
}

export default class MeleeAttackTest extends BaseTest<MeleeAttackTestData> {
	override type: TestType = TestType.MeleeAttack;

	constructor({
		actor,
		item,
		data,
	}: {
		actor: SR6Actor<LifeformDataModel>;
		item?: SR6Item;
		data: MeleeAttackTestData;
	}) {
		super({ actor, item, data });
	}
}
