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

import { SR6RollData } from '@/roll/SR6Roll';
import { ContextBase } from '@/vue/SheetContext';
import VueRollPrompt from '@/vue/apps/RollPrompt.vue';
import VueSheet from '@/vue/VueSheet';
import { Component } from 'vue';

export interface RollPromptContext<TRollData extends SR6RollData = SR6RollData> extends ContextBase {
	actor: SR6Actor;
	rollData: TRollData;
	resolvePromise: (value: TRollData) => void;
}

export default class RollPrompt<TRollData extends SR6RollData = SR6RollData> extends VueSheet(ActorSheet<SR6Actor<BaseActorDataModel>, SR6Item<BaseItemDataModel>>) {
	get vueComponent(): Component {
		return VueRollPrompt;
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

	static async promptForRoll<TRollData extends SR6RollData = SR6RollData>(actor: SR6Actor, rollData: TRollData): Promise<TRollData | null> {
		const sheet = new RollPrompt<TRollData>(actor, rollData);
		await sheet.render(true);

		return new Promise<TRollData | null>((resolve) => {
			sheet.#resolvePromise = resolve;
		});
	}

	#resolvePromise?: (value: TRollData | null) => void;

	rollData: TRollData;

	constructor(actor: SR6Actor, rollData: TRollData) {
		super(actor);
		this.rollData = rollData;
	}

	override async close(options = {}): Promise<void> {
		this.#resolvePromise?.(null);
		return super.close(options);
	}

	async getVueContext(): Promise<RollPromptContext<TRollData>> {
		return {
			resolvePromise: async (data) => {
				this.#resolvePromise?.(data);
				this.#resolvePromise = undefined;

				await this.close();
			},
			actor: this.actor,
			app: this,
			rollData: this.rollData,
		};
	}
}
