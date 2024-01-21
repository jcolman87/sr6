import { ConditionalData } from '@/effect/conditional';
import { ModifierSourceData } from '@/modifier';
import BaseModifier from '@/modifier/BaseModifier';
import { ITest } from 'src/test';

export interface TestPoolModifierSourceData extends ModifierSourceData {
	testClasses: string[];
	value: number;
}

export default class TestPoolModifier extends BaseModifier<TestPoolModifierSourceData> {
	get value(): number {
		return this.data!.value;
	}

	get testClasses(): string[] {
		return this.data!.testClasses;
	}

	prepareTest<TTest extends ITest>(test: TTest): void {
		test.data.pool! += this.value;
	}

	override toJSON(): ModifierSourceData {
		return {
			...super.toJSON(),
			value: this.value,
			testClasses: this.testClasses,
		};
	}

	constructor({
		parent,
		source,
		conditions,
		data,
	}: {
		parent: foundry.abstract.Document;
		source: foundry.abstract.Document;
		conditions?: ConditionalData[];
		data: TestPoolModifierSourceData;
	}) {
		super({ parent, source, conditions, data });
	}
}
