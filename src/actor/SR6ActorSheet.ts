/**
 *
 * @author jaynus
 * @file Basic Actor Sheet
 */
import SR6Actor from '@/actor/SR6Actor';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import SR6Item from '@/item/SR6Item';

import './SR6ActorSheet.scss';

export default class SR6ActorSheet<
	ActorDataModel extends foundry.abstract.DataModel = foundry.abstract.DataModel,
	ItemDataModel extends BaseItemDataModel = BaseItemDataModel
> extends ActorSheet<SR6Actor<ActorDataModel>, SR6Item<ItemDataModel>> {
	static override get defaultOptions(): ActorSheetOptions {
		return {
			...super.defaultOptions,
			classes: ['sr6', 'sheet', 'actor'],
			width: 720,
			height: 640,
		};
	}

	override activateListeners(html: JQuery): void {
		super.activateListeners(html);

		if (this.isEditable) {
			// Foundry v10 and v11 bind this functionality differently so instead we override that behavior with our own.
			html.find('img[data-edit]').off('click');
			html.find('img[data-edit]').on('click', this._onEditImage.bind(this));
		}
	}
}
