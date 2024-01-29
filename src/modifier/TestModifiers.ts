import { ModifierConstructorData, ModifierSourceData } from '@/modifier';
import BaseModifier from '@/modifier/BaseModifier';
import { ITest } from '@/test';

export interface TestModifierSourceData extends ModifierSourceData {
	testClasses?: string[];
}

export abstract class TestModifier<TSourceData extends TestModifierSourceData> extends BaseModifier<TSourceData> {
	override isApplicable(test: Maybe<ITest> = null, _roll: Maybe<Roll> = null): boolean {
		if (!super.isApplicable(test)) {
			return false;
		}
		if (test) {
			return this.testClasses.length === 0 || this.testClasses.includes(test.type);
		}

		return true;
	}

	get testClasses(): string[] {
		return this.data!.testClasses || [];
	}

	override toJSON(): ModifierSourceData {
		return {
			...super.toJSON(),
			testClasses: this.testClasses,
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
	value: number;
}

export class TestPoolModifier<
	TData extends TestPoolModifierSourceData = TestPoolModifierSourceData,
> extends TestModifier<TData> {
	override get displayValue(): undefined | string {
		return this.value > 0 ? `+${this.value}` : this.value.toString();
	}

	get value(): number {
		return this.data!.value;
	}

	async prepareTest<TTest extends ITest>(test: TTest): Promise<void> {
		test.pool += this.value;
	}

	override toJSON(): ModifierSourceData {
		return {
			...super.toJSON(),
			value: this.value,
		};
	}

	constructor({ parent, source, conditions, data }: ModifierConstructorData<TData>) {
		super({ parent, source, conditions, data });
	}
}
