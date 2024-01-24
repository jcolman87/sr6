import { ModifierConstructorData, ModifierSourceData } from '@/modifier';
import TestModifier, { TestModifierSourceData } from '@/modifier/TestModifier';
import { ITest } from 'src/test';

export interface TestPoolModifierSourceData extends TestModifierSourceData {
	testClasses: string[];
	value: number;
}

export default class TestPoolModifier extends TestModifier<TestPoolModifierSourceData> {
	get value(): number {
		return this.data!.value;
	}

	prepareTest<TTest extends ITest>(test: TTest): void {
		test.data.pool! += this.value;
	}

	override toJSON(): ModifierSourceData {
		return {
			...super.toJSON(),
			value: this.value,
		};
	}

	constructor({ parent, source, conditions, data }: ModifierConstructorData<TestPoolModifierSourceData>) {
		super({ parent, source, conditions, data });
	}
}
