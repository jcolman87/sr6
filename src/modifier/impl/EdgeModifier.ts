import { EnumAttribute } from '@/actor/data';
import AttributeTest from '@/test/AttributeTest';
import { ITest } from '@/test';
import { ModifierConstructorData, ModifierSourceData } from '@/modifier';
import { TestModifier, TestModifierSourceData } from '@/modifier/TestModifiers';
import SkillTest from '@/test/SkillTest';

export interface BonusEdgeModifierSourceData extends TestModifierSourceData {
	value: number;
	skill: Maybe<string>;
	attribute: Maybe<EnumAttribute>;
}

export class EdgeModifier extends TestModifier<BonusEdgeModifierSourceData> {
	get value(): number {
		return this.data!.value;
	}

	override isApplicable(testInterface: Maybe<ITest>): boolean {
		if (!testInterface) {
			return false;
		}

		if (!super.isApplicable(testInterface)) {
			return false;
		}

		if (testInterface.type === 'SkillTest') {
			const test = testInterface as SkillTest;
			if (this.data.skill) {
				if (test.data.skillUse.skill !== this.data.skill && test.data.skillUse.skill !== this.data.skill) {
					return false;
				}
			}
			if (this.data.attribute) {
				if (test.data.skillUse.attribute !== this.data.attribute) {
					return false;
				}
			}
		}

		if (testInterface.type === 'AttributeTest' && this.data.attribute) {
			const test = testInterface as AttributeTest;
			if (test.data.attribute !== this.data.attribute) {
				return false;
			}
		}

		return true;
	}

	async finishTest<TTest extends ITest>(test: TTest): Promise<void> {
		await test.actor.systemData.monitors.gainEdge(1);
	}

	override toJSON(): ModifierSourceData {
		return {
			...super.toJSON(),
			value: this.value,
			skill: this.data.skill,
			attribute: this.data.attribute,
		};
	}

	constructor({ parent, source, conditions, data }: ModifierConstructorData<BonusEdgeModifierSourceData>) {
		data.class = 'EdgeModifier';
		data.testClasses = data.testClasses || [];

		super({ parent, source, conditions, data });
	}
}
