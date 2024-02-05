import { ModifierConstructorData, ModifierSourceData } from '@/modifier';
import { TestPoolModifier, TestPoolModifierSourceData } from '@/modifier/TestModifiers';

export interface CoverModifierSourceData extends TestPoolModifierSourceData {}

export class CoverModifier extends TestPoolModifier<CoverModifierSourceData> {
	override toJSON(): ModifierSourceData {
		return {
			...super.toJSON(),
			value: this.value,
		};
	}

	constructor({ parent, source, target, conditions, data }: ModifierConstructorData<CoverModifierSourceData>) {
		data.class = 'CoverModifier';
		data.testClasses = data.testClasses || ['RangedDefenseTest'];

		super({ parent, source, target, conditions, data });
	}
}
