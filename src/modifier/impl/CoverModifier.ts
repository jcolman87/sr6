import { ModifierConstructorData, ModifierSourceData } from '@/modifier';
import { PoolModifier, PoolModifierSourceData } from '@/modifier/TestModifiers';

export interface CoverModifierSourceData extends PoolModifierSourceData {}

export class CoverModifier extends PoolModifier<CoverModifierSourceData> {
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
