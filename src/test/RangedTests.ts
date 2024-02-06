import { EnumAttribute } from '@/actor/data';
import LifeformDataModel from '@/actor/data/LifeformDataModel';
import SR6Actor from '@/actor/SR6Actor';
import { Distance, FireMode } from '@/data';
import WeaponDataModel from '@/item/data/gear/WeaponDataModel';
import SR6Item from '@/item/SR6Item';
import SR6Roll from '@/roll/SR6Roll';
import { PhysicalAttackTestData } from '@/test/AttackTestData';
import BaseTest, { BaseTestData, TestSourceData } from '@/test/BaseTest';
import { ITest, RollDataDelta, TestType } from '@/test/index';
import PhysicalSoakTest from '@/test/PhysicalSoakTest';
import AttackChatComponent from '@/test/vue/chat/RangedAttackTest.vue';
import DefenseChatComponent from '@/test/vue/chat/RangedDefenseTest.vue';

import AttackPromptComponent from '@/test/vue/prompt/RangedAttackTest.vue';
import { getTargetActorIds } from '@/util';
import { Component } from 'vue';

export interface RangedAttackTestData extends PhysicalAttackTestData {
	firemode?: FireMode;
}

export class RangedAttackTest extends BaseTest<RangedAttackTestData> {
	private _baseDamage: number;

	override get type(): TestType {
		return TestType.RangedAttack;
	}

	weapon: SR6Item<WeaponDataModel>;

	override get damage(): number {
		if (this.roll) {
			return this.baseDamage + this.roll.hits;
		} else {
			return this.baseDamage;
		}
	}

	get baseDamage(): number {
		return this._baseDamage;
	}

	opposed(actor: SR6Actor, item: undefined | SR6Item = undefined): RangedDefenseTest {
		return new RangedDefenseTest({
			actor,
			item,
			data: {
				pool: actor.solveFormula(this.weapon.systemData.damageData?.defenseFormula),
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				opposedData: this.toJSON() as any,
			},
		});
	}

	soak(defenseTest: RangedDefenseTest): ITest {
		return new PhysicalSoakTest({
			actor: defenseTest.actor,
			data: {
				pool: defenseTest.actor.solveFormula(this.weapon.systemData.damageData?.soakFormula),
				threshold: this.damage - defenseTest.roll!.hits,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				defenseTest: defenseTest.toJSON() as any,
			},
		});
	}

	chatComponent(): Component {
		return AttackChatComponent;
	}

	promptComponent(): Component {
		return AttackPromptComponent;
	}

	override hasAttribute(attribute: EnumAttribute): boolean {
		return this.weapon.systemData.skillUse?.attribute === attribute;
	}
	override hasSkill(skill: string): boolean {
		return (
			this.weapon.systemData.skillUse?.skill === skill ||
			this.weapon.systemData.skillUse?.specialization === skill
		);
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
		data?: RangedAttackTestData;
		roll?: SR6Roll;
		delta?: RollDataDelta;
	}) {
		const weapon = item as SR6Item<WeaponDataModel>;
		const defaultData = {
			targetIds: getTargetActorIds(),
			damage: weapon.systemData.damage,
			attackRating: weapon.systemData.attackRatings.near,
			firemode: FireMode.SS,
			distance: Distance.Near,
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
		this._baseDamage = this.weapon.systemData.damage;
	}
}

export interface RangedDefenseTestData extends BaseTestData {
	opposedData: TestSourceData<RangedAttackTestData>;
}

export class RangedDefenseTest extends BaseTest<RangedDefenseTestData> {
	opposedTest: RangedAttackTest;

	override get type(): TestType {
		return TestType.RangedDefense;
	}

	override get damage(): number {
		if (this.roll) {
			return this.opposedTest.damage - this.roll.hits;
		} else {
			return this.opposedTest.damage;
		}
	}

	chatComponent(): Component {
		return DefenseChatComponent;
	}

	override hasAttribute(attribute: EnumAttribute): boolean {
		return attribute === EnumAttribute.agility || attribute === EnumAttribute.intuition;
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
		data: RangedDefenseTestData;
		delta?: RollDataDelta;
		roll?: SR6Roll;
	}) {
		// Set the threshold automatically from the opposed data
		const opposedTest = BaseTest.fromData<RangedAttackTest>(data.opposedData);
		if (opposedTest.ok) {
			data.threshold = opposedTest.val.roll?.hits;
		} else {
			throw opposedTest.val;
		}

		super({ actor, item, data, roll, delta });

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.opposedTest = opposedTest.val;
	}
}
