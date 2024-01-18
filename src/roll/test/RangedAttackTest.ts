import LifeformDataModel from '@/actor/data/LifeformDataModel';
import SR6Actor from '@/actor/SR6Actor';
import { FireMode } from '@/data';
import SR6Item from '@/item/SR6Item';
import AttackTestData from '@/roll/test/AttackTestData';
import BaseTest from '@/roll/test/BaseTest';

export interface RangedAttackTestData extends AttackTestData {
	firemode: FireMode;
}

export default class RangedAttackTest extends BaseTest<RangedAttackTestData> {
	override type: string = 'WeaponAttackTest';

	constructor({
		actor,
		item,
		data,
	}: {
		actor: SR6Actor<LifeformDataModel>;
		item?: SR6Item;
		data: RangedAttackTestData;
	}) {
		super({ actor, item, data });
	}
}
