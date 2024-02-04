import { EnumAttribute } from '@/actor/data';
import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';
import { ModifierConstructorData, ModifierSourceData } from '@/modifier';
import BaseModifier from '@/modifier/BaseModifier';
import { ITest, TestType } from '@/test';
import { RangedAttackTest } from '@/test/RangedTests';
import SkillTest from '@/test/SkillTest';

export interface TestModifierSourceData extends ModifierSourceData {
	testClasses?: string[];
	skills?: string[];
	attributes?: EnumAttribute[];
}

export abstract class TestModifier<TSourceData extends TestModifierSourceData> extends BaseModifier<TSourceData> {
	override isApplicable(test: Maybe<ITest> = null, _roll: Maybe<Roll> = null): boolean {
		if (!super.isApplicable(test)) {
			return false;
		}
		if (test) {
			if (this.testClasses.length === 0) {
				return true;
			}

			// TODO: this shit is a mess
			if (this.testClasses.includes(test.type)) {
				if (this.skills.length > 0) {
					if (test.type === TestType.Skill) {
						if (!this.skills.includes((test as SkillTest).data.skillUse.skill)) {
							return false;
						}
					} else if (test.type === TestType.RangedAttack) {
						if (!this.skills.includes((test as RangedAttackTest).weapon.systemData.skillUse!.skill)) {
							return false;
						}
					} else {
						return false;
					}
				}

				if (this.attributes.length > 0) {
					// TODO: impl
				}
			}
		}

		return true;
	}

	get skills(): string[] {
		return this.data!.skills || [];
	}

	get attributes(): EnumAttribute[] {
		return this.data!.attributes || [];
	}

	get testClasses(): string[] {
		return this.data!.testClasses || [];
	}

	override toJSON(): ModifierSourceData {
		return {
			...super.toJSON(),
			testClasses: this.testClasses,
			skills: this.skills,
			attributes: this.attributes,
		};
	}

	protected constructor({ parent, source, conditions, data }: ModifierConstructorData<TSourceData>) {
		super({ parent, source, conditions, data });
		if (!data.testClasses) {
			data.testClasses = [];
		}
	}
}

export interface TestFunctionModifierSourceData extends TestModifierSourceData {
	prepareTestScript: string;
	finishTestScript: string;
}

export class TestFunctionModifier<
	TSourceData extends TestFunctionModifierSourceData = TestFunctionModifierSourceData,
> extends TestModifier<TSourceData> {
	prepareTest?: Function;
	finishTest?: Function;

	override toJSON(): ModifierSourceData {
		return {
			...super.toJSON(),
			prepareTestScript: this.prepareTest?.toString(),
			finishTestScript: this.finishTest?.toString(),
		};
	}

	constructor({ parent, source, conditions, data }: ModifierConstructorData<TSourceData>) {
		super({ parent, source, conditions, data });

		this.prepareTest = data.prepareTestScript ? Function('test', data.prepareTestScript) : undefined;
		this.finishTest = data.finishTestScript ? Function('test', data.finishTestScript) : undefined;
	}
}

export interface TestPoolModifierSourceData extends TestModifierSourceData {
	value?: number;
	valueFormula?: string;
}

export class TestPoolModifier<
	TData extends TestPoolModifierSourceData = TestPoolModifierSourceData,
> extends TestModifier<TData> {
	override get displayValue(): undefined | string {
		return this.value > 0 ? `+${this.value}` : this.value.toString();
	}

	get value(): number {
		return this.data!.value!;
	}

	async prepareTest<TTest extends ITest>(test: TTest): Promise<void> {
		test.pool += this.value;
	}

	override toJSON(): ModifierSourceData {
		return {
			...super.toJSON(),
			value: this.data.value,
			valueFormula: this.data.valueFormula,
		};
	}

	constructor({ parent, source, conditions, data }: ModifierConstructorData<TData>) {
		if (data.valueFormula) {
			if (source instanceof SR6Item) {
				data.value = (source as SR6Item).solveFormula(data.valueFormula!);
			} else if (source instanceof SR6Actor) {
				data.value = (source as SR6Actor).solveFormula(data.valueFormula!);
			}
		}

		super({ parent, source, conditions, data });
	}
}
