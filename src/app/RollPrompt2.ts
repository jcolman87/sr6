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

import { ITest } from '@/roll/test';
import BaseTest, { BaseTestData } from '@/roll/test/BaseTest';
import { ContextBase } from '@/vue/SheetContext';
import VueRollPrompt2 from '@/roll/RollPrompt2.vue';
import VueSheet from '@/vue/VueSheet';
import { Component } from 'vue';

export interface RollPromptContext<
	TData extends BaseTestData = BaseTestData,
	TTest extends ITest<TData> = BaseTest<TData>,
> extends ContextBase {
	test: TTest;
	data: TData;
	resolvePromise: (value: TData) => void;
}

export default class RollPrompt<
	TData extends BaseTestData = BaseTestData,
	TTest extends ITest<TData> = BaseTest<TData>,
> extends VueSheet(ActorSheet<SR6Actor<BaseActorDataModel>, SR6Item<BaseItemDataModel>>) {
	get vueComponent(): Component {
		return VueRollPrompt2;
	}

	static override get defaultOptions(): ActorSheetOptions {
		return {
			...super.defaultOptions,
			classes: ['app-roll-prompt'],
			width: 500,
			scroll: true,
			focus: true,
		};
	}

	static async prompt<TData extends BaseTestData = BaseTestData, TTest extends ITest<TData> = BaseTest<TData>>(
		actor: SR6Actor,
		test: TTest,
	): Promise<TData | null> {
		const sheet = new RollPrompt<TData, TTest>(actor, test);
		await sheet.render(true);

		return new Promise<TData | null>((resolve) => {
			sheet.#resolvePromise = resolve;
		});
	}

	#resolvePromise?: (value: TData | null) => void;

	test: TTest;
	data: TData;

	constructor(actor: SR6Actor, test: TTest) {
		super(actor);
		this.test = test;
		this.data = foundry.utils.deepClone(test.data);
	}

	override async close(options = {}): Promise<void> {
		this.#resolvePromise?.(null);
		return super.close(options);
	}

	async getVueContext(): Promise<RollPromptContext<TData, TTest>> {
		return {
			resolvePromise: async (data) => {
				this.#resolvePromise?.(data);
				this.#resolvePromise = undefined;

				await this.close();
			},
			actor: this.actor,
			app: this,
			test: this.test,
			data: this.data,
		};
	}
}
