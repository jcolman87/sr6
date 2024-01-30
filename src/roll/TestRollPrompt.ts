/**
 * FVTT-SR6
 * Unofficial implementation of the SR6 RPG for Foundry
 *
 * @author jaynus
 * @file Dice roll prompt app.
 */

import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';

import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';

import { ITest } from '@/test';
import BaseTest, { BaseTestData } from '@/test/BaseTest';
import { ContextBase } from '@/vue/SheetContext';
import VueRollPrompt from '@/roll/vue/TestRollPrompt.vue';
import VueSheet from '@/vue/VueSheet';
import { Component } from 'vue';

export interface TestRollPromptContext<
	TData extends BaseTestData = BaseTestData,
	TTest extends ITest<TData> = ITest<TData>,
> extends ContextBase {
	test: TTest;
	resolvePromise: (value: TData) => void;
}

export default class TestRollPrompt<
	TData extends BaseTestData = BaseTestData,
	TTest extends ITest<TData> = BaseTest<TData>,
> extends VueSheet(Application) {
	get vueComponent(): Component {
		return VueRollPrompt;
	}

	static override get defaultOptions(): ApplicationOptions {
		return {
			...super.defaultOptions,
			title: 'Test Configuration',
			classes: ['app-roll-prompt'],
			width: 500,
			scroll: true,
			focus: true,
		};
	}

	static async prompt<TData extends BaseTestData = BaseTestData, TTest extends ITest<TData> = BaseTest<TData>>(
		test: TTest,
	): Promise<TData | null> {
		const sheet = new TestRollPrompt<TData, TTest>(test);
		await sheet.render(true);

		return new Promise<TData | null>((resolve) => {
			sheet.#resolvePromise = resolve;
		});
	}

	#resolvePromise?: (value: TData | null) => void;

	test: TTest;

	constructor(test: TTest) {
		super();
		this.test = test;
	}

	override async close(options = {}): Promise<void> {
		this.#resolvePromise?.(null);
		return super.close(options);
	}

	async getVueContext(): Promise<TestRollPromptContext<TData, TTest>> {
		return {
			resolvePromise: async (data) => {
				this.#resolvePromise?.(data);
				this.#resolvePromise = undefined;

				await this.close();
			},
			app: this,
			test: this.test,
		};
	}
}
