import LifeformDataModel from '@/actor/data/LifeformDataModel';
import SR6Actor from '@/actor/SR6Actor';
import { Distance, FireMode } from '@/data';
import WeaponDataModel from '@/item/data/gear/WeaponDataModel';
import SR6Item from '@/item/SR6Item';
import PhysicalSoakTest from '@/roll/test/PhysicalSoakTest';
import { SR6Roll } from '@/roll/v2/SR6Roll';
import AttackTestData from '@/roll/test/AttackTestData';
import BaseTest, { BaseTestMessageData } from '@/roll/test/BaseTest';
import { ITest, RollDataDelta, TestType } from '@/roll/test/index';
import OpposedTest from '@/roll/test/OpposedTest';
import { getActorSync, getTargetActorIds } from '@/util';
import { Component } from 'vue';

import PromptComponent from '@/roll/test/vue/prompt/RangedAttack.vue';
import ChatComponent from '@/roll/test/vue/chat/RangedAttack.vue';

export interface RangedAttackTestData extends AttackTestData {
	firemode?: FireMode;
}

export default class RangedAttackTest extends BaseTest<RangedAttackTestData> {
	override type: TestType = TestType.RangedAttack;

	weapon: SR6Item<WeaponDataModel>;

	get targets(): SR6Actor[] {
		if (!this.data.targetIds) {
			return [];
		}
		return this.data.targetIds
			.map((id) => getActorSync(SR6Actor, id))
			.filter((actor) => actor != null)
			.map((actor) => actor!);
	}

	damage(opposedHits: number = 0): number {
		if (this.roll) {
			return this.baseDamage() + this.roll.hits - opposedHits;
		} else {
			return this.baseDamage() - opposedHits;
		}
	}

	baseDamage(): number {
		return this.weapon.systemData.damage;
	}

	opposed(actor: SR6Actor, item: undefined | SR6Item): OpposedTest<RangedAttackTestData> {
		return new OpposedTest<RangedAttackTestData>({
			actor,
			item,
			data: {
				pool: actor.solveFormula(this.weapon.systemData.damageData?.defenseFormula),
				oppposedData: this.toJSON() as any,
			},
		});
	}

	soak(defenseTest: OpposedTest<RangedAttackTestData>): ITest {
		return new PhysicalSoakTest({
			actor: defenseTest.actor,
			data: {
				pool: defenseTest.actor.solveFormula(this.weapon.systemData.damageData?.soakFormula),
				threshold: this.damage(defenseTest.roll?.hits),
				defenseTest: defenseTest.toJSON() as any,
			},
		});
	}

	chatComponent(): Component {
		return ChatComponent;
	}

	promptComponent(): Component {
		return PromptComponent;
	}

	constructor({
		actor,
		item,
		data,
		roll,
		delta,
	}: {
		actor: SR6Actor<LifeformDataModel>;
		item: SR6Item;
		data?: RangedAttackTest;
		roll?: SR6Roll;
		delta?: RollDataDelta;
	}) {
		const weapon = item as SR6Item<WeaponDataModel>;
		const defaultData = {
			targetIds: getTargetActorIds(),
			damage: weapon.systemData.damage,
			attackRating: weapon.systemData.attackRatings.near,
			firemode: FireMode.SS,
			distance: weapon.systemData.firemodes ? Distance.Close : Distance.Near,
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
