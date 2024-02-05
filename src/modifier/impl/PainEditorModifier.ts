import { WoundModifier } from '@/modifier/impl/WoundModifier';
import { ITest } from '@/test/index.js';
import { ModifierConstructorData, ModifierSourceData } from '@/modifier/index.js';
import { TestModifier, TestModifierSourceData } from '@/modifier/TestModifiers.js';

export interface PainEditorModifierSourceData extends TestModifierSourceData {
	value: number;
}

export class PainEditorModifier extends TestModifier<PainEditorModifierSourceData> {
	get value(): number {
		return this.data!.value;
	}

	async prepareTest<TTest extends ITest>(test: TTest): Promise<void> {
		if (test.data.pool) {
			test.data.pool += test.activeModifiers.reduce((acc, modifier) => {
				if (modifier.class === 'WoundModifier') {
					const w = modifier as WoundModifier;
					acc += Math.abs(w.value);
				}
				return acc;
			}, 0);
		}
	}

	override toJSON(): ModifierSourceData {
		return {
			...super.toJSON(),
			value: this.value,
		};
	}

	constructor({ parent, source, conditions, target, data }: ModifierConstructorData<PainEditorModifierSourceData>) {
		data.class = 'PainEditorModifier';
		data.name = game.i18n.localize('SR6.Modifiers.PainEditorModifier.Name');
		data.description = game.i18n.localize('SR6.Modifiers.PainEditorModifier.Description');
		data.testClasses = data.testClasses || [];

		super({ parent, source, conditions, target, data });
	}
}
