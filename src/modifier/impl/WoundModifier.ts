import { ITest } from '@/test/index.js';
import { ModifierConstructorData, ModifierSourceData } from '@/modifier/index.js';
import { TestModifier, TestModifierSourceData } from '@/modifier/TestModifiers.js';

export interface WoundModifierSourceData extends TestModifierSourceData {
	value: number;
}

export class WoundModifier extends TestModifier<WoundModifierSourceData> {
	get value(): number {
		return this.data!.value;
	}

	async prepareTest<TTest extends ITest>(test: TTest): Promise<void> {
		if (test.data.pool) {
			test.data.pool += this.value;
		}
	}

	override toJSON(): ModifierSourceData {
		return {
			...super.toJSON(),
			value: this.value,
		};
	}

	constructor({ parent, source, conditions, data }: ModifierConstructorData<WoundModifierSourceData>) {
		data.class = 'WoundModifier';
		data.name = game.i18n.localize('SR6.Modifiers.WoundModifier.Name');
		data.description = game.i18n.localize('SR6.Modifiers.WoundModifier.Description');
		data.testClasses = data.testClasses || [];

		super({ parent, source, conditions, data });
	}
}
