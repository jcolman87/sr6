import { ModifierConstructorData, ModifierSourceData } from '@/modifier';
import BaseModifier from '@/modifier/BaseModifier';

export interface TestModifierSourceData extends ModifierSourceData {
	testClasses: string[];
}

export default abstract class TestModifier<
	TSourceData extends TestModifierSourceData,
> extends BaseModifier<TSourceData> {
	get testClasses(): string[] {
		return this.data!.testClasses;
	}

	override toJSON(): ModifierSourceData {
		return {
			...super.toJSON(),
			testClasses: this.testClasses,
		};
	}

	constructor({ parent, source, conditions, data }: ModifierConstructorData<TSourceData>) {
		super({ parent, source, conditions, data });
	}
}
