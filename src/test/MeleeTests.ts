import LifeformDataModel from '@/actor/data/LifeformDataModel';
import SR6Actor from '@/actor/SR6Actor';
import { Distance, FireMode } from '@/data';
import WeaponDataModel from '@/item/data/gear/WeaponDataModel';
import SR6Item from '@/item/SR6Item';
import SR6Roll from '@/roll/SR6Roll';
import AttackTestData from '@/test/AttackTestData';
import BaseTest from '@/test/BaseTest';
import { ITest, RollDataDelta, TestType } from '@/test/index';
import { getActorSync, getTargetActorIds } from '@/util';
import { Component } from 'vue';

export interface MeleeAttackTestData extends AttackTestData {}

export default class MeleeAttackTest extends BaseTest<MeleeAttackTestData> {
	override type: TestType = TestType.MeleeAttack;
	weapon: SR6Item<WeaponDataModel>;

	constructor({
		actor,
		item,
		data,
		roll,
		delta,
	}: {
		actor: SR6Actor<LifeformDataModel>;
		item: SR6Item;
		data?: MeleeAttackTestData;
		roll?: SR6Roll;
		delta?: RollDataDelta;
	}) {
		const weapon = item as SR6Item<WeaponDataModel>;
		const defaultData = {
			targetIds: getTargetActorIds(),
			damage: weapon.systemData.damage,
			attackRating: weapon.systemData.attackRatings.near,
			pool: weapon.systemData.pool,
		};

		super({
			actor,
			item,
			data: data
				? foundry.utils.mergeObject(data, defaultData, { overwrite: false, inplace: true })
				: defaultData,
			roll,
			delta,
		});
		this.weapon = weapon;
	}
}
