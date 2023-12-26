/**
  *
 * @author jaynus
 * @file Basic Item Sheet
 */

import SR6Item from '@/item/SR6Item';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';

import './SR6ItemSheet.scss';

export type DropData = {
	type: 'ActiveEffect' | 'Actor' | 'Item' | 'Folder';
	uuid: string;
};

/**
 * Basic functionality shared by all ItemSheets.
 */
export default class SR6ItemSheet<ItemDataModel extends BaseItemDataModel = BaseItemDataModel> extends ItemSheet<SR6Item<ItemDataModel>> {
	static override get defaultOptions() {
		return {
			...super.defaultOptions,
			classes: ['sr6', 'sheet', 'item'],
			width: 480,
			height: 300,
			dragDrop: [
				{
					dragSelector: '.item-list .item',
				},
			],
			tabs: [
				{
					navSelector: '.sheet-tabs',
					contentSelector: '.sheet-body',
					initial: 'description',
				},
			],
		};
	}

	override activateListeners(html: JQuery<HTMLElement>): void {
		super.activateListeners(html);

		if (this.isEditable) {
			// Foundry v10 and v11 bind this functionality differently so instead we override that behavior with our own.
			html.find('img[data-edit]').off('click');
			html.find('img[data-edit]').on('click', this._onEditImage.bind(this));
		}
	}

	/**
	 * Add support for drop data on Item sheets.
	 */
	protected override _onDrop(event: DragEvent) {
		const data: DropData = <DropData>TextEditor.getDragEventData(event);

		switch (data.type) {
			case 'ActiveEffect':
				return this._onDropActiveEffect(event, data);
			case 'Actor':
				return this._onDropActor(event, data);
			case 'Item':
				return this._onDropItem(event, data);
			case 'Folder':
				return this._onDropFolder(event, data);
		}
	}

	/**
	 * Called when an ActiveEffect is dropped on the item sheet.
	 */
	protected async _onDropActiveEffect(_event: DragEvent, _data: DropData) {}
	/**
	 * Called when an Actor is dropped on the item sheet.
	 */
	protected async _onDropActor(_event: DragEvent, _data: DropData) {}
	/**
	 * Called when an Item is dropped on the item sheet.
	 */
	protected async _onDropItem(_event: DragEvent, _data: DropData) {}
	/**
	 * Called when a Folder is dropped on the item sheet.
	 */
	protected async _onDropFolder(_event: DragEvent, _data: DropData) {}
}
