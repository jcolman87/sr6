/**
 * FVTT-Genesys
 * Unofficial implementation of the Genesys RPG for Foundry
 *
 * @author Mezryss
 * @file Dice roll prompt app.
 */

import SR6Actor from '@/actor/SR6Actor';
import { SR6RollData } from '@/roll/SR6Roll';

import { ContextBase } from '@/vue/SheetContext';
import VueRollPrompt from '@/vue/apps/RollPrompt.vue';
import VueSheet from '@/vue/VueSheet';

export interface RollPromptContext<TRollData extends SR6RollData = SR6RollData> extends ContextBase {
	actor: SR6Actor;
	rollData: TRollData;
}

export default class RollPrompt<TRollData extends SR6RollData = SR6RollData> extends VueSheet(Application) {
	override get vueComponent() {
		return VueRollPrompt;
	}

	static override get defaultOptions() {
		return {
			...super.defaultOptions,
			classes: ['app-roll-prompt'],
			width: 500,
		};
	}

	//static async promptForRoll(actor: GenesysActor, skillId: string, options: DicePromptOptions = {}) {
	//	const app = new DicePrompt(actor, skillId, options);
	//	await app.render(true);
	//}

	actor: SR6Actor;
	rollData: TRollData;

	constructor(actor: SR6Actor, rollData: TRollData) {
		super();

		this.actor = actor;
		this.rollData = rollData;
	}

	override async close(options: {} = {}) {
		await super.close(options);
	}

	override async getVueContext(): Promise<RollPromptContext<TRollData>> {
		return {
			actor: this.actor,
			app: this,
			rollData: this.rollData,
		};
	}
}
