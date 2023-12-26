/**
  *
 * @author jaynus
 * @file Player Character Sheet
 */

import VueCharacterSheet from '@/vue/sheets/actor/CharacterSheet.vue';
import SR6Item from '@/item/SR6Item';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import CharacterDataModel from '@/actor/data/CharacterDataModel';
import VueSheet from '@/vue/VueSheet';
import SR6ActorSheet from '@/actor/SR6ActorSheet';
import { ActorSheetContext } from '@/vue/SheetContext';

/**
 * Actor sheet used for Player Characters
 */
export default class CharacterSheet extends VueSheet(SR6ActorSheet<CharacterDataModel>) {
	override get vueComponent() {
		return VueCharacterSheet;
	}

	override async getVueContext(): Promise<ActorSheetContext<CharacterDataModel>> {
		return {
			sheet: this,
			data: await this.getData(),
		};
	}

	static override get defaultOptions() {
		return {
			...super.defaultOptions,
			tabs: [
				{
					navSelector: '.sheet-tabs',
					contentSelector: '.sheet-body',
					initial: 'skills',
				},
			],
		};
	}

	protected override async _onDropItem(event: DragEvent, data: DropCanvasData<'Item', SR6Item<BaseItemDataModel>>): Promise<SR6Item<BaseItemDataModel>[] | boolean> {
		return await super._onDropItem(event, data);
	}

}
