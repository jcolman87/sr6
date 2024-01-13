/**
 *
 * @author jaynus
 * @file Basic Actor Sheet
 */
import SR6Actor from '@/actor/SR6Actor';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import SR6Item from '@/item/SR6Item';

import './SR6ActorSheet.scss';

export default class SR6ActorSheet<
	TActorDataModel extends BaseActorDataModel = BaseActorDataModel,
	TItemDataModel extends BaseItemDataModel = BaseItemDataModel,
> extends ActorSheet<SR6Actor<TActorDataModel>, SR6Item<TItemDataModel>> {
	constructor(object: SR6Actor<TActorDataModel>, options?: Partial<ActorSheetOptions>) {
		super(object, options);

		// Add actor sheets to teh combat apps so when combat updates, the character sheet does
		if (game.combat) {
			game.combat.apps[this.appId] = this;
		}
	}

	static override get defaultOptions(): ActorSheetOptions {
		return {
			...super.defaultOptions,
			classes: ['sr6', 'sheet', 'actor'],
			width: 750,
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
